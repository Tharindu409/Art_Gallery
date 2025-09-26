// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./Pages/home.jsx";
import SignUp from "./Pages/signup.jsx";
import SignIn from "./Pages/signin.jsx";
import Dashboard from "./Pages/about.jsx";
import Contact from "./Pages/contactus.jsx";
import Exhibitions from "./Pages/exhibition.jsx";
import Artshow from "./Pages/artshow.jsx";
import UserProfile from "./Pages/userprofile.jsx";
import Payment from "./Pages/directbuypayment.jsx";
import Directbuy from "./Pages/productpageDirect.jsx";
import Bidbuy from "./Pages/productPageBid.jsx";
import AdminArtManagement from "./Pages/ArtManagement.jsx";
import ExhibitionsManagement from "./Pages/ExhibitionManagement.jsx";
import UserManagement from "./Pages/UserManagement.jsx";

import OrderManagement from "./Pages/OrderManagement.jsx";
import BiddingManagement from "./Pages/BiddingManagement.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/artshow" element={<Artshow />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/directbuypayment" element={<Payment />} />
        <Route path="/productPageDirect/:id" element={<Directbuy />} />
        <Route path="/productPageBid/:id" element={<Bidbuy />} />

        {/* Admin routes  */}
        <Route path="/admin" element={<AdminArtManagement />} />
        <Route path="/admin/art-management" element={<AdminArtManagement />} />
        <Route
          path="/admin/exhibition-management"
          element={<ExhibitionsManagement />}
        />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/order-management" element={<OrderManagement />} />
        <Route
          path="/admin/bidding-management"
          element={<BiddingManagement />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<h1 className="text-center mt-20">404 – Page Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
