import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/footer/footer';
import { GlobalProvider } from './context/global-context/global-context';
import { ToastProvider } from 'context/toast-context/toast-context';
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalProvider>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </GlobalProvider>
        </BrowserRouter>
        <Footer></Footer>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
