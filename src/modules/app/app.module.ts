import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { DownloadModule } from '../download/download.module';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { CleanupModule } from '../cleanup/cleanup.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfoModule } from '../info/info.module';
import { InstagramModule } from '../instagram/instagram.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      serveRoot: '/app',
    }),
    PrismaModule,
    AuthModule,
    DownloadModule,
    YtdlpModule,
    CleanupModule,
    InfoModule,
    InstagramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
