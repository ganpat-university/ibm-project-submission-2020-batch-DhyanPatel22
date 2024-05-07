import React from 'react';
import {Table} from "antd";
import axios from "axios";
import { useEffect, useState } from 'react';
import AdminNavbar from '../Components/AdminNavbar';
import Loader from '../Components/Loader';
const Admin = () => {
const [emotionData, setEmotionData] = useState([]);  
const [loading, setLoading] = useState(false);
      const columns = [
        {
            title: 'Index',
            dataIndex: 'emotion',
            key: 'name',
            render: (text, record, index) => index + 1
          },    
        {
          title: 'Image',
          dataIndex: 'image',
          key: 'image',
            render: (text, record) => (
                <img src={record.image} alt="emotion" className='w-16 h-16 rounded-full object-cover' />
            )
        },      
        {
          title: 'Emotion',
          dataIndex: 'emotion',
          key: 'name',
        },      
        {
          title: 'Timestamp',
          dataIndex: 'detected_at',
          key: 'name',
          render: (text, record) => (
            <p>{new Date(record.detected_at).toLocaleString()}</p>
          )
        },      
      ];
      const fetchData = async () => {
        setLoading(true);
        try {
          const id = localStorage.getItem("id");
          const response = await axios.get(`https://emotion-3uen.onrender.com/api/emotion/all`);
          const data = await response
          console.log(data);
          setEmotionData(data?.data);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      }
      useEffect(() => { 
        fetchData();
      }, []);
      return (<>
      <AdminNavbar />
          <div className='p-12'>
            <h1 className='font-bold text-lg py-4'>Emotion Detection History</h1>
            <div>
            {loading?<div className='min-h-[70vh] flex w-full justify-center items-center'> 
          <Loader />
        </div>:<Table dataSource={emotionData} columns={columns} />}
        </div>
      
    </div>
    </>
  );
}

export default Admin;