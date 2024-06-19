import './DataPage.css';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { FaArrowLeft } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

const ViewAttendance = ({ handleDashBoardBoxClick, Loading }) => {
  // State Variables
  const [SheetsData, setSheetsData] = useState([]);
  const [Route_Points, setRoute_Points] = useState([]);
  const [Displayflag, setDisplayflag] = useState(false);
  const [Selectedvalue, set_SelectedValue] = useState('Select');
  const [ValidateFlag, setValidateFlag] = useState(false);
  const [DisplaySheetsData, setDisplaySheetsData] = useState(SheetsData || []);
  /* Getting RoutesPoints Names When Onload of the Browser Using UseEffect Hook for DropDown Options*/
  useEffect(() => {
    const RouteFunction = async () => {
      const response = await axios.get('https://collegeproject-backend.onrender.com/api/route');
      setRoute_Points(response.data);
    }
    RouteFunction();
  }, []);
  // Getting the DropDown (SelectInput) Selected Value
  function handleSelectInput(e) {
    setValidateFlag(false);
    set_SelectedValue(e.target.value);
  }
  /* Display the Students Table to Corresponding BoardPlace */
  async function handleViewDataClick() {
    /* Get the ID Value Based on selected DropDown Value by checking index value
       in the RoutePoint state array variable, if exist */
    if (Selectedvalue !== 'Select') {
      const Which_ID = Route_Points.indexOf(Selectedvalue) + 1;
      const response = await axios.get(`https://collegeproject-backend.onrender.com/api/students/route/${String(Which_ID)}`);
      setSheetsData(response.data);
      // Loading 
      Loading(3250);
      setTimeout(() => {
        setDisplayflag(!Displayflag);
      }, 1400);
    }
    else {
      setValidateFlag(true);
    }
  }
  // Search Feature, Filtering student based on entered input value.
  function handleFilterInput(e) {
    // Default Field Value
    let WhichField = "NAME";
    if (!isNaN(e.target.value[0]) && !isNaN(e.target.value.substring(0, 2))) {
      // Searching or Filtering based on RollNo of the student
      // Checking if first and first two values of the Entered input value is Number, Then Field value is set as ROLL_NUMBER.
      WhichField = "ROLL_NUMBER";
    }
    else {
      // If First and First two values of the Entered Input value is not a Number, Then default as NAME Field.
      WhichField = "NAME";
    }
    // Converts the Input Element value to UpperCase
    const SubString = e.target.value.toUpperCase();
    // Filtering the student Based on the SubString using includes() Method
    const FilterData = SheetsData.filter(Each => String(Each[WhichField]).includes(SubString));
    setDisplaySheetsData(FilterData);
  }
  // Constantly Updates the DisplaySheetValue state Variable, when The Main SheetData state Variable
  useEffect(() => {
    setDisplaySheetsData(SheetsData);
  }, [SheetsData]);
  // 
  async function handleExportXlsx() {
    try {
      const response = await axios.get("https://collegeproject-backend.onrender.com/fileDownload", {
        responseType: 'blob'
      });
      console.log(response.data);
      fileDownload(response.data,"Bus_Attendance_File123.xlsx");
    } catch (error) {
      console.log(error)
    }
  }
  // 
  const HeadingArray = DisplaySheetsData.map((EachOne) => Object.keys(EachOne))[0];
  // 
  return (
    <>
      {
        !Displayflag &&
        <div className="Attendance-Container">
          <div className='Back-to-DashBoard text-light' onClick={() => handleDashBoardBoxClick('Index')}>
            <FaArrowLeft />
          </div>
          <label htmlFor="Select-Tag" className='Select-Input-label'>BOARDING PLACE</label>
          <select name="Select-Tag" id="Select-Tag" onChange={(e) => { handleSelectInput(e) }}>
            <option value="Select">Select</option>
            {
              Route_Points.map((each, index) =>
                (<option key={index} value={each} className='text-start bg-light fw-bold'>{each}</option>)
              )
            }
          </select>
          {
            ValidateFlag &&
            <pre className='position-absolute top-100 mt-5 p-2 text-danger bg-light rounded border border-2 border-primary text-center fw-bold'>!Please Select Boarding Place</pre>
          }
          <footer>
            <button className='btn btn-success fw-bold px-3' onClick={() => handleViewDataClick()}>VIEW</button>
            <button className='btn btn-info fw-bold ms-4' onClick={handleExportXlsx}>DOWNLOAD</button>
          </footer>
        </div>
      }
      {
        Displayflag &&
        <div className='Data-Page-Container'>
          <nav>
            <div className='Back_To_DashBoard mx-1 bg-danger' onClick={() => setDisplayflag(false)}>
              <FaArrowLeft />
            </div>
            <input
              type="text"
              name='filterInput'
              placeholder='Search Student . . .'
              className='Filter-Input'
              onChange={(e) => handleFilterInput(e)}
            />
            <h4 className='my-2 fw-bold'>{Selectedvalue}</h4>
          </nav>
          <div className='Table-Container'>
            <table className='m-auto'>
              <thead>
                <tr>
                  {
                    HeadingArray.map((e, index) =>
                      (index > 2 && index < 7) ? null : <th key={index}>{e}</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                {
                  DisplaySheetsData.map((Each) =>
                  (
                    <tr key={Each.ID}>
                      {
                        Object.values(Each).map((e, i) =>
                        ((i < 7 && (i <= 2 || i === 7)) ?
                          ((i === 0) ? <td key={i} className='text-warning fw-bold text-center'>{e}</td> : <td key={i} className='fw-bold'>{e}</td>) :
                          ((e === "A" && i >= 7) ?
                            <td key={i} className='text-center fw-bold text-danger'>ABSENT</td> :
                            (e === "P" && i >= 7) ?
                              <td key={i} className='text-center fw-bold text-primary'>PRESENT</td> :
                              null))
                        )
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </>
  )
}

export default ViewAttendance