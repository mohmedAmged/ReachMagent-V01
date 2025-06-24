import React from 'react'
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import { useTranslation } from 'react-i18next';

export default function AddNewItem({link}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className='addNewItem__btn my-3 text-lg-end'>
            <button onClick={() => {
                scrollToTop();
                navigate(link);
            }}>
                {t('DashboardAllCatalogPage.addNewItemBtn')}
            </button>
        </div>
    );
};