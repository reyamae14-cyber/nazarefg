/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTVProgress, saveTVProgress } from '../utils/progressTracker';
import audioManager from '../utils/AudioManager';

const VideoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const { profile } = useSelector((state) => state.account);

  useEffect(() => {
    const handlePlayModalTrigger = (event) => {
      const trigger = event.target.closest('.play-modal-trigger');
      if (!trigger) return;

      event.preventDefault();
      event.stopPropagation();

      const dataType = trigger.getAttribute('data-type');
      const dataId = trigger.getAttribute('data-id');
      let dataSeason = trigger.getAttribute('data-season');
      let dataEpisode = trigger.getAttribute('data-episode');

      let videoUrl = '';
      
      if (dataType === 'movie' && dataId) {
        videoUrl = `https://infested.vercel.app/movie/${dataId}`;
      } else if (dataType === 'tv' && dataId) {
        // For TV shows, get user's progress or use defaults
        if (profile && profile.id) {
          const progress = getTVProgress(dataId, profile.id);
          dataSeason = progress.season;
          dataEpisode = progress.episode;
        } else {
          // Fallback to defaults if no profile
          dataSeason = dataSeason || 1;
          dataEpisode = dataEpisode || 1;
        }
        
        videoUrl = `https://infested.vercel.app/tv/${dataId}/${dataSeason}/${dataEpisode}`;
        
        // Save current progress when starting to watch
        if (profile && profile.id) {
          saveTVProgress(dataId, profile.id, dataSeason, dataEpisode);
        }
      }

      if (videoUrl) {
        // Pause all YouTube trailers before starting main video
        audioManager.pauseAllYouTubeVideos();
        
        setIframeSrc(videoUrl);
        setIsOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    };

    const handleCloseModal = () => {
      setIsOpen(false);
      setIframeSrc(''); // Stop video playback
      document.body.style.overflow = 'auto'; // Restore scrolling
      
      // Resume YouTube trailers when main video player closes
      audioManager.onMainVideoPlayerClose();
    };

    const handleOverlayClick = (event) => {
      if (event.target.classList.contains('video-modal-overlay')) {
        handleCloseModal();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };

    // Add event listeners
    document.addEventListener('click', handlePlayModalTrigger);
    document.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handlePlayModalTrigger);
      document.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto'; // Ensure scrolling is restored
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="video-modal-content relative bg-gray-900 rounded-lg shadow-2xl max-w-[1200px] w-full mx-4 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setIframeSrc('');
            document.body.style.overflow = 'auto';
            // Resume YouTube trailers when main video player closes
            audioManager.onMainVideoPlayerClose();
          }}
          className="absolute top-4 right-4 z-[101] w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 hover:scale-110"
          aria-label="Close video player"
        >
          ×
        </button>
        
        {/* Video Player */}
        <div className="relative w-full" style={{ paddingBottom: '57.42%' }}> {/* 1150/660 aspect ratio */}
          <iframe
            src={iframeSrc}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ width: '100%', height: '100%', minHeight: '660px' }}
            allowFullScreen
            frameBorder="0"
            title="Video Player"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;