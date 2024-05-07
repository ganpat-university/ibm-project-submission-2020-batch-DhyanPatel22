import React, { useEffect } from 'react';
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import signup from "../assets/images/signup.png"
import { BsLightningChargeFill } from "react-icons/bs";
import signup1 from "../assets/images/signup_1.png"
import { Input } from 'antd';
import { useState } from 'react'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script'
import { toast,Toaster } from 'react-hot-toast';
import Loader from '../Components/Loader';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    password: '',
    rePassword: ''
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    if ((formData.name === '' || formData.email === '' || formData.password === '' || formData.rePassword === '' || formData.phone === '' || formData.age === '' || formData.gender === '')) {
      toast.error('All fields are required');
      return;
    }
    if (formData.phone.length !== 10)
      {
        toast.error("Phone Number should be 10 Digit!")
        return;
      }

    if (formData.password !== formData.rePassword) {
      toast.error('Passwords do not match');
      return;
    }
    console.log(formData);
    // Create FormData object to send data
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('phone', formData.phone);
    try {
      const response = await fetch('https://emotion-3uen.onrender.com/api/signup/', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        toast.success(data.message);
        localStorage.setItem('isVerified', "false");
        const timer = setTimeout(() => {
        window.location.replace('/');
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const clientId = "1005163847995-ngh95j969boe2aivj4suvnkq0rc2ep8t.apps.googleusercontent.com";

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: clientId })
    })
  }, [])


  const responseGoogle = (response) => {
    console.log(response);
    // Handle Google OAuth response here
  };


  const onLogin = async ({ provider, data }) => {
    try {
      const code = data;
      console.log(code);
      console.log(provider);

      // Extracting user data from Google OAuth response
      // const { email, name } = profileObj;

      // Update form data with Google user data
      // setFormData({
      //   ...formData,
      //   email,
      //   name,
      // });

      // // Submit the form with the retrieved user data
      // const formDataToSend = new FormData();
      // formDataToSend.append('username', name);
      // formDataToSend.append('email', email);
      // formDataToSend.append('password', ''); // Since password is not provided by Google OAuth
      // formDataToSend.append('age', '');
      // formDataToSend.append('gender', '');
      // formDataToSend.append('phone', '');
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <section className="bg-[#F0F2F5]">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      <Toaster />
      <div className="lg:grid lg:grid-cols-2 min-h-screen" style={{ gridTemplateColumns: '40% 60%' }}>
        <div className='relative max-h-screen min-h-screen overflow-hidden lg:sticky top-0 lg:inline md:hidden sm:hidden xl:inline hidden'>
          <img src={signup} alt="signup" className="w-full min-h-screen max-h-screen object-cover" />
          <div className="flex items-center justify-left pl-12 w-full rounded-lg">
            <div className="absolute top-48 py-2 flex items-center justify-center w-[54%] bg-[#20DC49] rounded-[42px] rounded-lg">
              <div className='rounded-full bg-black bg-opacity-10 backdrop-blur-xl p-3'>
                <BsLightningChargeFill className="text-[#000] text-lg" />
              </div>

              <p className='text-sm text-[#000] ml-2 rounded-lg'>Real time Image Processing</p>
            </div>
          </div>
          <div className="flex items-center justify-left pl-12 w-full rounded-lg">
            <div className="absolute top-64 p-4 grid items-center justify-center w-[40%] bg-white bg-opacity-10  backdrop-filter backdrop-blur-lg rounded-lg">
              <img src={signup1} className='w-8 h-8' />
              <p className='text-sm text-[#000] rounded-lg'>Ready to dive back into the world of emotions? Log in effortlessly and resume your personalized journey with EmoSense. Your emotions, our technology — let's continue this exploration together.</p>
            </div>
          </div>        </div>
        <div>
          <section className='px-12 py-8'>
            <nav className='w-full flex justify-between'>
              <div className="flex items-center"><img src={logo} className="w-8 h-8" /><h1 className="font-semibold text-xl ml-2">EmoSense</h1></div>
              <div className="lg:inline md:inline sm:inline xl:inline hidden"><h1>Already Have an Account? <Link to="/" className="text-[#20DC49]">Login!</Link></h1></div>
            </nav>
            <div className='mt-[50px]'>
              <h1 className='font-semibold text-xl text-center'>Get Started with MAKER</h1>
              <p className='text-gray-600 text-center'>Getting started is easy</p><br></br>
              <div className="flex text-center items-center justify-center">
                {/* <div className="flex text-center items-center justify-center border border-gray-300 bg-[white] px-8 py-2 rounded-md hover:cursor-pointer"><FcGoogle className="text-3xl" /> &nbsp;Google </div> */}
                {/* <GoogleLogin
                  clientId="131433883580-spmpe139h15le4dp0fj1us5ulovglmn9.apps.googleusercontent.comy"
                  buttonText="Login with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  className="flex text-center items-center justify-center border border-gray-300 bg-[white] px-8 py-2 rounded-md hover:cursor-pointer"
                  render={renderProps => (
                    <FcGoogle onClick={renderProps.onClick} disabled={renderProps.disabled} className="text-3xl" />
                  )}
                /> */}

                {/* <LoginSocialGoogle
                  isOnlyGetToken
                  client_id="131433883580-spmpe139h15le4dp0fj1us5ulovglmn9.apps.googleusercontent.com"
                  onLoginStart={() => console.log('Login start')}
                  redirect_uri='http://localhost:3000/'
                  scope='https://www.googleapis.com/auth/userinfo.email'
                  onResolve={onLogin}
                  access_type="offline"
                  onReject={err => {
                  }}
                >
                  GOOGLE
                </LoginSocialGoogle> */}
                <GoogleLogin
                  clientId="1005163847995-ngh95j969boe2aivj4suvnkq0rc2ep8t.apps.googleusercontent.com"
                  buttonText="Login with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  // disbale popup and use redirect instead
                  uxMode="redirect"

                  className="flex text-center items-center justify-center border border-gray-300 bg-[white] px-8 py-2 rounded-md hover:cursor-pointer"
                  render={renderProps => (
                    <FcGoogle onClick={renderProps.onClick} disabled={renderProps.disabled} className="text-3xl" />
                  )}
                />
                {/* <button onClick = {getUrl}>Login with google</button> */}
                {/* <div className="flex text-center items-center justify-center  ml-4 px-8 py-2 rounded-md hover:cursor-pointer"><BsFacebook className="text-3xl text-[#3B5998]" /> &nbsp; </div> */}

              </div>
              <br></br>
              <div className='flex items-center justify-center'>
                <hr className='w-[170px] bg-gray-300 h-[1px] border-none'></hr><h1 className='px-2 text-center text-black'>Or Continue With</h1><hr className='w-[170px] bg-gray-300 h-[1px] border-none'></hr>
              </div>
            </div>
          </section>
          <form className="max-w-sm mx-auto px-12 lg:px-0">
            <div className="mb-5">
              <Input placeholder="Name" id='name'
                value={formData.name}
                onChange={handleInputChange}
                className='name bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input
                value={formData.email}
                onChange={handleInputChange}
                id='email'
                placeholder="Email" className='email bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input
                value={formData.phone}
                onChange={handleInputChange}
                id='phone'
                placeholder="Phone" className='phone bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input
                value={formData.age}
                onChange={handleInputChange}
                id='age'
                placeholder="Age" className='age bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input
                value={formData.gender}
                onChange={handleInputChange}
                id='gender'
                placeholder="Gender" className='gender bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input.Password
                id='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password" className='password bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>
            <div className="mb-5">
              <Input.Password
                id='rePassword'
                value={formData.rePassword}
                onChange={handleInputChange}
                placeholder="Retype Password" className='rePassword bg-white p-4 border border-gray-300 w-full rounded-md outline-none' />
            </div>

            <button type="button" onClick={handleForm} className="border border-[#20DC49] items-center text-white bg-[#20DC49] rounded-md w-full px-8 py-2">{
              loading ? <Loader small={true} /> : 'Create Account'
            
            }</button>
          </form><br></br>
          <div className='w-full px-12'>
            <p className='text-center text-gray-800 text-sm'>By continuing you indicate that you read and agreed to the Terms of Use</p>
          </div>
          <br></br>

        </div>
      </div>

    </section>
  );
}

export default Signup;