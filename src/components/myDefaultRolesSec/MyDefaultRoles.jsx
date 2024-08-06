import React, { useEffect, useState } from 'react'
import './myDefaultRoles.css'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Cookies.remove('UpdatedRuleData');

export default function MyDefaultRoles({token}) {
    const loginType = localStorage.getItem('loginType');
    const [permissions, setPermissions] = useState(Cookies.get('Permissions') ? 
    JSON.parse(Cookies.get('Permissions')) 
    : 
        []
    );
    const [allRoles,setAllRoles] = useState(Cookies.get('AllRoles') ?
            JSON.parse(Cookies.get('AllRoles')) 
        : 
            []
    );
    const [loadingPermissions,setLoadingPermissions] = useState(false);
    // const [roles,setRoles] = useState(Cookies.get('Roles&Permissions') ?
    //         JSON.parse(Cookies.get('Roles&Permissions')) 
    //     : 
    //         []
    // );
    const [changedPermsIds,setChangedPermsIds] = useState([]);
let counter = 0;

    const handleDeleteThisRule = async (id) => {
        await axios.delete(`${baseURL}/${loginType}/roles-delete/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            Cookies.set('AllRoles', JSON.stringify(allRoles?.filter(el => +el?.id !== +id)));
            // Cookies.set('Roles&Permissions', JSON.stringify(roles?.filter(rule => +rule?.role?.id !== +id)));
            Cookies.set('Permissions', JSON.stringify(permissions?.filter(perm => +perm?.permissionId !== +id)));
            toast.success(response?.data?.message);
        }).catch(error=>{
            toast.error(error?.response?.data?.message);
        });
    };

    useEffect(()=>{
        if(!Cookies.get('AllRoles')){
            (async ()=>{
                axios.get(`${baseURL}/${loginType}/roles`,{
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    setAllRoles(prevRoles => {
                        const lastShape = [...prevRoles , ...response?.data?.data?.roles];
                        return lastShape;
                    });
                    Cookies.set('AllRoles', JSON.stringify(response?.data?.data?.roles));
                }).catch(error=>{
                    toast.error(error?.response?.data?.message);
                });
            })();
        }
    },[allRoles,Cookies.get('AllRoles')]);

    const handleUpdateRule = async (id) => {
        // const cookiesValue = Cookies.get('UpdatedRuleData');
        // if(cookiesValue){
        //     const parsedData = JSON.parse(cookiesValue);
        //     const uniquePermissionIds = [...new Set(parsedData[0]?.permission_id)];
        //     const requesData = {
        //         name: parsedData[0]?.name,
        //         permission_id: uniquePermissionIds
        //     };
        //     const formData = new FormData();
        //     Object.keys(requesData).forEach((key) => {
        //         if(key === 'permission_id'){
        //             requesData[key].forEach((item, index) => {
        //                 formData.append(`${key}[${index}]`, item);
        //             });
        //         }
        //         formData.append(key, requesData[key]);
        //     });
        //     const toastId = toast.loading('Updating Role...')
        //     await axios.post(`${baseURL}/${loginType}/roles-update/${id}`, formData , {
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'multipart/form-data',
        //             'Authorization': `Bearer ${token}`,
        //         }
        //     })
        //     .then((response)=>{
        //         Cookies.set('Permissions',permissions);
        //         console.log(response?.data?.data);
        //         toast.success(response?.data?.message,{
        //             id: toastId,
        //             duration: 1000
        //         });
        //     })
        //     .catch(error=>{
        //         console.log(error?.response);
        //         toast.error(error?.data?.data?.message || 'Error',{
        //             id: toastId,
        //             duration: 1000
        //         })
        //     });
        // }
    };

    const gettingSingleRulePermissions = async (id) => {
        if(id && !permissions?.find(el => +el?.permissionId === +id)){
            setPermissions([]);
            setLoadingPermissions(true);
            await axios.get(`${baseURL}/${loginType}/roles-show/${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                // setRoles((prevRoles) => {
                //     const updatedRoles = [...prevRoles, response?.data?.data];
                //     // Cookies.set('Roles&Permissions', JSON.stringify(updatedRoles));
                //     return updatedRoles;
                // });
                setPermissions([{[id]: response?.data?.data?.permissions, 'permissionId': id }]);
                setLoadingPermissions(false);
            }).catch(error=>{
                toast.error(error?.response?.data?.message);
            });
        };
    };

    const gettingDefaultPermissions = (roles) => {
        roles?.map(rule => gettingSingleRulePermissions(rule?.id));
    }

    // useEffect(()=>{
    //     if(allRoles.length > 0 && !Cookies.get('Roles&Permissions') && !Cookies.get('Permissions')){
    //         gettingDefaultPermissions(allRoles);
    //     };
    // },[allRoles]);

    const [expandedRole, setExpandedRole] = useState(null);

    // const togglePermission = (id , ruleId) => {
    //     const currPerms = permissions?.map(perm =>
    //         (+perm?.permissionId === +ruleId) ?
    //         {[ruleId] : perm?.[ruleId]?.map(el =>
    //             (+el?.id === +id) ?
    //             {...el , enable: !el.enable}
    //             :
    //             el ),
    //             permissionId: ruleId
    //         }
    //         :
    //         perm
    //     );

    //     let ids = [];
    //     const currentRuleUnderChanging = allRoles?.find(rule => +rule?.id === +ruleId).name;
    //         permissions?.map(perm => 
    //             (+perm?.permissionId === +ruleId) ? 
    //                 (changedPermsIds?.find(el => +el === +id)) ? 
    //                     <>
    //                         {setChangedPermsIds(changedPermsIds?.filter(el => +el !== +id))}
    //                         {ids.push(...changedPermsIds?.filter(el => +el !== +id))}
    //                     </>
    //                 :
    //                     <>
    //                         {setChangedPermsIds([...changedPermsIds , id])}
    //                         {ids.push(...changedPermsIds , id)}
    //                     </>
    //             :
    //                 perm
    //         );
    //         Cookies.set('UpdatedRuleData' , JSON.stringify([{name: currentRuleUnderChanging , permission_id: ids }]));
    //     setPermissions(currPerms);
    // };

    const toggleRole = (id) => {
        // setPermissions([]);
        // setChangedPermsIds([]);
        // Cookies.remove('UpdatedRuleData');
        // if(toggledOnce){
            // gettingDefaultPermissions(allRoles);
        // }
        counter = 0;
        gettingSingleRulePermissions(id);
        setExpandedRole(prevId => (prevId === id ? null : id));
    };

    const getStyle = (enable) => ({
        color: enable ? '#000' : 'rgba(0, 0, 0, 0.3)'
    });

    return (
        <div className='myDefaultRoles__handler'>
            {allRoles?.map((role) => (
                <div key={role.id} className="oneRole__item__box mb-5">
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h3 className='role__tit d-flex align-items-center' onClick={() => toggleRole(role?.id)}>
                            <i className={`bi ${expandedRole === role?.id ? 'bi-chevron-compact-down' : 'bi-chevron-compact-right'}`}></i>
                            <span>{role?.name}</span>
                        </h3>
                        <div>
                            {/* <button className='updateRuleBtn' onClick={() => handleUpdateRule(role?.id)}>Update Role</button> */}
                            <button className="deleteRuleBtn" onClick={() => handleDeleteThisRule(role?.id)}>Remove Role</button>
                        </div>
                    </div>
                    {expandedRole === role?.id && (
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
                                        {loadingPermissions ? 
                                            <div class="permissionsLoader"></div>
                                        :
                                            permissions[0]?.[role?.id]?.map((perm , idx) =>{
                                                return(
                                                (perm?.enable === true) &&
                                                <tr key={perm?.id} className='onePermission__handler'>
                                                    <th className='permission__id' scope="row" style={getStyle(perm?.enable)}>{++counter}.</th>
                                                    <td className='permission__tit' style={getStyle(perm?.enable)}>{perm?.name}</td>
                                                    <td>
                                                        <div className="switch-container">
                                                            <label className="switch">
                                                            
                                                                <input
                                                                    type="checkbox"
                                                                    checked={true}
                                                                    // onChange={() => togglePermission(perm?.id , perms?.permissionId)}
                                                                />
                                                                <span className="slider"></span>
                                                            </label>
                                                            <span className="toggle-text" style={getStyle(perm?.enable)}>{perm?.enable ? 'Yes' : 'No'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )} )}
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
