"use client";
import { useState } from "react";
export function ArticleImage({ src, alt, priority = false, className = "" }: { src: string; alt: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}><span className="fallback-orbit" /><span className="fallback-word">overfox<span>news.</span></span></div>;
  // Images remain third-party URL references; no image proxy or server storage.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}
