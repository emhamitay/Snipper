import React from 'react';


function ErrorMessage({children} : {children:React.ReactNode}) {
  return (
    <>
      <p className="text-xs text-red-500">{children}</p>
    </>
  );
};

export default ErrorMessage;