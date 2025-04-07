import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginAdmin from '@pages/Login/LoginAdmin.jsx';  // Usamos el alias para importar el componente de Login

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
