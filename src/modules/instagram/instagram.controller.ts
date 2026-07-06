import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus, Downloaders } from '@prisma/client';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
  constructor(
    private readonly instagramService: InstagramService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiSecurity('X-API-Key')
  @Post('info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Instagram reel/post info' })
  @ApiResponse({ status: 200, description: 'Media info retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid URL or extraction failed' })
  async getInfo(@Body() body: { url: string }) {
    try {
      const info = await this.instagramService.getMediaInfo(body.url);
      return {
        title: info.title,
        thumbnail: info.thumbnailUrl,
        uploader: info.username,
        qualities: { video: ['Original'] },
        extensions: { video: ['mp4'] },
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @ApiSecurity('X-API-Key')
  @Post('download')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Download Instagram reel/post video' })
  @ApiResponse({ status: 202, description: 'Download started' })
  @ApiResponse({ status: 400, description: 'Invalid URL or download failed' })
  async download(@Body() body: { url: string }) {
    try {
      // Create download record
      const download = await this.prisma.download.create({
        data: {
          originalUrl: body.url,
          status: DownloadStatus.DOWNLOADING,
          downloader: Downloaders.INSTAGRAM,
          filename: 'pending',
        },
      });

      // Start download
      try {
        const result = await this.instagramService.downloadVideo(body.url);

        await this.prisma.download.update({
          where: { id: download.id },
          data: {
            status: DownloadStatus.COMPLETED,
            filename: result.filename,
            downloadUrl: `/download/${result.filename}`,
          },
        });

        return {
          message: 'Download completed',
          downloadId: download.id,
          fileName: result.filename,
          downloadUrl: `/download/${result.filename}`,
          info: {
            title: result.info.title,
            username: result.info.username,
            thumbnail: result.info.thumbnailUrl,
          },
        };
      } catch (err) {
        await this.prisma.download.update({
          where: { id: download.id },
          data: { status: DownloadStatus.FAILED },
        });
        throw err;
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(err.message);
    }
  }
}
