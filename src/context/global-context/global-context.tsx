import HttpService from "api-request/http/http";
import { ResearchDto } from "data-model/research/research-dto";
import { User } from "data-model/user/user";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { getDecodedToken } from "utils/get-decoded-token/get-decoded-token";

// Định nghĩa kiểu dữ liệu cho Global Context
interface GlobalContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    researchList:ResearchDto[] | null,
    setResearchList:(researchList:ResearchDto[] | null) => void;
    favoriteResearchList:ResearchDto[] | null,
    setFavoriteResearchList:(researchList:ResearchDto[] | null) => void;
    refreshResearchList:()=>Promise<void>;
    optionSearch:number;
    setOptionSearch:(option:number) => void;
    valueSearch:string;
    setValueSearch:(value:string) => void;
}

// Tạo Context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Tạo Provider
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(()=>{
        const token:string | null=localStorage.getItem("token");
        if(!token)
            return null;

        const decodedToken = getDecodedToken(token);
        const user:User={
            id: decodedToken?.id ?? "",
            name:decodedToken?.name ?? "",
            image:decodedToken?.image ?? "",
            email:decodedToken?.email ?? "",
            role:decodedToken?.role ?? ""
        }

        return user;
    });

    const [researchList, setResearchList]=useState<ResearchDto[] | null>([])

    const [favoriteResearchList, setFavoriteResearchList]=useState<ResearchDto[] | null>([])

    const refreshResearchList=async ()=>{
        try{
            const apiClient = new HttpService("http://localhost:5000");

            const query=valueSearch?`?title=${valueSearch}`:'?title='

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

    const [optionSearch, setOptionSearch]=useState<number>(1);

    const [valueSearch, setValueSearch]=useState<string>('')

    return (
        <GlobalContext.Provider value={{
            user, setUser, researchList, setResearchList, refreshResearchList,
            optionSearch, setOptionSearch, favoriteResearchList, setFavoriteResearchList, valueSearch, setValueSearch }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Hook tiện ích để sử dụng GlobalContext
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};
