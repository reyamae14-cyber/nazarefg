class AudioManager {
  constructor() {
    this.mainTrailer = null;
    this.modalTrailers = new Map();
    this.currentlyPlaying = null;
  }

  // Register main trailer (YouTube video player)
  registerMainTrailer(playerRef, setPlaying) {
    this.mainTrailer = {
      playerRef,
      setPlaying,
      isPlaying: false
    };
  }

  // Register modal trailer
  registerModalTrailer(modalId, playerRef, setPlaying) {
    this.modalTrailers.set(modalId, {
      playerRef,
      setPlaying,
      isPlaying: false
    });
  }

  // Unregister modal trailer
  unregisterModalTrailer(modalId) {
    this.modalTrailers.delete(modalId);
    if (this.currentlyPlaying === modalId) {
      this.currentlyPlaying = null;
    }
  }

  // Stop all audio sources
  stopAllAudio() {
    // Stop main trailer
    if (this.mainTrailer && this.mainTrailer.isPlaying) {
      this.mainTrailer.setPlaying(false);
      this.mainTrailer.isPlaying = false;
    }

    // Stop all modal trailers
    this.modalTrailers.forEach((trailer) => {
      if (trailer.isPlaying) {
        trailer.setPlaying(false);
        trailer.isPlaying = false;
      }
    });

    this.currentlyPlaying = null;
  }

  // Pause all YouTube videos (trailers)
  pauseAllYouTubeVideos() {
    this.stopAllAudio();
  }

  // Play main trailer and stop others
  playMainTrailer() {
    this.stopAllAudio();
    
    if (this.mainTrailer) {
      this.mainTrailer.setPlaying(true);
      this.mainTrailer.isPlaying = true;
      this.currentlyPlaying = 'main';
    }
  }

  // Play modal trailer and stop others
  playModalTrailer(modalId) {
    this.stopAllAudio();
    
    const trailer = this.modalTrailers.get(modalId);
    if (trailer) {
      trailer.setPlaying(true);
      trailer.isPlaying = true;
      this.currentlyPlaying = modalId;
    }
  }

  // Called when main video player starts
  onMainVideoPlayerStart() {
    this.stopAllAudio();
  }

  // Called when main video player closes
  onMainVideoPlayerClose() {
    // Resume main trailer if it was playing before
    if (this.mainTrailer && this.currentlyPlaying === null) {
      this.playMainTrailer();
    }
  }

  // Called when modal closes
  onModalClose() {
    // Resume main trailer if no other audio is playing
    if (this.currentlyPlaying === null && this.mainTrailer) {
      this.playMainTrailer();
    }
  }

  // Update playing status for main trailer
  updateMainTrailerStatus(isPlaying) {
    if (this.mainTrailer) {
      this.mainTrailer.isPlaying = isPlaying;
      if (isPlaying) {
        this.currentlyPlaying = 'main';
      } else if (this.currentlyPlaying === 'main') {
        this.currentlyPlaying = null;
      }
    }
  }

  // Update playing status for modal trailer
  updateModalTrailerStatus(modalId, isPlaying) {
    const trailer = this.modalTrailers.get(modalId);
    if (trailer) {
      trailer.isPlaying = isPlaying;
      if (isPlaying) {
        this.currentlyPlaying = modalId;
      } else if (this.currentlyPlaying === modalId) {
        this.currentlyPlaying = null;
      }
    }
  }
}

// Create and export singleton instance
const audioManager = new AudioManager();
export default audioManager;