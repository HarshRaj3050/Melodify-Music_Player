import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Login from './pages/Login';
import Register from "./pages/Register";
import Music from "./pages/Music";
import Settings from "./pages/Setting";
import Artist from "./pages/Artist";
import CreateMusic from "./pages/CreateMusic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
         <Route path="/api/auth/login" element={<Login />} />
        <Route path="/api/auth/register" element={<Register />} /> 
        <Route path="/musics" element={<Music />} /> 
        <Route path="/settings" element={<Settings />} />
        <Route path="/artist" element={<Artist/>}/>
        <Route path="/create-music" element={<CreateMusic/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;