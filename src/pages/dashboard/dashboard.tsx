import Logo from 'components/logo/logo'
import React, { useEffect, useState } from 'react'
import { LuPackage } from "react-icons/lu";
import { IoIosTrendingUp } from "react-icons/io";
import ResearchModal from "components/modal/research-modal/research-modal";
import HttpService from 'api-request/http/http';
import { ResearchDto } from 'data-model/research/research-dto';
import { CiStar } from "react-icons/ci";
import { formatDateTime } from 'utils/format-date-time/format-date-time';
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteModal from 'components/modal/delete-modal/delete-modal';
import { useGlobalContext } from 'context/global-context/global-context';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const {setUser}=useGlobalContext();
    const navigate = useNavigate();

    const [isOpenResearchModal, setIsOpenResearchModal]=useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal]=useState<boolean>(false);
    const [idResearch, setIdResearch]=useState<string>("");

    const [researchList, setResearchList]=useState<ResearchDto[] | null>(null)

    const openResearchModal=()=>{
        setIsOpenResearchModal((prev)=>!prev);

        if(isOpenResearchModal)
            setIdResearch("");
    }

    const openDeleteModal=()=>{
        setIsOpenDeleteModal((prev)=>!prev);

        if(isOpenDeleteModal)
            setIdResearch("")
    }

    const getInit =async () => {
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const res = await apiClient.get("/dashboard");
            const data=await res.json();

            if(res.ok){
                setResearchList(data.research);
            }
            else{
                console.error("Error fetching data:", data.message);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const refreshResearchList = async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const res = await apiClient.get("/research/all");
            const data=await res.json();

            if(res.ok){
                setResearchList(data);
            }
            else{
                console.error("Error fetching data:", data.message);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const signOut=()=>{
        localStorage.removeItem('token');
        setUser(null);
        navigate("/research");
    }

    useEffect(() => {
        getInit();
    }, [setResearchList]);

    return (
        <>
            {isOpenResearchModal && (
                <ResearchModal
                    closeModal={openResearchModal}
                    idResearch={idResearch}
                    refreshResearchList={refreshResearchList}
                />
            )}

            {isOpenDeleteModal && (
                <DeleteModal
                    closeModal={openDeleteModal}
                    idResearch={idResearch}
                    refreshResearchList={refreshResearchList}
                />
            )}

            <div className="font-[sans-serif] flex flex-col">
                <div className="flex justify-between px-1 md:px-10 py-5">
                    <Logo></Logo>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
                    text-[12px] md:text-sm px-2 py-1  md:px-5 md:py-2.5 me-2 mb-2 w-1/5 md:w-[7rem] mt-2 md:mt-0"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                        event.preventDefault();
                        signOut();
                    }}>
                        Sign out
                    </button>
                </div>


                <div className="h-[calc(100vh-56px)] flex flex-col px-2 md:px-10 overflow-y-auto scrollbar-hide gap-y-4">
                    <h1 className="title">Dashboard</h1>
                    <div className="card">
                        <div className="card-header justify-between">
                            <p className="card-title">Research</p>
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium
                                rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                                onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                                    event.preventDefault();
                                    openResearchModal();
                                }}>
                                    Create
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="relative h-[400px] md:h-[650px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                                <table className="table">
                                    <thead className="table-header">
                                        <tr className="table-row">
                                            <th className="table-head">#</th>
                                            <th className="table-head">Title</th>
                                            <th className="table-head">Description</th>
                                            <th className="table-head">Author</th>
                                            <th className="table-head">Rating</th>
                                            <th className="table-head">Source</th>
                                            <th className="table-head">Create At</th>
                                            <th className="table-head">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {researchList && researchList.map((research:ResearchDto, index:number) => (
                                            <tr
                                                key={index}
                                                className="table-row"
                                            >
                                                <td className="table-cell">{index+1}</td>
                                                <td className="table-cell">
                                                    <div className="flex w-max gap-x-4">
                                                        <img
                                                            src={research.image}
                                                            alt={research.title}
                                                            className="size-[4.5rem] rounded-lg object-cover"
                                                        />
                                                        <div className="flex flex-col w-[250px]">
                                                            <p className='break-words overflow-y-auto scrollbar-hide h-[1.5rem] font-bold'>{research.title}</p>
                                                            <p className="font-normal text-slate-600 dark:text-slate-400 break-words overflow-y-auto scrollbar-hide h-[3rem]">{research.abstract}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-cell"><p className='w-[600px] break-words overflow-y-auto scrollbar-hide h-[4.5rem]'>{research.description}</p></td>
                                                <td className="table-cell"><p className='w-[250px] break-words overflow-y-auto scrollbar-hide h-[4.5rem]'>{research.author}</p></td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-x-2">
                                                        <CiStar
                                                            size={18}
                                                            className="fill-yellow-600 stroke-yellow-600"
                                                        />
                                                        {research.rating}
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <a href={research.source} className="font-medium text-blue-600 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer">Read more</a>
                                                </td>
                                                <td className="table-cell">{formatDateTime(research.createdAt)}</td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-x-4">
                                                        <button className="text-blue-500 dark:text-blue-600"
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                                                            event.preventDefault();
                                                            setIdResearch(research._id);
                                                            openResearchModal();
                                                        }}>
                                                            <LuPencilLine  size={20} />
                                                        </button>

                                                        <button className="text-red-500"
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                                                            event.preventDefault();
                                                            setIdResearch(research._id);
                                                            openDeleteModal();
                                                        }}>
                                                            <FaRegTrashAlt  size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
