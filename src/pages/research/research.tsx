import React, { useEffect } from 'react'
import ResearchItem from '../../components/research-item/research-item'
import { useGlobalContext } from 'context/global-context/global-context';
import { ResearchDto } from 'data-model/research/research-dto';
import HttpService from 'api-request/http/http';

const Research: React.FC = () => {
    const {researchList, setResearchList, setOptionSearch}=useGlobalContext();

    const getResearchList=async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const res = await apiClient.get(`/research/all`);
            const data=await res.json();

            if(res.ok){
                setResearchList(data);
            }
            else{
                console.error("Error fetching data:", data.message);
            }
        }
        catch(error){
            console.error("Error fetching data:", error);
        }
    }

    useEffect(()=>{
        getResearchList();
        setOptionSearch(1);
    }, [setResearchList, setOptionSearch])

    return (
        <div className=''>
            <div className='text-2xl font-semibold pb-4'>
                Trending Research
            </div>

            <div className='flex flex-col gap-5 h-[27rem] md:h-[40rem] overflow-y-auto scrollbar-hide'>
                {researchList && researchList.map((research:ResearchDto, index:number) =>{
                    return (
                        <ResearchItem research={research}></ResearchItem>
                    )
                })}
            </div>
        </div>
    )
}

export default Research
