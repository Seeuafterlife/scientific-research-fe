import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/header/header'

const ResearchLayout: React.FC = () => {
    return (
        <div className='h-[calc(100vh-56px)] flex flex-col px-2 md:px-10 py-5 gap-10'>
            <Header></Header>

            <div className='h-[calc(100vh-56px)] px-2 md:px-60'>
                <Outlet />
            </div>
        </div>
    )
}

export default ResearchLayout
