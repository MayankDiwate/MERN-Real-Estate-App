import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
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
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUplaodError, setFileUplaodError] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleImageUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const res = await fetch(
        `${window.env.API_BASE_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

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
      const res = await fetch(
        `${window.env.API_BASE_URL}/api/auth/signout`,
        {}
      );
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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${window.env.API_BASE_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User deleted successfully");
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(
        `${window.env.API_BASE_URL}/api/user/listings/${currentUser._id}`,
        {}
      );
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      setListings(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(
        `${window.env.API_BASE_URL}/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setListings(listings.filter((listing) => listing._id !== listingId));
      toast.success("Listing deleted successfully");
    } catch (error) {
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
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg w-full"
          onChange={handleChange}
        />

        <p className="w-full text-left text-sm text-gray-400">
          (note: password is not visible but can be updated)
        </p>
        <button
          className="bg-slate-700 uppercase w-full hover:opacity-95 disabled:opacity-80 text-white p-3 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between items-center w-full mt-2">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <button className="text-green-700 w-full" onClick={handleShowListings}>
        Show listings
      </button>

      <div>
        {listings &&
          listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing._id}
              className="my-2 border p-2 border-gray-300 rounded-md flex justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="w-20 object-cover"
                />
                <Link to={`/listing/${listing._id}`}>
                  <div className="hover:underline truncate text-md font-semibold">
                    {listing.name}
                  </div>
                </Link>
              </div>
              <div className="space-x-2 flex items-center">
                <Link to={`/update-listing/${listing._id}`}>
                  <Pencil size={20} color="green" />
                </Link>
                <button onClick={() => handleDeleteListing(listing._id)}>
                  <Trash2 size={20} color="red" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
