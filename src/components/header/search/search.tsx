import HttpService from 'api-request/http/http';
import { useGlobalContext } from 'context/global-context/global-context';
import React, { useState } from 'react'

const Search: React.FC = () => {
    const {setResearchList, valueSearch, setValueSearch, setFavoriteResearchList, optionSearch}=useGlobalContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueSearch(event.target.value); // Cập nhật giá trị khi người dùng nhập
    };

    const getResearchListByTitle=async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const query=valueSearch?`?title=${valueSearch}`:''
            if(optionSearch===1){
                const res = await apiClient.get(`/research/search${query}`);
                const data=await res.json();

                if(res.ok){
                    setResearchList(data);
                }
                else{
                    console.error("Error fetching data:", data.message);
                }
            }
            else{
                const res = await apiClient.get(`/research/favorite-research${query}`);
                const data=await res.json();

                if(res.ok){
                    setFavoriteResearchList(data);
                }
                else{
                    console.error("Error fetching data:", data.message);
                }
            }
        }
        catch(error){
            console.error("Error fetching data:", error);
        }
    }

    return (
        <form className="w-60 md:w-96 mx-auto">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="h-2 w-2 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-2 md:py-4 md:px-10 ps-10 text-sm text-gray-900 border-2 border-gray-300 rounded-lg
                bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" placeholder="Search research" required
                onChange={handleChange}/>

                <button type="submit" className="text-white absolute end-2.5 bottom-[0.35rem] md:bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                focus:ring-blue-300 font-medium rounded-lg text-[12px] md:text-sm px-2 py-1 md:px-4 md:py-2"
                onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                    event.preventDefault();
                    getResearchListByTitle();
                }}>
                    Search
                </button>
            </div>
        </form>
    )
}

export default Search
