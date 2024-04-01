import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

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
              className="bg-transparent focus:outline-none w-30 w-54 md:w-64"
            />
            <FaSearch className="text-slate-600" />
          </form>
          <ul className="flex gap-4 items-center">
            <Link
              to="/about"
              className="hidden sm:inline hover:underline cursor-pointer text-slate-700"
            >
              About Us
            </Link>
            <button className="hidden sm:inline cursor-pointer bg-green-700 text-white px-3 py-1 rounded">
              <Link to="/create-listing">Create listing</Link>
            </button>
            {currentUser ? (
              <Link
                to="/profile"
                className="hidden sm:inline hover:underline cursor-pointer text-slate-700"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="rounded-full object-fill h-8 w-8"
                />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="hover:underline text-slate-700 cursor-pointer"
              >
                Sign in
              </Link>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
