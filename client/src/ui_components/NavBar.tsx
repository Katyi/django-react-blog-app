import { Switch } from '@/components/ui/switch';
import { FaHamburger } from 'react-icons/fa';
import ResponsiveNavBar from './ResponsiveNavBar';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface NavBarProps {
  darkMode: boolean;
  handleDarkMode: () => void;
  isAuthenticated: boolean;
  username: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (username: string | null) => void;
}

const NavBar = ({
  darkMode,
  handleDarkMode,
  isAuthenticated,
  username,
  setIsAuthenticated,
  setUsername,
}: NavBarProps) => {
  const [showNavBar, setShowNavBar] = useState(false);

  function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    setUsername(null);
  }

  return (
    <>
      <nav className="max-container padding-x py-6 flex justify-between items-center  gap-6 sticky top-0 z-10 bg-[#FFFFFF] dark:bg-[#141624]">
        <Link
          to="/"
          className="text-[#141624] text-2xl font-bold dark:text-[#FFFFFF]"
        >
          ПРОСТО БЛОГ
        </Link>
        <ul className="flex items-center  justify-end gap-9 text-[#3B3C4A] lg:flex-1 max-md:hidden dark:text-[#FFFFFF]">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to={`/profile/${username}`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Привет, {username}
                </NavLink>
              </li>
              <li onClick={logout} className="cursor-pointer">
                Выйти
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/signin"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Войти
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Регистрация
                </NavLink>
              </li>
            </>
          )}

          <li className="font-semibold">
            <NavLink
              to="/create"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Написать статью
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center justify-between gap-6">
          <Switch onCheckedChange={handleDarkMode} checked={darkMode} />
          <FaHamburger
            className="text-2xl cursor-pointer hidden max-md:block dark:text-white"
            onClick={() => setShowNavBar((curr) => !curr)}
          />
        </div>
      </nav>

      {showNavBar && (
        <ResponsiveNavBar
          isAuthenticated={isAuthenticated}
          username={username}
          logout={logout}
        />
      )}
    </>
  );
};

export default NavBar;
