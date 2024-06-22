"use client";

import { usePathname } from 'next/navigation';
import React from 'react'

 const layout = ({children}:any) => {
  const pathname = usePathname()
  return (
    <div className='container mx-auto'>
      <h2 className='mt-5'>Home / Shop {pathname.includes("order") ? " / Shopping Cart" : ""}</h2>
      {children}
    </div>
  )
}
export default layout