// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login'; // Your new, styled login page
import Admin from './pages/admin'; // Your new admin check logic

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} /> 
    </Routes>
  );
}
export default App;