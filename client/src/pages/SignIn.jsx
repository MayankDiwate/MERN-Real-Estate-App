import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      setLoading(false);
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
