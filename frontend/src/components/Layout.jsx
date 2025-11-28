import Sidebar from './Sidebar';
import Player from './Player';
import { Outlet } from 'react-router-dom';
import { usePlayer } from '../PlayerContext';

const Layout = () => {
    const { currentSong } = usePlayer();

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <div className={`flex-1 flex overflow-hidden ${currentSong ? 'pb-32 md:pb-24' : ''}`}>
                <Sidebar />
                <div className="flex-1 bg-slate-50 overflow-y-auto pt-16 lg:pt-0">
                    <Outlet />
                </div>
            </div>
            {currentSong && <Player />}
        </div>
    );
};

export default Layout;
