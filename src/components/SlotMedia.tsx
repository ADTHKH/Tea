import React from 'react';

// 素材網址是 .mp4 就用影片循環播放（靜音才能自動播），其他照舊用圖片顯示
export const SlotMedia: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) =>
  /\.mp4$/i.test(src) ? (
    <video src={src} aria-label={alt} className={className} autoPlay loop muted playsInline />
  ) : (
    <img src={src} alt={alt} className={className} />
  );
