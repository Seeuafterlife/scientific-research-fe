import React, { useEffect, useState } from "react";
import Logo from "../../../components/logo/logo";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "context/toast-context/toast-context";
import { UserLogin } from "data-model/auth/login/user-login";
import HttpService from "api-request/http/http";
import { useGlobalContext } from "context/global-context/global-context";
import { getDecodedToken } from "utils/get-decoded-token/get-decoded-token";
import { User } from "data-model/user/user";
import { useNavigate } from "react-router-dom";

const apiClient = new HttpService("http://localhost:5000");

const Login: React.FC = () => {
    const { notifyError } = useToast();
    const {setUser}=useGlobalContext();
    const navigate = useNavigate();

    const [isRemember, setIsRemember] =useState<boolean>(true);

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const handleClickPassword = () => {
        setHidePassword((prev)=>!prev)
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemember = ()=>{
        setIsRemember((prev)=>!prev);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const userLogin:UserLogin={
                email: formData.email,
                password: formData.password
            }

            const res = await apiClient.post("/user/login", userLogin);

            if(!res.ok){
                const data=await res.json();
                notifyError(data.message);
            }
            else{
                if(isRemember){
                    localStorage.setItem('email', formData.email);
                    localStorage.setItem('password', formData.password);
                }
                else{
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                }

                const data=await res.json();

                localStorage.setItem('token', data.token);

                const decodedToken = getDecodedToken(data.token);
                const user:User={
                    id: decodedToken?.id ?? "",
                    name:decodedToken?.name ?? "",
                    image:decodedToken?.image ?? "",
                    email:decodedToken?.email ?? "",
                    role:decodedToken?.role ?? ""
                }
                setUser(user);

                if(user.role === "admin"){
                    navigate("/dashboard");
                }
                else{
                    navigate("/research");
                }
            }
        }
        catch(e) {
            notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");

        setFormData({
            email: savedEmail || "",
            password: savedPassword || "",
        });
    }, [])

    return (
        <div className="font-[sans-serif] relative">
            <div className="absolute top-5 left-5">
                <Logo></Logo>
            </div>


            <div className="h-[calc(100vh-56px)] flex items-center justify-center py-6 px-4">

                    <form className="w-[30rem]" onSubmit={handleSubmit}>
                        <div className="mb-12">
                            <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                        </div>

                        <div>
                            <label className="text-gray-800 text-xs block mb-2">Email</label>
                            <div className="relative flex items-center">
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                    placeholder="Enter email">
                                </input>

                                <MdEmail className="w-[18px] h-[18px] absolute right-2"/>
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="text-gray-800 text-xs block mb-2">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    value={formData.password}
                                    type={hidePassword?"password":"text"}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                                    placeholder="Enter password">
                                </input>

                                <button type="button" onClick={handleClickPassword}>
                                    {!hidePassword?(
                                        <FaEye className="w-[18px] h-[18px] absolute right-2 cursor-pointer"/>
                                    ):(
                                        <FaEyeSlash className="w-[18px] h-[18px] absolute right-2 cursor-pointer"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    checked={isRemember}
                                    onChange={handleRemember}
                                    type="checkbox"
                                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                </input>
                                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <a href="jajvascript:void(0);" className="text-blue-600 font-semibold text-sm hover:underline">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-12 mb-12">
                            <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                Sign in
                            </button>
                        </div>

                        <div className="w-full h-[1px] bg-black ">
                        </div>

                        <p className="text-sm mt-4 text-gray-800">
                            Don't have an account
                            <a href="/register" className="text-blue-600 font-semibold hover:underline ml-1">Register here</a>
                        </p>
                    </form>
                </div>
        </div>
    );
};

export default Login;
