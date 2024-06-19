import React from 'react';
import './InitialPage.css';
import { useNavigate } from 'react-router-dom';
import MahendraLogo from '../Assets/Mahendra-LOGO.png';

const Firstpage = ({ Loading }) => {
    const NavigateTo = useNavigate();

    function Navigate_Login() {
        // Loading(2000);
        setTimeout(() => {
            NavigateTo('/Login');
        }, 400);
    }

    function Navigate_Signup() {
        // Loading(2000);
        setTimeout(() => {
            NavigateTo('/SignUp');
        }, 400);
    }

    function handleAdminBtnClick(){
        setTimeout(() => {
            NavigateTo("/AdminLogin")
        }, 400);
    }

    return (
        <div className='FirstPage-Container'>
            <button className='FileUpload-Login fw-bold btn btn-success' onClick={handleAdminBtnClick}>Admin</button>
            <div className='Details-Container'>
                <div className="Logo-header-section text-center">
                    <img src={MahendraLogo} alt="LOGO" className="Logo" />
                    <h2>MEIBUS</h2>
                    <h4>Mahendra Educational Institution <br />Mallasumdram, Namakkal <br /> <strong> 637 503</strong></h4>
                </div>
                <div className="Home-Page-btns">
                    <button className='btn btn-danger  fw-bold px-3' onClick={Navigate_Login}>Login</button>
                    <button className='btn btn-primary fw-bold' onClick={Navigate_Signup}>SignUp</button>
                </div>
            </div>
        </div>
    )
}

export default Firstpage