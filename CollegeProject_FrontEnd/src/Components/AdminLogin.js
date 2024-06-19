import axios from 'axios';
import './InitialPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaRegEyeSlash } from 'react-icons/fa';

const StandardEmail = /^[\w.%+-]{5,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const StandardPassWord = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const AdminLogin = ({ Loading }) => {
    const NavigateTo = useNavigate();
    const [PassWordToggle, setPassWordToggle] = useState(false);
    const [ErrorState, setErrorState] = useState({ ErrorFlag: false, ErrorMsg: '', Which_Field: '' });
    const [LoginInputValue, setLoginInputValue] = useState(
        {
            Email: '',
            PassWord: ''
        },
    )
    async function handleLoginSubmit(e) {
        e.preventDefault();
        if (LoginInputValue.Email !== '' &&
            LoginInputValue.PassWord !== '' &&
            StandardEmail.test(LoginInputValue.Email) &&
            StandardPassWord.test(LoginInputValue.PassWord)) {
            try {
                const response = await axios.post('https://collegeproject-backend.onrender.com/api/admin/Login', LoginInputValue);
                if (response.data === 'Login Successfully') {
                    Loading(2500);
                    setErrorState({ ErrorFlag: false, ErrorMsg: '', Which_Field: '' })
                    setTimeout(() => {
                        NavigateTo('/FileUploadPage');
                    }, 1000);
                }
            } catch (error) {
                setErrorState({ ErrorFlag: true, ErrorMsg: error.response.data, Which_Field: '' })
            }

        }
        else {
            if (LoginInputValue.Email === '') {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'Email Field is Required', Which_Field: 'Email' });
            }
            if (!StandardEmail.test(LoginInputValue.Email)) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'Please Enter Valid Email', Which_Field: 'Email' });
            }
            if (LoginInputValue.PassWord === '') {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'PassWord Field is Required', Which_Field: 'PassWord' });
            }
            if (LoginInputValue.PassWord.length < 8) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'PassWord Must Contain Minimum 8 Characters', Which_Field: 'PassWord' });
            }
            if (!StandardPassWord.test(LoginInputValue.PassWord)) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'Please Enter Valid PassWord', Which_Field: 'PassWord' });
            }
        }
    }
    function handleLoginInput(e) {
        setLoginInputValue(
            { ...LoginInputValue, [e.target.name]: e.target.value }
        );
    }
    return (
        <div className='Login-Page'>
            {
                ErrorState.ErrorFlag &&
                <div className='Error-Element text-danger border border-3 border-warning'>
                    <span className='d-flex fs-4 me-2'><FaExclamationTriangle /></span>
                    {ErrorState.ErrorMsg}
                </div>
            }
            <div className='Login-Container'>
                <button className='BackHome-btn' style={{ backgroundColor: 'chartreuse' }} onClick={() => {
                    setTimeout(() => {
                        NavigateTo('/')
                    }, 200);
                }}>
                    <FaArrowLeft />
                </button>
                <h3 className='mt-2 fw-bold'>Admin Login</h3>
                <form action="" onSubmit={(e) => handleLoginSubmit(e)}>
                    <label htmlFor="Email" style={(ErrorState.Which_Field === 'Email') ? { color: 'rgba(255, 0, 0, 0.8)' } : { color: '#2B124C' }}>User Email</label>
                    <input type="text" name="Email" id="Email" style={(ErrorState.Which_Field === 'Email') ? { border: '2.5px solid rgba(255, 0, 0, 0.8)' } : { border: '2px solid rgba(255, 255, 255, 0.2)' }} placeholder='Enter Email' onChange={(e) => handleLoginInput(e)} />
                    <br />
                    <label htmlFor="PassWord" style={(ErrorState.Which_Field === 'PassWord') ? { color: 'rgba(255, 0, 0, 0.8)' } : { color: '#2B124C' }}>Password</label>
                    <input type={PassWordToggle?"text":"password"} name="PassWord" id="PassWord" style={(ErrorState.Which_Field === 'PassWord') ? { border: '2.5px solid rgba(255, 0, 0, 0.8)' } : { border: '2px solid rgba(255, 255, 255, 0.2)' }} placeholder='Enter Password' onChange={(e) => handleLoginInput(e)} />
                    <span className='position-absolute fs-4 Eye-Icon' onClick={()=>setPassWordToggle(!PassWordToggle)}>
                        <FaRegEyeSlash/>
                    </span>
                    <br />
                    <input type="submit" value="Login" className='btn btn-light mt-3' />
                </form>
            </div>
        </div>
    )
}

export default AdminLogin