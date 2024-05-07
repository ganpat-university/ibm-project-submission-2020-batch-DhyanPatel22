import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Sidebar from './Sidebar';
import Loader from './Loader';
const DetailedInfo = () => {
    const [emotionData, setEmotionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FF00FF', '#0088FE'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const id = window.location.pathname.split("/").pop();
            const response = await axios.get(`https://emotion-3uen.onrender.com/api/emotion/${id}`);
            // Normalize the data to be between 0 and 1
            const normalizedData = response.data.prediction[0].map(value => value < 0 ? 0 : (value > 1 ? 1 : value));
            setEmotionData({ ...response.data, prediction: [normalizedData] });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <>
        <Sidebar />
        <div className="w-full bg-[#242424] min-h-screen text-white pl-32 py-12">
            {loading && <div className='min-h-[90vh] flex items-center justify-center'><Loader /></div>}
            {error && <p>Error: {error}</p>}
            {emotionData && (
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 mb-4">
                        <h3 className="text-lg font-semibold mb-2">Emotion: {emotionData.emotion}</h3>
                        <img src={emotionData.image} alt="Detected Image" className="max-w-full h-auto" />                        
                    </div>
                    <div className="w-full md:w-1/2 mb-4">
                        <h3 className="text-lg font-semibold mb-2 ml-12">Prediction Probabilities</h3>
                        <BarChart width={500} height={300} data={emotionData.prediction}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="" />
                            <YAxis domain={[0, 1]} />
                            <Tooltip />
                            <Legend />
                            {emotions.map((emotion, index) => (
                                <Bar key={index} dataKey={index} name={`${emotion} (${(emotionData.prediction[0][index] * 100).toFixed(2)}%)`} fill={colors[index]} />
                            ))}
                        </BarChart>
                    </div>
                </div>
            )}          
        </div>
        </>
    );
};

export default DetailedInfo;
