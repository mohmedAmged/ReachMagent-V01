import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';

export default function NewProductForm({ mainCategories, token }) {
  const loginType = localStorage.getItem('loginType')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    price: '',
    discount_price: '',
    category_id: '',
    sub_category_id: '',
    status: 'active',
    image: [],


    has_variation: 'no',   /*yes || no*/
    attribute_ar: '',
    attribute_en: '',
    variation_name_ar: [''],
    variation_name_en: [''],
    stock: [''],
    total_stock: ''   /*do not insert value if has variation is yes*/
  });

  const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (formData.category_id) {
        setCurrentSubCategoriesInsideMainCategory([]);
        const selectedCategory = mainCategories.find(
          (cat) => cat.mainCategoryId === +formData.category_id
        );
        if (selectedCategory) {
          const slug = selectedCategory.mainCategorySlug;
          try {
            const timestamp = new Date().getTime(); // Cache-busting
            const response = await axios.get(`${baseURL}/main-categories/${slug}?t=${timestamp}`);
            if (response.status === 200) {
              setCurrentSubCategoriesInsideMainCategory(response.data.data.subCategories);
            } else {
              toast.error('Failed to fetch subcategories');
            }
          } catch (error) {
            toast.error('Error fetching subcategories.');
          }
        }
      }
    };

    fetchSubCategories();
  }, [formData.category_id, mainCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      has_variation: prevState.has_variation === 'yes' ? 'no' : 'yes',
      total_stock: prevState.has_variation === 'yes' ? '' : prevState.total_stock, // Clear total_stock if switching to variation
    }));
  };

  const handleVariationChange = (e, index, field) => {
    const newValue = e.target.value;
    setFormData((prevState) => {
      const updatedField = [...prevState[field]];
      updatedField[index] = newValue;
      return { ...prevState, [field]: updatedField };
    });
  }

  const addVariationField = () => {
    setFormData((prevState) => ({
      ...prevState,
      variation_name_ar: [...prevState.variation_name_ar, ''],
      variation_name_en: [...prevState.variation_name_en, ''],
      stock: [...prevState.stock, ''],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      image: files,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    ;

    Object.keys(formData).forEach((key) => {
      // Skip 'total_stock' if has_variation is 'yes'
      if (key === 'total_stock' && formData.has_variation === 'yes') return;
      // Skip 'attribute_ar' and 'attribute_en' if has_variation is 'no'
      if ((key === 'attribute_ar' || key === 'attribute_en') && formData.has_variation === 'no') return;
      if (key !== 'image' && !Array.isArray(formData[key])) {
        submissionData.append(key, formData[key]);
      }
    });
    if (formData.has_variation === 'yes') {
      // Append variation-related fields only if has_variation is 'yes'
      submissionData.append('attribute_ar', formData.attribute_ar);
      submissionData.append('attribute_en', formData.attribute_en);

      formData.variation_name_ar.forEach((variation, index) => {
        submissionData.append(`variation_name_ar[${index}]`, variation);
      });
      formData.variation_name_en.forEach((variation, index) => {
        submissionData.append(`variation_name_en[${index}]`, variation);
      });
      formData.stock.forEach((stock, index) => {
        submissionData.append(`stock[${index}]`, stock);
      });
    } else {
      submissionData.append('total_stock', formData.total_stock);
    }

    formData.image.forEach((image, index) => {
      submissionData.append(`image[${index}]`, image);
    })
    try {
      const response = await axios.post(`${baseURL}/${loginType}/add-product`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/profile/products')
        scrollToTop()
        toast.success('product item added successfully');
        // Reset form if needed
      } else {
        toast.error('Failed to add product item');
      }
    } catch (error) {
      console.error("Error: ", error.response || error.message);
      toast.error('Error adding product item.');
    }
  };
  return (
    <>
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader />
          <div className='newCatalogItem__form__handler'>
            <ContentViewHeader title={'Add New product'} />
            <form className="catalog__form__items" onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="catalog__new__input">
                    <label htmlFor="title_en">Product Name in English</label>
                    <input
                      type="text"
                      name="title_en"
                      className="form-control"
                      placeholder="Enter your text"
                      value={formData?.title_en}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="catalog__new__input">
                    <label htmlFor="title_ar">Product Name in Arabic</label>
                    <input
                      type="text"
                      name="title_ar"
                      className="form-control"
                      placeholder="Enter your text"
                      value={formData?.title_ar}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="catalog__new__input">
                    <label htmlFor="category_id">Category</label>
                    <select
                      name="category_id"
                      className="form-control custom-select"
                      value={formData?.category_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {mainCategories?.map((cat) => (
                        <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>
                          {cat?.mainCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="catalog__new__input">
                    <label htmlFor="sub_category_id">Sub Category</label>
                    <select
                      name="sub_category_id"
                      className="form-control custom-select"
                      value={formData?.sub_category_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Sub Category</option>
                      {currentSubCategoriesInsideMainCategory?.map((subCat) => (
                        <option key={subCat?.subCategoryId} value={subCat?.subCategoryId}>
                          {subCat?.subCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <div className="catalog__new__input">
                    <label htmlFor="description_en">Description in English</label>
                    <textarea
                      name="description_en"
                      className="form-control"
                      rows="5"
                      value={formData?.description_en}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="catalog__new__input">
                    <label htmlFor="description_ar">Description in Arabic</label>
                    <textarea
                      name="description_ar"
                      className="form-control"
                      rows="5"
                      value={formData?.description_ar}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <div className="catalog__new__input">
                    <label htmlFor="price">Price</label>
                    <div className="custom-input-container">
                      <input
                        type="text"
                        id="price"
                        name="price"
                        className="form-control custom-input"
                        placeholder="Enter your text"
                        value={formData?.price}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="currency" className="currency__label">Currency:</label>
                      <select
                        name="currency"
                        className="form-control custom-select"
                      >
                        <option value="USD">USD</option>
                        <option value="EGP">EGP</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="catalog__new__input">
                    <label htmlFor="price">Discount Price</label>
                    <div className="custom-input-container">
                      <input
                        type="text"
                        id="discount_price"
                        name="discount_price"
                        className="form-control custom-input"
                        placeholder="Enter your text"
                        value={formData?.discount_price}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="currency" className="currency__label">Currency:</label>
                      <select
                        name="currency"
                        className="form-control custom-select"
                      >
                        <option value="USD">USD</option>
                        <option value="EGP">EGP</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 my-4">
                  <div className="check__item">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="has_variation"
                        className="form-check-input"
                        checked={formData?.has_variation === 'yes'}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="has_variation" className="form-check-label">
                        has variation
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {formData?.has_variation === 'yes' ? (
                <>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="catalog__new__input">
                        <label htmlFor="attribute_en">Attribute in English</label>
                        <input
                          type="text"
                          name="attribute_en"
                          className="form-control"
                          placeholder="Enter attribute"
                          value={formData?.attribute_en}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="catalog__new__input">
                        <label htmlFor="attribute_ar">Attribute in Arabic</label>
                        <input
                          type="text"
                          name="attribute_ar"
                          className="form-control"
                          placeholder="Enter attribute"
                          value={formData?.attribute_ar}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  {formData?.variation_name_ar.map((_, index) => (
                    <div className="row" key={index}>
                      <div className="col-lg-4">
                        <div className="catalog__new__input">
                          <label htmlFor={`variation_name_en_${index}`}>Variation Name in English</label>
                          <input
                            type="text"
                            name={`variation_name_en_${index}`}
                            className="form-control"
                            placeholder="Enter variation name"
                            value={formData?.variation_name_en[index]}
                            onChange={(e) => handleVariationChange(e, index, 'variation_name_en')}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="catalog__new__input">
                          <label htmlFor={`variation_name_ar_${index}`}>Variation Name in Arabic</label>
                          <input
                            type="text"
                            name={`variation_name_ar_${index}`}
                            className="form-control"
                            placeholder="Enter variation name"
                            value={formData?.variation_name_ar[index]}
                            onChange={(e) => handleVariationChange(e, index, 'variation_name_ar')}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="catalog__new__input">
                          <label htmlFor={`stock_${index}`}>Stock</label>
                          <input
                            type="number"
                            name={`stock_${index}`}
                            className="form-control"
                            placeholder="Enter stock quantity"
                            value={formData?.stock[index]}
                            onChange={(e) => handleVariationChange(e, index, 'stock')}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="form__submit__button">
                    <button type="button" className="btn btn-secondary" onClick={addVariationField}>
                      Add Another Variation
                    </button>
                  </div>
                </>
              ) : (
                <div className="row">
                  <div className="col-lg-8">
                    <div className="catalog__new__input">
                      <label htmlFor="total_stock">Total Stock</label>
                      <input
                        type="number"
                        name="total_stock"
                        className="form-control"
                        placeholder="Enter total stock"
                        value={formData?.total_stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="upload__image__btn">
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
              <div className="form__submit__button">
                <button type="submit" className="btn btn-primary">
                  Add Catalog Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}