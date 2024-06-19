import React from 'react';
import './UpdatedPage.css';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UpdatedPage = ({ Loading }) => {
    // Instance for useNavigate Hook
    const NavigateTo = useNavigate();
    // 
    return (
        <div className='Updated-Page'>
            <div className='Updated-Page-Container'>
                <div className='Check-icon'>
                    <FaCheckCircle />
                </div>
                <h3>Attendance <br />Updated Successfully</h3>
                <br />
                <button className='btn btn-warning px-4 fw-bold' onClick={() => {
                    Loading(1200);
                    setTimeout(() => {
                        NavigateTo('/DashBoard');
                    }, 1000);
                }}>OK</button>
            </div>
        </div >
    )
}

export default UpdatedPage