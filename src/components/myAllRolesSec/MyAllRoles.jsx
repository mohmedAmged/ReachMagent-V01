import React, { useState } from 'react';
import './myAllRoles.css';
import MyDefaultRoles from '../myDefaultRolesSec/MyDefaultRoles';
import AddRole from '../addRoleSec/AddRole';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';
export default function MyAllRoles({ token }) {
    const { t } = useTranslation();
    const [unAuth, setUnAuth] = useState(false);
    const [activeRole, setActiveRole] = useState('default');
    return (
        <div className="myAllRoles__handler row mt-3">
            <div className="col-12">
                <div className="my__roles__actions">
                    <button
                        className={`${Lang === 'ar' ? 'def__btn_RTL' : 'def__btn'} ${activeRole === 'default' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('default')}
                    >
                        {t('DashboardBussinessUserManagementPage.defaultRolesFilterItem')}
                    </button>
                    <button
                        className={`${Lang === 'ar' ? 'cust__btn_RTL' : 'cust__btn'} ${activeRole === 'addRule' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('addRule')}
                    >
                        {t('DashboardBussinessUserManagementPage.addRoleFilterItem')}
                    </button>
                </div>
            </div>
            <div className="col-12 mt-3">
                {unAuth
                    ? <UnAuthSec />
                    : <div className="my__roles__main__content__info">
                        {activeRole === 'default' && <MyDefaultRoles setUnAuth={setUnAuth} token={token} />}
                        {activeRole === 'addRule' && <AddRole setUnAuth={setUnAuth} token={token} />}
                    </div>}
            </div>
        </div>
    );
}
