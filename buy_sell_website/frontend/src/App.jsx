import FloatingCart from './components/FloatingCart';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './components/Login';
import CasLoginSuccess from "./components/CasLoginSuccess";
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Items from './components/Items';
import ItemDetails from './components/ItemDetails';
import Cart from './components/Cart';
import Orders from './components/Orders';
import DeliverItems from './components/DeliverItems';
import Support from './components/Support';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import AddItem from "./components/AddItem";
import ReviewForm from './components/ReviewForm';
import SellerReviews from './components/SellerReviews';

const App = () => (
  <Router>
   
    <Navbar />
    <FloatingCart /> 
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cas-login-success" element={<CasLoginSuccess />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetails />} />
     
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/deliver-items"
        element={
          <PrivateRoute>
            <DeliverItems />
          </PrivateRoute>
        }
      />
      <Route
        path="/support"
        element={
          <PrivateRoute>
            <Support />
          </PrivateRoute>
        }
      />
      <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
/>
<Route
    path="/add-item"
    element={
        <PrivateRoute>
            <AddItem />
        </PrivateRoute>
    }
/>

<Route
  path="/review/:orderId/:sellerId"
  element={
    <PrivateRoute>
      <ReviewForm />
    </PrivateRoute>
  }
/>
<Route
  path="/seller-reviews/:sellerId"
  element={
    <PrivateRoute>
      <SellerReviews />
    </PrivateRoute>
  }
/>


    </Routes>
  </Router>
);

export default App;
