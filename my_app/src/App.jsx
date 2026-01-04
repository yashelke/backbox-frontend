import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Greetheader from './components/Greetheader'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Otp from './pages/Otp';
import Uploads from './components/Uploads';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/greet" element={<Greetheader />} />
        <Route path="/uploads" element={<Uploads />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
