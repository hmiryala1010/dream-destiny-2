import { useEffect, useState, useCallback } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import API_URL from "../api";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const reservationList = useSelector((state) => state.user?.reservationList) || [];

  const dispatch = useDispatch();

  const getReservationList = useCallback(async () => {
    if (!userId) return; // Prevent unnecessary API calls if userId is not available

    try {
      const response = await fetch(`${API_URL}/users/${userId}/reservations`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched reservation list:", data); // Debugging

      dispatch(setReservationList(Array.isArray(data) ? data : []));
      setLoading(false);
    } catch (err) {
      console.error("Fetch Reservation List failed!", err);
      dispatch(setReservationList([])); // Ensure it's always an array
      setLoading(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    getReservationList();
  }, [getReservationList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList.length > 0 ? (
          reservationList.map(
            ({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
              <ListingCard
                key={listingId?._id} // Prevent React key warning
                listingId={listingId?._id}
                creator={hostId?._id}
                listingPhotoPaths={listingId?.listingPhotoPaths}
                city={listingId?.city}
                province={listingId?.province}
                country={listingId?.country}
                category={listingId?.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
            )
          )
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
