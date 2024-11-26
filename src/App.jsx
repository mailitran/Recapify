import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login.jsx';
import Callback from './Callback.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;