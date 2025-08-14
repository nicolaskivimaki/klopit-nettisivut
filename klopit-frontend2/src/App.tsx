import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Join from "./pages/Join";
import Events from "./pages/Events";
import EventPage from "./pages/EventPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateEvent from "./pages/CreateEvent";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Chants from "./pages/Chants";
import CreateChant from "./pages/CreateChant";
import ChantDetail from "./pages/ChantDetail";
import Gallery from "./pages/Gallery";
import AlbumPage from "./pages/AlbumPage";
import AdminGallery from "./pages/AdminGallery";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/join" element={<Join />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events/new" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
        <Route path="/chants" element={<Chants/>} />
        <Route path="/chants/new" element={<CreateChant />} />
        <Route path="/chants/:id" element={<ChantDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<AlbumPage />} />
        <Route path="/admin/gallery" element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
      </Routes>
      <Footer />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <ScrollToTop />
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
