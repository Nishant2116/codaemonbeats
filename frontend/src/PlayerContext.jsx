import { createContext, useState, useContext, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0); // Reset current time when song ends
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
            return;
        }

        if (currentSong) {
            audioRef.current.pause();
        }

        const audioUrl = song.audio_file.startsWith('http')
            ? song.audio_file
            : `http://127.0.0.1:8000${song.audio_file}`;

        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.play();
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const pauseSong = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const resumeSong = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            pauseSong();
        } else {
            resumeSong();
        }
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const changeVolume = (newVolume) => {
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            playSong,
            pauseSong,
            togglePlay,
            audioRef,
            currentTime,
            duration,
            volume,
            seek,
            changeVolume
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
