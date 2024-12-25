import HttpService from 'api-request/http/http';
import ResearchItem from 'components/research-item/research-item';
import { useGlobalContext } from 'context/global-context/global-context';
import { ResearchDto } from 'data-model/research/research-dto';
import React, { useEffect } from 'react'

const FavoriteResearch = () => {
    const {favoriteResearchList, setFavoriteResearchList, user, setOptionSearch}=useGlobalContext();

    const getResearchList=async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const res = await apiClient.get(`/research/favorite-research?title=`);
            const data=await res.json();

            if(res.ok){
                setFavoriteResearchList(data);
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
        setOptionSearch(2);
    }, [setFavoriteResearchList, setOptionSearch])

    return (
        <div className=''>
            <div className='text-2xl font-semibold pb-4'>
                Trending Research
            </div>

            <div className='flex flex-col gap-5 h-[30rem] md:h-[40rem] overflow-y-auto scrollbar-hide'>
                {favoriteResearchList && favoriteResearchList.map((research:ResearchDto, index:number) =>{
                    return (
                        <ResearchItem research={research}></ResearchItem>
                    )
                })}
            </div>
        </div>
    )
}

export default FavoriteResearch
