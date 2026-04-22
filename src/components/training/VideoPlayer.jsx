import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import './VideoPlayer.css';

// Load YouTube IFrame API once
let apiLoaded = false;
let apiReady = false;
const apiCallbacks = [];

const loadYTApi = () => {
  if (apiLoaded) return;
  apiLoaded = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    apiCallbacks.forEach(cb => cb());
    apiCallbacks.length = 0;
  };
};

const onApiReady = (cb) => {
  if (apiReady) { cb(); return; }
  apiCallbacks.push(cb);
};

const extractVideoId = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
  if (url.includes('youtube.com/watch?v=')) return url.split('v=')[1].split('&')[0];
  if (url.includes('/embed/')) return url.split('/embed/')[1].split('?')[0];
  return url;
};

const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ url, title }) => {
  const containerRef = useRef(null);
  const playerDivRef = useRef(null);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const hideTimer = useRef(null);

  // Init API and Player
  useEffect(() => {
    loadYTApi();
    const videoId = extractVideoId(url);
    if (!videoId) return;

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 0,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            setIsReady(true);
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
            if (e.data === window.YT.PlayerState.PLAYING) {
              startProgressTracking();
            } else {
              stopProgressTracking();
            }
          },
        },
      });
    };

    onApiReady(createPlayer);

    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [url]);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const ct = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(ct);
        setDuration(dur);
        setProgress(dur > 0 ? (ct / dur) * 100 : 0);
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Controls
  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const handleSeek = useCallback((e) => {
    if (!playerRef.current || !duration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    playerRef.current.seekTo(pct * duration, true);
    setProgress(pct * 100);
    setCurrentTime(pct * duration);
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div 
      className="vp-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* YouTube Player (hidden controls) */}
      <div className="vp-iframe-wrap">
        <div ref={playerDivRef} className="vp-iframe"></div>
      </div>

      {/* Click overlay — blocks ALL YouTube links */}
      <div className="vp-click-overlay" onClick={togglePlay}>
        {/* Big center play button when paused */}
        {!isPlaying && isReady && (
          <div className="vp-big-play">
            <Play fill="white" size={48} />
          </div>
        )}
        {/* Loading indicator */}
        {!isReady && (
          <div className="vp-loading">Đang tải video...</div>
        )}
      </div>

      {/* Custom Controls Bar */}
      <div className={`vp-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
        <button className="vp-ctrl-btn" onClick={togglePlay} title={isPlaying ? 'Tạm dừng' : 'Phát'}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="white" />}
        </button>

        <span className="vp-time">{formatTime(currentTime)}</span>

        <div className="vp-progress-bar" onClick={handleSeek}>
          <div className="vp-progress-bg">
            <div className="vp-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <span className="vp-time">{formatTime(duration)}</span>

        <button className="vp-ctrl-btn" onClick={toggleMute} title={isMuted ? 'Bật âm' : 'Tắt âm'}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button className="vp-ctrl-btn" onClick={toggleFullscreen} title="Toàn màn hình">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
