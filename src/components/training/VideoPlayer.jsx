import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Gauge } from 'lucide-react';
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

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SPEED_LABELS = { 0.5: '0.5x', 0.75: '0.75x', 1: 'Bình thường', 1.25: '1.25x', 1.5: '1.5x', 2: '2x' };

const QUALITY_MAP = {
  'hd1080': '1080p',
  'hd720': '720p',
  'large': '480p',
  'medium': '360p',
  'small': '240p',
  'default': 'Auto',
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

  // Speed & Quality state
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('default');
  const [availableQualities, setAvailableQualities] = useState([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const hideTimer = useRef(null);
  const readyTimeout = useRef(null);

  // Init API and Player
  useEffect(() => {
    loadYTApi();
    const videoId = extractVideoId(url);
    if (!videoId) return;
    
    setIsReady(false);

    const createPlayer = () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
      }
      
      // Safely create a fresh div for YT API to consume
      if (!playerDivRef.current) return;
      playerDivRef.current.innerHTML = '';
      const el = document.createElement('div');
      playerDivRef.current.appendChild(el);

      playerRef.current = new window.YT.Player(el, {
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
            if (readyTimeout.current) clearTimeout(readyTimeout.current);
            const quals = e.target.getAvailableQualityLevels();
            setAvailableQualities(quals || []);
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
            if (e.data === window.YT.PlayerState.PLAYING) {
              startProgressTracking();
              const quals = playerRef.current?.getAvailableQualityLevels?.() || [];
              if (quals.length > 0) setAvailableQualities(quals);
            } else {
              stopProgressTracking();
            }
          },
          onPlaybackQualityChange: (e) => {
            setCurrentQuality(e.data);
          },
        },
      });
      
      // Fallback: forcefully mark as ready if YT is slow or blocked
      readyTimeout.current = setTimeout(() => {
        setIsReady(true);
      }, 2000);
    };

    onApiReady(createPlayer);

    return () => {
      stopProgressTracking();
      if (readyTimeout.current) clearTimeout(readyTimeout.current);
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

  // Speed control
  const changeSpeed = useCallback((rate) => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  // Quality control
  const changeQuality = useCallback((quality) => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackQuality(quality);
    setCurrentQuality(quality);
    setShowQualityMenu(false);
  }, []);

  // Close menus when clicking elsewhere
  const closeMenus = useCallback(() => {
    setShowSpeedMenu(false);
    setShowQualityMenu(false);
  }, []);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => { setShowControls(false); closeMenus(); }, 3000);
    }
  }, [isPlaying, closeMenus]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Filter valid qualities (remove 'auto' and unknown)
  const displayQualities = availableQualities.filter(q => QUALITY_MAP[q]);

  return (
    <div 
      className="vp-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (isPlaying) { setShowControls(false); closeMenus(); } }}
    >
      {/* YouTube Player (hidden controls) */}
      <div className="vp-iframe-wrap">
        <div ref={playerDivRef} className="vp-iframe"></div>
      </div>

      {/* Click overlay — blocks ALL YouTube links */}
      <div className="vp-click-overlay" onClick={() => { togglePlay(); closeMenus(); }}>
        {!isPlaying && isReady && (
          <div className="vp-big-play">
            <Play fill="white" size={48} />
          </div>
        )}
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

        {/* Speed Control */}
        <div className="vp-menu-wrapper">
          <button 
            className={`vp-ctrl-btn ${playbackRate !== 1 ? 'vp-active-indicator' : ''}`}
            onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }} 
            title="Tốc độ phát"
          >
            <Gauge size={18} />
          </button>
          {showSpeedMenu && (
            <div className="vp-popup-menu">
              <div className="vp-popup-title">Tốc độ phát</div>
              {SPEED_OPTIONS.map(rate => (
                <div 
                  key={rate} 
                  className={`vp-popup-item ${playbackRate === rate ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); changeSpeed(rate); }}
                >
                  {SPEED_LABELS[rate]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quality Control */}
        <div className="vp-menu-wrapper">
          <button 
            className="vp-ctrl-btn"
            onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }} 
            title="Chất lượng video"
          >
            <Settings size={18} />
          </button>
          {showQualityMenu && (
            <div className="vp-popup-menu">
              <div className="vp-popup-title">Chất lượng</div>
              <div 
                className={`vp-popup-item ${currentQuality === 'default' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); changeQuality('default'); }}
              >
                Tự động
              </div>
              {displayQualities.map(q => (
                <div 
                  key={q} 
                  className={`vp-popup-item ${currentQuality === q ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); changeQuality(q); }}
                >
                  {QUALITY_MAP[q]}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="vp-ctrl-btn" onClick={toggleFullscreen} title="Toàn màn hình">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
