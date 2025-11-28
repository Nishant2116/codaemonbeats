import { useEffect, useState } from 'react';
import api from '../api';
import { Play, Pause, Heart, Trash2 } from 'lucide-react';
import { usePlayer } from '../PlayerContext';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const { playSong, currentSong, isPlaying, user } = usePlayer();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await api.get('all-songs/');
                setSongs(res.data);
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
            const updatedSongs = songs.map(s =>
                s.id === song.id ? { ...s, is_liked: res.data.liked } : s
            );
            setSongs(updatedSongs);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e, song) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this song?")) return;

        try {
            if (song.is_generated) {
                await api.delete(`generated-songs/${song.id}/`);
            } else {
                await api.delete(`songs/${song.id}/`);
            }
            setSongs(songs.filter(s => s.id !== song.id));
        } catch (err) {
            console.error("Failed to delete song:", err);
            alert("Failed to delete song");
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Discover</h1>

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
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleLike(e, song)}
                                        className="text-slate-400 hover:text-red-500 transition hover:scale-110"
                                    >
                                        <Heart
                                            size={20}
                                            fill={song.is_liked ? "#ef4444" : "none"}
                                            className={song.is_liked ? "text-red-500" : ""}
                                        />
                                    </button>
                                    {song.is_owner && (
                                        <button
                                            onClick={(e) => handleDelete(e, song)}
                                            className="text-slate-400 hover:text-red-600 transition hover:scale-110"
                                            title="Delete Song"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
