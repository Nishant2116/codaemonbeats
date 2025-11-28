import { useState, useEffect } from 'react';
import api from '../api';
import { Play, Pause, Heart, Search as SearchIcon } from 'lucide-react';
import { usePlayer } from '../PlayerContext';

const Search = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const { playSong, currentSong, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await api.get('all-songs/');
                setSongs(res.data);
                setFilteredSongs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = songs.filter(song =>
            song.title.toLowerCase().includes(lowerQuery) ||
            song.artist.toLowerCase().includes(lowerQuery)
        );
        setFilteredSongs(filtered);
    }, [query, songs]);

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

            // Also update filtered songs
            const updatedFiltered = filteredSongs.map(s =>
                s.id === song.id ? { ...s, is_liked: res.data.liked } : s
            );
            setFilteredSongs(updatedFiltered);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <SearchIcon className="text-slate-400" size={24} />
                <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="w-full bg-transparent text-slate-900 text-lg focus:outline-none placeholder:text-slate-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </div>

            {filteredSongs.length === 0 && query && (
                <div className="text-center text-slate-500 mt-20">
                    <p>No results found for "{query}"</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredSongs.map((song) => {
                    const isCurrent = currentSong?.id === song.id;
                    const coverImage = song.cover_image || `https://picsum.photos/seed/${song.id}/300`;

                    return (
                        <div
                            key={song.id}
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
                                        fill={song.is_liked ? "#ef4444" : "none"}
                                        className={song.is_liked ? "text-red-500" : ""}
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

export default Search;
