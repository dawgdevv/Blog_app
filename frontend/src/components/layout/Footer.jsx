import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="w-full bg-gray-100 text-gray-500 text-center py-3 border-t">
    &copy; {new Date().getFullYear()} BlogApp
  </footer>
);

export default Footer;
