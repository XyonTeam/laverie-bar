import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import { Laverie } from './components/Laverie';
import { TableTache } from './components/TableTache';
import { TableCaisse } from './components/TableCaisse';

function App() {
  return (
    <div >
      <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/Laverie" element={<Laverie />} />
        <Route path="/Taches" element={<TableTache />} />
        <Route path="/caisse" element={<TableCaisse />} />
      </Routes>
    </Router>
    </div>
    
  );
}

export default App;