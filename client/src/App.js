import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
