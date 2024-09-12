import React, { createContext, useState } from 'react';
import SweetAlert2 from 'react-sweetalert2';


// Create Auth Context
export const SweetAlert = createContext();

// Auth Provider Component
export const SweetAlertProvider = ({ children }) => {
    const [swalProps, setSwalProps] = useState({});
    
    return (
        <SweetAlert.Provider value={{ setSwalProps }}>
            {children}
            <SweetAlert2 {...swalProps} />
        </SweetAlert.Provider>
    );
};
