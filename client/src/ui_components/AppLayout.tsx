import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar';
import Footer from './Footer';

interface AppLayoutProps {
  isAuthenticated: boolean;
  username: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (username: string | null) => void;
}

const AppLayout = ({
  isAuthenticated,
  username,
  setIsAuthenticated,
  setUsername,
}: AppLayoutProps) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('dark') === 'true'
  );

  const handleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark', newDarkMode ? 'true' : 'false');
  };

  useEffect(function () {
    if (localStorage.getItem('dark') === null) {
      localStorage.setItem('dark', 'false');
    }
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main className="w-full bg-[#ffffff] dark:bg-[#181A2A]">
        <NavBar
          darkMode={darkMode}
          handleDarkMode={handleDarkMode}
          isAuthenticated={isAuthenticated}
          username={username}
          setIsAuthenticated={setIsAuthenticated}
          setUsername={setUsername}
        />
        <ToastContainer />
        <Outlet />
        <Footer username={username} />
      </main>
    </div>
  );
};

export default AppLayout;
