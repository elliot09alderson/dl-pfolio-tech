import Downloader from "./components/Downloader";

export default function Home() {
  return (
    <main className="flex-1 relative z-1">
      <Downloader />

      {/* SEO Content - visible to crawlers and users */}
      <section className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="border-t border-border pt-12">
          <h2 className="font-[var(--font-syne)] font-bold text-xl text-text-primary mb-4">
            Free Instagram Reel Downloader & YouTube Video Downloader Online
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            VidGrab is a free online video downloader that works on iPhone, Android, PC, and Mac.
            Download Instagram Reels, Instagram posts, YouTube videos, YouTube Shorts,
            TikTok videos without watermark, Facebook videos, and Twitter/X video posts.
            Save videos in any quality from 240p to 4K Ultra HD. Convert YouTube to MP3
            for music. No app install needed — works right in your browser.
          </p>

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-10">
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h3 className="font-[var(--font-syne)] font-bold text-sm text-accent mb-2">
                Instagram Reel Downloader
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Download Instagram Reels to your iPhone or Android in original quality.
                Save Instagram posts, stories, and IGTV videos as MP4. Works without login
                for public content. Best free Instagram reel downloader online — just paste
                the reel link and download instantly.
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h3 className="font-[var(--font-syne)] font-bold text-sm text-accent mb-2">
                YouTube Video Downloader
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Download YouTube videos in 720p, 1080p, 1440p, or 4K quality. Save YouTube
                Shorts as MP4. Convert YouTube to MP3 for music downloads. Works with all
                YouTube URL formats including playlists. Best YouTube video downloader for
                iPhone and Android — no app required.
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h3 className="font-[var(--font-syne)] font-bold text-sm text-accent mb-2">
                TikTok Video Downloader
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Download TikTok videos without watermark. Save TikTok videos to iPhone or
                Android camera roll. Supports all TikTok URL formats including short links
                and shared URLs. Free TikTok downloader online — no watermark, no login.
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <h3 className="font-[var(--font-syne)] font-bold text-sm text-accent mb-2">
                Facebook & Twitter/X Downloader
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Download Facebook videos, reels, and stories in HD quality. Save Twitter/X
                video posts as MP4. Free Facebook video downloader and Twitter video
                downloader — works on all devices including iPhone and Android.
              </p>
            </div>
          </div>

          <h2 className="font-[var(--font-syne)] font-bold text-lg text-text-primary mb-4">
            How to Download Instagram Reels & YouTube Videos
          </h2>
          <ol className="text-sm text-text-secondary leading-relaxed list-decimal list-inside space-y-2.5 mb-10">
            <li>
              <strong>Copy the link</strong> — Open Instagram, YouTube, TikTok, Facebook, or Twitter/X
              and copy the video/reel/post URL
            </li>
            <li>
              <strong>Paste the URL</strong> — Paste it into the download field above. VidGrab
              auto-detects the platform (Instagram, YouTube, TikTok, etc.)
            </li>
            <li>
              <strong>Fetch video info</strong> — Click &ldquo;Fetch&rdquo; to load the video title,
              thumbnail, and available quality options
            </li>
            <li>
              <strong>Choose quality & format</strong> — Select video quality (240p to 4K) and format
              (MP4, WebM, MP3 for audio). For Instagram reels, original quality is downloaded
            </li>
            <li>
              <strong>Download & save</strong> — Click &ldquo;Download&rdquo; and save the file
              to your iPhone, Android, PC, or Mac when it&apos;s ready
            </li>
          </ol>

          <h2 className="font-[var(--font-syne)] font-bold text-lg text-text-primary mb-4">
            Download Reels for iPhone & Android
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            VidGrab works perfectly on mobile browsers. To download Instagram reels on iPhone,
            simply open VidGrab in Safari, paste the reel link, and tap Download. The video
            saves directly to your camera roll. On Android, use Chrome or any browser —
            downloaded videos appear in your Downloads folder. No app installation needed.
            This is the easiest Instagram reel downloader for iPhone and the best reel saver
            for Android.
          </p>

          <h2 className="font-[var(--font-syne)] font-bold text-lg text-text-primary mb-4">
            Supported Formats & Qualities
          </h2>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-10">
            <div>
              <h3 className="text-xs uppercase tracking-[1.5px] text-text-muted font-semibold mb-2">
                Video Formats
              </h3>
              <p className="text-sm text-text-secondary">
                MP4, WebM, MKV, OGG, FLV — from 240p to 4K (2160p). Download YouTube in 4K,
                Instagram reels in original quality, TikTok without watermark.
              </p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[1.5px] text-text-muted font-semibold mb-2">
                Audio Formats
              </h3>
              <p className="text-sm text-text-secondary">
                MP3, WAV, AAC, M4A, OPUS, Vorbis, FLAC — up to 320Kbps. Convert YouTube
                videos to MP3 music files. Extract audio from any video.
              </p>
            </div>
          </div>

          <h2 className="font-[var(--font-syne)] font-bold text-lg text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 mb-10">
            <details className="bg-bg-card border border-border rounded-xl p-4 group">
              <summary className="text-sm text-text-primary font-medium cursor-pointer">
                How to download Instagram reels on iPhone?
              </summary>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                Open VidGrab in Safari on your iPhone, paste the Instagram reel link,
                click Fetch, then Download. The reel saves as an MP4 file to your device.
                No app needed — VidGrab is the best Instagram reel downloader for iPhone.
              </p>
            </details>
            <details className="bg-bg-card border border-border rounded-xl p-4 group">
              <summary className="text-sm text-text-primary font-medium cursor-pointer">
                Can I download YouTube Shorts as MP4?
              </summary>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                Yes! Paste any YouTube Shorts URL into VidGrab. You can download Shorts in
                multiple qualities and formats including MP4. You can also extract the audio
                as MP3. Works on iPhone, Android, and desktop.
              </p>
            </details>
            <details className="bg-bg-card border border-border rounded-xl p-4 group">
              <summary className="text-sm text-text-primary font-medium cursor-pointer">
                How to download TikTok videos without watermark?
              </summary>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                Copy the TikTok video link, paste it into VidGrab, and download. VidGrab
                downloads TikTok videos without the watermark overlay, giving you clean
                MP4 files. Free TikTok downloader for iPhone and Android.
              </p>
            </details>
            <details className="bg-bg-card border border-border rounded-xl p-4 group">
              <summary className="text-sm text-text-primary font-medium cursor-pointer">
                Is VidGrab free? Do I need to install an app?
              </summary>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                VidGrab is completely free. No app installation required — it works
                directly in your web browser on any device (iPhone, Android, PC, Mac).
                No login, no signup, no watermarks added.
              </p>
            </details>
            <details className="bg-bg-card border border-border rounded-xl p-4 group">
              <summary className="text-sm text-text-primary font-medium cursor-pointer">
                Can I download Instagram posts and stories?
              </summary>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                Yes, VidGrab supports downloading Instagram posts (photos and videos),
                reels, and stories from public accounts. Just paste the Instagram URL
                and download. Best free Instagram post downloader online.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-6 text-center">
          <p className="text-xs text-text-muted">
            VidGrab &mdash; Free online Instagram reel downloader, YouTube video downloader,
            TikTok downloader. Works on iPhone & Android. For personal use only.
          </p>
        </footer>
      </section>

      {/* JSON-LD Structured Data - WebApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "VidGrab",
            url: "https://vidgrab.app",
            description:
              "Free online Instagram reel downloader, YouTube video downloader, TikTok downloader, Facebook video downloader, Twitter/X video downloader. Download reels for iPhone & Android. Save videos in 4K, convert to MP3.",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Instagram reel downloader",
              "Instagram post downloader",
              "Instagram story downloader",
              "YouTube video downloader",
              "YouTube Shorts downloader",
              "YouTube to MP3 converter",
              "TikTok downloader without watermark",
              "Facebook video downloader",
              "Twitter/X video downloader",
              "4K video download",
              "Works on iPhone and Android",
              "No app installation required",
              "Multiple format support (MP4, MP3, WebM, AAC)",
            ],
          }),
        }}
      />

      {/* JSON-LD FAQ Schema for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How to download Instagram reels on iPhone?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Open VidGrab in Safari on your iPhone, paste the Instagram reel link, click Fetch, then Download. The reel saves as an MP4 file to your device. No app needed.",
                },
              },
              {
                "@type": "Question",
                name: "Can I download YouTube Shorts as MP4?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! Paste any YouTube Shorts URL into VidGrab. You can download Shorts in multiple qualities and formats including MP4. You can also extract the audio as MP3.",
                },
              },
              {
                "@type": "Question",
                name: "How to download TikTok videos without watermark?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Copy the TikTok video link, paste it into VidGrab, and download. VidGrab downloads TikTok videos without the watermark overlay, giving you clean MP4 files.",
                },
              },
              {
                "@type": "Question",
                name: "Is VidGrab free? Do I need to install an app?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "VidGrab is completely free. No app installation required — it works directly in your web browser on any device (iPhone, Android, PC, Mac). No login, no signup, no watermarks added.",
                },
              },
              {
                "@type": "Question",
                name: "Can I download Instagram posts and stories?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, VidGrab supports downloading Instagram posts (photos and videos), reels, and stories from public accounts. Just paste the Instagram URL and download.",
                },
              },
            ],
          }),
        }}
      />

      {/* JSON-LD HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Download Instagram Reels & YouTube Videos Online",
            description:
              "Step-by-step guide to download Instagram reels, YouTube videos, TikTok videos, and more using VidGrab free online video downloader.",
            step: [
              {
                "@type": "HowToStep",
                name: "Copy the link",
                text: "Open Instagram, YouTube, TikTok, Facebook, or Twitter/X and copy the video/reel/post URL.",
              },
              {
                "@type": "HowToStep",
                name: "Paste the URL",
                text: "Paste it into VidGrab's download field. The platform is auto-detected.",
              },
              {
                "@type": "HowToStep",
                name: "Fetch video info",
                text: "Click Fetch to load video title, thumbnail, and available quality options.",
              },
              {
                "@type": "HowToStep",
                name: "Choose quality and format",
                text: "Select video quality (240p to 4K) and format (MP4, WebM, MP3 for audio).",
              },
              {
                "@type": "HowToStep",
                name: "Download and save",
                text: "Click Download and save the file to your iPhone, Android, PC, or Mac.",
              },
            ],
          }),
        }}
      />
    </main>
  );
}
