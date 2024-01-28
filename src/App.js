import * as React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Resume from './pages/Resume';
import MainLayout from './pages/MainLayout';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/" element={<Navigate to="/home" replace />} />
          <Route exact path="/cv" element={<Resume />} />
        </Route>
        <Route path="/" element={<MainLayout />} >
          <Route exact path="/notFound" element={<NotFound />} /> {/* Add a route for the 404 page */}
          <Route path="*" element={<Navigate to="/notFound" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
