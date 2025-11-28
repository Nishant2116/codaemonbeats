import { Home, Search, Library, PlusSquare, Heart, Mic2, Upload as UploadIcon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const NavItem = ({ to, icon: Icon, label, special }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    } ${special ? 'text-blue-600 hover:text-blue-700' : ''}`}
            >
                <Icon size={22} className={isActive ? 'text-blue-600' : special ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'} />
                <span className={isActive ? 'font-bold' : 'font-medium'}>{label}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-100"
            >
                {isOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-900" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`w-64 bg-white h-full flex flex-col border-r border-gray-100 shadow-sm z-40 fixed lg:relative transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-6">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 font-black text-2xl px-2 mb-2 tracking-tight">
                        CodaemonBeats
                    </div>
                </div>

                <div className="flex flex-col gap-2 px-3">
                    <NavItem to="/" icon={Home} label="Home" />
                    <NavItem to="/search" icon={Search} label="Search" />
                    <NavItem to="/library" icon={Library} label="Your Library" />
                    <NavItem to="/generate" icon={Mic2} label="Song Generator" special />
                </div>

                <div className="mt-8 px-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Playlists</h3>
                    <div className="flex flex-col gap-2">
                        <Link to="/create-playlist" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-2 py-2 text-slate-500 hover:text-slate-900 transition cursor-pointer group">
                            <div className="bg-gray-100 p-1.5 rounded-md group-hover:bg-purple-100 transition">
                                <PlusSquare size={20} className="text-slate-400 group-hover:text-purple-600" />
                            </div>
                            <span className="font-medium">Create Playlist</span>
                        </Link>
                        <Link to="/upload" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-2 py-2 text-slate-500 hover:text-slate-900 transition cursor-pointer group">
                            <div className="bg-gray-100 p-1.5 rounded-md group-hover:bg-blue-100 transition">
                                <UploadIcon size={20} className="text-slate-400 group-hover:text-blue-600" />
                            </div>
                            <span className="font-medium">Upload Music</span>
                        </Link>
                        <Link to="/liked" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-2 py-2 text-slate-500 hover:text-slate-900 transition cursor-pointer group">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 rounded-md shadow-sm opacity-80 group-hover:opacity-100 transition">
                                <Heart size={20} className="text-white" fill="white" />
                            </div>
                            <span className="font-medium">Liked Songs</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
