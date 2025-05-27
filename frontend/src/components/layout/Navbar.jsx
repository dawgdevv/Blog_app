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
    <nav className="w-full bg-white border-b px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold text-blue-600">
        BlogSphere
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Link
              to="/blog/create"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
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
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
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
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignupModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
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
