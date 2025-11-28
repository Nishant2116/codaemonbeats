import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Music } from 'lucide-react';

const Upload = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio_file', audioFile);
        if (coverImage) {
            formData.append('cover_image', coverImage);
        }

        try {
            await api.post('songs/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-full">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Music className="text-blue-600" size={32} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 text-3xl font-bold">Upload Music</h1>
                        <p className="text-slate-500">Share your beats with the world</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-slate-900 outline-none transition"
                                    placeholder="Song Title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Artist</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-slate-900 outline-none transition"
                                    placeholder="Artist Name"
                                    value={artist}
                                    onChange={e => setArtist(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Audio File</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    required
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={e => setAudioFile(e.target.files[0])}
                                />
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                                    <UploadIcon className="text-blue-600" size={28} />
                                </div>
                                <p className="text-slate-900 font-medium mb-1">
                                    {audioFile ? audioFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-slate-400 text-sm">MP3, WAV, or OGG</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={e => setCoverImage(e.target.files[0])}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={loading}
                                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Uploading Track...' : 'Upload Track'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;
