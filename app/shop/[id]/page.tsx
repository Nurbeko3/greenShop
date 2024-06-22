"use client"
import { URL } from '@/service/request'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Page = ({ params }: any) => {
  const id = params.id
  const [singleData, setSingleData] = useState<any>({})
  const [activeImg, setActiveImg] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    axios.get(`${URL}/product/${id}`).then(res => {
      setSingleData(res.data)
      setActiveImg(res.data.image_url[0])
    })
  }, [id])

  const handleIncrease = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  if (!singleData) {
    return <div>Loading...</div>
  }

  return (
    
    <div className='container mx-auto pt-[70px] flex gap-10'>
      <div className='flex'>
        <div className='w-[80px] h-[444px] overflow-y-auto flex flex-col gap-2'>
          {singleData?.image_url?.map((item: any, index: number) => (
            <Image 
              key={index} 
              src={item} 
              alt='Product Image' 
              width={100} 
              height={100} 
              className={`cursor-pointer border-[0.5px] ${activeImg === item ? 'border-green-500' : 'border-gray-300'}`} 
              onClick={() => setActiveImg(item)} 
            />
          ))}
        </div>
        <div className='w-[444px] ml-5'>
          <Image 
            src={activeImg} 
            alt='Active Product Image' 
            width={444} 
            height={444} 
            className='shadow-md shadow-green-700' 
          />
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{singleData.product_name}</h1>
          <p className='text-lg font-semibold'>Price: ${singleData.cost}</p>
          <p className='text-lg'><span className='font-semibold'>Product Short description:</span> {singleData.short_description}</p>
          <div className='mt-2'>
            <span className='font-semibold'>Sizes: </span>
            {singleData.size?.map((size: string) => (
              <span key={size} className='ml-2'>{size}</span>
            ))}
          </div>
          <p className='mt-2'><span className='font-semibold'>SKU: </span>{singleData.category_id}</p>
          <p className='mt-2'><span className='font-semibold'>Product Status: </span>{singleData.product_status}</p>
          <p className='mt-2'>
            <span className='font-semibold'>Categories: </span>
            {singleData.categories ? singleData.categories.join(', ') : 'N/A'}
          </p>
          <p className='mt-2'>
            <span className='font-semibold'>Tags: </span>
            {singleData.tags ? singleData.tags.join(', ') : 'N/A'}
          </p>
          <div className='flex items-center mt-4'>
            <button 
              onClick={handleDecrease} 
              className='text-white bg-[#46A358] w-[35px] h-[35px] rounded-full outline-none'
            >
              -
            </button>
            <span className='mx-2 text-lg'>{quantity}</span>
            <button 
              onClick={handleIncrease} 
              className='text-white bg-[#46A358] w-[35px] h-[35px] rounded-full outline-none'
            >
              +
            </button>
          </div>
        </div>
        <a href='https://t.me/Makkalik_Yigit' className='mt-4 bg-green-500 text-center text-white py-2 px-4 rounded outline-none border-[2px] border-[#46A358] hover:text-[#46A358] hover:bg-transparent transition-all'>Buy Now</a>
      </div>
    </div>
  )
}

export default Page
