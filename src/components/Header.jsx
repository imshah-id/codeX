import React from 'react'

const Header = () => {
  return (
    <header className='flex flex-col items-center'>
        <h1 className='md:text-4xl text-xl font-bold pt-14 text-gray-900'>Master Programming Languages</h1>
        <p className=' md:text-2xl text-xl text-center text-gray-500 p-4 w-[80%]'>Learn through interactive exercises, challanges, and projects. Track your progress and become a better programmer</p>
      
    </header>
  )
}

export default React.memo(Header)