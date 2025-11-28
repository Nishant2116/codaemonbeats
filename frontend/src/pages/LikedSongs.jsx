import { useState, useEffect } from 'react';
import api from '../api';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../PlayerContext';

const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const { playSong, currentSong, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await api.get('all-songs/');
                // Filter only liked songs
                const liked = res.data.filter(song => song.is_liked);
                setSongs(liked);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSongs();
    }, []);

    const handleLike = async (e, song) => {
        e.stopPropagation();
        try {
            const endpoint = song.is_generated
                ? `generated-songs/${song.id}/like/`
                : `songs/${song.id}/like/`;

            const res = await api.post(endpoint);
            // Remove from list if unliked
            if (!res.data.liked) {
                setSongs(songs.filter(s => s.id !== song.id || s.is_generated !== song.is_generated));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="flex items-end gap-6 mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-lg text-white">
                <div className="w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center shadow-inner backdrop-blur-sm">
                    <Heart size={48} fill="white" className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider opacity-80">Playlist</p>
                    <h1 className="text-5xl font-black mt-2 mb-4">Liked Songs</h1>
                    <p className="font-medium opacity-90">{songs.length} songs</p>
                </div>
            </div>

            {songs.length === 0 && (
                <div className="text-center text-slate-500 mt-20">
                    <p>You haven't liked any songs yet.</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {songs.map((song) => {
                    const isCurrent = currentSong?.id === song.id;
                    const coverImage = song.cover_image || `https://picsum.photos/seed/${song.id}/300`;

                    return (
                        <div
                            key={`${song.is_generated ? 'gen' : 'upl'}-${song.id}`}
                            onClick={() => playSong({ ...song, cover_image: coverImage })}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition group cursor-pointer border border-gray-100 relative"
                        >
                            <div className="relative mb-4">
                                <div className="w-full aspect-square bg-slate-200 rounded-lg shadow-inner overflow-hidden">
                                    <img
                                        src={coverImage}
                                        alt={song.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <button className={`absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 ${isCurrent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                    {isCurrent && isPlaying ? (
                                        <Pause fill="white" className="text-white" />
                                    ) : (
                                        <Play fill="white" className="ml-1 text-white" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="overflow-hidden">
                                    <h3 className={`font-bold truncate ${isCurrent ? 'text-blue-600' : 'text-slate-900'}`}>{song.title}</h3>
                                    <p className="text-slate-500 text-sm truncate mt-1">{song.artist}</p>
                                </div>
                                <button
                                    onClick={(e) => handleLike(e, song)}
                                    className="text-slate-400 hover:text-red-500 transition hover:scale-110"
                                >
                                    <Heart
                                        size={20}
                                        fill="currentColor"
                                        className="text-red-500"
                                    />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LikedSongs;
