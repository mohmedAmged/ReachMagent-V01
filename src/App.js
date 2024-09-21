import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './pages/myDashboard/companyDashboard.css';
import './App.css';
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
import toast, { Toaster } from 'react-hot-toast';
import CompanyFollowers from './pages/companyFollowersSec/CompanyFollowers';
import CompanyMessage from './pages/companyMessagePage/CompanyMessage';
import EnterUrEmail from './pages/enterUrEmailPage/EnterUrEmail';
import ResetPassword from './pages/resetPasswordPage/ResetPassword';
import OtherCategories from './pages/otherCategoriesPage/OtherCategories';
import SubCategoryMain from './pages/subCategoryMainPage/SubCategoryMain';
import MyProfileSettings from './pages/myProfileSettingsPage/MyProfileSettings';
import MyBussinessSettings from './pages/myBusinessSettingsPage/MyBussinessSettings';
import MyUsersManagement from './pages/myUsersManagementPage/MyUsersManagement';
import SingleCompanyQuote from './pages/singleCompanyQuotePage/SingleCompanyQuote';
import OneClickQuotation from './pages/oneClickQuotationPage/OneClickQuotation';
import MyService from './pages/myServicesPage/MyService';
import NewServiceForm from './components/newServiceFormSec/NewServiceForm';
import ShowSingleQuotation from './components/showSingleQuotationsSec/ShowSingleQuotation';
import OneClickQuotationsDashboard from './pages/oneClickQuotationsDashboardPage/OneClickQuotationsDashboard';
import ShowOneClickQuotation from './components/showOneClickQuotationSec/ShowOneClickQuotation';
import OneClickNegotiationCompanies from './pages/oneClickNegotiationCompaniesPage/OneClickNegotiationCompanies';
import MyFaqs from './pages/myFaqsPage/MyFaqs';
import NewFaqForm from './components/newFaqFromItem/NewFaqForm';
import MyPosts from './pages/myPostsPage/MyPosts';
import NewPostForm from './components/newPostFormItem/NewPostForm';
import MyAllCompanies from './pages/myAllCompaniesPage/MyAllCompanies';
import MyCompaniesInsights from './pages/myCompaniesInsightsPage/MyCompaniesInsights';
import ShowOneOrderInfo from './components/showOneOrderInfoSec/ShowOneOrderInfo';
import { baseURL } from './functions/baseUrl';
import axios from 'axios';
import MyShippingCosts from './pages/myShippingCostsPage/MyShippingCosts';
import NewShippingCostForm from './components/newShippingCostFromItem/NewShippingCostForm';

function App() {
  useEffect(() => {
    if (!(localStorage.getItem('loginType') === 'employee')) {
      localStorage.setItem('loginType', 'user');
      setLoginType(localStorage.getItem('loginType'));
    };
  }, []);

  const token = Cookies.get('authToken');
  const [loginType, setLoginType] = useState(localStorage.getItem('loginType'));
  const [totalCartItemsInCart, setTotalCartItemsInCart] = useState(0);
  const [totalWishlistItems, setTotalWishlistItems] = useState(0);


  const location = useLocation();
  const navigate = useNavigate();
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
    queryFn: () => getDataFromAPI(`companies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    ),
  });
  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: () => getDataFromAPI('regions'),
  });
  // const fetchCartItems = async () => {
  //   if (token) {
  //     try {
  //       const response = await axios.get(`${baseURL}/${loginType}/my-cart?t=${new Date().getTime()}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       setTotalCartItemsInCart(response?.data?.data?.cart?.total_quantity);
  //     } catch (error) {
  //       toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
  //     };
  //   };
  // };

  // const wishlistItems = async () => {
  //   if (token) {
  //     if (loginType === 'user') {
  //       try {
  //         const response = await axios.get(`${baseURL}/${loginType}/my-wishlist?t=${new Date().getTime()}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //         setTotalWishlistItems(response?.data?.data?.wish_list?.length);
  //       }
  //       catch (error) {
  //         toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
  //       };
  //     };
  //   };
  // };
  // useEffect(() => {
  //   fetchCartItems();
  //   wishlistItems();
  // }, [loginType, token]);

  if (token) {
    if (
      location.pathname === '/Login'
      || location.pathname === '/business-signUp'
      || location.pathname === '/personalsignUp'
      || location.pathname === '/forget-password'
      || location.pathname === '/reset-password'
    ) {
      navigate('/');
    };
  } else if (!token) {
    if (
      location.pathname.includes('profile') ||
      location.pathname === '/profile/followers' ||
      location.pathname === '/profile/catalog' ||
      location.pathname === '/profile/catalog/addNewItem' ||
      location.pathname === '/profile/catalog/edit-item' ||
      location.pathname === '/profile/service' ||
      location.pathname === '/profile/service/addNewItem' ||
      location.pathname === '/profile/service/edit-item' ||
      location.pathname === '/profile/products' ||
      location.pathname === '/profile/products/addNewItem' ||
      location.pathname === '/profile/products/edit-item' ||
      location.pathname === '/profile/faqs' ||
      location.pathname === '/profile/faqs/addNewItem' ||
      location.pathname === '/profile/faqs/edit-item' ||
      location.pathname === '/profile/posts' ||
      location.pathname === '/profile/posts/addNewItem' ||
      location.pathname === '/profile/posts/edit-item' ||
      location.pathname === '/profile/shipping-costs' ||
      location.pathname === '/profile/shipping-costs/addNewItem' ||
      location.pathname === '/profile/shipping-costs/edit-item' ||
      location.pathname === '/profile/quotations' ||
      location.pathname === '/profile/oneclick-quotations' ||
      location.pathname === '/profile/orders'
    ) {
      navigate('/login');
    };
  };

  return (
    <>

      {
        location.pathname.includes('profile') ? <></> : <MyNavBar loginType={loginType} token={token} scrollToggle={scrollToggle} />
      }

      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* HomePage Route */}
        <Route path='/' element={<Home companies={companiesQuery?.data?.companies} token={token} />} />
        
        {/* Shop Routes */}
        {/* <Route path='/discover' element={<Discover />} /> */}
        {/* <Route path='/shop' element={<Shop fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} />} /> */}
        {/* <Route path='/shop/:singleProduct' element={<ProductDetails fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} />} /> */}

        {/* <Route path='/lastMinuteDeals/:singleDeal' element={<LastMinuteDetails token={token} />} /> */}

        <Route path='/all-companies' element={<MyAllCompanies token={token} />} />
        <Route path='/show-company/:companyId' element={<SingleCompany token={token} />} />
        <Route path='/:companyName/request-quote' element={<SingleCompanyQuote countries={countriesQuery?.data?.countries} token={token} />} />

        <Route path='/one-click-quotation' element={<OneClickQuotation regions={regionsQuery?.data?.regions} mainCategories={mainCategoriesQuery?.data?.mainCategories} countries={countriesQuery?.data?.countries} token={token} />} />

        <Route path='/all-insights' element={<MyCompaniesInsights token={token} />} />

        {/* <Route path='/my-wishlist' element={<MyWishList fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} />} /> */}

        {/* <Route path='/my-cart' element={<MyCart fetchCartItems={fetchCartItems} token={token} />} /> */}
        {/* <Route path='/check-out/:companyId' element={<MyCheckout token={token} />} /> */}

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
        <Route path='/personalsignUp' element={<PersonalSignUp countries={countriesQuery?.data?.countries} industries={industriesQuery?.data?.industries} />} />
        <Route path='/business-signUp' element={<BusinessSignUp countries={countriesQuery?.data?.countries} industries={industriesQuery?.data?.industries} mainCategories={mainCategoriesQuery?.data?.mainCategories} mainActivities={mainActivitiesQuery?.data?.mainActivities} />} />
        <Route path='/login' element={<MyLogin type={loginType} setType={setLoginType} />} />
        <Route path='/forget-password' element={<EnterUrEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Profile Routes */}
        <Route path='/profile/followers' element={<CompanyFollowers loginType={loginType} token={token} />} />

        <Route path='/profile/catalog' element={<MyCatalog token={token} />} />
        <Route path='/profile/catalog/addNewItem' element={<NewCatalogItemForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} />
        <Route path='/profile/catalog/edit-item/:id' element={<NewCatalogItemForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} />

        <Route path='/profile/service' element={<MyService token={token} />} />
        <Route path='/profile/service/addNewItem' element={<NewServiceForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} />
        <Route path='/profile/service/edit-item/:id' element={<NewServiceForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} />

        {/* <Route path='/profile/products' element={<MyProducts token={token} />} /> */}
        {/* <Route path='/profile/products/addNewItem' element={<NewProductForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} /> */}
        {/* <Route path='/profile/products/edit-item/:id' element={<NewProductForm mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} /> */}
        {/* <Route path='/profile/products/show-one/:prodInfoId' element={<ShowOneProductInfoInDash token={token} />} /> */}

        <Route path='/profile/faqs' element={<MyFaqs token={token} />} />
        <Route path='/profile/faqs/addNewItem' element={<NewFaqForm token={token} />} />
        <Route path='/profile/faqs/edit-item/:id' element={<NewFaqForm token={token} />} />

        <Route path='/profile/posts' element={<MyPosts token={token} />} />
        <Route path='/profile/posts/addNewItem' element={<NewPostForm token={token} />} />
        <Route path='/profile/posts/edit-item/:id' element={<NewPostForm token={token} />} />

        <Route path='/profile/shipping-costs' element={<MyShippingCosts token={token} />} />
        <Route path='/profile/shipping-costs/addNewCost' element={<NewShippingCostForm token={token} countries={countriesQuery?.data?.countries} />} />
        <Route path='/profile/shipping-costs/edit-item/:id' element={<NewShippingCostForm token={token} countries={countriesQuery?.data?.countries} />} />

        <Route path='/profile/quotations' element={<MyQutations token={token} />} />
        <Route path='/profile/quotations/:quotationsId' element={<ShowSingleQuotation token={token} />} />

        <Route path='/profile/companyoneclick-quotations/:quotationsId' element={<ShowSingleQuotation token={token} />} />
        <Route path='/profile/oneclick-quotations' element={<OneClickQuotationsDashboard token={token} />} />
        <Route path='/profile/oneclick-quotations/:negotiateId' element={<OneClickNegotiationCompanies token={token} />} />
        <Route path='/profile/oneclick-quotations/:negotiateId/:offerId' element={<ShowOneClickQuotation token={token} />} />

        <Route path='/profile/orders' element={<MyOrders token={token} />} />
        <Route path='/profile/orders/:orderId' element={<ShowOneOrderInfo token={token} />} />

        <Route path='/company-messages' element={<CompanyMessage />} />
        <Route path='/your-messages' element={<MyMessage />} />

        <Route path='/profile/profile-settings' element={<MyProfileSettings countries={countriesQuery?.data?.countries} loginType={loginType} token={token} />} />
        <Route path='/profile/business-settings' element={<MyBussinessSettings mainCategories={mainCategoriesQuery?.data?.mainCategories} token={token} />} />
        <Route path='/profile/users-management' element={<MyUsersManagement countries={countriesQuery?.data?.countries} loginType={loginType} token={token} />} />

      </Routes>

      {
        !location.pathname.includes('profile') && <MyFooter />
      }

    </>
  );
};

export default App;
