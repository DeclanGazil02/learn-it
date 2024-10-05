import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav >
        <ul >
          <li>
            <Link to="/">loo</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Navbar;