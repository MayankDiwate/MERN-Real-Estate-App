import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [passwordType, setPasswordType] = useState("password");
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUplaodError, setFileUplaodError] = useState(false);

  useEffect(() => {
    if (file) {
      handleImageUpload(file);
    }
  }, [file]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleImageUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUplaodError(true);
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User logged out successfully");
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 items-center w-full"
      >
        <input
          type="file"
          hidden
          ref={imageRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="flex justify-center relative w-24">
          <img
            src={formData.avatar ? formData.avatar : currentUser.avatar}
            alt={currentUser.username}
            className="rounded-full relative object-cover self-center mt-2 h-24 w-24"
          />
          <div
            onClick={() => imageRef.current.click()}
            className="flex w-8 h-8 bottom-0 right-0 items-center justify-center bg-slate-700 rounded-full absolute"
          >
            <FaPencilAlt size={16} className="cursor-pointer text-white" />
          </div>
        </div>
        <p>
          {fileUplaodError ? (
            <span className="text-red-700">
              Erro Uploading Image(image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg w-full"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg w-full"
          disabled
          defaultValue={currentUser.email}
        />
        <div className="w-full relative">
          <input
            type={passwordType}
            id="password"
            placeholder="Password"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            defaultValue={currentUser.password}
          />
          <span
            className="absolute right-3 top-4"
            onClick={() =>
              passwordType === "password"
                ? setPasswordType("text")
                : setPasswordType("password")
            }
          >
            {passwordType === "password" ? <EyeOff size={16} /> : <FaEye />}
          </span>
        </div>
        <button
          className="bg-slate-700 uppercase w-full hover:opacity-95 disabled:opacity-80 text-white p-3 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between items-center w-full mt-2">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
