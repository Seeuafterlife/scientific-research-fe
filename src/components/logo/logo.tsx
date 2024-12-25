import React from 'react'
import { SiResearchgate } from 'react-icons/si'

const Logo: React.FC = () => {
    return (
        <a href='/' className="flex flex-row md:gap-2 w-1/5">
            <SiResearchgate  className="w-9 h-9 text-cyan-500 -mt-2 ml-4 md:mt-0 md:ml-0"/>
            <span className="font-mono text-2xl text-center font-semibold md:pt-1 hidden md:block">SciArchive</span>
        </a>
    )
}

export default Logo
