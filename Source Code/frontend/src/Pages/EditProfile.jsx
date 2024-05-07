import React from 'react';
import { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { Link } from 'react-router-dom';
import {toast,Toaster } from 'react-hot-toast';
import Loader from '../Components/Loader';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        age:'',
        gender:''
    });
    const [formDataOne, setFormDataOne] = useState({
        username: '',
        email: '',
        phone: '',
        age:'',
        gender:''
    });
    const fetchData = async () => {
        try {
            const id = localStorage.getItem("id");
            const response = await fetch(`https://emotion-3uen.onrender.com/api/profile/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setFormData({
                username: data.username,
                email: data.email,
                phone: data.phone,
                age: data.age,
                gender:data.gender

            })
            setFormDataOne({
                username: data.username,
                email: data.email,
                phone: data.phone,
                age: data.age,
                gender:data.gender

            })
            setLoading(false);

        } catch (err) {
            console.error(err);
        }
    };

    const handleEmailChange = (e) => {
        setFormData({
          ...formData,
          email: e.target.value,
        });
      };
        const handleUsernameChange = (e) => {
            setFormData({
            ...formData,
            username: e.target.value,
            });
        };
        const handlePhoneChange = (e) => {
            setFormData({
            ...formData,
            phone: e.target.value,
            });
        };
        const handleAgeChange = (e) => {
            setFormData({
            ...formData,
            age: e.target.value,
            });
        };
        const handleGenderChange = (e) => {
            setFormData({
            ...formData,
            gender: e.target.value,
            });
        };

const handleUpdate = async () => {
    if(formData.username === formDataOne.username && formData.email === formDataOne.email && formData.phone === formDataOne.phone && formData.age === formDataOne.age && formData.gender === formDataOne.gender)
    {
        toast.error("No changes made");
        return;
    }
    if(formData.phone.length !== 10){
        toast.error("Phone number should be of 10 digits");
        return;
    }
    try {
        const id = localStorage.getItem("id");
        const response = await fetch(`https://emotion-3uen.onrender.com/api/editProfile/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data);
        if(data.status === "success"){
            toast.success("Profile Updated Successfully");
        }
        else{
            toast.error(data.message)
        }
        fetchData();
    }
    catch (err) {
        console.error(err);
    }
};


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.replace('/');
        }
        fetchData();
    }
        , []);

    return (

        <div className="profile-section flex min-h-screen bg-[#1a1a1a] text-white">
            <Sidebar />
            <Toaster />
            {loading?<Loader />:<div className='ml-24 p-12'>
                <div>
                    <h1 className='text-3xl font-bold'>Edit Profile</h1>
                </div>
                <div className='mt-8 grid grid-cols-3 gap-4 justify-between'>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Name</label>
                        <input id="username" value={formData.username} onChange={handleUsernameChange} className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' />
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Email</label>
                        <input id="email" value={formData.email} onChange={handleEmailChange} className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' />
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Phone</label>
                        <input id="phone" value={formData.phone} onChange={handlePhoneChange} className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' />
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Age</label>
                        <input id="age" value={formData.age} onChange={handleAgeChange} className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' />
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Gender</label>
                        <input id="gender" value={formData.gender} onChange={handleGenderChange} className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' />
                    </div>
                </div>
                <Link to="/profile"><button type='button' className='my-8 py-2 px-4 bg-gray-600 text-white text-black rounded-md inline-block'>
                    Go Back
                </button>
                </Link>
                <button type='button' className='ml-2 my-8 py-2 px-4 bg-white text-black rounded-md inline-block'
                    onClick={handleUpdate}
                >
                    Save Changes
                </button>
            </div>}
        </div>
    );
}

export default EditProfile;