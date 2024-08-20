import React from 'react';
import './productDetailsSec.css';
import { Col, Container, Row } from 'react-bootstrap';
import ProdDetailsSlider from '../prodDetailsSliderSec/ProdDetailsSlider';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailsSec({ getCurrentProduct, itemType, product, token }) {
  const navigate = useNavigate();
  const loginType = localStorage.getItem('loginType');
  const handleAddProductToCart = (id) => {
    if (token) {
      if (loginType === 'employee') {
        toast.error(`Employees Can't Add to Cart!
            You Must be A user.
          `);
      } else {
        const productSended = { item_type: itemType, item_id: `${id}` };
        const toastId = toast.loading('Loading...');
        axios.post(`${baseURL}/user/add-to-cart?t=${new Date().getTime()}`, productSended, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        })
          .then(response => {
            getCurrentProduct(product?.id);
            toast.success(response?.data?.message || 'Added Successfully!', {
              id: toastId,
              duration: 1000,
            })
          })
          .catch(error => {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
              id: toastId,
              duration: 1000,
            });
          });
      };
    } else {
      toast.error('You Should Login First');
    };
  };

  const handleAddProductToWishList = (id) => {
    if (token) {
      if (loginType === 'employee') {
        toast.error(`Employees Can't Add to Cart!
            You Must be A user.
            `);
      } else {
        const productSended = { product_id: `${id}` };
        const toastId = toast.loading('Loading...');
        axios.post(`${baseURL}/user/control-wishlist?t=${new Date().getTime()}`, productSended, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        })
          .then(response => {
            getCurrentProduct(product?.id);
            toast.success(response?.data?.message || 'Added Successfully!', {
              id: toastId,
              duration: 1000,
            })
          })
          .catch(error => {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
              id: toastId,
              duration: 1000,
            });
          });
      };
    } else {
      toast.error('You Should Login First');
    };
  };

  return (
    <Container className='productDetails__sec mb-5 mt-3'>
      <Row>
        <Col lg={8}>
          <ProdDetailsSlider productImgs={product?.productImages ? product?.productImages : product?.medias} />
        </Col>
        <Col lg={4}>
          <div className='productDetails__description mt-md-4'>
            <h2 className='productDetails__head text-capitalize'>
              {product?.title ? product?.title : ''}
            </h2>

            <p className='mt-3 mb-4 fs-5 text-capitalize'>
              {product?.description}
            </p>
            <p className='productDetails__price mb-3'>
              {product?.price ? product?.price + product?.currency_symbol : product?.total_price + product?.currency_symbol}
              {
                product?.quantity ?
                  <>
                    <br />
                    <span className='fs-3'>
                      For {product?.quantity} Pieces
                    </span>
                  </>
                  :
                  ''
              }
            </p>
            {
              product?.discountPrice ?
                <p className='productDetails__delPrice d-flex gap-3 align-items-center mb-4'>
                  <span className='productDetails__deletedPrice'>
                    {product?.discountPrice ? product?.price + product?.discountPrice : ''}{product?.currency_symbol}
                  </span>
                </p>
                :
                ''
            }
            {
              product?.limited_date ?
                <p className='productDetails__delPrice limitedP d-flex gap-3 align-items-center mb-4'>
                  limited Date : {product?.limited_date}
                </p>
                :
                ''
            }
            <p className='productDetails__soldBy d-flex gap-2 align-items-center mb-3 mb-4'>
              <span>
                Sold by
                <strong>{product?.company_name}</strong>
              </span>
            </p>
            <div className='productDetails__addToCartPart d-flex justify-content-between align-items-center mt-2 flex-wrap gap-3'>
              <div className="productDetails__addToCartBtn">
                {
                  product?.inWishList ?
                    <button className="addToCartBtn addToWishlist" onClick={() => handleAddProductToWishList(product?.id)}>
                      REMOVE FROM WISHLIST <i className="bi bi-trash"></i>
                    </button>
                    :
                    <button className="addToCartBtn addToWishlist" onClick={() => handleAddProductToWishList(product?.id)}>
                      ADD TO WISHLIST <i className="bi bi-heart-fill"></i>
                    </button>
                }
                {
                  product?.inCart ?
                    <button className="addToCartBtn" onClick={() => navigate('/cart')}>
                      SHOW IN CART <i className="bi bi-eye"></i>
                    </button>
                    :
                    <button className="addToCartBtn" onClick={handleAddProductToCart}>
                      ADD TO CART <i className="bi bi-cart-plus-fill"></i>
                    </button>
                }
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
