import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-purple-200'>
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14 ">
      <div className="logo font-bold text-xl">Passop</div>
      <ul className='flex gap-4'>
        <li><a className='hover:font-bold transition' href="#">Home</a></li>
        <li><a className='hover:font-bold transition' href="#">About</a></li>
        <li><a className='hover:font-bold transition' href="#">Contact</a></li>
      </ul>
      </div>
    </nav>
  )
}

export default Navbar