import HttpService from 'api-request/http/http';
import { useToast } from 'context/toast-context/toast-context';
import React from 'react'

interface Props{
    closeModal:()=>void,
    idResearch:string,
    refreshResearchList:() => Promise<void>
}

const DeleteModal = ({closeModal, idResearch, refreshResearchList}:Props) => {
    const { notifyError, notifySuccess } = useToast();

    const deleteResearch= async () => {
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const res = await apiClient.delete(`/research/${idResearch}`);
            const data=await res.json();
            const message=data.message;

            if(res.ok){
                notifySuccess(message);
                refreshResearchList();
            }
            else{
                notifyError(message);
            }
        }
        catch(err:any){
            console.log("Error delete research: "+err.message);
            notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
        }
    }

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed flex top-0 right-0 left-0 z-50 justify-center items-center bg-black/65 w-full md:inset-0 h-full max-h-full">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                            <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold text-gray-900" id="modal-title">Deactivate research</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Are you sure you want to deactivate your research? All of your data will be permanently removed. This action cannot be undone.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                            event.preventDefault();
                            deleteResearch();
                            closeModal();
                        }}>
                            Deactivate
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                            event.preventDefault();
                            closeModal();
                        }}>
                            Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
