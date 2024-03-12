import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-2">
        <Link to="/">
          <h1 className="font-bold text-lg md:text-2xl flex flex-wrap">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <form className="bg-slate-100 p-3 rounded-lg flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-30 sm:w-64"
            />
            <FaSearch className="text-slate-600" />
          </form>
          <ul className="flex gap-4">
            <Link
              to="/"
              className="hidden sm:inline hover:underline cursor-pointer text-slate-700"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hidden sm:inline hover:underline cursor-pointer text-slate-700"
            >
              About
            </Link>
            <Link
              to="/signin"
              className="hover:underline text-slate-700 cursor-pointer"
            >
              Sign in
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
