import { useState } from 'react';
import api from '../api';
import { Sparkles, Play, Pause, Music2 } from 'lucide-react';
import { usePlayer } from '../PlayerContext';

const Generate = () => {
    const [prompt, setPrompt] = useState('');
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('pop');
    const [voice, setVoice] = useState('female');
    const [loading, setLoading] = useState(false);
    const [generatedSong, setGeneratedSong] = useState(null);
    const { playSong, currentSong, isPlaying } = usePlayer();

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('generate/', { prompt, title, genre, voice });
            setGeneratedSong(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayGenerated = () => {
        if (generatedSong) {
            playSong({
                id: generatedSong.id,
                title: generatedSong.title || generatedSong.prompt,
                artist: 'AI Generator',
                audio_file: generatedSong.audio_file,
                cover_image: generatedSong.cover_image
            });
        }
    };

    const isCurrentGenerated = currentSong?.id === generatedSong?.id;

    const genres = [
        { id: 'pop', name: 'Pop', color: 'from-pink-500 to-rose-500' },
        { id: 'lofi', name: 'Lofi', color: 'from-indigo-500 to-blue-500' },
        { id: 'hiphop', name: 'Hip Hop', color: 'from-amber-500 to-orange-500' }
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 text-3xl font-bold">AI Song Generator</h1>
                        <p className="text-slate-500">Turn your text into music instantly</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <form onSubmit={handleGenerate}>
                            <div className="mb-6">
                                <label className="block text-slate-700 mb-3 font-bold">1. Name your Song</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 text-slate-900 rounded-xl p-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition mb-2"
                                    placeholder="My Awesome Track"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-slate-700 mb-3 font-bold">2. Choose your Vibe</label>
                                <div className="relative">
                                    <select
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full bg-slate-50 text-slate-900 rounded-xl p-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition appearance-none cursor-pointer font-medium"
                                    >
                                        {genres.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <Music2 size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-slate-700 mb-3 font-bold">3. Choose Voice</label>
                                <div className="flex gap-4">
                                    <div
                                        onClick={() => setVoice('female')}
                                        className={`flex-1 cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 flex items-center justify-center gap-2 ${voice === 'female'
                                            ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold'
                                            : 'border-gray-100 hover:border-pink-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        <span>👩 Female</span>
                                    </div>
                                    <div
                                        onClick={() => setVoice('male')}
                                        className={`flex-1 cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 flex items-center justify-center gap-2 ${voice === 'male'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                            : 'border-gray-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        <span>👨 Male</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-slate-700 mb-3 font-bold">4. Describe your Lyrics/Idea</label>
                                <textarea
                                    className="w-full bg-slate-50 text-slate-900 rounded-xl p-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none h-32 transition"
                                    placeholder="Enter text to be spoken over the beat..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>

                            <button
                                disabled={loading || !prompt}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition shadow-md hover:shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Mixing Track...</span>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Song
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Result or Placeholder */}
                    <div className="lg:sticky lg:top-8">
                        {generatedSong ? (
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fade-in relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                <div className="relative z-10">
                                    <div className="aspect-square w-full bg-slate-100 rounded-xl mb-6 overflow-hidden shadow-inner relative">
                                        <img
                                            src={generatedSong.cover_image}
                                            alt={generatedSong.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={handlePlayGenerated}
                                            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition backdrop-blur-[2px] opacity-0 group-hover:opacity-100"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition">
                                                {isCurrentGenerated && isPlaying ? (
                                                    <Pause fill="black" className="text-black" size={32} />
                                                ) : (
                                                    <Play fill="black" className="ml-1 text-black" size={32} />
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">{generatedSong.title || "Untitled Track"}</h2>
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">{genre}</span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500 text-sm">Generated by AI</span>
                                        </div>

                                        <button
                                            onClick={handlePlayGenerated}
                                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {isCurrentGenerated && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                            {isCurrentGenerated && isPlaying ? 'Pause Track' : 'Play Track'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                                    <Music2 size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Create?</h3>
                                <p className="text-slate-500 max-w-xs">Fill out the form on the left to generate your unique AI song. It will appear here!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Generate;
