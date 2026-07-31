// App.jsx
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './index.css'
import './App.css'
import Manager from './components/Manager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className='flex-grow pb-32 sm:pb-24'>
        <Manager/>
      </div>
      <Footer/>
    </div>
  )
}

export default App