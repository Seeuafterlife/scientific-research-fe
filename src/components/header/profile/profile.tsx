import { useGlobalContext } from 'context/global-context/global-context';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const {user, setUser}=useGlobalContext();
    const navigate = useNavigate();

    const [isOpenMenu, setIsOpenMenu]=useState<boolean>(false);

    const openMenu=()=>{
        setIsOpenMenu((prev)=>!prev)
    }

    const signOut=()=>{
        localStorage.removeItem('token');
        setUser(null);
        navigate("/research");
    }

    const gotoSignIn=()=>{
        navigate("/login");
    }

    if(!user){
        return (
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
            text-[12px] md:text-sm px-2 py-1  md:px-5 md:py-2.5 me-2 mb-2 w-1/5 md:w-[7rem] mt-2 md:mt-0"
            onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                event.preventDefault();
                gotoSignIn();
            }}>
                Sign In
            </button>
        )
    }
    else{
        return (
            <div className='relative'>
                <button type='button'
                onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                    event.preventDefault();
                    openMenu();
                }}>
                    <img data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start"
                    className="w-10 h-10 rounded-full cursor-pointer" src={user.image?user.image:"http://localhost:5000/upload/user/user-image.jpg"} alt="User dropdown"
                    ></img>
                </button>

                {isOpenMenu &&  (
                    <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-64 absolute top-3 -left-60 md:-left-72">
                        <div className="px-4 py-3 text-sm text-gray-900">
                            <div>{user.name}</div>
                            <div className="font-medium truncate">{user.email}</div>
                        </div>

                        <ul className="py-2 text-sm text-gray-700">
                            <li>
                                <a href='/profile/edit-profile' className="block px-4 py-2 hover:bg-gray-100">Edit Profile</a>
                            </li>
                            <li>
                                <a href='/profile/change-password' className="block px-4 py-2 hover:bg-gray-100">Change Password</a>
                            </li>
                            <li>
                                <a href='/research/favorite-research' className="block px-4 py-2 hover:bg-gray-100">Favorite Research</a>
                            </li>
                        </ul>

                        <div className="py-1">
                            <button
                                onClick={(event: React.MouseEvent<HTMLButtonElement>)=>{
                                    event.preventDefault();
                                    signOut();
                                }}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Profile
