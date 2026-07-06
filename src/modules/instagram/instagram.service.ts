import { Injectable } from '@nestjs/common';
import { https } from 'follow-redirects';
import * as fs from 'fs';
import * as path from 'path';

export interface InstaMediaInfo {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  username?: string;
}

@Injectable()
export class InstagramService {
  private readonly downloadPath: string;

  constructor() {
    this.downloadPath = path.join(__dirname, '..', '..', '..', 'downloads');
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
  }

  private extractShortcode(url: string): string {
    const match = url.match(
      /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/,
    );
    if (!match) throw new Error('Invalid Instagram URL');
    return match[1];
  }

  private fetchUrl(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const defaultHeaders = {
        'User-Agent': 'curl/7.88.0',
        'Accept': '*/*',
      };

      https.get(
        url,
        {
          headers: { ...defaultHeaders, ...headers },
          maxRedirects: 5,
        } as any,
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
          res.on('error', reject);
        },
      ).on('error', reject);
    });
  }

  private unescapeUrl(raw: string): string {
    return raw
      .replace(/\\+\//g, '/')      // one or more backslashes + / -> /
      .replace(/\\u0026/g, '&')    // \u0026 -> &
      .replace(/\\u003D/g, '=');   // \u003D -> =
  }

  /**
   * Extract video URL using string operations instead of regex.
   * The embed page contains escaped JSON like:
   *   video_url\":\"https:\/\/...mp4?...\"
   * Using indexOf avoids TypeScript regex escaping issues.
   */
  private extractVideoUrl(html: string): string {
    const marker = 'video_url';
    const idx = html.indexOf(marker);
    if (idx === -1) return '';

    // Grab a generous chunk after the marker
    const chunk = html.substring(idx, idx + 2000);
    console.log('[Instagram] Raw chars after video_url:', chunk.substring(0, 80));

    // Find the start of the URL (https)
    const httpsIdx = chunk.indexOf('https');
    if (httpsIdx === -1) return '';

    // Find the end of the URL — stop at whitespace, unescaped quote, or escaped-quote boundary
    let end = httpsIdx;
    while (end < chunk.length) {
      const ch = chunk[end];
      if (ch === ' ' || ch === '\n' || ch === '\t' || ch === ',' || ch === '}' || ch === ']') break;
      // Unescaped double-quote
      if (ch === '"' && (end === 0 || chunk[end - 1] !== '\\')) break;
      // Escaped quote pattern: \"
      if (ch === '\\' && end + 1 < chunk.length && chunk[end + 1] === '"') break;
      end++;
    }

    const raw = chunk.substring(httpsIdx, end);
    if (!raw.includes('.mp4')) return '';

    console.log('[Instagram] Raw URL (first 120):', raw.substring(0, 120));

    return this.unescapeUrl(raw);
  }

  /**
   * Fallback: Query Instagram's GraphQL API directly when embed page
   * doesn't contain video_url (Instagram strips it for some reels).
   */
  private fetchGraphQL(shortcode: string): Promise<InstaMediaInfo> {
    return new Promise((resolve, reject) => {
      const variables = JSON.stringify({ shortcode });
      const docId = '10015901848480474';
      const params = new URLSearchParams({ variables, doc_id: docId });

      https.get(
        `https://www.instagram.com/graphql/query/?${params.toString()}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            Accept: '*/*',
            'X-IG-App-ID': '936619743392459',
            'X-Requested-With': 'XMLHttpRequest',
          },
          maxRedirects: 5,
        } as any,
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              const media =
                json?.data?.xdt_shortcode_media ||
                json?.data?.shortcode_media;
              if (!media?.video_url) {
                return reject(new Error('GraphQL: no video_url in response'));
              }
              const username = media.owner?.username || '';
              const caption =
                media.edge_media_to_caption?.edges?.[0]?.node?.text || '';
              const title = caption
                ? caption.substring(0, 100)
                : username
                  ? `Reel by @${username}`
                  : `Reel ${shortcode}`;

              console.log(`[Instagram] GraphQL: got video for @${username}`);
              resolve({
                videoUrl: media.video_url,
                thumbnailUrl: media.display_url || '',
                title,
                username,
              });
            } catch {
              reject(new Error('GraphQL: failed to parse response'));
            }
          });
          res.on('error', reject);
        },
      ).on('error', reject);
    });
  }

  async getMediaInfo(url: string): Promise<InstaMediaInfo> {
    const shortcode = this.extractShortcode(url);
    console.log(`[Instagram] Extracting media for shortcode: ${shortcode}`);

    // Strategy 1: Embed page scraping (works for many reels)
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const html = await this.fetchUrl(embedUrl);

    console.log(`[Instagram] Embed page length: ${html.length}`);
    console.log(`[Instagram] Has video_url: ${html.includes('video_url')}`);

    let videoUrl = this.extractVideoUrl(html);

    if (videoUrl) {
      // Extract username from embed page
      let username = '';
      const ownerIdx = html.indexOf('"owner"');
      if (ownerIdx !== -1) {
        const ownerChunk = html.substring(ownerIdx, ownerIdx + 500);
        const unameKey = ownerChunk.indexOf('"username"');
        if (unameKey !== -1) {
          const afterKey = ownerChunk.substring(unameKey + 10);
          const qStart = afterKey.indexOf('"');
          if (qStart !== -1) {
            const qEnd = afterKey.indexOf('"', qStart + 1);
            if (qEnd !== -1) {
              const val = afterKey.substring(qStart + 1, qEnd);
              if (!val.includes('/') && !val.includes('http') && val.length < 50) {
                username = val;
              }
            }
          }
        }
      }

      // Fallback: extract username from EmbeddedMediaImage alt text (e.g. "Instagram post shared by @username")
      if (!username) {
        const altIdx = html.indexOf('shared by &#064;');
        if (altIdx !== -1) {
          const afterAt = html.substring(altIdx + 16, altIdx + 80);
          const endQuote = afterAt.indexOf('"');
          if (endQuote !== -1) {
            username = afterAt.substring(0, endQuote);
          }
        }
      }

      // Extract thumbnail from EmbeddedMediaImage <img> tag in embed page
      let thumbnailUrl = '';
      const imgClassIdx = html.indexOf('EmbeddedMediaImage');
      if (imgClassIdx !== -1) {
        // src= comes after the class attribute, search forward
        const imgChunk = html.substring(imgClassIdx, imgClassIdx + 2000);
        const srcIdx = imgChunk.indexOf('src="');
        if (srcIdx !== -1) {
          const srcStart = srcIdx + 5;
          const srcEnd = imgChunk.indexOf('"', srcStart);
          if (srcEnd !== -1) {
            thumbnailUrl = imgChunk.substring(srcStart, srcEnd).replace(/&amp;/g, '&');
          }
        }
      }

      const title = username ? `Reel by @${username}` : `Reel ${shortcode}`;
      console.log(`[Instagram] Embed: video URL found for @${username || 'unknown'}`);

      return { videoUrl, thumbnailUrl, title, username };
    }

    // Strategy 2: GraphQL API fallback (for reels where embed page strips video_url)
    console.log('[Instagram] Embed page has no video_url, trying GraphQL API...');
    try {
      const info = await this.fetchGraphQL(shortcode);
      return info;
    } catch (err) {
      console.log(`[Instagram] GraphQL fallback failed: ${err.message}`);
    }

    throw new Error(
      'Could not extract video URL. The content may be private or Instagram has changed their page structure.',
    );
  }

  async downloadVideo(url: string): Promise<{ filename: string; info: InstaMediaInfo }> {
    const info = await this.getMediaInfo(url);
    const shortcode = this.extractShortcode(url);
    const filename = `instagram_${shortcode}_${Date.now()}.mp4`;
    const filePath = path.join(this.downloadPath, filename);

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);

      https.get(
        info.videoUrl,
        {
          headers: {
            'User-Agent': 'curl/7.88.0',
            Referer: 'https://www.instagram.com/',
          },
          maxRedirects: 5,
        } as any,
        (res) => {
          if (res.statusCode !== 200) {
            fs.unlinkSync(filePath);
            return reject(new Error(`Download failed with status ${res.statusCode}`));
          }

          res.pipe(file);

          file.on('finish', () => {
            file.close();
            console.log(`[Instagram] Downloaded: ${filename}`);
            resolve({ filename, info });
          });

          file.on('error', (err) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
          });
        },
      ).on('error', (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
    });
  }
}
