import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { PlusSquare, Music, CheckCircle } from 'lucide-react';

const CreatePlaylist = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSongIds, setSelectedSongIds] = useState([]);
    const [selectedGeneratedSongIds, setSelectedGeneratedSongIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await api.get('all-songs/');
                setAvailableSongs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSongs();
    }, []);

    const toggleSongSelection = (song) => {
        if (song.is_generated) {
            setSelectedGeneratedSongIds(prev =>
                prev.includes(song.id)
                    ? prev.filter(id => id !== song.id)
                    : [...prev, song.id]
            );
        } else {
            setSelectedSongIds(prev =>
                prev.includes(song.id)
                    ? prev.filter(id => id !== song.id)
                    : [...prev, song.id]
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('playlists/', {
                name,
                description,
                songs: selectedSongIds,
                generated_songs: selectedGeneratedSongIds
            });
            navigate('/'); // Or navigate to the new playlist
        } catch (err) {
            console.error(err);
            alert('Failed to create playlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-purple-100 p-3 rounded-xl">
                        <PlusSquare className="text-purple-600" size={32} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 text-3xl font-bold">Create Playlist</h1>
                        <p className="text-slate-500">Curate your favorite tracks</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Playlist Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg p-3 text-slate-900 outline-none transition"
                                    placeholder="My Awesome Playlist"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg p-3 text-slate-900 outline-none transition"
                                    placeholder="Vibes for coding..."
                                    rows="3"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add Songs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableSongs.map((song) => {
                                const isSelected = song.is_generated
                                    ? selectedGeneratedSongIds.includes(song.id)
                                    : selectedSongIds.includes(song.id);

                                return (
                                    <div
                                        key={`${song.is_generated ? 'gen' : 'upl'}-${song.id}`}
                                        onClick={() => toggleSongSelection(song)}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${isSelected
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-100 bg-white hover:border-purple-200'
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={song.cover_image || `https://picsum.photos/seed/${song.id}/100`}
                                                alt={song.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-bold truncate ${isSelected ? 'text-purple-700' : 'text-slate-900'}`}>{song.title}</h4>
                                            <p className="text-xs text-slate-500 truncate">{song.artist}</p>
                                        </div>
                                        {isSelected && <CheckCircle size={20} className="text-purple-600" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 pb-20">
                        <button
                            disabled={loading}
                            className="bg-purple-600 text-white font-bold py-4 px-8 rounded-full hover:bg-purple-700 hover:shadow-lg hover:scale-[1.02] transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Playlist...' : 'Create Playlist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylist;
