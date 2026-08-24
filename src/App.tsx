import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PatientMode from './pages/PatientMode';
import ASHAMode from './pages/ASHAMode';
import Facilities from './pages/Facilities';
import type { Language } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <BrowserRouter>
      <Navbar language={language} onLanguageChange={setLanguage} />
      <main>
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/patient" element={<PatientMode language={language} />} />
          <Route path="/asha" element={<ASHAMode language={language} />} />
          <Route path="/facilities" element={<Facilities language={language} />} />
          <Route path="*" element={<Home language={language} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
