import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';
import Admin from './pages/admin/Admin';
import AllProducts from './pages/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import Electronics from './pages/Electronics';
import Mobiles from './pages/Mobiles';
import Laptops from './pages/Laptops';
import Fashion from './pages/Fashion';
import Grocery from './pages/Grocery';
import Sports from './pages/Sports';

function App() {
  return (
    <div className="App d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1" style={{ marginLeft: 240, minHeight: '100vh', background: '#f7f7f7' }}>
        <Navbar />
        <div className="container-fluid pt-3">
          <Routes>
            <Route path='/auth' element={<Authentication />} />
            <Route exact path='' element={<Home />}/>
            <Route path='/cart' element={<Cart />} />
            <Route path='/product/:id' element={<IndividualProduct />} />
            <Route path='/category/:category' element={<CategoryProducts />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/all-products' element={<AllProducts />} />
            <Route path='/all-users' element={<AllUsers />} />
            <Route path='/all-orders' element={<AllOrders />} />
            <Route path='/new-product' element={<NewProduct />} />
            <Route path='/update-product/:id' element={<UpdateProduct />} />
            <Route path='/electronics' element={<Electronics />} />
            <Route path='/mobiles' element={<Mobiles />} />
            <Route path='/laptops' element={<Laptops />} />
            <Route path='/fashion' element={<Fashion />} />
            <Route path='/grocery' element={<Grocery />} />
            <Route path='/sports' element={<Sports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
