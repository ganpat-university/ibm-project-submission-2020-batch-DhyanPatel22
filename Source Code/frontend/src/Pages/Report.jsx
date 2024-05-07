import React, { useState,useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const Report = () => {
    const [selectedButton, setSelectedButton] = useState('All');
const [imageData, setImageData] = useState([]);
    const handleClick = (button) => {
        setSelectedButton(button);
    };

    const sortOptions = ['All', 'Happy', 'Surprise', 'Fear', 'Anger', 'Sad', 'Neutral', 'Disgust'];   
    const fetchData = async () => {
        try {
          const id = localStorage.getItem("id");
          const response = await axios.get(`https://emotion-3uen.onrender.com/api/emotionHistory/${id}`);
          const data = await response
          console.log(data);
          setImageData(data?.data);
        } catch (err) {
          console.error(err);
        }
      }
      useEffect(() => { 
        fetchData();
      }, []);
    const filteredImages = selectedButton === 'All' ? imageData : imageData.filter(image => image.emotion === selectedButton);
      const redirectTo=(id)=>{
        window.location.href = `/detailedInfo/${id}`;
      }
    return (
        <div className="report-section flex min-h-screen bg-[#1a1a1a] text-white">
            <Sidebar />
            <div className='ml-24 p-12 flex flex-col w-full'>
                <div>
                    <h1 className='text-3xl font-bold'>Analysis</h1>
                </div>
                <div className='w-full '>
                    <div className='flex justify-between w-full my-8'>
                        {sortOptions.map((button, index) => (
                            <button
                                key={index}
                                className={`flex-grow ${selectedButton === button ? 'bg-[#fff]' : 'bg-[#2F2F2F]'} ${selectedButton === button ? 'text-[#2F2F2F]' : 'text-[white]'} text-sm inline-block py-2 px-3 mx-2 rounded-md`}
                                onClick={() => handleClick(button)}
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                </div>
              {filteredImages?.length>0?  <div className='grid gap-4 grid-cols-4'>
               {filteredImages.map((image) => (
                    <div key={image.id} id={image.emotion} className='hover:cursor-pointer' onClick={()=>redirectTo(image?.id)}>
                        <div className='w-64 h-64'><img src={image.image} alt={`Emotion ${image.emotion}`} className='w-64 h-64 rounded-md object-cover' /></div>
                        <div className='mt-2'>
                            <h1>Image {image.id}</h1>
                            <h1 className='text-sm text-[#6b6b6b]'>Emotion: {image.emotion}</h1>
                        </div>
                    </div>
                ))}
                </div>:<div className='w-full'>
                        <h1 className='flex justify-center items-center w-full min-h-[60vh]'>No Data</h1>
                    </div>}
            </div>
        </div>
    );
}

export default Report;
