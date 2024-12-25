import HttpService from 'api-request/http/http';
import Header from 'components/header/header'
import { useGlobalContext } from 'context/global-context/global-context';
import { useToast } from 'context/toast-context/toast-context';
import { User } from 'data-model/user/user';
import React, { useEffect, useState } from 'react'
import { getDecodedToken } from 'utils/get-decoded-token/get-decoded-token';

const EditProfile = () => {
    const {user, setOptionSearch, setUser}=useGlobalContext();
    console.log(user)
    const { notifyError, notifySuccess } = useToast();

    const [name, setName]=useState<string>(user?user.name:"");
    const [imageUrl, setImageUrl] = useState<string | undefined>(user?.image?user?.image:"http://localhost:5000/upload/user/user-image.jpg");
    const [file, setFile]=useState<File | undefined>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value); // Cập nhật giá trị khi người dùng nhập
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);

            // Tạo URL tạm thời cho file
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const apiClient = new HttpService("http://localhost:5000");
        const bodyData = new FormData();

        bodyData.append('name', name);
        if (file) {
            bodyData.append('file', file);
        }

        const res = await apiClient.put(`/user/update`, bodyData);

        const data=await res.json();
        const message=data.message;
        if(!res.ok){
            notifyError(message);
        }
        else{
            notifySuccess(message);

            localStorage.setItem('token', data.token);

            const decodedToken = getDecodedToken(data.token);
            const user:User={
                id: decodedToken?.id ?? "",
                name:decodedToken?.name ?? "",
                image:decodedToken?.image ?? "",
                email:decodedToken?.email ?? "",
                role:decodedToken?.role ?? ""
            }
            setImageUrl(decodedToken?.image?decodedToken?.image:"http://localhost:5000/upload/user/user-image.jpg")
            setUser(user);
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
                                    Profile
                                </h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center">
                                        <div style={{backgroundImage: `url(${imageUrl})`}}
                                        className={`mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}>
                                            <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                                                <input type="file" name="profile" id="upload_profile" hidden onChange={handleFileChange}></input>

                                                <label htmlFor="upload_profile">
                                                    <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none"
                                                        stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                                        </path>
                                                    </svg>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 justify-center w-full mt-4">
                                        <div className="w-full">
                                            <label htmlFor="" className="mb-2">Name</label>
                                            <input type="text" value={name} onChange={handleChange}
                                                className="mt-2 px-4 py-2 md:p-4 w-full border-2 rounded-lg"
                                                placeholder="Name"></input>
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="">Email</label>
                                            <input
                                                disabled={true}
                                                value={user?.email}
                                                type="text"
                                                className="mt-2 px-4 py-2 md:p-4 w-full border-2 rounded-lg"
                                                placeholder="Email">
                                            </input>
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

export default EditProfile
