import React, { useState, useEffect } from 'react';
import vk from "../assets/images/vk.jpg";
import ro from "../assets/images/ro.jpeg";
import ms from "../assets/images/msd.jpeg";
import axios from 'axios';
const EmotionDetectionHistory = () => {
  const [emotionData, setEmotionData] = useState([]);

  const fetchData = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await axios.get(`https://emotion-3uen.onrender.com/api/emotionHistory/${id}`);
      const data = await response
      console.log(data);
      setEmotionData(data?.data);
    } catch (err) {
      console.error(err);
    }
  }

  const redirect = (id) => {
    window.location.href = `/detailedInfo/${id}`;
  }
  useEffect(() => { 
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1 className='text-xl mt-8 font-semibold'>Emotion Detection History</h1>        
      </div>
      <div>
        {emotionData?.length>0?emotionData.map((item, index) => (
          <div key={index} className='flex w-full justify-between items-center mt-6'>
            <div className='flex items-center'>
              <div><img src={item.image} className='w-12 object-cover h-12 rounded-full' alt={`Emotion ${item.emotion}`} /></div>
              <div className='pl-4 text-md'><h1>{item.emotion}<br></br><p className='text-sm hover:cursor-pointer text-[#6b6b6b] hover:text-[#4a4a4a]'
              onClick={()=>redirect(item?.id)}
              >View Deailed Analysis</p></h1></div>
            </div>
            <div>
              <p className='text-sm text-[#6B6B6B]'>{
             new Date(item.detected_at).toLocaleString()
              }</p>
            </div>
          </div>
        )):<div className='text-center text-[#6b6b6b] mt-8'>No Data Available</div>}
      </div>
    </div>
  );
}

export default EmotionDetectionHistory;
