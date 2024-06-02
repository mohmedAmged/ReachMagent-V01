import React from 'react';
import './Home.css';
import ProductCategoryCard from '../../components/productCategoryCard/ProductCategoryCard';

export default function Home() {
    return (
        <div className='p-5 bg-light fw-bold fs-1 text-center'>
            Home Page
            <ProductCategoryCard />
        </div>
    )
}
