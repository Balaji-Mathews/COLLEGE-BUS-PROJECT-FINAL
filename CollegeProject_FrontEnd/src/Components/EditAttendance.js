import '../index.css';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DataPage from '../Components/DataPage';
import { FaArrowLeft } from 'react-icons/fa'

const EditAttendance = ({ Loading, handleDashBoardBoxClick }) => {
    // Instance for Date Constructor (Object)
    const date = new Date();
    // State Variables
    const [RoutePoints, setRoutes] = useState([]);
    const [SheetData, setSheetData] = useState([]);
    const [DisplayFlag, setDisplayFlag] = useState(false);
    const [ValidateFlag, setValidateFlag] = useState(false);
    const [SelectedValue, setSelectedValue] = useState('Select');
    // TodayDate
    const TodayDate = String(date.getDate()).padStart(2, 0) + "/" + String(date.getMonth() + 1).padStart(2, 0) + "/" + String(date.getFullYear()).padStart(2, 0);
    /* Getting RoutesPoints Names When Onload of the Browser Using UseEffect Hook for DropDown Options */
    useEffect(() => {
        const route = async () => {
            const response = await axios.get('https://collegeproject-backend.onrender.com/api/route');
            setRoutes(response.data);
        }
        route();
    }, [TodayDate]);
    // Getting the DropDown (SelectInput) Selected Value
    function handleSelectInput(e) {
        setValidateFlag(false);
        setSelectedValue(e.target.value);
    }
    /* Display the Students Table to Corresponding BoardPlace */
    async function handleViewsBtnClick() {
        /* Get the ID Value Based on selected DropDown Value by checking index value
           in the RoutePoint state array variable, if exist */
        if (SelectedValue !== 'Select') {
            const ID = RoutePoints.indexOf(SelectedValue) + 1;
            const response = await axios.get(`https://collegeproject-backend.onrender.com/api/students/route/${String(ID)}`);
            setSheetData(response.data);
            // Set TodayDate and set Default Attendance as Present to all Students 
            setSheetData(PrevData =>
                PrevData.map((Each) => ({ ...Each, [TodayDate]: "P" }))
            );
            // Loading
            Loading(3250);
            setTimeout(() => {
                setDisplayFlag(!DisplayFlag);
            }, 1400);
        }
        else {
            setValidateFlag(true);
        }
    }
    // Handling Present & Absent CheckBox Click
    // defaultChecked is used
    function handleCheckBoxClick(e, id) {
        setSheetData(
            SheetData.map((Each) => (Each.ID === id) ? { ...Each, [TodayDate]: e.target.value } : Each)
        );
    }
    // Handling Delete the Student with ID as a Reference
    async function handleStudentDelete(Which_Id) {
        try {
            const response = await axios.delete(`https://collegeproject-backend.onrender.com/api/students/removeStudent/${Which_Id}`);
            setSheetData(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    // This is Props Function
    function UpdateSheetData(UpdatedData) {
        setSheetData(UpdatedData);
    }
    // 
    return (
        <>
            {
                !DisplayFlag &&
                <div className="Attendance-Container">
                    <div className='Back-to-DashBoard text-light' onClick={() => handleDashBoardBoxClick('Index')}>
                        <FaArrowLeft />
                    </div>
                    <label htmlFor="Select-Tag" className='Select-Input-label'>BOARDING PLACE</label>
                    <select name="Select-Tag" id="Select-Tag" onChange={(e) => { handleSelectInput(e) }}>
                        <option value="Select">Select</option>
                        {
                            RoutePoints.map((each, index) =>
                                (<option key={index} value={each} className='text-start bg-light fw-bold'>{each}</option>)
                            )
                        }
                    </select>
                    {
                        ValidateFlag &&
                        <pre className='position-absolute top-100 mt-5 p-2 text-danger bg-light rounded border border-2 border-primary text-center fw-bold'>!Please Select Boarding Place</pre>
                    }
                    <button className='btn btn-success mb-2 fw-bold px-3' onClick={() => handleViewsBtnClick()}>EDIT</button>
                </div>
            }
            {
                DisplayFlag &&
                <DataPage
                    Loading={Loading}
                    SheetData={SheetData}
                    SelectedValue={SelectedValue}
                    setDisplayFlag={setDisplayFlag}
                    UpdateSheetData={UpdateSheetData}
                    handleCheckBoxClick={handleCheckBoxClick}
                    handleStudentDelete={handleStudentDelete}
                />
            }
        </>
    )
}

export default EditAttendance