import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/create-listing", element: <CreateListing /> },
  { path: "/properties/:listingId", element: <ListingDetails /> },
  { path: "/properties/category/:category", element: <CategoryPage /> },
  { path: "/properties/search/:search", element: <SearchPage /> },
  { path: "/:userId/trips", element: <TripList /> },
  { path: "/:userId/wishList", element: <WishList /> },
  { path: "/:userId/properties", element: <PropertyList /> },
  { path: "/:userId/reservations", element: <ReservationList /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
