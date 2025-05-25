import React, { useEffect, useState } from 'react';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UserVirificationFormSec from '../../components/userVirificationForm/UserVirificationFormSec';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';

export default function UserVirificationSec({token}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  return (
    <>
      {
        loading ?
          <MyNewLoader />
          :
          <UserVirificationFormSec token={token} />
      }
    </>
  );
}
