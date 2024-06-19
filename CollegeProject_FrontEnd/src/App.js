import './index.css';
import { useState } from 'react';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import Article from './Components/Article';
import Firstpage from './Components/FirstPage';
import DashBoard from './Components/DashBoard';
import FileUpload from './Components/FileUpload';
import AdminLogin from './Components/AdminLogin';
import UpdatedPage from './Components/UpdatedPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [DisplayLoader, setDisplayLoader] = useState(false);
  // Loading Function
  function Loading(Timer) {
    setTimeout(() => {
      setDisplayLoader(true);
    }, 250);
    setTimeout(() => {
      setDisplayLoader(false)
    }, Timer);
  }
  // Loader Element
  const LoaderElement =
    <div className='Loading-Container'>
      <div className='Loading-Box'>
        <div
          className="Loader"
          style={(DisplayLoader) ? { animation: 'Loading-Animation 1s linear 0.1s infinite' } : { animation: 'none' }}>
        </div>
        <h3 className='text-primary bg-light border border-3 border-primary rounded fw-bold p-2'>! Loading . . .</h3>
      </div>
    </div>
  // 
  return (
    // Routes
    <BrowserRouter>
      <div className='App'>
        { 
          // Display Loader Element of => "Position = absoulte && Z-Index = 1", 
          // This is for display Loader Element Over an All Elements in the UI
          DisplayLoader && LoaderElement
        }
        <Routes>
          <Route index element={<Firstpage Loading={Loading} />} />
          <Route path='/Login' element={<Login Loading={Loading} />} />
          <Route path='/SignUp' element={<Signup Loading={Loading} />} />
          <Route path='/Article' element={<Article Loading={Loading}/>} />
          <Route path='/DashBoard' element={<DashBoard Loading={Loading}/>} />
          <Route path='/AdminLogin' element={<AdminLogin Loading={Loading}/>} />
          <Route path='/UpdatedPage' element={<UpdatedPage Loading={Loading}/>} />
          <Route path='/FileUploadPage' element={<FileUpload Loading={Loading}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;