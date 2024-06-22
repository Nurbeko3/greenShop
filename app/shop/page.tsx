import Image from 'next/image'
import React from 'react'

function page() {
  return (
    <div className='container pt-5'>
      <Image src={'/shoppage.png'} width={1200} height={449} alt="shop"/>
    </div>
  )
}

export default page