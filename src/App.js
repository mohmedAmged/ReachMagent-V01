import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import MyDashboard from './pages/myDashboard/MyDashboard';
import MyCatalog from './pages/myInsights/MyCatalog';
import MyOrders from './pages/myOrders/MyOrders';
import MyProducts from './pages/myProductsPage/MyProducts';
import MyQutations from './pages/myQutationsPage/MyQutations';
import NewCatalogItemForm from './components/newCatalogItemForm/NewCatalogItemForm';
import Home from './pages/myHome/Home';
import MyNavBar from './components/myNavBar/MyNavBar';
import MyFooter from './components/myFooter/MyFooter';
import { useState } from 'react';
import Discover from './pages/myDiscover/Discover';
import Shop from './pages/myShop/Shop';
import ProductDetails from './pages/myProductDetails/ProductDetails';

function App() {
  const {pathname} = useLocation();
  const [scrollToggle, setScrollToggle] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      setScrollToggle(true);
    } else {
      setScrollToggle(false);
    }
  });

  return (
    <>

    {
      pathname.includes('profile') ? <></> : <MyNavBar scrollToggle={scrollToggle}/>
    }

      <Routes>

        {/* Page Routes */}
        <Route path='/' element={<Home />} />

        {/* Shop Routes */}
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop/:singleProduct' element={<ProductDetails />} />
        <Route path='/discover' element={<Discover />} />

        {/* Profile Routes */}
        <Route path='/profile' element={<MyDashboard />} />
        <Route path='/profile/catalog' element={<MyCatalog />} />
        <Route path='/profile/catalog/:addNewItem' element={<NewCatalogItemForm />} />
        <Route path='/profile/quotations' element={<MyQutations />} />
        <Route path='/profile/products' element={<MyProducts />} />
        <Route path='/profile/orders' element={<MyOrders />} />

      </Routes>

    {
      // pathname.includes('profile') ? <></> : <MyFooter />
    }

    </>
  );
};

export default App;
