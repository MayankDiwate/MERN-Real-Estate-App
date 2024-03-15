import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      toast.error("Please fill in all fields");
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(signInSuccess(data.user));
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      toast.error(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          className="
            bg-slate-700
            text-white
            p-3
            rounded-lg
            uppercase
            hover:opacity-95
            disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <div className="flex gap-1 justify-end mt-2">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
