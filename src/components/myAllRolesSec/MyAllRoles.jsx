import React, { useState } from 'react'
import './myAllRoles.css'
import MyDefaultRoles from '../myDefaultRolesSec/MyDefaultRoles';
export default function MyAllRoles() {
    const [activeRole, setActiveRole] = useState('default');
    return (
        <div className='myAllRoles__handler row mt-3'>
            <div className="col-12">
                <div className="my__roles__actions">
                    <button 
                        className={`def__btn ${activeRole === 'default' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('default')}
                    >
                        Default Roles
                    </button>
                    <button 
                        className={`cust__btn ${activeRole === 'custom' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('custom')}
                    >
                        Custom Roles
                    </button>
                </div>
            </div>
            <div className="col-12 mt-3">
                <div className="my__roles__main__content__info">
                {activeRole === 'default' && <MyDefaultRoles />}
                {activeRole === 'custom' && <div>Custom Roles Content</div>}
                </div>
            </div>
        </div>
    )
}
