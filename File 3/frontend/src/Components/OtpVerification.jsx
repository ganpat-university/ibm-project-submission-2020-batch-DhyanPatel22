import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Loader from './Loader';
const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [finalOtp, setFinalOtp] = useState('');
    const [loading, setLoading] = useState(false); 

    const submitOtp = async () => {
        const id = localStorage.getItem('id');
        setLoading(true);
        try{
        const response = await axios.post(`https://emotion-3uen.onrender.com/api/checkOtp/${id}`, { otp :otp.join('')});
        const data = response.data;
        if (data.status === 'success') {
            toast.success('OTP Verified Successfully');
            window.location.replace('/dashboard');
            localStorage.removeItem('isVerified');
        } else {
            toast.error('Invalid OTP. Please try again!');
            setOtp(new Array(6).fill(''));
        }}
        catch(err){
            console.error(err);
            toast.error('Invalid OTP. Please try again!');
        }
        setLoading(false);
    };
    // Function to handle input change and focus management
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return; // Only numeric inputs
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Automatically move to the next input or submit if this was the last one
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        } else if (!element.nextSibling && otp.join('').length === 6) {
            // All inputs filled, submit OTP
            setFinalOtp(newOtp.join(''));
        }
    };

    // Function to handle backspace or delete key for focusing previous input
    const handleBackspace = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = ''; // Clear current input
        setOtp(newOtp);
        if (index !== 0 && !element.value) {
            element.previousSibling.focus(); // Move focus to previous input if available
        }
    };

    // Function to submit OTP    

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Toaster />
            <h1 className="text-2xl font-semibold text-green-700 mb-4">OTP Verification</h1>
            <div className="space-x-2">
                {otp.map((data, index) => (
                    <input
                        className="w-12 h-12 text-xl text-center border-2 border-green-500 focus:border-green-700 rounded"
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => (e.key === 'Backspace' || e.key === 'Delete') && handleBackspace(e.target, index)}
                        onFocus={e => e.target.select()}
                    />
                ))}
            </div>
                <button
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={submitOtp}
                >
                    {loading?<Loader small={true} />:"Verify OTP"}
                </button>
        </div>
    );
}

export default OtpVerification;
