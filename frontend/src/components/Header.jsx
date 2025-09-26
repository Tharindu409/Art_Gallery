import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignIn = () => {
    navigate("/signin");
    setShowMobileMenu(false);
  };

  const openLogoutModal = () => {
    setShowLogoutConfirm(true);
    // Trigger the fade/scale animation after mount
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeLogoutModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowLogoutConfirm(false), 200); // match transition duration
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowMobileMenu(false);
    setModalVisible(false);
    setTimeout(() => setShowLogoutConfirm(false), 200);
    navigate("/signin");
  };

  const toggleMobileMenu = () => setShowMobileMenu((v) => !v);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div>
            <Link to="/" className="block">
              <h1 className="text-xl font-semibold uppercase tracking-wide text-black">
                CEYLON GALLERIA
              </h1>
            </Link>
            <p className="text-xs text-gray-600 tracking-wide">
              by Janith Weerasinghe
            </p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/artshow"
              className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
            >
              ART SHOWCASE
            </Link>
            <Link
              to="/exhibitions"
              className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
            >
              EXHIBITIONS
            </Link>
            <Link
              to="/about"
              className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
            >
              ABOUT JANITH
            </Link>
            <Link
              to="/contact"
              className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
            >
              CONTACT
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/userprofile">
                  <span className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer">
                    WELCOME, {user.name}
                  </span>
                </Link>
                <button
                  onClick={openLogoutModal}
                  className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleSignIn}
                  className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer"
                >
                  SIGN IN
                </button>
                <Link
                  to="/signup"
                  className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/artshow"
                onClick={() => setShowMobileMenu(false)}
                className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
              >
                ART SHOWCASE
              </Link>
              <Link
                to="/exhibitions"
                onClick={() => setShowMobileMenu(false)}
                className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
              >
                EXHIBITIONS
              </Link>
              <Link
                to="/about"
                onClick={() => setShowMobileMenu(false)}
                className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
              >
                ABOUT JANITH
              </Link>
              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="text-sm uppercase tracking-wide text-gray-700 hover:text-black transition-colors"
              >
                CONTACT
              </Link>

              <hr className="border-gray-200" />
              {user ? (
                <div className="flex flex-col items-center space-y-3 pt-2">
                  <Link
                    to="/userprofile"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer">
                      WELCOME, {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={openLogoutModal}
                    className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    onClick={handleSignIn}
                    className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors text-left cursor-pointer"
                  >
                    SIGN IN
                  </button>
                  <Link
                    to="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-sm uppercase tracking-wide font-bold text-gray-800 hover:text-black transition-colors cursor-pointer"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smooth Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-200 ${
              modalVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform duration-200 ${
                modalVisible ? "scale-100" : "scale-90"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 text-center">
                Confirm Logout
              </h2>
              <p className="mb-4 text-center">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeLogoutModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
