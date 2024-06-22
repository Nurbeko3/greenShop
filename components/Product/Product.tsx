import React, { useState } from 'react'
import { LikeIcon, OrderBasket, SearchIcon } from '@/assets/fonts/Icon';
import axios from 'axios';
import { URL } from '@/service/request';
import { StaticImg } from '../StaticImg';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface ProductType {
  item: any,
  setRefresh: (value: boolean) => void,
  refresh: boolean,
}

export const Product: React.FC<ProductType> = ({ item, setRefresh, refresh }) => {
  const handleLikeClick = (id: string) => {
    axios.post(`${URL}/like/${id}`, {}, {
      headers: {
        "Authorization": "Bearer " + window.localStorage.getItem("token")
      }
    }).then(res => {
      toast.success("Sevimlilarga qo'shildi!")
      setRefresh(!refresh)
    })
  }

  const handleBasketClick = (id: string) => {
    axios.post(`${URL}/basket`, {
      productId: id
    }, {
      headers: {
        "Authorization": "Bearer " + window.localStorage.getItem("token") 
      }
    }).then(res => {
      toast.success("Maxsulot saqlandi!")
      setRefresh(!refresh);
    }).catch(error => {

      console.error('Basket request error:', error);
    });
  }


  return (
    <li className='inline-block w-[258px]'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='bg-[#FBFBFB] relative overflow-hidden product-img-wrapper pt-[31px] pb-[19px]'>
        <Link href={`/shop/${item?.product_id}`}>
          <StaticImg src={item.image_url ? item.image_url[0] : ""} alt='Product Img' width={250} height={250} />
        </Link>
        <ul className='flex space-x-[10px] absolute duration-300 product-list-icons justify-center left-0 right-0 -bottom-[40px] mx-auto'>
          <li onClick={() => handleBasketClick(item.product_id)} className={`${item.basket ? "text-green-500" : "text-slate-600"}  w-[35px] h-[35px] cursor-pointer bg-[#FFFFFF] rounded-md flex items-center justify-center`}>
            <OrderBasket />
          </li>
          <li onClick={() => handleLikeClick(item.product_id)} className={`w-[35px] h-[35px] bg-[#FFFFFF] rounded-md flex items-center justify-center cursor-pointer ${item.liked ? "text-red-500" : "text-slate-600"}`}>
            <LikeIcon />
          </li>
          <li className='w-[35px] h-[35px] bg-[#FFFFFF] rounded-md flex items-center justify-center'>
            <SearchIcon />
          </li>
        </ul>
      </div>
      <h2 className='text-[16px] leading-[16px] text-[#3D3D3D] mt-[12px] mb-[6px]'>{item.product_name}</h2>
      <p className='text-[#46A358] text-[18px] leading-[16px] font-bold'>{item.cost}</p>
    </li>
  )
}

