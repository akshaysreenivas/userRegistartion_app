//env
require("dotenv").config();

// import modules
const express = require("express");
const morgan = require("morgan");
const path = require("path");
// const errorHandler = require("./middlewares/errorHandler");
const userRouter=require("./Routes/UserRouter")


// app
const app = express();

// connecting mongodb 
const dataBase =require("./config/db")
dataBase()

// MIDDLEWARES ...
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// static files
app.use(express.static(path.join(__dirname, "public")));

//route
app.use("/", userRouter);


// port
const PORT = process.env.SERVER_PORT ;
// listen
app.listen(PORT, () => {
    console.log("Server is running on Port ",PORT);
});