import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState, useCallback } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import API_URL from "../api";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || [];

  const dispatch = useDispatch();

  // Wrap getPropertyList in useCallback to avoid redefinition on each render
  const getPropertyList = useCallback(async () => {
    if (!user?._id) return; // Prevent fetching if user is not available

    try {
      const response = await fetch(`${API_URL}/users/${user._id}/properties`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      console.error("Fetch all properties failed:", err.message);
    }
  }, [user?._id, dispatch]); // Include user._id and dispatch in dependencies

  useEffect(() => {
    getPropertyList();
  }, [getPropertyList]); // Use getPropertyList in the dependency array

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList.length > 0 ? (
          propertyList.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
              />
            )
          )
        ) : (
          <p>No properties found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PropertyList;
