import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListingItem, Slider } from "../components";
import { db } from "../firebase";

export default function Home() {
  //Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const qSnap = await getDocs(q);
        let listings = [];
        qSnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  //Places for Rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const qSnap = await getDocs(q);
        let listings = [];
        qSnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentListings();
  }, []);
  //Places for Sell
  const [sellListings, setSellListings] = useState(null);
  useEffect(() => {
    const fetchSellListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );

        const qSnap = await getDocs(q);
        let listings = [];
        qSnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSellListings(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSellListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-x-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-4 mb-6">
            <h2 className="px-2 text-2xl font-semibold mt-6">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-2 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-4 space-x-6 ">
        {rentListings && rentListings.length > 0 && (
          <div className="m-4 mb-6">
            <h2 className="px-2 text-2xl font-semibold mt-6">Places to rent</h2>
            <Link to="/category/rent">
              <p className="px-2 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-4 space-x-6 ">
        {sellListings && sellListings.length > 0 && (
          <div className="m-4 mb-6">
            <h2 className="px-2 text-2xl font-semibold mt-6">Places to sell</h2>
            <Link to="/category/sale">
              <p className="px-2 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sellListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
