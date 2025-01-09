import HttpService from 'api-request/http/http';
import Header from 'components/header/header'
import { useGlobalContext } from 'context/global-context/global-context';
import { useToast } from 'context/toast-context/toast-context';
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
    const {setOptionSearch}=useGlobalContext();
    const { notifyError, notifySuccess } = useToast();

    const [hideOldPassword, setHideOldPassword] = useState<boolean>(true);
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

    const [formData, setFormData] = useState({
        oldPassword:"",
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

    const handleClickOldPassword = () => {
        setHideOldPassword((prev)=>!prev)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(formData.password!==formData.confirmPassword){
            notifyError("Mật khẩu không khớp");
        }
        else{
            try{
                const userCreate={
                    oldPassword: formData.oldPassword,
                    password: formData.password,
                }

                const apiClient = new HttpService("https://scientific-research-be1.vercel.app/");
                const res = await apiClient.put("/user/change-password", userCreate);

                const data=await res.json();
                const message=data.message;
                console.log(message)
                if(!res.ok){
                    notifyError(message);
                }
                else{
                    notifySuccess(message)
                }
            }
            catch(e) {
                notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
            }
        }
    }

    useEffect(() => {
        setOptionSearch(0);
    }, [setOptionSearch])

    return (
        <div className='h-[calc(100vh-56px)] flex flex-col px-2 md:px-10 py-5 gap-10'>
            <Header></Header>

            <div className='h-[calc(100vh-56px)] md:px-60'>
                <section className="py-10 my-auto">
                    <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
                        <div className="lg:w-[40%] md:w-[40%] sm:w-[40%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center">
                            <div className="">
                                <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2">
                                    Change Password
                                </h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-2 justify-center w-full mt-4">
                                        <div className="w-full">
                                            <label htmlFor="oldPassword" className="mb-2">Password</label>
                                            <div className='relative'>
                                                <input
                                                name="oldPassword"
                                                    type={hideOldPassword?"password":"text"}
                                                    value={formData.oldPassword} onChange={handleChange}
                                                    className="mt-2 px-4 py-2 md:p-4 w-full border-2 rounded-lg"></input>

                                                <button type="button" onClick={handleClickOldPassword} className='absolute right-4 top-[40%] md:top-[50%] cursor-pointer'>
                                                    {!hideOldPassword?(
                                                        <FaEye className="w-[18px] h-[18px]"/>
                                                    ):(
                                                        <FaEyeSlash className="w-[18px] h-[18px]"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="password" className="mb-2">New Password</label>
                                            <div className='relative'>
                                                <input
                                                    name="password"
                                                    type={hidePassword?"password":"text"}
                                                    value={formData.password} onChange={handleChange}
                                                    className="mt-2 px-4 py-2 md:p-4 w-full border-2 rounded-lg"></input>

                                                <button type="button" onClick={handleClickPassword} className='absolute right-4 top-[40%] md:top-[50%] cursor-pointer'>
                                                    {!hidePassword?(
                                                        <FaEye className="w-[18px] h-[18px]"/>
                                                    ):(
                                                        <FaEyeSlash className="w-[18px] h-[18px]"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="confirmPassword" className="mb-2">Confirm Password</label>
                                            <div className='relative'>
                                                <input
                                                name="confirmPassword"
                                                    type={hideConfirmPassword?"password":"text"}
                                                    value={formData.confirmPassword} onChange={handleChange}
                                                    className="mt-2 px-4 py-2 md:p-4 w-full border-2 rounded-lg"></input>

                                                <button type="button" onClick={handleClickConfirmPassword} className='absolute right-4 top-[40%] md:top-[50%] cursor-pointer'>
                                                    {!hideConfirmPassword?(
                                                        <FaEye className="w-[18px] h-[18px]"/>
                                                    ):(
                                                        <FaEyeSlash className="w-[18px] h-[18px]"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                                        <button type="submit" className="w-full px-4 py-2 md:p-4">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ChangePassword
