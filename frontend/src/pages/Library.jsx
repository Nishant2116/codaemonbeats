import { useState, useEffect } from 'react';
import api from '../api';
import { Play, Pause, Trash2 } from 'lucide-react';
import { usePlayer } from '../PlayerContext';

const Library = () => {
    const [generatedSongs, setGeneratedSongs] = useState([]);
    const { playSong, currentSong, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                // Currently we only have an endpoint for creating generated songs, 
                // but we can fetch all generated songs and filter by user on client side 
                // OR better, let's assume we can fetch them.
                // For now, let's try to fetch from a new endpoint or filter existing ones if possible.
                // Since we don't have a specific 'my-generated-songs' endpoint yet, 
                // I will fetch all generated songs if the endpoint exists, or I might need to add one.
                // Wait, GeneratedSongViewSet is not explicitly defined in views.py shown.
                // But GenerateSongView is a CreateAPIView.
                // Let's check if we can get a list. 
                // Actually, let's add a list endpoint for generated songs in views.py first?
                // Or maybe just filter the main song list? No, GeneratedSong is a different model.

                // Let's assume for now we will add a GET method to GenerateSongView or a new ViewSet.
                // I will implement a simple fetch here assuming I will add the backend support next.
                const res = await api.get('my-songs/');
                setGeneratedSongs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLibrary();
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📚</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Your Library</h1>
                    <p className="text-slate-500">Songs you've created with AI</p>
                </div>
            </div>

            {generatedSongs.length === 0 && (
                <div className="text-center text-slate-500 mt-20">
                    <p>You haven't generated any songs yet.</p>
                    <a href="/generate" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Create one now</a>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {generatedSongs.map((song) => {
                    const isCurrent = currentSong?.id === song.id;

                    return (
                        <div
                            key={song.id}
                            onClick={() => playSong({
                                id: song.id,
                                title: song.title || song.prompt,
                                artist: 'AI Generator',
                                audio_file: song.audio_file,
                                cover_image: song.cover_image
                            })}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition group cursor-pointer border border-gray-100 relative"
                        >
                            <div className="relative mb-4">
                                <div className="w-full aspect-square bg-slate-200 rounded-lg shadow-inner overflow-hidden">
                                    <img
                                        src={song.cover_image || `https://picsum.photos/seed/${song.id}/300`}
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
                                    <h3 className={`font-bold truncate ${isCurrent ? 'text-blue-600' : 'text-slate-900'}`}>{song.title || song.prompt}</h3>
                                    <p className="text-slate-500 text-sm truncate mt-1">Generated</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Library;
