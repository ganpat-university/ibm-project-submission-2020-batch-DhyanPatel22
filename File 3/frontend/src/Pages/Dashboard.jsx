import React, { useRef, useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { FiCamera } from "react-icons/fi";
import { FiCameraOff } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Loader from '../Components/Loader';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Tooltip, Legend,Cell } from 'recharts';


const ResultItem = ({ timestamp, message }) => (
    <div className='text-sm text-green-500'>
        [{timestamp}] - {message}
    </div>
);

const Dashboard = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [logData, setLogData] = useState([]);
    const [outputData, setOutputData] = useState(null);
    const label = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FF00FF', '#0088FE'];

    const [facemeshModel, setFacemeshModel] = useState(null);

    const startVideoStream = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStream(stream);
                    logData.push({ timestamp: new Date().toLocaleString(), message: 'Camera Connection Successful' });
                }
            })
            .catch(error => console.error('Error accessing the camera:', error));
    };

    const toggleCamera = () => {
        if (isCameraOn) {
            stopVideoStream();
        } else {
            startVideoStream();
        }
        setIsCameraOn(!isCameraOn);
    };

    const stopVideoStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            logData.push({ timestamp: new Date().toLocaleString(), message: 'Camera Connection Closed' });
        }
    };

    const takePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            setLoading(true);
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');

            try {
                const response = await fetch('https://emotion-3uen.onrender.com/api/model/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: dataURL, user_id: localStorage.getItem("id") })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch predictions.');
                }

                const responseData = await response.json();
                console.log(responseData);
                setOutputData(responseData); // Store the response data in state

                // Detect facial landmarks
                const predictions = await facemeshModel?.estimateFaces(video, false);
                console.log(predictions); // Check the predictions in the console

                if (predictions && predictions.length > 0) {
                    predictions.forEach(prediction => {
                        const keypoints = prediction.scaledMesh;

                        // Draw facial landmarks on the canvas
                        context.beginPath();
                        context.fillStyle = 'red'; // Color for landmarks
                        for (let i = 0; i < keypoints.length; i++) {
                            const [x, y] = keypoints[i];
                            context.fillRect(x, y, 2, 2); // Draw a small rectangle at each landmark point
                        }
                        context.closePath();
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error('Error processing photo:', err);
                setLoading(false);
            }
        } else {
            console.error('Video or canvas element not found.');
            setLoading(false);
        }
    };



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
        startVideoStream();

        // Load facemesh model
        async function loadFacemeshModel() {
            const model = await facemesh.load();
            setFacemeshModel(model);
        }
        loadFacemeshModel();

        return () => {
            stopVideoStream();
        };
    }, []);

    return (
        <div className='bg-[#1a1a1a] w-full text-white flex min-h-screen'>
            <Sidebar />
            <Toaster />
            <div className='w-full ml-16'>
                <nav className='w-full flex items-center justify-between bg-[#242424]'>
                    <h1 className='p-4 px-8 text-lg'>{data?.username}</h1>
                </nav>
                <div className="md:flex md:flex-row">
                    <div className='px-4'>
                        <div className='pl-4 relative' style={{ width: '110%', height: '800px' }}>
                            <video ref={videoRef} autoPlay muted className="w-full h-full" style={{ borderRadius: '16px', transform: 'scaleX(-1)' }}></video>
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                            <button className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 p-4 text-white border border-white ${isCameraOn ? "" : "bg-red-500"} rounded-full mb-2`} onClick={toggleCamera}>
                                {isCameraOn ? <FiCamera /> : <FiCameraOff />}
                            </button>
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <button className="mt-4 p-2 px-8 bg-none border border-white text-white rounded-md" onClick={takePhoto}>Check Emotion</button>
                        </div>
                        <div className='w-full'>
                            {loading ? <div className='mx-1 2 p-8 mt-8 rounded-md  bg-[#2F2F2F]'><Loader /></div> : outputData && (
                                <div className='mx-12 p-8 mt-8 w-full rounded-md grid grid-cols-1  bg-[#2F2F2F]'>
                                    <div className='flex'>
                                        <h2>Emotions Detected:</h2>
                                        <p className='ml-2'>
                                            {outputData?.emotion}
                                        </p>
                                    </div>
                                    <br />
                                    <p className='grid grid-cols-4'>{
                                        outputData?.prediction[0]?.map((item, index) => (
                                            <><span className='py-2'>{label[index]}: {(item.toFixed(2) * 100).toFixed(2)}%</span><br /></>

                                        ))
                                    }
                                    </p>
                                    <div className='flex w-full items-center justify-center mt-12'>
                                    <PieChart width={450} height={300}>
                                        <Pie
                                            data={outputData?.prediction[0].map((emotion, index) => ({
                                                name: label[index],
                                                value: emotion*100,
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {
                                                outputData?.prediction[0].map((emotion, index) => (
                                                    <Cell key={index} fill={colors[index % colors.length]} />
                                                ))
                                            }
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
