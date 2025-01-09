import HttpService from 'api-request/http/http';
import { useToast } from 'context/toast-context/toast-context';
import { ResearchFormData } from 'data-model/research/research-form-data';
import React, { useEffect, useState } from 'react'

interface Props{
    closeModal:()=>void,
    idResearch:string,
    refreshResearchList:() => Promise<void>
}

const ResearchModal = ({closeModal, idResearch, refreshResearchList}:Props) => {
    const { notifyError, notifySuccess } = useToast();
    const [isCreate]=useState<boolean>(idResearch==='');
    const [isChangeData, setIsChangeData]=useState<boolean>(false);

    const [formData, setFormData] = useState<ResearchFormData>({
        title: "",
        abstract: "",
        description: "",
        author:"",
        source:"",
        file: null,
    });

    const isFormDataValid = (): boolean => {
        return (
            formData.title.trim() !== "" &&
            formData.abstract.trim() !== "" &&
            formData.description.trim() !== "" &&
            formData.author.trim() !== "" &&
            formData.source.trim() !== "" &&
            formData.file !== null
        );
    };

    // State để lưu URL của ảnh đã chọn
  const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setIsChangeData(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData({ ...formData, file: file });

            // Tạo URL tạm thời cho file
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);

            setIsChangeData(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const apiClient = new HttpService("https://scientific-research-be1.vercel.app/");
            const bodyData = new FormData();

            bodyData.append('title', formData.title);
            bodyData.append('abstract', formData.abstract);
            bodyData.append('description', formData.description);
            bodyData.append('author', formData.author);
            bodyData.append('source', formData.source);
            if (formData.file) {
                bodyData.append('file', formData.file);
            }

            let res;
            if(idResearch){
                res = await apiClient.put(`/research/${idResearch}`, bodyData);
            }
            else{
                res = await apiClient.post("/research", bodyData);
            }

            const data=await res.json();
            const message=data.message;
            if(!res.ok){
                notifyError(message);
            }
            else{
                notifySuccess(message);
                refreshResearchList();
            }

            closeModal();
        }
        catch(e) {
            notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
        }
    };

    const getResearch= async ()=>{
        try{
            const apiClient = new HttpService("https://scientific-research-be1.vercel.app/");

            const res = await apiClient.get(`/research/${idResearch}`);
            const data=await res.json();

            if(res.ok){
                setFormData({
                    title: data.title,
                    abstract: data.abstract,
                    description: data.description,
                    author: data.author,
                    source: data.source,
                    file: null,
                });

                setPreviewImage(data.image);
            }
            else{
                console.error("Error fetching data:", data.message);
            }
        }
        catch(error){
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        console.log(idResearch)
        if(idResearch){
            getResearch();
        }
    },[setFormData, setPreviewImage])


    return (
        <div className="overflow-y-auto overflow-x-hidden fixed flex top-0 right-0 left-0 z-50 justify-center items-center bg-black/65 w-full md:inset-0 h-full max-h-full">
            <div className="relative p-4 w-full max-w-lg max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isCreate?"Create New Research":"Update Research"}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent
                        hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                            event.preventDefault();
                            closeModal();
                        }}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                                <input type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    id="title"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required>
                                </input>
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="abstract" className="block mb-2 text-sm font-medium text-gray-900">Abstract</label>
                                <input
                                    id="abstract"
                                    name='abstract'
                                    value={formData.abstract}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required>
                                </input>
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="abstract" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                <input
                                    id="description"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required>
                                </input>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Author</label>
                                <input
                                    id="author"
                                    name='author'
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required>
                                </input>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Source</label>
                                <input
                                    id="source"
                                    name='source'
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required>
                                </input>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-center w-full">
                                    {previewImage?(
                                        <label htmlFor="dropzone-file" className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg cursor-pointer'>
                                            <img
                                                className="h-full w-full rounded-lg"
                                                src={previewImage}
                                                alt="image description"></img>
                                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange}/>
                                        </label>
                                    ):(
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">
                                                        Click to upload
                                                    </span>
                                                    or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} required/>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end pt-4'>
                            <button
                                type="submit"
                                disabled={isCreate?!isFormDataValid():!isChangeData}
                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 hover:cursor-pointer focus:ring-4 focus:outline-none
                                focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                {isCreate?"Add New Research":"Update Research"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResearchModal
