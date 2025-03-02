import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import API_URL from "../api";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList) || [];

  const dispatch = useDispatch();

  useEffect(() => {
    const getTripList = async () => {
      try {
        if (!userId) return; // Ensure user is logged in before fetching

        const response = await fetch(`${API_URL}/users/${userId}/trips`, {
          method: "GET",
        });

        const data = await response.json();
        console.log("Fetched trip list:", data); // Debugging

        // Ensure data is an array before updating state
        dispatch(setTripList(Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Fetch Trip List failed!", err.message);
      } finally {
        setLoading(false); // Ensure loading state updates
      }
    };

    getTripList();
  }, [dispatch, userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {Array.isArray(tripList) && tripList.length > 0 ? (
          tripList.map(({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
            <ListingCard
              key={listingId?._id || Math.random()} // Fallback key if _id is missing
              listingId={listingId?._id || ""}
              creator={hostId?._id || ""}
              listingPhotoPaths={listingId?.listingPhotoPaths || []}
              city={listingId?.city || "Unknown"}
              province={listingId?.province || "Unknown"}
              country={listingId?.country || "Unknown"}
              category={listingId?.category || "Unknown"}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          ))
        ) : (
          <p>No trips found</p> // Show a fallback message if no trips exist
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
