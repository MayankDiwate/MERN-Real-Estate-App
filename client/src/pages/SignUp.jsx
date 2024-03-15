import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data.message);
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success(data.message);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          required
          
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          required
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-1 justify-end mt-2">
        <p>Already have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
