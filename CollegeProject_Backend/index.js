const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Path = require('path');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const app = express();
const { removeSync, existsSync } = require('fs-extra');
const { readFile, writeFile, utils } = require('xlsx');
// Some Contants
// const date = new Date();
const PORT = process.env.PORT_NO || 8080;
const maxFileSize = 10 * 1000 * 1000;
// const TodayDateTime = (String(date.getDate()).padStart(2, 0) + "-" + String(date.getMonth() + 1).padStart(2, 0) + "-" + String(date.getFullYear()))
// 
//const HomeRootPath = Path.join(os.homedir() + "/Desktop" + `Bus_Attendanc_File.xlsx`);
// Excel File Path 
let Excel_File_Path = Path.join(__dirname + '/uploadedFiles/Bus_Attendance_File.xlsx');
// const Excel_File_Path = Path.join(__dirname + '/Bus_Attendance_File.xlsx');
let WorkBook = readFile(Excel_File_Path);
let RouteNames = WorkBook.SheetNames; // Routes Names
// Default sheet 
let SheetName = WorkBook.SheetNames[0];
let WorkSheet = WorkBook.Sheets[SheetName];
let Json_Data = utils.sheet_to_json(WorkSheet);
// Custom Middleware
function UserIndexHandler(request, response, next) {
  const { params: { id }, } = request;
  const ParsedID = parseInt(id);
  if (isNaN(ParsedID)) return response.sendStatus(400);
  const WhichIndex = Json_Data.findIndex(Each => Each.ID === ParsedID);
  if (WhichIndex === -1) return response.sendStatus(404);
  request.WhichIndex = WhichIndex;
  next();
}
// MiddleWares
app.use(cors());
app.use(express.json());
app.use(express.static("./uploadedFiles"))
// Multer Works below here
let fileStorage = multer.diskStorage({
  destination: function (request, file, callBack) {
    callBack(null, "./uploadedFiles")
  },
  filename: function (request, file, callBack) {
    callBack(null, file.originalname);
  }
});
// Main Multer Configurations
let upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: function (request, file, callBack) {
    const fileTypes = ['.xlsx', '.xls'];
    if (fileTypes.includes(Path.extname(file.originalname))) {
      callBack(null, true);
    }
    else {
      callBack("Error: File Type Must be xlsx", false);
    }
  }
});
// 
let uploadHandler = upload.single("File");
// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a user schema and model
const UserSchema = new mongoose.Schema({
  Email: String,
  PassWord: String
});
// 
// app.get("/",(request, response)=>{
//   response.status(200).send("Hi Working");
// });
// 
const User = mongoose.model('User', UserSchema);
// Route to handle the Register endpoint
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { Email, PassWord, ConfirmPassWord } = req.body;

    if (Email && PassWord && ConfirmPassWord && PassWord === ConfirmPassWord) {
      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }

      const hashedPassword = await bcrypt.hash(PassWord, 10);
      const user = new User({ Email, PassWord: hashedPassword });
      await user.save();
      return res.status(201).send('User registered successfully');
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
// Route to handle the Login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { Email, PassWord } = req.body;
    // Check if required fields are not empty
    if (Email && PassWord) {
      const user = await User.findOne({ Email });
      if (!user) {
        return res.status(404).send('User not found');
      }
      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(PassWord, user.PassWord);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
      }
      return res.status(200).send('Login Successfully');
    } else {
      // If any required field is missing, return a 400 Bad Request status code
      return res.status(400).send('Missing required data');
    }
  } catch (error) {
    // Handle any errors that occur during login
    return res.status(500).send(error.message);
  }
});
// Route for Handling and Uploading New Main xlsx File by Admin
app.post("/handleFile", (request, response, next) => {
  if (existsSync(Path.join(__dirname + "/uploadedFiles"))) {
    removeSync("uploadedFiles");
  }
  next();
}, (request, response, next) => {
  if (!existsSync(Path.join(__dirname + "/uploadedFiles"))) {
    setTimeout(() => {
      fs.mkdir("uploadedFiles", (err) => {
        if (err) throw new Error(err);
      })
    }, 40);
  }
  next();
}, (request, response) => {
  setTimeout(() => {
    if (existsSync(Path.join(__dirname + "/uploadedFiles"))) {
      uploadHandler(request, response, function (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return response.status(400).send("Error: File Size must below 10mb");
          }
          return response.status(400).send(err);
        }
        else {
          return response.status(202).send("File Uploaded Successfully!");
        }
      })
    }
  }, 60);
});
// 
app.get('/fileDownload', (request, response) => {
  const filePath = Path.join(__dirname, "uploadedFiles", "Bus_Attendance_File.xlsx");
  response.download(filePath);
});
// 
app.get('/api/students', (request, response) => {
  response.status(200).send(JSON.stringify(Json_Data));
});
// 
app.get('/api/route', (request, response) => {
  Excel_File_Path = Path.join(__dirname + '/uploadedFiles/Bus_Attendance_File.xlsx');
  WorkBook = readFile(Excel_File_Path);
  RouteNames = WorkBook.SheetNames
  response.status(201).send(JSON.stringify(RouteNames));
});
// 
app.get('/api/students/route/:id', (request, response) => {
  const { params: { id }, } = request;
  const ParsedID = parseInt(id) - 1;
  if (ParsedID === -1) return response.sendStatus(404);
  Excel_File_Path = Path.join(__dirname + '/uploadedFiles/Bus_Attendance_File.xlsx');
  WorkBook = readFile(Excel_File_Path);
  RouteNames = WorkBook.SheetNames
  SheetName = WorkBook.SheetNames[ParsedID];
  WorkSheet = WorkBook.Sheets[SheetName];
  Json_Data = utils.sheet_to_json(WorkSheet);
  response.status(202).send(JSON.stringify(Json_Data));
});
// 
app.post('/api/students/newStudent', (request, response) => {
  const { body } = request;
  Json_Data.push(body); 
  const UpdatedSheet = utils.json_to_sheet(Json_Data);
  WorkBook.Sheets[SheetName] = UpdatedSheet;
  writeFile(WorkBook, Excel_File_Path);
  response.status(202).send(JSON.stringify(Json_Data));
});
// 
app.put('/api/students/updateStudent/:id', UserIndexHandler, (request, response) => {
  const { body, WhichIndex } = request;
  Json_Data[WhichIndex] = { ...Json_Data[WhichIndex], ...body }
  const UpdatedSheet = utils.json_to_sheet(Json_Data);
  WorkBook.Sheets[SheetName] = UpdatedSheet;
  writeFile(WorkBook, Excel_File_Path);
  response.status(202).send(JSON.stringify(Json_Data));
});
// 
app.put('/api/students/attendance', (request, response) => {
  const { body } = request;
  const UpdatedSheet = utils.json_to_sheet(body);
  WorkBook.Sheets[SheetName] = UpdatedSheet;
  writeFile(WorkBook, Excel_File_Path);
  response.status(202).send("Attendance Updated Successfully");
});
// 
app.delete('/api/students/removeStudent/:id', UserIndexHandler, (request, response) => {
  const { WhichIndex } = request;
  Json_Data.splice(WhichIndex, 1);
  Json_Data.map(each => (each.ID > WhichIndex) ? (each.ID--) : each.ID);
  const UpdatedSheet = utils.json_to_sheet(Json_Data);
  WorkBook.Sheets[SheetName] = UpdatedSheet;
  writeFile(WorkBook, Excel_File_Path);
  response.status(200).send(JSON.stringify(Json_Data));;
});
// 
app.listen(PORT);
// 