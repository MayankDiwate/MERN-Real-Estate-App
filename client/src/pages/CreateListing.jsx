import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const removeImage = (index) => {
    setFiles(formData.imageUrls.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      Array.from(files).forEach((file) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(file.name),
        });
        console.log(file.name);
      });
    }
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

  const handleSubmit = (e) => {
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
        })
        .catch(() => {
          toast.error("Something went wrong while uploading images");
        });
    } else {
      toast.error("You can only upload up to 6 images");
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
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
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
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
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
                type="number"
                id="bedrooms"
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
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                placeholder="beds"
                className="border p-2 border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col">
                <span>Regular Price</span>
                <span className="text-xs text-gray-500">($/Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="discountPrice"
                min={1}
                max={10}
                placeholder="beds"
                className="border p-2 border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col">
                <span>Discount Price</span>
                <span className="text-xs text-gray-500">($/Month)</span>
              </div>
            </div>
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
          <button className="p-3 bg-slate-600 text-white rounded uppercase hover:shadow-lg disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
