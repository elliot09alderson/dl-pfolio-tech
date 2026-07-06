import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "VidGrab - Instagram Reel Downloader | YouTube Video Downloader | TikTok, Facebook & Twitter/X | Free Online Video Saver for iPhone & Android",
  description:
    "Free online Instagram reel downloader, Instagram post downloader, YouTube video downloader, YouTube Shorts downloader, TikTok downloader without watermark. Download reels for iPhone & Android. Save videos in 4K, 1080p, 720p. Convert YouTube to MP3. Works on all devices — no app needed, no login required.",
  keywords: [
    // Instagram keywords
    "instagram downloader",
    "instagram reel downloader",
    "instagram post downloader",
    "instagram story downloader",
    "instagram video downloader",
    "download instagram reels",
    "download instagram post",
    "instagram reel downloader for iphone",
    "instagram reel downloader for android",
    "instagram reel saver",
    "save instagram reels",
    "instagram reel download online",
    "instagram reels download without login",
    "insta reel downloader",
    "insta post downloader",
    "instagram downloader online free",
    // YouTube keywords
    "youtube downloader",
    "youtube video downloader",
    "youtube shorts downloader",
    "download youtube video",
    "youtube to mp3",
    "youtube to mp4",
    "youtube video downloader for iphone",
    "youtube downloader online",
    "youtube 4k downloader",
    "youtube hd downloader",
    "youtube music downloader",
    "youtube shorts download",
    "save youtube video",
    // TikTok keywords
    "tiktok downloader",
    "tiktok video downloader",
    "download tiktok video",
    "tiktok downloader without watermark",
    "tiktok saver",
    "save tiktok video",
    // Facebook keywords
    "facebook video downloader",
    "facebook reel downloader",
    "download facebook video",
    "fb video downloader",
    // Twitter/X keywords
    "twitter video downloader",
    "x video downloader",
    "download twitter video",
    // General keywords
    "video downloader",
    "free video downloader",
    "online video downloader",
    "social media downloader",
    "mp4 downloader",
    "mp3 converter",
    "4k video downloader",
    "hd video downloader",
    "download video without watermark",
    "save video online",
    "video downloader for iphone",
    "video downloader for android",
    "reel downloader",
    "post downloader",
    "shorts downloader",
    "vidgrab",
  ],
  authors: [{ name: "VidGrab" }],
  creator: "VidGrab",
  publisher: "VidGrab",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vidgrab.app",
    siteName: "VidGrab",
    title: "VidGrab - Free Instagram Reel & YouTube Video Downloader for iPhone & Android",
    description:
      "Download Instagram Reels, YouTube videos & Shorts, TikTok without watermark, Facebook & Twitter/X videos. All qualities up to 4K. Extract audio as MP3. Free, fast, works on iPhone & Android. No app needed.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VidGrab - Instagram Reel Downloader, YouTube Video Downloader, TikTok Downloader",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VidGrab - Free Instagram Reel & YouTube Video Downloader",
    description:
      "Download Instagram Reels & posts, YouTube videos & Shorts, TikTok without watermark. Works on iPhone & Android. Free, no app needed.",
    images: ["/opengraph-image"],
    creator: "@vidgrab",
  },
  alternates: {
    canonical: "https://vidgrab.app",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#06060b" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
