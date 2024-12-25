import React from 'react'
import Logo from '../logo/logo'
import Search from './search/search'
import Profile from './profile/profile'
import { useGlobalContext } from 'context/global-context/global-context'

const Header: React.FC = () => {
    const {optionSearch}=useGlobalContext();

    return (
        <div className='flex flex-row md:flex-none justify-between items-center gap-2'>
            <Logo></Logo>

            {optionSearch>0?(
                <Search></Search>
            ):(
                <div className='w-60 md:w-96'></div>
            )}

            <Profile></Profile>
        </div>
    )
}

export default Header
