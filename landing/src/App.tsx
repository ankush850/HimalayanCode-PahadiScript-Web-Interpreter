import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SharePage from './pages/SharePage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import VideoBackground from './components/VideoBackground';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBeginJourney = () => {
    if (user) {
      navigate('/editor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
      <section
        className="pb-40 w-full flex flex-col items-center justify-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-display font-normal text-black leading-[0.95] tracking-[-2.46px] animate-fade-rise"
        >
          Code in the language of the mountains. <span className="italic text-[#6F6F6F]">Think in Hindi,</span> <span className="italic text-[#6F6F6F]">Build in code.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] font-body animate-fade-rise-delay">
          A web-based interpreter for HimalayanCode — a beginner-friendly programming language using Hindi keywords (like agar, bol, phir) to help Hindi-speaking engineering students learn coding concepts without the barrier of English syntax. Built with Python & Flask.
        </p>

        {/* Hero CTA Button */}
        <button
          onClick={handleBeginJourney}
          className="rounded-full px-14 py-5 text-base bg-black text-white hover:scale-[1.03] transition-transform duration-300 ease-out mt-12 font-medium animate-fade-rise-delay-2"
        >
          Begin Journey
        </button>
      </section>
    </div>
  );
}

function AppContent() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-body select-none">
      {/* Global Background Video Layer */}
      <VideoBackground />

      {/* Subtle Global Background Gradients */}
      <div className="fixed inset-0 bg-gradient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />

      {/* Global Header Navigation */}
      <Navbar />

      {/* Main Page Content Wrapper (z-10) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<Layout><EditorPage /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/share/:share_id" element={<Layout><SharePage /></Layout>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
