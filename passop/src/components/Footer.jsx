// Footer.jsx
import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full py-4'>
            <div className="logo font-bold text-white text-xl sm:text-2xl">
                <span className='text-green-500'> &lt;</span>
                <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
            </div>
            <div className='flex justify-center items-center text-sm sm:text-base px-4 text-center'>
                Created with <img className='w-5 sm:w-7 mx-2' src="/icons/heart.png" alt="" />by Rohan Mendon
            </div>
        </div>
    )
}

export default Footer