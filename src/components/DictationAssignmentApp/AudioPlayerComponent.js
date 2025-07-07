import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const AudioPlayerComponent = ({
  audioUrl,
  duration,
  showDuration = true,
  showReset = false,
  onReset,
  className = '',
  playerSize = 'medium',
  waveColor = '#3b82f6',
  progressColor = '#1d4ed8'
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef(null);

  const sizeClasses = {
    small: {
      button: 'p-1.5',
      icon: 'w-4 h-4',
      slider: 'h-1'
    },
    medium: {
      button: 'p-2',
      icon: 'w-5 h-5',
      slider: 'h-1.5'
    },
    large: {
      button: 'p-3',
      icon: 'w-6 h-6',
      slider: 'h-2'
    }
  };

  const currentSize = sizeClasses[playerSize];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      isMuted ? (audioRef.current.volume = 0) : (audioRef.current.volume = volume);
    }
  }, [isMuted, volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
    setIsPlaying(!isPlaying);
  };

  const whilePlaying = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    const manualChange = Number(e.target.value);
    audioRef.current.currentTime = (audioRef.current.duration / 100) * manualChange;
    setProgress(manualChange);
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
    if (onReset) onReset();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`bg-white/5 rounded-xl p-3 border border-white/10 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        onTimeUpdate={(e) => {
          if (!animationRef.current) {
            setProgress((e.target.currentTime / e.target.duration) * 100);
          }
        }}
        onLoadedMetadata={(e) => {
          if (duration && e.target.duration !== duration) {
            // Adjust duration if it doesn't match the expected duration
            e.target.duration = duration;
          }
        }}
      />

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className={`rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors ${currentSize.button} ${
            !audioUrl ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPlaying ? (
            <Pause className={`text-blue-400 ${currentSize.icon}`} />
          ) : (
            <Play className={`text-blue-400 ${currentSize.icon}`} />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className={`flex-1 accent-blue-500 ${currentSize.slider} rounded-full bg-white/10 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500`}
            style={{
              background: `linear-gradient(to right, ${progressColor} ${progress}%, ${waveColor} ${progress}%)`
            }}
            disabled={!audioUrl}
          />
          {showDuration && (
            <span className="text-xs text-white/60 min-w-[40px] text-right">
              {formatTime(
                audioRef.current
                  ? (audioRef.current.duration * progress) / 100
                  : (duration * progress) / 100 || 0
              )}
            </span>
          )}
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
              isMuted ? 'text-red-400' : 'text-blue-400'
            }`}
          >
            {isMuted ? (
              <VolumeX className={currentSize.icon} />
            ) : (
              <Volume2 className={currentSize.icon} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className={`w-16 ${currentSize.slider} rounded-full bg-white/10 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500`}
            style={{
              background: `linear-gradient(to right, ${progressColor} ${
                isMuted ? 0 : volume * 100
              }%, ${waveColor} ${isMuted ? 0 : volume * 100}%)`
            }}
          />
        </div>

        {/* Reset Button (optional) */}
        {showReset && (
          <button
            onClick={handleReset}
            className={`p-1 rounded-full hover:bg-white/10 transition-colors text-blue-400`}
          >
            <RotateCcw className={currentSize.icon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioPlayerComponent;