import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-xl font-bold italic text-blue-600">
            FridgeRecipe
          </NavLink>
          <div className="flex space-x-4">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Favorites
            </NavLink>
            <NavLink to="/signin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Sign In
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;