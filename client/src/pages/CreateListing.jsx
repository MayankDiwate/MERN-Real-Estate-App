import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  console.log(formData);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const removeImage = async (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const imageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(imageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          toast.success("Images uploaded successfully");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } else {
      toast.error("You can only upload up to 6 images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return toast.error("Please upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return toast.error("Discount price must be less than regular price");

      setLoading(true);
      const res = await fetch(`${window.env.API_BASE_URL}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message);
      }

      toast.success("Listing created successfully");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create New Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                type="number"
                id="bedrooms"
                min={1}
                max={5}
                className="border p-2 border-gray-300 rounded-lg"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                type="number"
                id="bathrooms"
                min={1}
                max={5}
                className="border p-2 border-gray-300 rounded-lg"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                placeholder="beds"
                className="border p-2 border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col">
                <span>Regular Price</span>
                <span className="text-xs text-gray-500">($/Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  type="number"
                  id="discountPrice"
                  min={0}
                  max={1000000}
                  placeholder="beds"
                  className="border p-2 border-gray-300 rounded-lg"
                  required
                />
                <div className="flex flex-col">
                  <span>Discount Price</span>
                  <span className="text-xs text-gray-500">($/Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="text-gray-600 ml-2 font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                id="images"
                accept="image/*"
                multiple
                alt="Images"
                className="p-3 border border-gray-300 rounded w-full"
              />
              <button
                onClick={handleImageUpload}
                type="button"
                className="p-3 border text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                Upload
              </button>
            </div>
            <div className="flex flex-row flex-wrap gap-4">
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="relative w-40 h-40 object-cover"
                    />
                    <Trash2
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 text-white cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          </div>
          <button
            className="p-3 bg-slate-600 text-white rounded uppercase hover:shadow-lg disabled:opacity-80"
            disabled={loading}
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
