import { Outlet, Link } from "react-router-dom";
import { useState } from 'react'

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle the dark mode class on the body
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <>
      <nav >
        <ul >
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav>

      <div className={darkMode ? 'dark-mode' : ''}>
      
      {/* Add a button to toggle dark mode */}
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>      

      <Outlet />
    </>
  )
};

export default Navbar;
