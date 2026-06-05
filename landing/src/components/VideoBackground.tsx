import { useEffect, useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const FADE_DURATION = 0.5; // seconds

    const monitorVideoFade = () => {
      if (video.duration) {
        const current = video.currentTime;
        const duration = video.duration;

        let opacity = 1;
        if (current < FADE_DURATION) {
          opacity = current / FADE_DURATION;
        } else if (current > duration - FADE_DURATION) {
          opacity = (duration - current) / FADE_DURATION;
        }

        opacity = Math.max(0, Math.min(1, opacity));
        video.style.opacity = opacity.toString();
      }
      rafId = requestAnimationFrame(monitorVideoFade);
    };

    const handlePlay = () => {
      rafId = requestAnimationFrame(monitorVideoFade);
    };

    const handlePause = () => {
      cancelAnimationFrame(rafId);
    };

    const handleEnded = () => {
      cancelAnimationFrame(rafId);
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          rafId = requestAnimationFrame(monitorVideoFade);
        }).catch((err) => {
          console.error('Play failed on ended loop:', err);
        });
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    video.play().then(() => {
      rafId = requestAnimationFrame(monitorVideoFade);
    }).catch((err) => {
      console.warn('Autoplay blocked or failed, waiting for user interaction:', err);
      rafId = requestAnimationFrame(monitorVideoFade);
    });

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div 
      className="absolute z-0 w-full overflow-hidden pointer-events-none"
      style={{
        top: '300px',
        inset: 'auto 0 0 0',
        height: 'calc(100vh - 300px)',
      }}
    >
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        className="w-full h-full object-cover"
        style={{ opacity: 0 }}
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
    </div>
  );
}
