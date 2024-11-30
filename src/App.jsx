import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import './css/index.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

// Layout Component
function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/settings" element={<Layout />}>
          <Route index element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;