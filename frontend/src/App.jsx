import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Upload from './pages/Upload';
import Search from './pages/Search';
import LikedSongs from './pages/LikedSongs';
import Library from './pages/Library';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen bg-white text-slate-900 flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

import CreatePlaylist from './pages/CreatePlaylist';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="generate" element={<Generate />} />
        <Route path="upload" element={<Upload />} />
        <Route path="create-playlist" element={<CreatePlaylist />} />
        <Route path="search" element={<Search />} />
        <Route path="liked" element={<LikedSongs />} />
        <Route path="library" element={<Library />} />
      </Route>
    </Routes>
  );
}

export default App;
