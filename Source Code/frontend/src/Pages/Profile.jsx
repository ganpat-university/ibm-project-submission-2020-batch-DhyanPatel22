import React from 'react';
import { useState, useEffect } from 'react';
import EmotionDetectionHistory from '../Components/EmotionDetectionHistory';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Loader from '../Components/Loader';
const Profile = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
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
            console.log(data);
            setData(data);
            setLoading(false);
        } catch (err) {
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
            {loading?<Loader />:<div className='ml-24 p-12'>
                <div>
                    <h1 className='text-3xl font-bold'>Profile</h1>
                </div>
                <div className='mt-8 grid grid-cols-3 gap-4 justify-between'>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Name</label>
                        <p className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' >
                            {data?.username}
                        </p>
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Email</label>
                        <p className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' >
                            {data?.email}
                        </p>
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Phone</label>
                        <p className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' >
                            {data?.phone}
                        </p>
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Age</label>
                        <p className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' >
                            {data?.age}
                        </p>
                    </div>
                    <div className='mt-4'>
                        <label className='text-md font-medium'>Gender</label>
                        <p className='bg-[#2f2f2f] w-[27vw] p-4 mt-2 text-white rounded-xl outline-none' >
                            {data?.gender}
                        </p>
                    </div>

                </div>
                <Link to="/edit-profile"><button type='button' className='my-8 py-2 px-4 bg-white text-black rounded-md inline-block'>
                    Edit Profile
                </button>
                </Link>
            <EmotionDetectionHistory />
            </div>}
        </div>
    );
}

export default Profile;