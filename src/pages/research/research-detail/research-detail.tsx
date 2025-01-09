import HttpService from 'api-request/http/http';
import { ResearchDto } from 'data-model/research/research-dto'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { formatDateTime } from 'utils/format-date-time/format-date-time';
import { MdOutlineFindInPage } from "react-icons/md";
import { useGlobalContext } from 'context/global-context/global-context';

const ResearchDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [research, setResearch]=useState<ResearchDto | null>(null);
    const {setOptionSearch}=useGlobalContext();

    const getResearch= async ()=>{
        try{
            const apiClient = new HttpService("https://scientific-research-be1.vercel.app/");

            const res = await apiClient.get(`/research/${id}`);
            const data=await res.json();

            if(res.ok){
                setResearch(data);
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
        getResearch();
        setOptionSearch(0);
    },[setResearch])

    return (
        <div className='h-[30rem] md:h-[45rem] overflow-y-auto scrollbar-hide'>
            <h1 className='text-5xl font-serif font-bold text-slate-600 pb-2'>{research?.title}</h1>

            <p className='text-base text-gray-400 flex flex-row gap-2 justify-start items-center'><FaUserCheck/> {research?.author}</p>

            <p className='text-base text-gray-400 flex flex-row gap-2 justify-start items-center'>
                <BsCalendar2DateFill /> {formatDateTime(research?.createdAt)}
            </p>

            <p className='py-4'>{research?.description}</p>

            <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br
                focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                w-24 h-10 flex"
                onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                    event.preventDefault();
                    window.open(research?.source, "_blank", "noopener,noreferrer");
                }}>
                    <MdOutlineFindInPage className='size-5 inline-block pr-[2px]'/> Page
            </button>
        </div>
    )
}

export default ResearchDetail
