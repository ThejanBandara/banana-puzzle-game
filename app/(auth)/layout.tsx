import Image from 'next/image';
import React from 'react'

const AuthLayout = ({  children,}: Readonly<{  children: React.ReactNode;}> ) => {
  return (
    <div>
      <Image src={'/bg1.jpg'} alt="Background" fill style={{ objectFit: "cover" }} className='-z-20' />
      <div className='w-full h-screen bg-gray-800/50 absolute -z-10'></div>
      {children}
    </div>
  )
}

export default AuthLayout
