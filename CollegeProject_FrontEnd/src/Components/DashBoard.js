import '../index.css';
import React, { useState } from 'react';
import EditAttendance from '../Components/EditAttendance';
import ViewAttendance from '../Components/ViewAttendance';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaEye, FaEdit, FaSignOutAlt } from 'react-icons/fa';

const DashBoard = ({ Loading }) => {
    // Instance for useNavigate hook
    const NavigateTo = useNavigate();
    // State Variable
    const [WhichDashBoardBox, setWhichDashBoardBox] = useState('Index');
    const [LogOutFlag, setLogOutFlag] = useState(false);
    /* Display Components the MainDashBoard, EditAttendance, ViewAttendance  
       with corresponding Values of Index, Edit, View respectively. */
    function handleDashBoardBoxClick(WhichBox) {
        // (WhichBox === 'Index') ?
        //     Loading(1000) :
        //     Loading(2000);
        setTimeout(() => {
            setWhichDashBoardBox(WhichBox);
        }, 1000);
    }
    // LogOut Page Element
    const LogOutElement =
        <div className='LogOut-Page'>
            <div className='LogOut-Container'>
                <h4>Are You Sure to LogOut</h4>
                <div className='LogOut-Btn'>
                    <button className='btn btn-primary fw-bold px-4 mx-4' onClick={() => handleLogOut()}>Ok</button>
                    <button className='btn btn-danger  fw-bold mx-4' onClick={() => setLogOutFlag(false)}>Cancel</button>
                </div>
            </div>
        </div>
    // Handling LogOut
    function handleLogOut() {
        // Loading
        Loading(1600);
        setLogOutFlag(false);
        setTimeout(() => {
            // LogOut Action
            NavigateTo('/Login');
        }, 1000);
    }
    // Handle LogOut Page Display
    function handleLogOutDisplay() {
        setLogOutFlag(true);
    }
    // 
    function handleAboutClick() {
        Loading(1800);
        setTimeout(() => {
            NavigateTo('/Article');
        }, 500);
    }
    // 
    return (
        <>
            <div className='DashBoard-NavBar'>
                <div className='LogOut-Icon' onClick={() => handleLogOutDisplay()}>
                    <FaSignOutAlt />
                </div>
                <div className='DashBoard-icon'>
                    <FaGraduationCap />
                </div>
                <h3 className='my-3 fw-bold'>DASHBOARD</h3>
                <div
                    className="position-absolute fw-bold About-Button btn btn-success align-self-end mx-2 my-2"
                    onClick={() => handleAboutClick()}>
                    About
                </div>
            </div>
            {
                LogOutFlag && LogOutElement
            }
            {
                WhichDashBoardBox === 'Index' &&
                <div className='DashBoard-Container'>
                    <div className='DashBoard-Box' onClick={() => handleDashBoardBoxClick('Edit')}>
                        <div className='fs-1'>
                            <FaEdit />
                        </div>
                        <h3 className='text-primary mt-3'>Update <br /> Attendance <br /></h3>
                        <p>To Select the Boarding Place and put the Attendance to the corresponding student</p>
                    </div>
                    <div className='DashBoard-Box' onClick={() => handleDashBoardBoxClick('View')}>
                        <div className='fs-1'>
                            <FaEye />
                        </div>
                        <h3 className='text-success'>View <br />Updated Attendance</h3>
                        <p>View the Updated Attendance of the corresponding Boarding Place</p>
                    </div>
                </div>
            }
            {
                WhichDashBoardBox === 'Edit' &&
                <EditAttendance handleDashBoardBoxClick={handleDashBoardBoxClick} Loading={Loading} />
            }
            {
                WhichDashBoardBox === 'View' &&
                <ViewAttendance handleDashBoardBoxClick={handleDashBoardBoxClick} Loading={Loading} />
            }
        </>
    )
}

export default DashBoard


// {
//     !DisplayFlag &&
//     <div className="Attendance-Container">
//         <label htmlFor="Select-Tag" className='Select-Input-label'>BOARDING PLACE</label>
//         <select name="Select-Tag" id="Select-Tag" onChange={(e) => { handleSelectInput(e) }}>
//             <option value="Select">Select</option>
//             {
//                 RoutePoints.map((each, index) =>
//                     (<option key={index} value={each}>{each}</option>)
//                 )
//             }
//         </select>
//         <button className='View-btn' onClick={() => handleViewsBtnClick()}>ATTENDANCE</button>
//     </div>
// }
// {
//     DisplayFlag &&
//     <DataPage
//         SheetData={SheetData}
//         SelectedValue={SelectedValue}
//         UpdateSheetData={UpdateSheetData}
//         handleViewsBtnClick={handleViewsBtnClick}
//         handleCheckBoxClick={handleCheckBoxClick}
//         handleStudentDelete={handleStudentDelete}
//     />
// }