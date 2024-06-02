import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import MyDashboard from './pages/myDashboard/MyDashboard';
import MyCatalog from './pages/myInsights/MyCatalog';
import MyOrders from './pages/myOrders/MyOrders';
import MyProducts from './pages/myProducts/MyProducts';
import MyQutations from './pages/myQutations/MyQutations';
import NewCatalogItemForm from './components/newCatalogItemForm/NewCatalogItemForm';
import Home from './pages/homePage/Home';
import MyNavBar from './components/myNavBar/MyNavBar';
import MyFooter from './components/myFooter/MyFooter';
import { useState } from 'react';

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
