import React, { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

const ToastContext = createContext({
    notifySuccess: (message: string) => {},
    notifyError: (message: string) => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const notifySuccess = (message: string) => toast.success(message);
    const notifyError = (message: string) => toast.error(message);

    return (
        <ToastContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
