import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import MyDashboard from './pages/myDashboard/MyDashboard';
import MyCatalog from './pages/myInsights/MyCatalog';
import MyOrders from './pages/myOrders/MyOrders';
import MyProducts from './pages/myProductsPage/MyProducts';
import MyQutations from './pages/myQutationsPage/MyQutations';
import NewCatalogItemForm from './components/newCatalogItemFormSec/NewCatalogItemForm';
import Home from './pages/myHome/Home';
import MyNavBar from './components/myNavBarSec/MyNavBar';
import MyFooter from './components/myFooterSec/MyFooter';
import { useState } from 'react';
import Discover from './pages/myDiscover/Discover';
import Shop from './pages/myShop/Shop';
import ProductDetails from './pages/myProductDetails/ProductDetails';
import SingleCompany from './pages/singleCompanyPage/SingleCompany';
import PersonalSignUp from './pages/personalSignUp/PersonalSignUp';
import BusinessSignUp from './pages/busnissSignUp/BusinessSignUp';
import { useQuery } from 'react-query';
import { getDataFromAPI } from './functions/fetchAPI';
import MyLogin from './pages/myLoginPage/MyLogin';
import Cookies from 'js-cookie';
function App() {

  const token = Cookies.get('authToken');
  console.log(token);
  const {pathname} = useLocation();
  const [scrollToggle, setScrollToggle] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      setScrollToggle(true);
    } else {
      setScrollToggle(false);
    }
  });

  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: ()=> getDataFromAPI('countries'),
  });
  const industriesQuery = useQuery({
    queryKey: ['industries'],
    queryFn: () => getDataFromAPI('industries'),
  });
  const mainCategoriesQuery = useQuery({
    queryKey: ['main-categories'],
    queryFn: () => getDataFromAPI('main-categories'),
  });
  const mainActivitiesQuery = useQuery({
    queryKey: ['main-activities'],
    queryFn: () => getDataFromAPI('main-activities'),
  });
  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: ()=> getDataFromAPI('companies'),
  });
// console.log(companiesQuery?.data);
  return (
    <>

    {
      pathname.includes('profile') ? <></> : <MyNavBar scrollToggle={scrollToggle}/>
    }

      <Routes>

        {/* HomePage Route */}
        <Route path='/' element={<Home companies={companiesQuery?.data}/>} />

        {/* Shop Routes */}
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop/:singleProduct' element={<ProductDetails />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/show-company/:companyId' element={<SingleCompany />} />

        {/* Login & Regester Routes */}
        <Route 
        path='/personalsignUp' 
        element={
          <PersonalSignUp 
            countries={countriesQuery?.data?.countries}
            industries={industriesQuery?.data?.industries} 
          /> 
        }/>
        <Route path='/business-signUp' element={
          <BusinessSignUp
            countries={countriesQuery?.data?.countries}
            industries={industriesQuery?.data?.industries} 
            mainCategories={mainCategoriesQuery?.data?.mainCategories} 
            mainActivities={mainActivitiesQuery?.data?.mainActivities} 
          />
        }/>
        <Route path='/login' element={<MyLogin />} />

        {/* Profile Routes */}
        <Route path='/profile' element={<MyDashboard />} />
        <Route path='/profile/catalog' element={<MyCatalog />} />
        <Route path='/profile/catalog/:addNewItem' element={<NewCatalogItemForm />} />
        <Route path='/profile/quotations' element={<MyQutations />} />
        <Route path='/profile/products' element={<MyProducts />} />
        <Route path='/profile/orders' element={<MyOrders />} />

      </Routes>

    {
      !pathname.includes('profile') && <MyFooter />
    }

    </>
  );
};

export default App;
