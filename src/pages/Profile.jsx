import { updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FcHome } from "react-icons/fc";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ListingItem } from "../components";
import { auth, db } from "../firebase";

const Profile = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const navigate = useNavigate();
  const { email, name } = formData;
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update displayname in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile updated successfully!.");
    } catch (error) {
      toast.error("Could not update the profile details.");
    }
  };
  useEffect(() => {
    const fetchUserListings = async () => {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Listing has been deleted successfully.");
    }
  };
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <>
      <section className="max-w-4 mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl mt-6 text-center font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              value={name}
              id="name"
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-4
              ${changeDetail && "bg-green-200 focus:bg-green-200"}
              `}
            />

            <input
              type="email"
              value={email}
              id="name"
              disabled
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-4 "
            />
            <div className="flex justify-between items-center whitespace-nowrap mb-6">
              <p className="flex  items-center font-semibold">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="ml-2 text-sm sm:text-lg text-green-500 hover:text-green-600 transition ease-in-out duration-200 cursor-pointer font-semibold"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out font-semibold cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-semibold rounded shadow-md hover:bg-blue-700 transition ease-in-out duration-150 hover:shadow-lg active:bg-blue-800"
          >
            <Link
              className="flex justify-center items-center"
              to="/create-listing"
            >
              <FcHome className="mr-2 text-2xl bg-red-200 rounded-full p-1 border-2" />
              Sell or Rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
