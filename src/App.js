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
import { Toaster } from 'react-hot-toast';
import CompanyFollowers from './pages/companyFollowersSec/CompanyFollowers';
import CompanyMessage from './pages/companyMessagePage/CompanyMessage';
import EnterUrEmail from './pages/enterUrEmailPage/EnterUrEmail';
import ResetPassword from './pages/resetPasswordPage/ResetPassword';
import OtherCategories from './pages/otherCategoriesPage/OtherCategories';
import SubCategoryMain from './pages/subCategoryMainPage/SubCategoryMain';
import { baseURL } from './functions/baseUrl';
import axios from 'axios';
import MyProfileSettings from './pages/myProfileSettingsPage/MyProfileSettings';
import MyBussinessSettings from './pages/myBusinessSettingsPage/MyBussinessSettings';
import MyUsersManagement from './pages/myUsersManagementPage/MyUsersManagement';
import SingleCompanyQuote from './pages/singleCompanyQuotePage/SingleCompanyQuote';
import OneClickQuotation from './pages/oneClickQuotationPage/OneClickQuotation';
import MyService from './pages/myServicesPage/MyService';
import NewServiceForm from './components/newServiceFormSec/NewServiceForm';

function App() {
  useEffect(() => {
    if (!(localStorage.getItem('loginType') === 'employee')) {
      localStorage.setItem('loginType', 'user');
      setLoginType(localStorage.getItem('loginType'));
    };
  }, []);

  const token = Cookies.get('authToken');
  const [loginType, setLoginType] = useState(localStorage.getItem('loginType'));
  const { pathname } = useLocation();
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
    queryFn: () => getDataFromAPI('countries'),
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
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data?.data;
    },
  });
  // console.log(companiesQuery?.data);



  return (
    <>

      {
        pathname.includes('profile') ? <></> : <MyNavBar loginType={loginType} token={token} scrollToggle={scrollToggle} />
      }

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <Routes>

        {/* HomePage Route */}
        <Route path='/' element={<Home companies={companiesQuery?.data} token={token} />} />

        {/* Shop Routes */}
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop/:singleProduct' element={<ProductDetails />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/show-company/:companyId' element={<SingleCompany token={token} />} />
        <Route path='/:companyName/request-quote' element={<SingleCompanyQuote countries={countriesQuery?.data?.countries}
          token={token} />} />
        <Route path='/one-click-quotation' element={<OneClickQuotation />} />


        {/* all category routes */}
        <Route path='/all-category' element={<OtherCategories />} />
        <Route path='/all-category/Fashion&Apparel' element={<SubCategoryMain />} />
        <Route path='/all-category/Beauty&PersonalCare' element={<SubCategoryMain />} />
        <Route path='/all-category/Health&Wellness' element={<SubCategoryMain />} />
        <Route path='/all-category/Automotive' element={<SubCategoryMain />} />
        <Route path='/all-category/Packaging' element={<SubCategoryMain />} />
        <Route path='/all-category/Retail' element={<SubCategoryMain />} />
        <Route path='/all-category/Medical' element={<SubCategoryMain />} />
        <Route path='/all-category/Technology' element={<SubCategoryMain />} />
        <Route path='/all-category/Education' element={<SubCategoryMain />} />

        {/* Login & Regester Routes */}
        <Route
          path='/personalsignUp'
          element={
            <PersonalSignUp
              countries={countriesQuery?.data?.countries}
              industries={industriesQuery?.data?.industries}
            />
          }
        />
        <Route path='/business-signUp' element={
          <BusinessSignUp
            countries={countriesQuery?.data?.countries}
            industries={industriesQuery?.data?.industries}
            mainCategories={mainCategoriesQuery?.data?.mainCategories}
            mainActivities={mainActivitiesQuery?.data?.mainActivities}
          />
        } />
        <Route path='/login' element={
          <MyLogin
            loginType={loginType}
            setLoginType={setLoginType}
          />}
        />
        <Route path='/forget-password' element={<EnterUrEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {/* business Profile Routes */}
        <Route path='/profile' element={
          <MyDashboard
            countries={countriesQuery?.data?.countries}
            loginType={loginType}
            token={token}
          />}
        />
        <Route path='/profile/followers'
          element={<CompanyFollowers
            loginType={loginType}
            token={token}
          />}
        />
        <Route path='/profile/catalog' element={<MyCatalog token={token} />} />
        <Route path='/profile/service' element={<MyService token={token} />} />

        <Route path='/profile/profile-settings'
          element={<MyProfileSettings
            countries={countriesQuery?.data?.countries}
            loginType={loginType}
            token={token} />}
        />

        <Route path='/profile/business-settings'
          element={<MyBussinessSettings
            mainCategories={mainCategoriesQuery?.data?.mainCategories}
            countries={countriesQuery?.data?.countries}
            loginType={loginType}
            token={token} />}
        />

        <Route path='/profile/users-management'
          element={<MyUsersManagement
            countries={countriesQuery?.data?.countries}
            loginType={loginType}
            token={token} />}
        />

        <Route path='/profile/catalog/:addNewItem' element={
          <NewCatalogItemForm
            mainCategories={mainCategoriesQuery?.data?.mainCategories}
            token={token}
          />} />
        <Route path='/profile/service/:addNewItem' element={
          <NewServiceForm
            mainCategories={mainCategoriesQuery?.data?.mainCategories}
            token={token}
          />} />
        <Route path='/profile/quotations' element={<MyQutations  token={token}/>} />
        <Route path='/profile/products' element={<MyProducts />} />
        <Route path='/profile/orders' element={<MyOrders />} />
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
