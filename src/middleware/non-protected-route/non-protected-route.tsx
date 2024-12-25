import React from 'react';
import { Navigate } from 'react-router-dom';

const NonProtectedRoute = ({ children }:{ children: React.ReactNode }) => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Nếu token tồn tại, chuyển hướng tới Dashboard
        return <Navigate to="/" replace/>;
    }

    // Nếu không có token, cho phép truy cập vào trang hiện tại
    return <>{children}</>;
};

export default NonProtectedRoute;
