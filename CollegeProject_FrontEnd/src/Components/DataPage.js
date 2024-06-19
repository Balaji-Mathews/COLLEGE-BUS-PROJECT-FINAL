import './DataPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
// 
const DataPage = ({ Loading, SheetData, SelectedValue, UpdateSheetData, setDisplayFlag, handleCheckBoxClick, handleStudentDelete }) => {
    // State Variables
    const [DisplaySheetData, setDisplaySheetData] = useState(SheetData || []);
    const [NewStudentTab, setNewStudentTabFlag] = useState(false);
    const [UpdateStudentTab, setUpdateStudentTabFlag] = useState(false);
    const [DeleteElementFlag, setDeleteElementFlag] = useState(false);
    const [DeleteStudentId, setDeleteStudentId] = useState(null);
    // Constant Object for NewStudent
    const NewStudent = {
        ID: null,
        NAME: null,
        ROLL_NUMBER: null,
        COLLEGE: null,
        DEPARTMENT: null,
        YEAR: null,
        BOARDING_POINT: null
    }
    // Constant Object for UpdateStudent
    const [UpdateStudent, setUpdate_Student] = useState({
        ID: null,
        NAME: null,
        ROLL_NUMBER: null,
        COLLEGE: null,
        DEPARTMENT: null,
        YEAR: null,
        BOARDING_POINT: null
    });
    // Instance for useNavigate hook
    const NavigateTo = useNavigate();
    // New-Student-Addition 
    function handleNewStudentInput(e) {
        NewStudent.ID = SheetData.length + 1;
        NewStudent[e.target.name] = e.target.value;
    }
    // 
    async function handleNewStudentSubmit(e) {
        e.preventDefault();
        const response = await axios.post('https://collegeproject-backend.onrender.com/api/students/newStudent', NewStudent);
        UpdateSheetData(response.data);
        setNewStudentTabFlag(false);
    }
    // Update-Existing_Student's-Data
    function handleUpdateStudentInput(e) {
        setUpdate_Student({ ...UpdateStudent, [e.target.name]: e.target.value });
    }
    // 
    async function handleUpdateStudentSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.put(`https://collegeproject-backend.onrender.com/api/students/updateStudent/${String(UpdateStudent.ID)}`, UpdateStudent);
            if (response.status === 202) {
                UpdateSheetData(response.data);
                setUpdateStudentTabFlag(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 
    useEffect(() => {
        setDisplaySheetData(SheetData)
    }, [SheetData]);
    // 
    async function handleSubmit() {
        try {
            const response = await axios.put('https://collegeproject-backend.onrender.com/api/students/attendance', SheetData);
            if (response.status === 202) {
                // Loading
                Loading(2600);
                setTimeout(() => {
                    NavigateTo('/UpdatedPage')
                }, 2000);
            }
        } catch (error) {
            console.log(error)
        }
    }
    // Search feature (Filter Students) with Reference of NAME OR ROLL_NO Field
    function handleFilterInput(e) {
        let Which_Field = 'NAME';
        let Sub_String = e.target.value;
        Sub_String = Sub_String.toUpperCase();
        (!isNaN(Sub_String.substring(0, 2))) ? Which_Field = "ROLL_NUMBER" : Which_Field = "NAME";
        const FilteredData = SheetData.filter((each) => String(each[Which_Field]).includes(Sub_String));
        setDisplaySheetData(FilteredData);
    }
    // 
    const DeleteElement =
        <div className='DeleteElement-Page'>
            <div className='DeleteElement-Container'>
                <h4>Are You Sure to Delete</h4>
                <div className='DeleteElement-Btn'>
                    <button className='btn btn-primary fw-bold px-4 mx-4' onClick={() => { handleStudentDelete(DeleteStudentId); setDeleteElementFlag(false) }}>Ok</button>
                    <button className='btn btn-danger  fw-bold mx-4' onClick={() => setDeleteElementFlag(false)}>Cancel</button>
                </div>
            </div>
        </div>
    // 
    return (
        <>
            {
                (!NewStudentTab && !UpdateStudentTab) &&
                <div className='Data-Page-Container'>
                    <nav>
                        <div className='Back_To_DashBoard mx-1 bg-danger' onClick={() => setDisplayFlag(false)}>
                            <FaArrowLeft />
                        </div>
                        <input
                            type="text"
                            name='filterInput'
                            placeholder='Search Student . . .'
                            className='Filter-Input'
                            onChange={(e) => handleFilterInput(e)}
                        />
                        <h4 className='my-2 fw-bold'>{SelectedValue}</h4>
                    </nav>
                    <div className='Table-Container'>
                        <table className='m-auto'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>ROLL NO</th>
                                    <th>COLLEGE</th>
                                    <th>DEPARTMENT</th>
                                    <th>YEAR</th>
                                    <th>BOARDING_POINT</th>
                                    <th>ATTENDANCE</th>
                                    <th>EDIT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    DisplaySheetData.map((Each) =>
                                    (<tr key={Each.ID}>
                                        <td className='text-center text-warning fw-bold'>{Each.ID}</td>
                                        <td>{Each.NAME}</td>
                                        <td className='text-center'>{Each.ROLL_NUMBER}</td>
                                        <td className='text-center'>{Each.COLLEGE}</td>
                                        <td className='text-center'>{Each.DEPARTMENT}</td>
                                        <td className='text-center'>{Each.YEAR}</td>
                                        <td className='text-center'>{Each.BOARDING_POINT}</td>
                                        <td>
                                            <div className='Main-Checkbox-container'>
                                                <div className="checkbox-container">
                                                    <label htmlFor={Each.ID} className='text-primary'>Present</label>
                                                    <input type="radio" name={Each.ID} id="Radio1" value={'P'} defaultChecked onClick={(e) => { handleCheckBoxClick(e, Each.ID) }} />
                                                </div>
                                                <div className="checkbox-container">
                                                    <label htmlFor={Each.ID} className='text-warning'>Absent</label>
                                                    <input type="radio" name={Each.ID} id="Radio2" value={'A'} onClick={(e) => { handleCheckBoxClick(e, Each.ID) }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='d-flex border-0'>
                                            <button className='btn btn-primary mx-1 my-1' onClick={() => {
                                                // Default to Set Unchanged Data of Clicked Student 
                                                // while updating Single field in that Specific Student
                                                setUpdate_Student({
                                                    ID: Each.ID,
                                                    NAME: Each.NAME,
                                                    ROLL_NUMBER: Each.ROLL_NUMBER,
                                                    COLLEGE: Each.COLLEGE,
                                                    DEPARTMENT: Each.DEPARTMENT,
                                                    YEAR: Each.YEAR,
                                                    BOARDING_POINT: Each.BOARDING_POINT
                                                });
                                                setUpdateStudentTabFlag(true);
                                            }}>Update</button>
                                            <button className='btn btn-danger mx-1 my-1' onClick={() => { setDeleteStudentId(Each.ID); setDeleteElementFlag(true) }}>Delete</button>
                                        </td>
                                    </tr>)
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <footer>
                        <button className='NewStudent-btn bg-primary' onClick={() => setNewStudentTabFlag(true)}>
                            <FaPlus />
                        </button>
                        <button onClick={handleSubmit} className='Submit-btn'>Submit</button>
                    </footer>
                </div>
            }
            {
                DeleteElementFlag && DeleteElement
            }
            {
                NewStudentTab &&
                <div className='NewStudent-Input-Container'>
                    <form action="" onSubmit={(e) => handleNewStudentSubmit(e)}>
                        <div className='Back-to-DashBoard text-light' onClick={() => setNewStudentTabFlag(false)}>
                            <FaArrowLeft />
                        </div>
                        <strong className='fs-5'>ADD NEW STUDENT</strong>
                        <input type="text" name="NAME" id="" placeholder='ENTER NAME' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="text" name="ROLL_NUMBER" id="" placeholder='ENTER ROLL NO' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="text" name="COLLEGE" id="" placeholder='ENTER COLLEGE' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="text" name="DEPARTMENT" id="" placeholder='ENTER DEPARTMENT' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="text" name="YEAR" id="" placeholder='ENTER YEAR' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="text" name="BOARDING_POINT" id="" placeholder='ENTER BOARDING POINT' onChange={(e) => handleNewStudentInput(e)} />
                        <input type="submit" value="Submit" className='btn btn-primary fw-bold' />
                    </form>
                </div>
            }
            {
                UpdateStudentTab &&
                <div className='UpdateStudent-Input-Container'>
                    <form action="" onSubmit={(e) => handleUpdateStudentSubmit(e)}>
                        <div className='Back-to-DashBoard text-light' onClick={() => setUpdateStudentTabFlag(false)}>
                            <FaArrowLeft />
                        </div>
                        <strong className='fs-5'>{UpdateStudent.NAME}</strong>
                        <input type="text" name="NAME" id="" placeholder='ENTER NAME' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="text" name="ROLL_NUMBER" id="" placeholder='ENTER ROLL NO' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="text" name="COLLEGE" id="" placeholder='ENTER COLLEGE' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="text" name="DEPARTMENT" id="" placeholder='ENTER DEPARTMENT' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="text" name="YEAR" id="" placeholder='ENTER YEAR' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="text" name="BOARDING_POINT" id="" placeholder='ENTER BOARDING POINT' onChange={(e) => handleUpdateStudentInput(e)} />
                        <input type="submit" value="Update" className='btn btn-danger fw-bold' />
                    </form>
                </div>
            }
        </>
    )
}

export default DataPage