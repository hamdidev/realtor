import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ListingItem, Spinner } from "../components";
import { db } from "../firebase";

export default function Offers() {
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
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
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings.");
      }
    };
    fetchOfferListings();
  }, []);
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const qSnap = await getDocs(q);
      const lastVisible = qSnap.docs[qSnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      const listings = [];
      qSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      offerListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 space-x-6 px-3 ">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>
      {loading ? (
        <Spinner />
      ) : offerListings && offerListings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}
