import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { WebSignProvider } from '@/contexts/WebSignContext';
import { Layout } from '@/components/Layout';
import { AuthLayout } from '@/components/AuthLayout';
import { LandingPage } from '@/pages/LandingPage';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Screens } from '@/pages/Screens';
import { NewScreen } from '@/pages/NewScreen';
import { ScreenDetail } from '@/pages/ScreenDetail';
import { Content } from '@/pages/Content';
import { NewContent } from '@/pages/NewContent';
import { Playlists } from '@/pages/Playlists';
import { NewPlaylist } from '@/pages/NewPlaylist';
import { PlaylistDetail } from '@/pages/PlaylistDetail';
import { Display } from '@/pages/Display';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WebSignProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/display/:id" element={<Display />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              
              {/* Legacy auth routes (redirect to new structure) */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route path="/screens" element={<Layout />}>
                <Route index element={<Screens />} />
                <Route path="new" element={<NewScreen />} />
                <Route path=":id" element={<ScreenDetail />} />
              </Route>
              
              <Route path="/content" element={<Layout />}>
                <Route index element={<Content />} />
                <Route path="new" element={<NewContent />} />
              </Route>
              
              <Route path="/playlists" element={<Layout />}>
                <Route index element={<Playlists />} />
                <Route path="new" element={<NewPlaylist />} />
                <Route path=":id" element={<PlaylistDetail />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </WebSignProvider>
    </AuthProvider>
  );
}

export default App;