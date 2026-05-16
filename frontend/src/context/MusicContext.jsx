import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load music settings from backend
  useEffect(() => {
    loadMusicSettings();
  }, []);

  const loadMusicSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/music`);
      const settings = response.data.data;
      
      if (settings.previewUrl || settings.customMp3Url) {
        setCurrentSong({
          title: settings.songTitle,
          artist: settings.artist,
          albumCover: settings.albumCover,
          previewUrl: settings.isCustom ? settings.customMp3Url : settings.previewUrl,
          isCustom: settings.isCustom,
        });
        setVolume(settings.volume);
      }
    } catch (error) {
      console.error('Error loading music settings:', error);
    }
  };

  const saveMusicSettings = async (song, vol = volume) => {
    try {
      await axios.put(`${API_URL}/music`, {
        songTitle: song.title,
        artist: song.artist,
        albumCover: song.albumCover,
        previewUrl: song.isCustom ? '' : song.previewUrl,
        customMp3Url: song.isCustom ? song.previewUrl : '',
        isCustom: song.isCustom || false,
        volume: vol,
        isPlaying: isPlaying,
      });
    } catch (error) {
      console.error('Error saving music settings:', error);
    }
  };

  const playSong = (song) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentSong(song);
    setIsPlaying(true);
    saveMusicSettings(song);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (currentSong) {
      saveMusicSettings(currentSong, newVolume);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Update audio element when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      }
    }
  }, [currentSong]);

  const value = {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    audioRef,
    playSong,
    togglePlay,
    changeVolume,
    toggleMute,
    stopMusic,
    loadMusicSettings,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} loop />
    </MusicContext.Provider>
  );
};
