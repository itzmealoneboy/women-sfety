import React, { useState, useRef, useEffect } from 'react';

const VideoTutorial = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const mockVideos = [
      {
        id: 1,
        title: 'Introduction to Personal Safety',
        description: 'Learn fundamental safety practices for everyday life',
        duration: '15:30',
        thumbnail: '🎥',
        category: 'Safety Basics',
        views: 12450,
        likes: 892,
        transcript: 'Welcome to personal safety training...',
        videoUrl: '#'
      },
      {
        id: 2,
        title: 'Self-Defense Techniques',
        description: 'Basic self-defense moves for everyone',
        duration: '25:45',
        thumbnail: '🥋',
        category: 'Self Defense',
        views: 8750,
        likes: 645,
        transcript: 'In this video, we will cover basic self-defense techniques...',
        videoUrl: '#'
      },
      {
        id: 3,
        title: 'Cyber Safety Tips',
        description: 'Protect yourself from online threats',
        duration: '18:20',
        thumbnail: '💻',
        category: 'Cyber Security',
        views: 15600,
        likes: 1203,
        transcript: 'Cybersecurity is essential in today\'s digital world...',
        videoUrl: '#'
      },
      {
        id: 4,
        title: 'Emergency First Aid',
        description: 'Learn critical first aid procedures',
        duration: '22:10',
        thumbnail: '🚑',
        category: 'Emergency',
        views: 9800,
        likes: 734,
        transcript: 'Knowing first aid can save lives...',
        videoUrl: '#'
      }
    ];
    setVideos(mockVideos);
    setSelectedVideo(mockVideos[0]);
    setPlaylist(mockVideos);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const addBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      videoId: selectedVideo.id,
      time: currentTime,
      label: prompt('Enter bookmark label:', `Bookmark at ${formatTime(currentTime)}`)
    };
    if (newBookmark.label) {
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const goToBookmark = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const newSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="video-tutorial">
      <div className="video-header">
        <h2>Video Tutorials</h2>
        <p>Watch expert-led safety and security tutorials</p>
      </div>

      <div className="video-container">
        <div className="video-player-section">
          {selectedVideo && (
            <>
              <div className="video-player">
                <video
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="player"
                />
                <div className="video-controls">
                  <button onClick={handlePlayPause} className="control-btn">
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <div className="progress-container" ref={progressRef} onClick={handleSeek}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                  </div>
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <button onClick={addBookmark} className="control-btn" title="Add Bookmark">
                    🔖
                  </button>
                  <button onClick={changeSpeed} className="control-btn">
                    {speed}x
                  </button>
                  <button onClick={() => setShowTranscript(!showTranscript)} className="control-btn">
                    📝
                  </button>
                </div>
              </div>

              <div className="video-info">
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description}</p>
                <div className="video-stats">
                  <span>👁️ {selectedVideo.views.toLocaleString()} views</span>
                  <span>👍 {selectedVideo.likes.toLocaleString()} likes</span>
                  <span>⏱️ {selectedVideo.duration}</span>
                  <span>📁 {selectedVideo.category}</span>
                </div>
              </div>

              {showTranscript && (
                <div className="transcript-section">
                  <h4>Video Transcript</h4>
                  <div className="transcript-content">
                    <p>{selectedVideo.transcript}</p>
                  </div>
                </div>
              )}

              {bookmarks.filter(b => b.videoId === selectedVideo.id).length > 0 && (
                <div className="bookmarks-section">
                  <h4>Bookmarks</h4>
                  <div className="bookmarks-list">
                    {bookmarks.filter(b => b.videoId === selectedVideo.id).map(bookmark => (
                      <button key={bookmark.id} onClick={() => goToBookmark(bookmark.time)} className="bookmark-btn">
                        🔖 {bookmark.label} ({formatTime(bookmark.time)})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="playlist-section">
          <h3>Playlist</h3>
          <div className="playlist-videos">
            {playlist.map(video => (
              <div 
                key={video.id} 
                className={`playlist-item ${selectedVideo?.id === video.id ? 'active' : ''}`}
                onClick={() => selectVideo(video)}
              >
                <div className="playlist-thumbnail">
                  {video.thumbnail}
                </div>
                <div className="playlist-info">
                  <div className="playlist-title">{video.title}</div>
                  <div className="playlist-duration">{video.duration}</div>
                  <div className="playlist-category">{video.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recommended-section">
        <h3>Recommended for You</h3>
        <div className="recommended-grid">
          {videos.slice(0, 4).map(video => (
            <div key={video.id} className="recommended-card" onClick={() => selectVideo(video)}>
              <div className="recommended-thumbnail">{video.thumbnail}</div>
              <div className="recommended-info">
                <div className="recommended-title">{video.title}</div>
                <div className="recommended-duration">{video.duration}</div>
                <div className="recommended-views">{video.views.toLocaleString()} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .video-tutorial {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .video-header {
          margin-bottom: 30px;
        }

        .video-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .video-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .video-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 30px;
          margin-bottom: 40px;
        }

        .video-player-section {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .video-player {
          position: relative;
          background: #000;
          aspect-ratio: 16/9;
        }

        .player {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .video-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
        }

        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
        }

        .progress-container {
          flex: 1;
          cursor: pointer;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.1s linear;
        }

        .time-display {
          font-size: 12px;
          font-family: monospace;
        }

        .video-info {
          padding: 20px;
        }

        .video-info h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .video-info p {
          margin: 0 0 15px 0;
          color: #666;
          line-height: 1.5;
        }

        .video-stats {
          display: flex;
          gap: 20px;
          font-size: 13px;
          color: #999;
        }

        .transcript-section {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .transcript-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .transcript-content {
          max-height: 200px;
          overflow-y: auto;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }

        .bookmarks-section {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .bookmarks-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .bookmarks-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .bookmark-btn {
          padding: 5px 12px;
          background: #e7f3ff;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          color: #007bff;
        }

        .playlist-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .playlist-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .playlist-videos {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .playlist-item {
          display: flex;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .playlist-item:hover {
          background: #f8f9fa;
        }

        .playlist-item.active {
          background: #e7f3ff;
          border-left: 3px solid #007bff;
        }

        .playlist-thumbnail {
          font-size: 48px;
        }

        .playlist-info {
          flex: 1;
        }

        .playlist-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .playlist-duration, .playlist-category {
          font-size: 11px;
          color: #999;
        }

        .recommended-section {
          margin-top: 20px;
        }

        .recommended-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .recommended-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .recommended-card:hover {
          transform: translateY(-2px);
        }

        .recommended-thumbnail {
          font-size: 80px;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
        }

        .recommended-info {
          padding: 12px;
        }

        .recommended-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
        }

        .recommended-duration, .recommended-views {
          font-size: 12px;
          color: #999;
        }

        @media (max-width: 768px) {
          .video-container {
            grid-template-columns: 1fr;
          }
          
          .recommended-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoTutorial;
