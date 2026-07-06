"use client";

import { useState, useCallback, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

const PLATFORMS = [
  { name: "youtube", label: "YouTube", color: "#ff0033", patterns: ["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com"] },
  { name: "instagram", label: "Instagram", color: "#e4405f", patterns: ["instagram.com"] },
  { name: "tiktok", label: "TikTok", color: "#00f2ea", patterns: ["tiktok.com", "vm.tiktok.com"] },
  { name: "facebook", label: "Facebook", color: "#1877f2", patterns: ["facebook.com", "fb.watch", "fb.com", "web.facebook.com"] },
  { name: "twitter", label: "Twitter/X", color: "#efefef", patterns: ["twitter.com", "x.com"] },
] as const;

type Platform = (typeof PLATFORMS)[number]["name"];

interface VideoInfo {
  title?: string;
  thumbnail?: string;
  uploader?: string;
  duration?: number;
  viewCount?: number;
  likeCount?: number;
  qualities?: { video?: string[]; audio?: string[] };
  extensions?: { video?: string[]; audio?: string[] };
}

interface ProgressData {
  percentage?: number;
  speed_str?: string;
  eta_str?: string;
  isConverting?: boolean;
}

function detectPlatform(url: string): Platform | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "").replace(/^m\./, "");
    for (const p of PLATFORMS) {
      if (p.patterns.some((pat) => hostname.includes(pat.replace(/^(www\.|m\.)/, "")))) {
        return p.name;
      }
    }
  } catch {}
  return null;
}

function formatNum(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [type, setType] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("");
  const [format, setFormat] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Downloading...");
  const [completed, setCompleted] = useState(false);
  const [completedFile, setCompletedFile] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    const detected = detectPlatform(value);
    setPlatform(detected);
    setError("");
  }, []);

  const resetState = useCallback(() => {
    setVideoInfo(null);
    setError("");
    setDownloading(false);
    setProgress(null);
    setProgressPct(0);
    setCompleted(false);
    setCompletedFile("");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const fetchInfo = useCallback(async () => {
    if (!url || !platform) return;
    resetState();
    setFetching(true);

    try {
      const endpoint = platform === "instagram" ? `${API}/instagram/info` : `${API}/info`;
      const body = platform === "instagram" ? { url } : { url, platform };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      const info: VideoInfo = await res.json();
      setVideoInfo(info);

      // Set default quality/format
      const quals = info.qualities?.video || [];
      const exts = info.extensions?.video || [];
      const q720 = quals.find((q) => q === "720p");
      setQuality(q720 || quals[0] || "");
      const mp4 = exts.find((e) => e === "mp4");
      setFormat(mp4 || exts[0] || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch info");
    } finally {
      setFetching(false);
    }
  }, [url, platform, resetState]);

  const handleTypeChange = useCallback(
    (newType: "video" | "audio") => {
      setType(newType);
      if (videoInfo) {
        const quals = newType === "video" ? videoInfo.qualities?.video : videoInfo.qualities?.audio;
        const exts = newType === "video" ? videoInfo.extensions?.video : videoInfo.extensions?.audio;
        setQuality(quals?.[0] || "");
        setFormat(exts?.[0] || "");
      }
    },
    [videoInfo]
  );

  const pollStatus = useCallback(
    async (downloadId: string, fileName: string) => {
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const res = await fetch(`${API}/download/${downloadId}/status`);
          const data = await res.json();
          if (data.status === "COMPLETED") {
            setProgressPct(100);
            setProgressLabel("Complete!");
            setTimeout(() => {
              setDownloading(false);
              setCompleted(true);
              setCompletedFile(fileName);
            }, 500);
            return;
          }
          if (data.status === "FAILED") {
            setError("Download failed");
            setDownloading(false);
            return;
          }
        } catch {}
      }
      setError("Download timed out");
      setDownloading(false);
    },
    []
  );

  const startDownload = useCallback(async () => {
    if (!url || !platform || !videoInfo) return;

    setDownloading(true);
    setCompleted(false);
    setCompletedFile("");
    setProgress(null);
    setProgressPct(0);
    setProgressLabel("Downloading...");

    try {
      if (platform === "instagram") {
        // Instagram: server-side download (direct video URL, fast)
        setProgressPct(30);
        setProgressLabel("Downloading from Instagram...");

        const res = await fetch(`${API}/instagram/download`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Error ${res.status}`);
        }

        const data = await res.json();
        setProgressPct(100);
        setProgressLabel("Complete!");
        setTimeout(() => {
          setDownloading(false);
          setCompleted(true);
          setCompletedFile(data.fileName);
        }, 500);
        return;
      }

      // YouTube and other platforms: server-side download with SSE progress
      // (YouTube needs ffmpeg merge for quality > 360p)
      const endpoint = type === "audio" ? `${API}/download/audio` : `${API}/download/video`;
      setProgressLabel("Starting download...");
      setProgressPct(5);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify({ url, quality, extension: format }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      const data = await res.json();
      const downloadId = data.downloadId;
      const fileName = data.fileName;

      // Subscribe to SSE progress
      setProgressLabel("Processing...");
      setProgressPct(10);

      const es = new EventSource(`${API}/download/${downloadId}/progress`);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "progress" && msg.data) {
            const pct = msg.data.percentage || 0;
            setProgressPct(Math.min(pct, 99));
            setProgressLabel(
              msg.data.speed_str
                ? `${msg.data.percentage_str || Math.round(pct) + "%"} · ${msg.data.speed_str}`
                : `${Math.round(pct)}%`
            );
          } else if (msg.type === "complete") {
            es.close();
            eventSourceRef.current = null;
            setProgressPct(100);
            setProgressLabel("Complete!");
            setTimeout(() => {
              setDownloading(false);
              setCompleted(true);
              setCompletedFile(fileName);
            }, 500);
          } else if (msg.type === "error") {
            es.close();
            eventSourceRef.current = null;
            setError(msg.message || "Download failed");
            setDownloading(false);
          }
        } catch {}
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        // Fallback: poll status
        pollStatus(downloadId, fileName);
      };
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Download failed");
      setDownloading(false);
    }
  }, [url, platform, videoInfo, type, quality, format, pollStatus]);

  const platformInfo = platform ? PLATFORMS.find((p) => p.name === platform) : null;
  const qualities = type === "video" ? videoInfo?.qualities?.video : videoInfo?.qualities?.audio;
  const extensions = type === "video" ? videoInfo?.extensions?.video : videoInfo?.extensions?.audio;

  return (
    <div className="relative z-1 w-full max-w-[720px] mx-auto px-6 pt-12 pb-20">
      {/* Header */}
      <header className="text-center mb-12" style={{ animation: "fadeDown 0.6s ease-out" }}>
        <h1
          className="font-[var(--font-syne)] font-extrabold text-4xl tracking-tight"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #70ffb8 50%, var(--accent) 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s ease-in-out infinite",
          }}
        >
          VidGrab
        </h1>
        <p className="text-xs text-text-muted mt-1.5 tracking-[2px] uppercase font-medium">
          Social Media Video Downloader
        </p>
      </header>

      {/* URL Input */}
      <section style={{ animation: "fadeUp 0.5s ease-out 0.1s both" }}>
        <div
          className={`relative flex bg-bg-input border-[1.5px] rounded-xl overflow-hidden transition-all duration-300 ${
            error
              ? "border-danger shadow-[0_0_30px_rgba(255,64,96,0.08)]"
              : "border-border focus-within:border-accent-dim focus-within:shadow-[0_0_40px_rgba(0,224,208,0.08)]"
          }`}
        >
          <input
            type="url"
            className="flex-1 bg-transparent border-none px-5 py-4 text-text-primary font-[var(--font-jetbrains)] text-sm outline-none min-w-0 placeholder:text-text-muted placeholder:font-[var(--font-dm-sans)] placeholder:italic"
            placeholder="Paste a YouTube, Instagram, TikTok, Facebook, or Twitter/X link..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && platform && !fetching) fetchInfo();
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="bg-gradient-to-br from-accent-dim to-accent text-bg-deep border-none px-7 font-[var(--font-syne)] font-bold text-xs tracking-[1.5px] uppercase cursor-pointer transition-all duration-200 whitespace-nowrap hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={fetchInfo}
            disabled={!platform || fetching}
          >
            {fetching ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin align-middle mr-1.5" />
                Wait
              </>
            ) : (
              "Fetch"
            )}
          </button>
        </div>

        {/* Platform badge */}
        {platformInfo && (
          <div
            className="inline-flex items-center gap-2 mt-3.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-bg-elevated border border-border text-text-secondary"
            style={{ animation: "fadeUp 0.3s ease-out" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: platformInfo.color }}
            />
            {platformInfo.label}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-danger" style={{ animation: "fadeUp 0.2s ease-out" }}>
            {error}
          </p>
        )}
      </section>

      {/* Video Info Card */}
      {videoInfo && (
        <section
          className="mt-7 bg-bg-card border border-border rounded-xl overflow-hidden"
          style={{ animation: "fadeUp 0.5s ease-out" }}
        >
          <div className="flex max-sm:flex-col">
            {videoInfo.thumbnail ? (
              <div className="w-[220px] max-sm:w-full min-h-[140px] max-sm:min-h-[180px] flex-shrink-0 bg-bg-elevated relative overflow-hidden">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title || "Video thumbnail"}
                  className="w-full h-full object-cover absolute inset-0"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {videoInfo.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white font-[var(--font-jetbrains)] text-[0.72rem] px-2 py-0.5 rounded font-medium z-10">
                    {formatDuration(videoInfo.duration)}
                  </span>
                )}
              </div>
            ) : (
              <div className="w-[220px] max-sm:w-full min-h-[140px] max-sm:min-h-[100px] flex-shrink-0 bg-bg-elevated flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="opacity-20">
                  <path d="M32 16L32 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M22 32L32 42L42 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 48H46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            )}

            <div className="flex-1 p-5 flex flex-col justify-center gap-2 min-w-0">
              <h2 className="font-[var(--font-syne)] font-bold text-[0.95rem] leading-snug text-text-primary line-clamp-2">
                {videoInfo.title || "Untitled"}
              </h2>
              {videoInfo.uploader && (
                <p className="text-sm text-accent font-medium">{videoInfo.uploader}</p>
              )}
              <div className="flex gap-4 text-xs text-text-muted font-medium">
                {videoInfo.viewCount != null && videoInfo.viewCount > 0 && (
                  <span>{formatNum(videoInfo.viewCount)} views</span>
                )}
                {videoInfo.likeCount != null && videoInfo.likeCount > 0 && (
                  <span>{formatNum(videoInfo.likeCount)} likes</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Options */}
      {videoInfo && (
        <div
          className="mt-5 grid grid-cols-3 max-sm:grid-cols-1 gap-3"
          style={{ animation: "fadeUp 0.4s ease-out 0.1s both" }}
        >
          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-text-muted mb-1.5 font-semibold">
              Type
            </label>
            <select
              className="w-full p-3 bg-bg-input border-[1.5px] border-border rounded-lg text-text-primary font-[var(--font-dm-sans)] text-sm font-medium outline-none cursor-pointer appearance-none bg-no-repeat focus:border-accent-dim"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2355536a' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 12px center",
              }}
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as "video" | "audio")}
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-text-muted mb-1.5 font-semibold">
              Quality
            </label>
            <select
              className="w-full p-3 bg-bg-input border-[1.5px] border-border rounded-lg text-text-primary font-[var(--font-dm-sans)] text-sm font-medium outline-none cursor-pointer appearance-none bg-no-repeat focus:border-accent-dim"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2355536a' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 12px center",
              }}
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              {(qualities || []).map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-text-muted mb-1.5 font-semibold">
              Format
            </label>
            <select
              className="w-full p-3 bg-bg-input border-[1.5px] border-border rounded-lg text-text-primary font-[var(--font-dm-sans)] text-sm font-medium outline-none cursor-pointer appearance-none bg-no-repeat focus:border-accent-dim"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2355536a' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 12px center",
              }}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              {(extensions || []).map((ext) => (
                <option key={ext} value={ext}>
                  {ext.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Download Button */}
      {videoInfo && !completed && (
        <div className="mt-6" style={{ animation: "fadeUp 0.4s ease-out 0.15s both" }}>
          <button
            className="w-full py-4 border-none rounded-xl font-[var(--font-syne)] font-bold text-[0.95rem] tracking-[1px] uppercase cursor-pointer transition-all duration-200 relative overflow-hidden bg-gradient-to-br from-accent-dim to-accent text-bg-deep hover:shadow-[0_4px_30px_rgba(0,224,208,0.2)] active:scale-[0.985] disabled:opacity-35 disabled:cursor-not-allowed group"
            onClick={startDownload}
            disabled={downloading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
            {downloading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin align-middle mr-1.5" />
                Processing...
              </>
            ) : (
              "Download"
            )}
          </button>
        </div>
      )}

      {/* Progress */}
      {downloading && (
        <div className="mt-6" style={{ animation: "fadeUp 0.3s ease-out" }}>
          <div className="flex justify-between items-center mb-2.5 text-xs font-medium">
            <span className="text-text-secondary">{progressLabel}</span>
            <span className="font-[var(--font-jetbrains)] text-accent text-xs">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-[width] duration-400 ease-out relative"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, var(--accent-dim), var(--accent), #70ffb8)",
                backgroundSize: "200% 100%",
                animation: "progressShimmer 2s linear infinite",
              }}
            >
              <span className="absolute right-0 -top-0.5 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] opacity-80" />
            </div>
          </div>
          <div className="flex justify-between mt-2.5 font-[var(--font-jetbrains)] text-[0.72rem] text-text-muted">
            <span>{progress?.speed_str || ""}</span>
            <span>{progress?.eta_str ? `ETA ${progress.eta_str}` : ""}</span>
          </div>
        </div>
      )}

      {/* Complete */}
      {completed && completedFile && (
        <div className="mt-6 text-center" style={{ animation: "fadeUp 0.4s ease-out" }}>
          <div className="bg-bg-card border border-accent-dim rounded-xl p-7">
            <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-accent-glow border-2 border-accent-dim flex items-center justify-center text-xl">
              &#10003;
            </div>
            <p className="font-[var(--font-syne)] font-bold text-lg mb-1.5 text-accent">
              Ready to save
            </p>
            <p className="font-[var(--font-jetbrains)] text-[0.72rem] text-text-muted break-all mb-5">
              {completedFile}
            </p>
            <a
              href={`${API}/download/${encodeURIComponent(completedFile)}`}
              download={completedFile}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent-dim to-accent text-bg-deep border-none rounded-lg font-[var(--font-syne)] font-bold text-sm tracking-[1px] uppercase cursor-pointer no-underline transition-all duration-200 hover:shadow-[0_4px_30px_rgba(0,224,208,0.25)] hover:-translate-y-px"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Save File
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
