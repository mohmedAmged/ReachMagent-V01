// import React, { useState } from 'react';
// import './businessRegisterPackages.css';

// export default function BusinessSignUpPackages() {
//   const arrOfPackages = [
//     {
//       id: 1,
//       name: 'Basic',
//       price: '$4.50',
//       features: [
//         {
//           id: 1,
//           content: '50 Image generations'
//         },
//         {
//           id: 2,
//           content: '500 Credits'
//         },
//         {
//           id: 3,
//           content: 'Monthly 100 Credits Free'
//         },
//         {
//           id: 4,
//           content: 'Customer Support'
//         },
//         {
//           id: 5,
//           content: 'Dedicated Server'
//         },
//         {
//           id: 6,
//           content: 'Priority Generations'
//         },
//         {
//           id: 7,
//           content: '50GB Cloud Storage'
//         }
//       ],
//       selected: false,
//     },
//     {
//       id: 2,
//       name: 'Premium',
//       price: '$9.50',
//       features: [
//         {
//           id: 1,
//           content: '50 Image generations'
//         },
//         {
//           id: 2,
//           content: '500 Credits'
//         },
//         {
//           id: 3,
//           content: 'Monthly 100 Credits Free'
//         },
//         {
//           id: 4,
//           content: 'Customer Support'
//         },
//         {
//           id: 5,
//           content: 'Dedicated Server'
//         },
//         {
//           id: 6,
//           content: 'Priority Generations'
//         },
//         {
//           id: 7,
//           content: '50GB Cloud Storage'
//         }
//       ],
//       selected: true,
//     },
//     {
//       id: 3,
//       name: 'Enterprise',
//       price: '$14.50',
//       features: [
//         {
//           id: 1,
//           content: '50 Image generations'
//         },
//         {
//           id: 2,
//           content: '500 Credits'
//         },
//         {
//           id: 3,
//           content: 'Monthly 100 Credits Free'
//         },
//         {
//           id: 4,
//           content: 'Customer Support'
//         },
//         {
//           id: 5,
//           content: 'Dedicated Server'
//         },
//         {
//           id: 6,
//           content: 'Priority Generations'
//         },
//         {
//           id: 7,
//           content: '50GB Cloud Storage'
//         }
//       ],
//       selected: false,
//     },
//   ];
//   const [preferedTimePackage,setPreferedTimePackage] = useState('Monthly');
//   const [preferedSelectedPackage,setPreferedSelectedPackage] = useState('Premium');
//   const [packs,setPacks] = useState(arrOfPackages);
//   const arrOfTimePackages = [
//     {
//       id: 1,
//       name: 'Monthly'
//     },{
//       id: 2,
//       name: 'Yearly'
//     }
//   ];

//   const updateAllValues = (newValue) => {
//     const updatedPacks = packs.map(pack => ({...pack , selected: newValue}));
//     setPacks(updatedPacks);
//   };
//   const updateCurrPackValue = (id, newValue) => {
//     const updatedPacks = packs.map((pack) => pack.id === id ? { ...pack, selected: newValue } : pack);
//     setPacks(updatedPacks);
//   };

//   return (
//     <div className='business-signUp__packages container text-center my-5 pt-5'>
//       <h4>
//         Which package are you interested in?
//       </h4>
//       <ul className="preferedTimeForPackage d-flex justify-content-around align-items-center">
//         {
//           arrOfTimePackages.map((pack) =>{
//             return(
//               <li className={`${preferedTimePackage === pack.name ? 'active' : ''}`}
//                 onClick={()=>setPreferedTimePackage(pack.name)}
//                 key={pack.id}
//               >{pack.name}</li>
//             );
//           })
//         }
//       </ul>
//       <div className="row">
//         <div className="col-12">
//           <h5 className='suggested__package'>
//             Suggested
//           </h5>
//         </div>
//         {
//           packs.map(pack =>{
//             return(
//               <div className={`col-lg-4 col-md-6 col-sm10 m-auto p-4`} key={pack.id}>
//                 <div className={`packageCard ${ (preferedSelectedPackage === pack.name) ? 'selectedPackage' : 'notSelectedPackage'}`}>
//                   <h5>{pack.name}</h5>
//                   <p className="price">
//                     {pack.price}
//                   </p>
//                   <ul className={`d-flex flex-column justify-content-start align-items-start`}>
//                     {pack.features.map(feature=>{
//                       return(
//                         <li key={feature.id}>
//                           <span><i className="bi bi-check-lg"></i></span>
//                           {feature.content}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                   <div 
//                   onClick={()=>{
//                     updateAllValues(false);
//                     updateCurrPackValue(pack.id,true);
//                     setPreferedSelectedPackage(pack.name);
//                   }}
//                   className={`packageBtn ${(preferedSelectedPackage === pack.name) ? 'selectedPackageBtn' : 'notSelectedPackageBtn'}`}>
//                     {(preferedSelectedPackage === pack.name) ? 'Selected' : 'Select'}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         }
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './businessRegisterPackages.css';
import { baseURL } from '../../functions/baseUrl';

export default function BusinessSignUpPackages({ setValue, watch }) {
  const [packs, setPacks] = useState([]);
  const [preferedTimePackage, setPreferedTimePackage] = useState('Monthly');
  const [preferedSelectedPackage, setPreferedSelectedPackage] = useState( watch('prefered_package_id') || null);

  const arrOfTimePackages = [
    {
      id: 1,
      name: 'Monthly',
    },
    {
      id: 2,
      name: 'Yearly',
    },
  ];

  useEffect(() => {
    // Fetch packages from the API
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${baseURL}/all-packages`);
        const apiPackages = response.data.data.packages.map((pack) => ({
          id: pack.id,
          name: pack.name,
          price: `$${pack.price}`,
          discountPrice: `$${pack.discount_price}`,
          features: Object.entries(pack.data).map(([key, value]) => ({
            id: key,
            content: `${key.replace(/_/g, ' ')}: ${value}`,
          })),
          selected: false,
        }));
        setPacks(apiPackages);
        const defaultPackage = apiPackages[0]?.id || null;
        // setPreferedSelectedPackage(apiPackages[0]?.name || null);
        setPreferedSelectedPackage(defaultPackage);
        setValue('prefered_package_id', defaultPackage);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, [setValue]);

  const updateAllValues = (newValue) => {
    const updatedPacks = packs.map((pack) => ({ ...pack, selected: newValue }));
    setPacks(updatedPacks);
  };

  const updateCurrPackValue = (id, newValue) => {
    const updatedPacks = packs.map((pack) =>
      pack.id === id ? { ...pack, selected: newValue } : pack
    );
    setPacks(updatedPacks);
  };

  return (
    <div className='business-signUp__packages container text-center my-5 pt-5'>
      <h4>Which package are you interested in?</h4>
      <ul className='preferedTimeForPackage d-flex justify-content-around align-items-center'>
        {arrOfTimePackages.map((pack) => (
          <li
            className={`${preferedTimePackage === pack.name ? 'active' : ''}`}
            onClick={() => setPreferedTimePackage(pack.name)}
            key={pack.id}
          >
            {pack.name}
          </li>
        ))}
      </ul>
      <div className='row'>
        <div className='col-12'>
          <h5 className='suggested__package'>Suggested</h5>
        </div>
        {packs.map((pack) => (
          <div
            className={`col-lg-4 col-md-6 col-sm-10 m-auto p-4`}
            key={pack.id}
          >
            <div
              className={`packageCard ${
                preferedSelectedPackage === pack.id
                  ? 'selectedPackage'
                  : 'notSelectedPackage'
              }`}
            >
              <h5>{pack.name}</h5>
              <p className='price'>{pack.price}</p>
              {pack.discountPrice && (
                <p className='discount-price'>
                  Discount Price: {pack.discountPrice}
                </p>
              )}
              <ul
                className={`d-flex flex-column justify-content-start align-items-start`}
              >
                {pack.features.map((feature) => (
                  <li key={feature.id}>
                    <span>
                      <i className='bi bi-check-lg'></i>
                    </span>
                    {feature.content}
                  </li>
                ))}
              </ul>
              <div
                onClick={() => {
                  updateAllValues(false);
                  updateCurrPackValue(pack.id, true);
                  setPreferedSelectedPackage(pack.id);
                  setValue('prefered_package_id', pack.id.toString());
                }}
                className={`packageBtn ${
                  preferedSelectedPackage === pack.id
                    ? 'selectedPackageBtn'
                    : 'notSelectedPackageBtn'
                }`}
              >
                {preferedSelectedPackage === pack.id ? 'Selected' : 'Select'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
