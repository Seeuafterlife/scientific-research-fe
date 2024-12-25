import { ResearchDto } from 'data-model/research/research-dto'
import React from 'react'
import { formatDateTime } from 'utils/format-date-time/format-date-time'
import { FaUserCheck } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { MdOutlineFindInPage } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import HttpService from 'api-request/http/http';
import { useGlobalContext } from 'context/global-context/global-context';
import { useToast } from 'context/toast-context/toast-context';

interface Props{
    research:ResearchDto
}

const ResearchItem: React.FC<Props> = ({research}) => {
    const {user, refreshResearchList}=useGlobalContext();
    const { notifyError, notifySuccess } = useToast();

    const processRating=async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const body={
                research: research._id,
                user: user?.id,
            }
            const res = await apiClient.post(`/rating`,body);

            const data=await res.json();
            const message=data.message;
            if(!res.ok){
                notifyError(message);
            }
            else{
                notifySuccess(message);
                refreshResearchList();
            }
        }
        catch(e) {
            notifyError("Lỗi server. Vui lòng liên hệ quản trị viên!")
        }
    }

    return (
        <div className='flex flex-col md:flex-row w-full border rounded-md shadow-gray-600 border-gray-300 p-4 gap-5 h-[40rem] md:h-[15rem]'>
            <div className='w-full md:w-[20%] h-[15rem] md:h-full'>
                <img className="w-full h-full rounded-lg" src={research.image} alt="image description"></img>
            </div>

            <div className='flex flex-col w-full md:w-[70%]'>
                <a
                    href={`/research/${research._id}`} // Đường dẫn động dựa trên ID nghiên cứu
                    className="text-base md:text-2xl font-bold font-serif text-slate-900 hover:underline"
                >
                    {research.title}
                </a>
                <p className='text-sm text-gray-400 flex flex-row gap-2 justify-start items-center'><FaUserCheck/> {research.author}</p>
                <p className='text-sm text-gray-400 flex flex-row gap-2 justify-start items-center'><BsCalendar2DateFill /> {formatDateTime(research.createdAt)}</p>
                <p className='pt-4 text-sm md:text-base'>{research.abstract}</p>
            </div>

            <div className='w-full md:w-[7%] flex flex-row md:flex-col justify-between items-center gap-5'>
                <div className='w-1/2 md:w-3/4'>
                    <button type="button" className="py-2.5 px-5 me-2 md:mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg
                    border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 w-full md:h-10 flex"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                        event.preventDefault();
                        processRating();
                    }}>
                        <FaStar className={`size-5 inline-block pr-1 ${research.isRating?"fill-yellow-600 stroke-yellow-600":""}`}/> {research.rating}
                    </button>
                </div>

                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br
                    focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                    w-1/2 md:w-full md:h-10 flex"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                        event.preventDefault();
                        window.open(research.source, "_blank", "noopener,noreferrer");
                    }}>
                        <MdOutlineFindInPage className='size-5 inline-block pr-[2px]'/> Page
                </button>
            </div>
        </div>
    )
}

export default ResearchItem
