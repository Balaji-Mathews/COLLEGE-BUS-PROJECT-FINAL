import './InitialPage.css';
import { FaCloudUploadAlt, FaArrowLeft } from 'react-icons/fa';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const NavigateTo = useNavigate();
    const [file, setFile] = useState('');
    const [fileName, setfileName] = useState('');
    const [DisplayFileName, setDisplayFileName] = useState('Upload (.xlsx) File Only');
    // 
    async function handleFileSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("File", file);
        formData.append("FileName", fileName);
        try {
            await axios.post("https://collegeproject-backend.onrender.com/handleFile", formData);
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        setDisplayFileName('File Uploaded Successfully!');
    }
    // 
    function handleInputChange(e) {
        setFile(e.target.files[0]);
        setfileName(e.target.files[0].name);
        setDisplayFileName(e.target.files[0].name);
    }
    // 
    return (
        <div className='fileUpload-Container'>
            <div className='Form-Container bg-light' onSubmit={(e) => handleFileSubmit(e)}>
                <button className='BackHome-btn' style={{ backgroundColor: 'chartreuse' }} onClick={() => {
                    setTimeout(() => {
                        NavigateTo('/')
                    }, 200);
                }}>
                    <FaArrowLeft />
                </button>
                {/* <h4>File Upload</h4> */}
                <div className='FileInput-Container'>
                    <FaCloudUploadAlt />
                    <h5>{DisplayFileName}</h5>
                </div>
                <form action="">
                    <input type="file" accept='.xlsx, .csv' className='fileInput mt-3 me-2' name="File" id="File" onChange={(e) => handleInputChange(e)} />
                    <input type="submit" className='mb-3 BtnClicked fw-bold btn btn-primary' value="Upload" />
                </form>
            </div>
        </div>
    )
}

export default FileUpload