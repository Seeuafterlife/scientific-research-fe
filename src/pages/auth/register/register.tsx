import React, { useState } from "react";
import Logo from "../../../components/logo/logo";
import HttpService from "api-request/http/http";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useToast } from "context/toast-context/toast-context";
import { UserCreate } from "data-model/auth/register/user-create";
import { User } from "data-model/user/user";
import { getDecodedToken } from "utils/get-decoded-token/get-decoded-token";
import { useGlobalContext } from "context/global-context/global-context";
import { useNavigate } from "react-router-dom";

const apiClient = new HttpService("http://localhost:5000");

const Register: React.FC = () => {
    const { notifyError } = useToast();
    const {setUser}=useGlobalContext();
    const navigate = useNavigate();

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword:""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClickPassword = () => {
        setHidePassword((prev)=>!prev)
    };

    const handleClickConfirmPassword = () => {
        setHideConfirmPassword((prev)=>!prev)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(formData.password!==formData.confirmPassword){
            notifyError("Password not match");
        }
        else{
            try{
                const userCreate:UserCreate={
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }

                const res = await apiClient.post("/user/register", userCreate);

                if(!res.ok){
                    const data=await res.json();
                    notifyError(data.message);
                }
                else{
                    const data=await res.json();

                    localStorage.setItem('token', data.token);

                    const decodedToken = getDecodedToken(data.token);
                    const user:User={
                        id: decodedToken?.id ?? "",
                        name:decodedToken?.name ?? "",
                        image:decodedToken?.image?? "",
                        email:decodedToken?.email ?? "",
                        role:decodedToken?.role ?? ""
                    }
                    setUser(user);
                    navigate("/research");
                }
            }
            catch(e) {
                notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
            }
        }
    };


    return (
        <div className="font-[sans-serif] relative">
            <div className="absolute top-5 left-5">
                <Logo></Logo>
            </div>


            <div className="h-[calc(100vh-56px)] flex items-center justify-center py-6 px-4 w-full">
                    <form className="w-[30rem]" onSubmit={handleSubmit}>
                        <div className="mb-12">
                            <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Create an account</h3>
                        </div>

                        <div>
                            <label className="text-gray-800 text-xs block mb-2">Full Name</label>
                            <div className="relative flex items-center">
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent text-sm border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
                                    placeholder="Enter name">
                                </input>

                                <FaUser className="w-[18px] h-[18px] absolute right-2" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="text-gray-800 text-xs block mb-2">Email</label>
                            <div className="relative flex items-center">
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent text-sm border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
                                    placeholder="Enter email">
                                </input>

                                <MdEmail className="w-[18px] h-[18px] absolute right-2"/>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="text-gray-800 text-xs block mb-2">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    type={hidePassword?"password":"text"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent text-sm border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
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
                        <div className="mt-6">
                            <label className="text-gray-800 text-xs block mb-2">Confirm Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="confirmPassword"
                                    type={hideConfirmPassword?"password":"text"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent text-sm border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
                                    placeholder="Enter password">
                                </input>
                                <button type="button" onClick={handleClickConfirmPassword}>
                                    {!hideConfirmPassword?(
                                        <FaEye className="w-[18px] h-[18px] absolute right-2 cursor-pointer"/>
                                    ):(
                                        <FaEyeSlash className="w-[18px] h-[18px] absolute right-2 cursor-pointer"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 mb-12">
                            <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                                Creat an account
                            </button>
                        </div>

                        <div className="w-full h-[1px] bg-black ">
                        </div>

                        <p className="text-sm mt-4 text-gray-800">
                            You have an account
                            <a href="/login" className="text-blue-600 font-semibold hover:underline ml-1">Sign here</a>
                        </p>
                    </form>
                </div>
        </div>
    )
}

export default Register
