import React from 'react';
import { Navigate } from 'react-router-dom';
import { getDecodedToken } from 'utils/get-decoded-token/get-decoded-token';

const ProtectedAdminRoute = ({ children }:{ children: React.ReactNode }) => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // Nếu token tồn tại, chuyển hướng tới Dashboard
        return <Navigate to="/login" replace/>;
    }
    else{
        const decodedToken = getDecodedToken(token);
        if(decodedToken?.role!=='admin'){
            return <Navigate to="/login" replace/>;
        }
    }

    // Nếu không có token, cho phép truy cập vào trang hiện tại
    return <>{children}</>;
};

export default ProtectedAdminRoute;
