import React, { useState } from 'react'
import './myDefaultRoles.css'
export default function MyDefaultRoles() {
    const [permissions, setPermissions] = useState([
        { id: 1, title: 'View Threats', enabled: true },
        { id: 2, title: 'Edit Users', enabled: false },
        { id: 3, title: 'Delete Posts', enabled: false },
        { id: 4, title: 'Manage Settings', enabled: false }
    ]);

    const [expandedRole, setExpandedRole] = useState(1);

    const togglePermission = (id) => {
        setPermissions(prevPermissions =>
            prevPermissions.map(permission =>
                permission.id === id ? { ...permission, enabled: !permission.enabled } : permission
            )
        );
    };

    const toggleRole = (id) => {
        setExpandedRole(prevId => (prevId === id ? null : id));
    };

    const getStyle = (enabled) => ({
        color: enabled ? '#000' : 'rgba(0, 0, 0, 0.3)'
    });

    const roles = [
        { id: 1, name: 'owner (Admin)', permissions },
        { id: 2, name: 'editor (User)', permissions },
        { id: 3, name: 'viewer (Guest)', permissions },
    ];
    return (
        <div className='myDefaultRoles__handler'>
            {roles.map(role => (
                <div key={role.id} className="oneRole__item__box mb-5">
                    <h1 className='role__tit d-flex align-items-center' onClick={() => toggleRole(role.id)}>
                        <i className={`bi ${expandedRole === role.id ? 'bi-chevron-compact-down' : 'bi-chevron-compact-right'}`}></i>
                        <span>{role.name}</span>
                    </h1>
                    {expandedRole === role.id && (
                        <>
                            <p className='role__desc d-flex '>
                                <i className="bi bi-exclamation-circle"></i>
                                <span>
                                    Owners have view and edit access to user management by default which cannot be changed.
                                    Every member gets basic permissions and functionality by default. You can customize settings for all members or make local adjustments for individual users in their profiles.
                                </span>
                            </p>
                            <h3 className='permission__header'>Permissions</h3>
                            <div className="allPermission__items">
                                <table className="table table-responsive">
                                    <tbody>
                                        {role.permissions.map(({ id, title, enabled }) => (
                                            <tr key={id} className='onePermission__handler'>
                                                <th className='permission__id' scope="row" style={getStyle(enabled)}>{id}.</th>
                                                <td className='permission__tit' style={getStyle(enabled)}>{title}</td>
                                                <td>
                                                    <div className="switch-container">
                                                        <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={enabled}
                                                                onChange={() => togglePermission(id)}
                                                            />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <span className="toggle-text" style={getStyle(enabled)}>{enabled ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}
