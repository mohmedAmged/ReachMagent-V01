import { json, Route, Routes, useLocation } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
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
import MyMessage from './pages/myMessagePage/MyMessage';
import { baseURL } from './functions/baseUrl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CompanyFollowers from './pages/companyFollowersSec/CompanyFollowers';
import CompanyMessage from './pages/companyMessagePage/CompanyMessage';

function App() {
  // First Open website
  useEffect(()=>{
    if(!localStorage.getItem('loginType') === 'eployee'){
      localStorage.setItem('loginType','user');
    };
  },[]);

  const token = Cookies.get('authToken');
  const [loginType,setLoginType] = useState(localStorage.getItem('loginType'));
  const {pathname} = useLocation();
  const [scrollToggle, setScrollToggle] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      setScrollToggle(true);
    } else {
      setScrollToggle(false);
    }
  });

  // Webside dataQueries
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: ()=> getDataFromAPI('countries'),
  });
  // const citiesQuery = useQuery({
  //   queryKey: ['cities'],
  //   queryFn: ()=> getDataFromAPI('cities'),
  // });
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
    queryFn: () => getDataFromAPI('companies'),
  });

  // // Authentication queries
  // useEffect(() => {
  //   if (token) {
  //     const slugCompletion = loginType === 'user' ? 'user/profile' : 'employee/show-profile';
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(`${baseURL}/${slugCompletion}`, {
  //           headers: {
  //             'Accept': 'application/json',
  //             'Authorization': `Bearer ${token}`,
  //           },
  //         });
  //         Cookies.set('currentEmployeeData', JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });
  //       } catch (error) {
  //         toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [loginType, token]);

  return (
    <>

    {
      pathname.includes('profile') ? <></> : <MyNavBar loginType={loginType} token={token} scrollToggle={scrollToggle}/>
    }

    <Toaster
        position="top-center"
        reverseOrder={false}
    />

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
        <Route path='/login' element={
          <MyLogin 
            loginType={loginType}
            setLoginType={setLoginType}
          />} 
        />

        {/* business Profile Routes */}
        <Route path='/business-profile' element={
          <MyDashboard 
            countries={countriesQuery?.data?.countries}
            loginType={loginType}
            token={token} 
          />} 
        />
        <Route path='/business-profile/followers' 
        element={<CompanyFollowers 
            loginType={loginType}
            token={token} />} />
        <Route path='/business-profile/catalog' element={<MyCatalog />} />
        <Route path='/business-profile/catalog/:addNewItem' element={<NewCatalogItemForm />} />
        <Route path='/business-profile/quotations' element={<MyQutations />} />
        <Route path='/business-profile/products' element={<MyProducts />} />
        <Route path='/business-profile/orders' element={<MyOrders />} />
        <Route path='/company-messages' element={<CompanyMessage />} />
        <Route path='/your-messages' element={<MyMessage />} />

      </Routes>

    {
      !pathname.includes('profile') && <MyFooter />
    }

    </>
  );
};

export default App;
