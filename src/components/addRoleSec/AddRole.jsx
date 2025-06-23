import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddRoleSchema } from '../../validation/AddRoleSchema';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function AddRole({ token, setUnAuth }) {
  const { t } = useTranslation();
  const loginType = localStorage.getItem('loginType');
  const [permissions, setPermissions] = useState([]);
  const [accepetedPermissions, setAcceptedPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const gettingAllPermissions = async (page = 1) => {
    await axios.get(`${baseURL}/${loginType}/permissions?page=${page}&t=${new Date().getTime()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
        "Locale" : Lang
      },
    })
      .then((response) => {
        setPermissions(response?.data?.data?.permissions);
        setTotalPages(response?.data?.data?.meta?.last_page);
      })
      .catch((error) => {
        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message);
      });
  };

  useEffect(() => {
    gettingAllPermissions(currentPage);
  }, [currentPage]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(AddRoleSchema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Loading...');
    if (accepetedPermissions.length > 0) {
      data.permission_id = accepetedPermissions;
      axios.post(`${baseURL}/${loginType}/roles-create?t=${new Date().getTime()}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          scrollToTop();
          window.location.reload();
          toast.success(response?.data?.message || `${t('DashboardBussinessUserManagementPage.RoleAddedToast')}`, {
            id: toastId,
            duration: 1000,
          });
        })
        .catch((error) => {
          if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
            setUnAuth(true);
          };
          if (error?.response?.data?.errors) {
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
          }
          toast.error(error?.response?.data.message || 'Validation Error!', {
            id: toastId,
            duration: 1000,
          });
        });
    } else {
      toast.error(`${t('DashboardBussinessUserManagementPage.atLeastOnePermissionToast')}`, {
        id: toastId,
        duration: 2000,
      });
    };
  };

  const handleChangeCheckBox = (e, id) => {
    if (e.target.checked === true) {
      setAcceptedPermissions([...accepetedPermissions, id]);
    } else if (e.target.checked === false) {
      setAcceptedPermissions(accepetedPermissions?.filter((el) => +el !== +id));
    };
  };

 const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2 ms-2 profileFormInputItem mb-3">
        <label htmlFor="dashboardCompanyAddRoleName">{t('DashboardBussinessUserManagementPage.roleNAmeFormInput')}</label>
        <input
          id="dashboardCompanyAddRoleName"
          placeholder={t('DashboardBussinessUserManagementPage.roleNAmeFormInputPlaceholder')}
          className={`form-control signUpInput mt-2 ${errors?.name ? 'inputError' : ''}`}
          {...register('name')}
          type="text"
        />
        {errors?.name && (<span className="errorMessage">{errors?.name?.message}</span>)}
      </div>

      <div className="allPermission__items mt-4">
        {permissions?.map((perm) => (
          <div key={perm?.id}>
            <label className="switch cursorPointer w-100 px-3 d-flex justify-content-between gap-3 align-items-center mb-3">
              <span>{perm?.name}</span>
              <input
                type="checkbox"
                checked={accepetedPermissions?.find(el => +el === +perm?.id)}
                onChange={(e) => handleChangeCheckBox(e, perm?.id)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          type="button"
          className="paginationBtn me-2"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <i class="bi bi-caret-left-fill"></i>
        </button>
        <span className='currentPagePagination'>{currentPage}</span>
        <button
          type="button"
          className="paginationBtn ms-2"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>

      <div className="submitAddRole text-center my-4">
        <input type="submit" disabled={isSubmitting} value={t('DashboardBussinessUserManagementPage.confirmChangesBtn')} className="updateBtn mt-0" />
      </div>
    </form>
  );
}
