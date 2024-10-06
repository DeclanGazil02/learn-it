import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"
import SignUp from "./Components/SignUp";
import NavbarComponent from "./Components/NavbarComponent"
import Home from "./Components/Home";
import Upload from "./Components/Upload"
import Tutors from "./Components/Tutors"
import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [email, setEmail] = useState("")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavbarComponent />}>
          <Route index element={<Login email={email} setEmail={setEmail}/>} />
          <Route path="signup" element={<SignUp email={email} setEmail={setEmail}/>} />
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="tutors" element={<Tutors email={email}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
