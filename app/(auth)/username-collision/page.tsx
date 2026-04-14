import React from 'react';


function UsernameCollision({children} : {children:React.ReactNode}) {
    console.log('username collision page');
  return (
    <>
      {children}
    </>
  );
};

export default UsernameCollision;