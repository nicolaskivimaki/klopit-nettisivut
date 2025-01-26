// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {

  return (
    <div className="bg-black text-gold min-h-screen flex flex-col">
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/new" element={<CreateEvent />} />
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
