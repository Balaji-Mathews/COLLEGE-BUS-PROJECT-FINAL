import './InitialPage.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaRegEyeSlash } from 'react-icons/fa'

const StandardEmail = /^[\w.%+-]{5,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const StandardPassWord = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const Signup = ({ Loading }) => {
    const NavigateTo = useNavigate();
    const [ErrorState, setErrorState] = useState({ ErrorFlag: false, ErrorMsg: '', Which_Field: '' });
    const [PassWordToggle1, setPassWordToggle1] = useState(false);
    const [PassWordToggle2, setPassWordToggle2] = useState(false);
    const [SignUpInputValue, setSignUpInputValue] = useState(
        {
            Email: '',
            PassWord: '',
            ConfirmPassWord: ''
        }
    );
    async function handleSignUpSubmit(e) {
        e.preventDefault();
        if (SignUpInputValue.Email !== '' &&
            SignUpInputValue.PassWord !== '' &&
            SignUpInputValue.ConfirmPassWord !== '' &&
            StandardEmail.test(SignUpInputValue.Email) &&
            StandardPassWord.test(SignUpInputValue.PassWord) &&
            StandardPassWord.test(SignUpInputValue.ConfirmPassWord) &&
            SignUpInputValue.PassWord === SignUpInputValue.ConfirmPassWord) {
            // 
            try {
                const response = await axios.post('https://collegeproject-backend.onrender.com/api/admin/signup', SignUpInputValue);
                if (response.data === 'User registered successfully') {
                    Loading(2500);
                    setErrorState({ ErrorFlag: false, ErrorMsg: '' });
                    setTimeout(() => {
                        NavigateTo('/Login');
                    }, 1000);
                }

            } catch (error) {
                SignUpInputValue.Email = '';
                SignUpInputValue.PassWord = '';
                SignUpInputValue.ConfirmPassWord = '';
                setErrorState({ ErrorFlag: true, ErrorMsg: error.response.data, Which_Field: '' });
            }
        }
        else {
            if (SignUpInputValue.Email === '') {
                return setErrorState({ ErrorFlag: true, ErrorMsg: "Email Field is Required", Which_Field: 'Email' });
            }
            if (!StandardEmail.test(SignUpInputValue.Email)) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: "Please Enter Valid Email", Which_Field: 'Email' });
            }
            if (SignUpInputValue.PassWord === '' || SignUpInputValue.ConfirmPassWord === '') {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'PassWord Field is Required', Which_Field: 'PassWord' });
            }
            if (SignUpInputValue.PassWord.length < 8) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: 'PassWord Must Contain Minimum 8 Charcters', Which_Field: 'PassWord' });
            }
            if (!StandardPassWord.test(SignUpInputValue.PassWord)) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: "Please Enter Valid PassWord", Which_Field: 'PassWord' })
            }
            if (SignUpInputValue.PassWord !== SignUpInputValue.ConfirmPassWord) {
                return setErrorState({ ErrorFlag: true, ErrorMsg: "PassWord Doesn't Match", Which_Field: 'CPassWord' });
            }
        }
    }
    function handleSignUpInput(e) {
        setSignUpInputValue(
            { ...SignUpInputValue, [e.target.name]: e.target.value }
        );
    }
    return (
        <div className='SignUp-Page'>
            {
                ErrorState.ErrorFlag &&
                <div className='Error-Element text-danger border border-3 border-warning'>
                    <span className='d-flex fs-4 me-2'><FaExclamationTriangle /></span>
                    {ErrorState.ErrorMsg}
                </div>
            }
            <div className='SignUp-Container'>
                <button className='BackHome-btn' style={{ backgroundColor: 'deeppink' }} onClick={() => {
                    setTimeout(() => {
                        NavigateTo('/')
                    }, 200);
                }}>
                    <FaArrowLeft />
                </button>
                <h2 className='mt-3 fw-bold'>SignUp</h2>
                <form action="" onSubmit={(e) => handleSignUpSubmit(e)}>
                    <label htmlFor="Email" style={(ErrorState.Which_Field === 'Email') ? { color: 'rgba(255, 0, 0, 0.8)' } : { color: '#2B124C' }}>User Email</label>
                    <input type="email" value={SignUpInputValue.Email} name="Email" id="Email" style={(ErrorState.Which_Field === 'Email') ? { border: '2.5px solid rgba(255, 0, 0, 0.8)' } : { border: '2px solid rgba(255, 255, 255, 0.2)' }} placeholder='Enter Email' onChange={(e) => handleSignUpInput(e)} />
                    <br />
                    <label htmlFor="PassWord" style={(ErrorState.Which_Field === 'PassWord') ? { color: 'rgba(255, 0, 0, 0.8)' } : { color: '#2B124C' }}>Password</label>
                    <input type={PassWordToggle1?"text":"password"} value={SignUpInputValue.PassWord} name="PassWord" id="PassWord" style={(ErrorState.Which_Field === 'PassWord') ? { border: '2.5px solid rgba(255, 0, 0, 0.8)' } : { border: '2px solid rgba(255, 255, 255, 0.2)' }} placeholder='Enter Password' onChange={(e) => handleSignUpInput(e)} />
                    <span className='position-absolute fs-4' style={{left: "180px", top: "118px"}} onClick={()=>setPassWordToggle1(!PassWordToggle1)}>
                        <FaRegEyeSlash/>
                    </span>
                    <br />
                    <label htmlFor="ConfirmPassWord" style={(ErrorState.Which_Field === 'CPassWord') ? { color: 'rgba(255, 0, 0, 0.8)' } : { color: '#2B124C' }}>Confirm Password</label>
                    <input type={PassWordToggle2?"text":"password"} value={SignUpInputValue.ConfirmPassWord} name="ConfirmPassWord" id="ConfirmPassWord" style={(ErrorState.Which_Field === 'CPassWord') ? { border: '2.5px solid rgba(255, 0, 0, 0.8)' } : { border: '2px solid rgba(255, 255, 255, 0.2)' }} placeholder='Confirm Password' onChange={(e) => handleSignUpInput(e)} />
                    <span className='position-absolute fs-4' style={{left: "180px", bottom: "66px"}} onClick={()=>setPassWordToggle2(!PassWordToggle2)}>
                        <FaRegEyeSlash/>
                    </span>
                    <input type="submit" value="SignUp" className='btn btn-light mt-4 text-light' />
                </form>
            </div>
        </div>
    )
}

export default Signup