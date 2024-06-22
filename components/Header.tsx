'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, ChangeEventHandler, useEffect } from 'react'
import { Navbar } from './Navbar'
import { HamburgerIcon, LoginIcon, OrderBasket, SearchIcon } from '@/assets/fonts/Icon'
import { Button } from './Button'
import { usePathname } from "next/navigation";
import { Modal, Input, Badge } from 'antd'
import axios from 'axios'
import { URL } from '@/service/request'
import toast, { Toaster } from 'react-hot-toast'


interface LinkType {
  id: number;
  title: string;
  path: string;
  isActive: boolean;
}

const Header = () => {
  const token = window.localStorage.getItem("token")
  const pathname = usePathname()
  const navList = [
    { id: 1, title: "Home", path: "/", isActive: pathname == "/" ? true : false },
    { id: 2, title: "Shop", path: "/shop", isActive: pathname == "/shop" ? true : false },
    { id: 3, title: "Plant Care", path: "/plant", isActive: pathname == "/plant" ? true : false },
    { id: 4, title: "Blogs", path: "/blogs", isActive: pathname == "/blogs" ? true : false }
  ]

  const [showSearchInput, setShowSearchInput] = useState<boolean>(false)
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const handleSearchChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value == "") {
      setTimeout(() => {
        setShowSearchInput(false)
      }, 2000)
    }
  }
  const closeModal = (e: React.MouseEvent) => {
    if ((e.target as HTMLButtonElement).id == "modal-wrapper") {
      setOpenModal(false)
    }
  }

  const [isModalContent, setIsModalContent] = useState<string>("Login")
  // Login Modal start 
  const [loginEmail, setLoginEmail] = useState<string>("")
  const [loginPassword, setloginPassword] = useState<string>("")
  const loginModalClick = () => {
    const data = {
      password: loginPassword,
      usernameoremail: loginEmail
    };
    try {
      axios.post(`${URL}/login`, data)
        .then(res => {
          window.localStorage.setItem('token', res.data.access_token)
          toast.success("Hush kelibsiz " + res.data.first_name)
          setOpenLoginModal(false)
          setloginPassword("")
          setLoginEmail("")
        }
        )
    } catch (err) {
      console.log(err);
    }
  };
  // Login Modal end

  // Register Modal start 
  const [registerEmail, setRegisterEmail] = useState<string>("")
  const [registerFirstName, setRegisterFirstName] = useState<string>("")
  const [registerLastName, setRegisterLastName] = useState<string>("")
  const [registerPassword, setRegisterPassword] = useState<string>("")
  const registerBtnClick = () => {
    const data = {
      email: registerEmail,
      first_name: registerFirstName,
      last_name: registerLastName,
      password: registerPassword
    }
    try {
      axios.post(`${URL}/register`, data).then(res => {
        setIsModalContent("registerVerify")
        setLoginEmail(registerEmail)
      })

    } catch (err) {
      console.log(err);
    }
  }
  // Register Modal end

  // Forgot start login
  const [forgotLoginEmail, setForgotLoginEmail] = useState<string>("")
  const forgotBtnClick = () => {
    axios.post(`${URL}/forgot/${forgotLoginEmail}`).then(res => {
      setIsModalContent("forgotVerify")
    })
  }
  // Forgot end login

  //  Forgot OTP start 
  const [forgotOTPCode, setForgotOTPCode] = useState<string>("")
  const forgotOTPBtnClick = () => {
    axios.post(`${URL}/verify`, {}, {
      params: {
        email: forgotLoginEmail,
        otp: forgotOTPCode
      }
    }).then(res => {
      setLoginEmail(forgotLoginEmail)
      setIsModalContent("Login")
    })
  }
  //  Forgot OTP end 

  // // Forgot email verify start

  // const [forgotEmailOTPCode,setForgotEmailOTPCode] =useState<string>('')
  // const forgotVerifyBtnClick =()=>{}
  // // Forgot email verify end


  // // Register verify end
  const [registerOTPCode, setRegisterOTPCode] = useState<string>('')
  const registerVerifyBtnClick = () => {
    const data = {
      email: registerEmail,
      code: registerOTPCode
    }
    try {
      axios.post(`${URL}/users/verify`, {}, {
        params: data
      })
        .then(res => {
          setIsModalContent("Login")
          setRegisterEmail("")
          setRegisterFirstName("")
          setRegisterLastName("")
          setRegisterPassword("")
        })
    }
    catch (err) {
      console.log(err)
    }
  }
  // Register verify end

  // Basket part start 
  const [basketList, setBasketList] = useState<any>([])
  useEffect(() => {
    if (token) {
      axios.get(`${URL}/basket`, {
        params: {
          page: 1,
          limit: 100
        },
        headers: {
          "Authorization": "Bearer " + window.localStorage.getItem("token")
        }
      }).then(res => setBasketList(res.data.ProductId))
    }
  }, [])

  //Basket part end 

  return (
    <header className='pt-[41px] md:pt-[25px]'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className="container px-[24px] gap-[8px] md:gap-0 md:px-0 flex items-center justify-between md:border-b-[1px] md:border-[#A2D0AB]">
        <Link className='pb-[17px] hidden md:block' href={'/'}>
          <Image src={'/site-logo.svg'} width={150} height={34} alt='Site logo' />
        </Link>
        <Navbar />
        <div className='hidden md:flex items-center space-x-[30px] pb-[11px] '>
          <button
            className="flex items-center"
            onClick={() => setShowSearchInput(true)}
          >
            {!showSearchInput && <SearchIcon />}
            <input
              onChange={handleSearchChangeInput}
              className={`${showSearchInput ? "py-[14px] pl-[41px] w-[300px]" : "w-[0px]"
                } search-input duration-300 outline-none focus:shadow text-[14px] font-normal leading-[16px] bg-[#F8F8F8] rounded-[10px] `}
              type="text"
              placeholder="Find your plants"
              autoComplete="off"
              aria-label="Find your plants"
              name="plants-search"
            />
          </button>
          <Badge style={{ color: "white", background: "#46A358" }} size='default' count={basketList?.length}>
            <Link href={'/shop/order'}>
              <OrderBasket />
            </Link>
          </Badge>
          <Button onClick={() => setOpenLoginModal(true)} bgBtn={false} title='Login' iconPosition='prev' icon={<LoginIcon />} buttonWidth={125} />
        </div>
        <input className={`md:hidden py-[14px] pl-[41px] w-[90%] search-input duration-300 outline-none focus:shadow text-[14px] 
            font-normal leading-[16px] bg-[#F8F8F8] rounded-[10px]`}
          type="text" name='plant-search' placeholder='Find your plants' autoComplete='off' aria-label='Find your plants' />
        <button onClick={() => setOpenModal(true)} className='md:hidden w-[45px] h-[45px] bg-[#46A358] rounded-[14px] flex items-center justify-center opacity-80'>
          <HamburgerIcon />
        </button>
      </div>
      <div onClick={closeModal} id='modal-wrapper' className={`${openModal ? "left-0" : "left-[-100%]"} modal duration-500 fixed top-0 z-[2] backdrop-blur-md h-[100vh] w-full`}>
        <div className={`hamburger-bg absolute w-[80%] h-[100vh] bg-green-300 duration-500 ${openModal ? "right-0" : "right-[-200%]"} p-10 flex flex-col space-y-5`}>
          {navList.map((item: LinkType) => (
            <Link onClick={() => setOpenModal(false)} key={item.id} className={`font-normal pb-[33px] text-[16px] leading-[20.11px] text-[#3D3D3D]`} href={item.path}>{item.title}</Link>
          ))}
        </div>
      </div>

      <Modal open={openLoginModal} onCancel={() => setOpenLoginModal(false)}>
        <div className='p-5'>
          <ul className='flex items-center space-x-3 justify-center text-[22px] font-semibold'>
            <li className={`${isModalContent == "Login" ? "text-green-500" : "cursor-pointer"}`} onClick={() => setIsModalContent("Login")}>Login</li>
            <li className='w-[2px] h-[25px] bg-black'></li>
            <li className={`${isModalContent == "Register" ? "text-green-500" : "cursor-pointer"}`} onClick={() => setIsModalContent("Register")}>Register</li>
          </ul>
        </div>
        {isModalContent == "Login" &&
          <div className='space-y-3 text-center'>
            <Input onChange={(e) => setLoginEmail(e.target.value)} value={loginEmail} type='email' placeholder='Enter your email' size='large' />
            <Input onChange={(e) => setloginPassword(e.target.value)} value={loginPassword} type='password' placeholder='Enter your password' size='large' />
            <button onClick={() => setIsModalContent("forgotEmail")} className='text-[16px] text-green-500 font-normal w-full text-end'>Forgot Password ?</button>
            <div className='flex items-center justify-center'>
              <Button onClick={loginModalClick} title='Login' buttonWidth={472} bgBtn={false} />
            </div>
          </div>
        }
        {isModalContent == "Register" &&
          <div className='space-y-5 text-center'>
            <Input onChange={(e) => setRegisterEmail(e.target.value)} value={registerEmail} type='email' placeholder='Enter your email' size='large' />
            <Input onChange={(e) => setRegisterFirstName(e.target.value)} value={registerFirstName} type='text' placeholder='Enter your First Name' size='large' />
            <Input onChange={(e) => setRegisterLastName(e.target.value)} value={registerLastName} type='text' placeholder='Enter your Last Name' size='large' />
            <Input onChange={(e) => setRegisterPassword(e.target.value)} value={registerPassword} type='password' placeholder='Enter your Password' size='large' />
            <div className='flex items-center justify-center mt-[10px]'>
              <Button onClick={registerBtnClick} title='Register' buttonWidth={472} bgBtn={false} />
            </div>
          </div>
        }
        {
          isModalContent == "forgotEmail" &&
          <div className='space-y-5 flex flex-col items-center'>
            <Input value={forgotLoginEmail} onChange={(e) => setForgotLoginEmail(e.target.value)} placeholder='Enter your email' size='large' />
            <Button onClick={forgotBtnClick} title='Send Code' buttonWidth={472} bgBtn={false} />
          </div>
        }
        {
          isModalContent == "forgotVerify" &&
          <div className='space-y-5 flex flex-col items-center'>
            <Input.OTP value={forgotOTPCode} onChange={(e) => setForgotOTPCode(e)} length={6} size='large' />
            <Button onClick={forgotOTPBtnClick} title='Enter Code' buttonWidth={472} bgBtn={false} />
          </div>
        }
        {
          isModalContent == "registerVerify" &&
          <div className='space-y-5 flex flex-col items-center'>
            <Input.OTP value={registerOTPCode} onChange={(e) => setRegisterOTPCode(e)} length={6} size='large' />
            <Button onClick={registerVerifyBtnClick} title='Enter Code' buttonWidth={472} bgBtn={false} />
          </div>
        }
      </Modal>

    </header>
  )
}

export default Header