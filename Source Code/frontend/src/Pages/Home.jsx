import React, { useState,useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { CiCamera } from "react-icons/ci";
import { Link, redirect } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Components/Loader';

const redirectTo = (id) => {
    window.location.href = `/detailedInfo/${id}`;
    }
const ResultItem = ({ id,imageSrc, emotion, details }) => (
    <div className='flex justify-between items-center mt-4'>
        <div>
            <img src={imageSrc} className='h-16 w-16 rounded-md object-cover' alt="Result" />
        </div>
        <div className='ml-4'>
            <p className='text-white'>{emotion}</p>
            <p className='text-sm text-[#6b6b6b]'>{new Date(details).toLocaleString()}</p>
            <p className='hover:cursor-pointer' onClick={()=>redirectTo(id)}>View Detailed Analysis</p>
        </div>
    </div>
);

const Home = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [result, setResult] = useState(null); // [emotion, setEmotion
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emotionData, setEmotionData] = useState([]);
    const fetchData = async () => {
        try {
          const id = localStorage.getItem("id");
          const response = await axios.get(`https://emotion-3uen.onrender.com/api/emotionHistory/${id}`);
          const data = await response
          console.log(data);
          setEmotionData(data?.data)?.splice(0,3);
        } catch (err) {
          console.error(err);
        }
      }
      useEffect(() => { 
        fetchData();
      }, []);


    const fetchResult = async (base64Image) => {
        setLoading(true);
        try {
            const response = await axios.post('https://emotion-3uen.onrender.com/api/model/', {
                image: base64Image ,user_id:localStorage.getItem("id")
            });

            const responseData = await response;
            console.log(responseData);
            fetchData()
            // ṛemove duplicate
            setResult(responseData.data.emotion); // ṛemove duplicate

        } catch (err) {
            setError(err.response.data.error);
            console.error('Error sending photo:', err);
        }
        setLoading(false);
    };

    const handleFileChange = (event) => {
        setError(null);
        setResult(null);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                const base64Image = reader.result;
                fetchResult(base64Image);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
            toast.error("Please select an image file.");
        }
    };

    return (
        <div className="profile-section flex min-h-screen bg-[#1a1a1a] text-white w-full">
            <Sidebar />
            <Toaster />
            <div className='ml-24 p-12 flex justify-between '>
                <div>
                    <div>
                        <h1 className='text-3xl font-bold'>Detect Emotion</h1>
                        <p className='text-sm py-4'>Upload a photo or capture a facial expression to analyze emotions</p>
                    </div>
                    <div className='bg-[#242424] rounded-md p-4 flex justify-between items-center'>
                        <div>
                            <h1 className='font-bold'>Upload a Photo</h1>
                            <p className='text-sm mt-1 text-[#6b6b6b]'>Use a high quality image for the best result</p>
                            <div className="flex items-center mt-4">
                                <label htmlFor="fileInput" className="relative inline-block bg-[#2E2E2E] text-white rounded-lg text-sm px-4 py-2 cursor-pointer">
                                    Choose File
                                    <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div>
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="ml-4 w-20 h-20 rounded-md object-cover" />
                            )}
                        </div>
                        <div>
                        </div>
                    </div>
                        <div>
                            {loading?<div className='max-h-[20vh] flex flex-col mt-5 bg-[#242424] p-4 rounded-md'><Loader className="max-h-[20vh]"/></div>:
                                result && (
                                    <div className='flex flex-col mt-5 bg-[#242424] p-4 rounded-md'>
                                        <h1 className='font-bold'>Result</h1>
                                        <div className='flex items-center py-4'>
                                        <p className='text-sm text-[#6b6b6b]'>Emotion detected: </p>
                                        {
                                         result
                                        }
                                        </div>
                                    </div>
                                )}{
                                error && (
                                    <div className='flex flex-col mt-5 bg-[#242424] p-4 rounded-md'>
                                        <h1 className='font-bold'>Error</h1>
                                        <p className='text-sm text-[#6b6b6b]'>{error}</p>
                                    </div>
                                )
                            }
                        </div>
                    <div className='flex justify-center my-4'>
                        <Link to="/dashboard">
                            <button className='flex items-center p-4 rounded-lg text-white bg-[#2E2E2E] text-md font-bold'>
                                <CiCamera className='text-2xl mr-2' />
                                Capture a photo
                            </button>
                        </Link>
                    </div>
                </div>
                <div className='ml-32'>
                    <div>
                        <h1 className='font-bold py-4 text-3xl'>Recent Results</h1>
                    </div>
                    <div>
                        {emotionData.map((item, index) => (
                            <ResultItem key={index} id = {item.id} imageSrc={item.image} emotion={item.emotion} details={item.detected_at} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
