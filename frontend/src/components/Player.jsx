import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Heart } from 'lucide-react';
import { usePlayer } from '../PlayerContext';
import api from '../api';
import { useState, useEffect } from 'react';

const Player = () => {
    const { currentSong, isPlaying, togglePlay, currentTime, duration, seek, volume, changeVolume } = usePlayer();
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (currentSong) {
            setLiked(currentSong.is_liked);
        }
    }, [currentSong]);

    if (!currentSong) return null;

    const formatTime = (time) => {
        if (!time) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newTime = (clickX / width) * duration;
        seek(newTime);
    };

    const handleVolume = (e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newVolume = Math.max(0, Math.min(1, clickX / width));
        changeVolume(newVolume);
    };

    const handleLike = async () => {
        try {
            const endpoint = currentSong.is_generated
                ? `generated-songs/${currentSong.id}/like/`
                : `songs/${currentSong.id}/like/`;

            const res = await api.post(endpoint);
            setLiked(res.data.liked);
            // Ideally update global state or refetch songs, but local state works for immediate feedback
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    return (
        <div className="h-auto md:h-24 bg-white border-t border-gray-200 px-3 md:px-4 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between text-slate-900 fixed bottom-0 w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Song Info */}
            <div className="flex items-center gap-3 w-full md:w-[30%] mb-2 md:mb-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded overflow-hidden shadow-sm flex-shrink-0">
                    <img
                        src={currentSong.cover_image || `https://picsum.photos/seed/${currentSong.id}/200`}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold hover:underline cursor-pointer text-slate-900 truncate">{currentSong.title}</div>
                    <div className="text-xs text-slate-500 hover:underline cursor-pointer truncate">{currentSong.artist}</div>
                </div>
                <button
                    onClick={handleLike}
                    className="text-slate-400 hover:text-red-500 transition hover:scale-110 flex-shrink-0"
                >
                    <Heart
                        size={20}
                        fill={liked ? "#ef4444" : "none"}
                        className={liked ? "text-red-500" : ""}
                    />
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 w-full md:w-[40%]">
                <div className="flex items-center gap-4 md:gap-6">
                    <Shuffle size={18} className="hidden md:block text-slate-400 hover:text-blue-600 cursor-pointer transition" />
                    <SkipBack size={20} className="text-slate-600 hover:text-blue-600 cursor-pointer transition" />
                    <button
                        onClick={togglePlay}
                        className="bg-blue-600 rounded-full p-2 hover:scale-105 transition cursor-pointer shadow-md hover:bg-blue-700"
                    >
                        {isPlaying ? (
                            <Pause size={20} fill="white" className="text-white" />
                        ) : (
                            <Play size={20} fill="white" className="text-white ml-0.5" />
                        )}
                    </button>
                    <SkipForward size={20} className="text-slate-600 hover:text-blue-600 cursor-pointer transition" />
                    <Repeat size={18} className="hidden md:block text-slate-400 hover:text-blue-600 cursor-pointer transition" />
                </div>
                <div className="w-full flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-[10px] md:text-xs">{formatTime(currentTime)}</span>
                    <div
                        className="h-1 bg-gray-200 rounded-full flex-1 group cursor-pointer relative"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-600 group-hover:bg-blue-700 rounded-full relative"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                            <div className="hidden group-hover:block w-3 h-3 bg-white border border-blue-600 rounded-full absolute -right-1.5 -top-1 shadow-sm"></div>
                        </div>
                    </div>
                    <span className="text-[10px] md:text-xs">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume - Hidden on mobile */}
            <div className="hidden md:flex items-center justify-end gap-2 w-[30%]">
                <Volume2 size={20} className="text-slate-500" />
                <div
                    className="w-24 h-1 bg-gray-200 rounded-full cursor-pointer group relative"
                    onClick={handleVolume}
                >
                    <div
                        className="h-full bg-blue-600 group-hover:bg-blue-700 rounded-full"
                        style={{ width: `${volume * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Player;
