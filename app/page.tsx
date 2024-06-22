"use client";
import HeroMobileCarusel from "@/components/HeroCarusel/HeroMobileCarusel";
import HeroCarusel from "../components/HeroCarusel";
import RangeSlider from "@/components/RangeSlider";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { URL } from "@/service/request";
import { Product } from "@/components/Product/Product";
import { Pagination, Popover } from "antd";
import Image from "next/image";

interface CategoryType {
   category_id: string;
   category_name: string;
   category_title: string;
}

interface ProductType {
   product_id: string;
   product_name: string;
   cost: string;
   image: string;
}

interface SizeType {
   size_id: number,
   size_name: string;
}

interface TagType {
   tag_id: number;
   tag_name: string;
   path: string | null;
}

function Home() {
   const token = window.localStorage.getItem("token")
   const [arrow, setArrow] = useState<string>('Show');
   const [isLoading, setIsloading] = useState(false);
   const [refresh, setRefresh] = useState<boolean>(false);
   const [page, setPage] = useState<number>(1);
   const [limit, setLimit] = useState<number>(10);

   const [categoryData, setCategoryData] = useState<Array<CategoryType>>([]);
   const sizeData: SizeType[] = [
      {
         size_id: 1,
         size_name: "Small",
      },
      {
         size_id: 2,
         size_name: "Medium",
      },
      {
         size_id: 3,
         size_name: "Large",
      }
   ];

   const tagData: TagType[] = [
      {
         tag_id: 1,
         tag_name: "All Plants",
         path: null
      },
      {
         tag_id: 2,
         tag_name: "New Arrivals",
         path: "new-arrival"
      },
      {
         tag_id: 3,
         tag_name: "Sale",
         path: "sale"
      }
   ];

   const [products, setProducts] = useState<Array<any>>([]);

   const [categoryId, setCategoryId] = useState<string | null>(null);
   const [tagId, setTagId] = useState<string | null>("");
   const [sizeId, setSizeId] = useState<string | null>(null);
   const [rangeValue, setRangeValue] = useState<Array<number> | null | string>(null);

   const mergedArrow = useMemo(() => {
      if (arrow === 'Hide') {
         return false;
      }

      if (arrow === 'Show') {
         return true;
      }

      return {
         pointAtCenter: true,
      };
   }, [arrow]);

   useEffect(() => {
      axios.get(`${URL}/categories?page=1&limit=100`).then(res => {
         setCategoryData(res.data.categories);
      });
   }, []);

   useEffect(() => {
      const params: any = {
         page: page,
         limit: 10,
         name: null,
         category: categoryId,
         size: sizeId,
         min_price: rangeValue ? rangeValue[0] : null,
         max_price: rangeValue ? rangeValue[1] : null,
      };

      if (tagId) {
         params.status = tagId;
      }

      axios.get(`${URL}/products`, {
         params: params,
         headers: token ? {
          "Authorization" : "Bearer " + token
         } : {}
      })
         .then((res) => {
            setIsloading(false);
            setLimit(res.data.total_count);
            setProducts(res.data.products);
         })
         .catch(err => {
            setIsloading(false);
         });
   }, [categoryId, sizeId, rangeValue, tagId, page, refresh]);

   return (
      <>
         <section className="pt-[12px] pb-[46px]">
            <div className="container">
               <HeroCarusel />
               <HeroMobileCarusel />
            </div>
         </section>
         <section className="">
            <div className="container">
               <div className="flex justify-between gap-[50px]">
                  <div className="w-[25%] bg-[#FBFBFB]">
                     <div className="px-[15px]">
                        <h2 className="font-bold text-[18px] leading-[16px] text-[#3D3D3D] mt-[10px]">Categories</h2>
                        <ul className="pl-[12px] space-y-[15px] mt-[20px]  mb-[36px]">
                           {categoryData && Array.isArray(categoryData) && categoryData?.length > 0 && categoryData?.map((item: CategoryType) => (
                              <li onClick={() => {
                                 setIsloading(true)
                                 setTimeout(() => {
                                    setCategoryId(item.category_name)
                                 }, 500)
                              }} className={`flex items-center justify-between cursor-pointer ${categoryId == item.category_name ? "text-[#46A358] font-bold " : ""}`} key={item.category_id}>
                                 <span>{item.category_name}</span>
                              </li>
                           ))}
                        </ul>
                        <h2 className="font-bold text-[18px] leading-[16px] text-[#3D3D3D] mb-[20px]">Price Range</h2>
                        <RangeSlider setRangeValue={setRangeValue} />
                        <h2 className="font-bold text-[18px] leading-[16px] text-[#3D3D3D] mt-[46px]">Size</h2>
                        <ul className="pl-[12px] space-y-[15px] mt-[20px]  mb-[36px]">
                           {sizeData.map((item: SizeType) => (
                              <li onClick={() => setSizeId(item.size_name)} className={`flex items-center justify-between cursor-pointer  ${sizeId == item.size_name ? "text-[#46A358]  font-bold border-b-[2.5px] border-[#46A358]" : ""}`} key={item.size_id}>
                                 <span>{item.size_name}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <Link href={"#"}>
                        <img src="/plant-aside.jpg" alt="Plant Aside" width={"100%"} height={470} />
                     </Link>
                  </div>

                  <div className="w-[75%]">
                     <div className="flex items-center justify-between">
                        <ul className="flex items-center space-x-[37px]">
                           {tagData.map((item: TagType) => (
                              <li className={`cursor-pointer ${tagId == item.path ? "text-green-500 font-bold border-b-[2px] border-[#46A358] " : ""}`}
                                 onClick={() => {
                                    setIsloading(true)
                                    setTimeout(() => {
                                       setTagId(item.path)
                                    }, 500)
                                 }} key={item.tag_id}>{item.tag_name}</li>
                           ))}
                        </ul>
                        <div className="flex items-center cursor-pointer">
                           Short by:
                           <Popover placement="bottom" title={""} content={<ul className="space-y-3 w-[100px] text-center font-semibold">
                              <li className="hover:scale-125 duration-300 hover:font-bold hover:text-green-500  cursor-pointer">Title Sort</li>
                              <li className="hover:scale-125 duration-300 hover:font-bold hover:text-green-500  cursor-pointer">Price Sort</li>
                           </ul>} arrow={mergedArrow}>
                              <h2>Default sorting ↓</h2>
                           </Popover>
                        </div>
                     </div>
                     <ul className="mt-[31px] flex gap-[30px] flex-wrap">
                        {isLoading ? "Loading..." : products?.length ? products.map((item: any) => (
                           <Product refresh={refresh} setRefresh={setRefresh} key={item.product_id} item={item} />
                        )) : "Not Found:("}
                     </ul>
                     <div className="mt-[90px] flex justify-end">
                        <Pagination onChange={(e) => {
                           setIsloading(true)
                           setTimeout(() => {
                              setPage(e)
                           }, 500)
                        }} defaultCurrent={page} total={limit} />
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <section className="my-[40px]">
            <div className="container">
               <div className="w-full">
                  <div className="flex flex-col justify-center items-center">
                     <h4 className="text-[#3D3D3D] text-[30px] font-bold">Our Blog Posts</h4>
                     <p className="text-[#727272] text-[14px] ">We are an online plant shop offering a wide range of cheap and trendy plants. </p>
                  </div>
                  <div className="flex justify-between flex-wrap">
                     <div className="w-[268px] bg-[#FBFBFB] mt-[30px]">
                        <Image className='' src={"/our1.png"} alt='Plant' width={268} height={195} />
                        <div className="pl-[15px] py-[15px] pr-[20px] flex flex-col space-y-1">
                           <p className="text-[#46A358] text-[14px] font-medium">September 12  I Read in 6 minutes</p>
                           <strong className="text-[20px] font-bold">Cactus & Succulent  Care Tips</strong>
                           <p className="text-[#727272]">Cacti are succulents are easy care plants for any home or patio. </p>
                           <span>Read More</span>
                        </div>
                     </div>
                     <div className="w-[268px] bg-[#FBFBFB] mt-[30px]">
                        <Image className='' src={"/our2.png"} alt='Plant' width={268} height={195} />
                        <div className="pl-[15px] py-[15px] pr-[20px] flex flex-col space-y-1">
                           <p className="text-[#46A358] text-[14px] font-medium">September 12  I Read in 6 minutes</p>
                           <strong className="text-[20px] font-bold">Top 10 Succulents for
                              Your Home</strong>
                           <p className="text-[#727272]">Cacti are succulents are easy care plants for any home or patio. </p>
                           <span>Read More</span>
                        </div>
                     </div>
                     <div className="w-[268px] bg-[#FBFBFB] mt-[30px]">
                        <Image className='' src={"/our3.png"} alt='Plant' width={268} height={195} />
                        <div className="pl-[15px] py-[15px] pr-[20px] flex flex-col space-y-1">
                           <p className="text-[#46A358] text-[14px] font-medium">September 12  I Read in 6 minutes</p>
                           <strong className="text-[20px] font-bold">Cacti & Succulent
                              Care Tips</strong>
                           <p className="text-[#727272]">Cacti are succulents are easy care plants for any home or patio. </p>
                           <span>Read More</span>
                        </div>
                     </div>
                     <div className="w-[268px] bg-[#FBFBFB] mt-[30px]">
                        <Image className='' src={"/our4.png"} alt='Plant' width={268} height={195} />
                        <div className="pl-[15px] py-[15px] pr-[20px] flex flex-col space-y-1">
                           <p className="text-[#46A358] text-[14px] font-medium">September 12  I Read in 6 minutes</p>
                           <strong className="text-[20px] font-bold">Best Houseplants
                              Room by Room</strong>
                           <p className="text-[#727272]">Cacti are succulents are easy care plants for any home or patio. </p>
                           <span>Read More</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}

export default Home;
