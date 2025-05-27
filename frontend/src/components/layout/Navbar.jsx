import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../auth/LoginModal";
import SignupModal from "../auth/SignupModal";
import ProfileMenu from "../auth/ProfileMenu";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
      >
        📜 BlogSphere
      </Link>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/streak"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Streak 🔥
            </Link>
            <Link
              to="/blog/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Blog
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-lg font-medium transition-colors duration-200 shadow-sm"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>
              {showProfileMenu && (
                <ProfileMenu onClose={() => setShowProfileMenu(false)} />
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium border border-blue-600 hover:border-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignupModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          openSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          openLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
