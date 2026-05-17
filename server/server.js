require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

//Middleware to handle cors
app.use(
    cors({
        // it will allow the access for all CLIENT to save from it remove the "*" and only keep the client URL.
        origin: process.env.CLIENT_URL || "*" ,
        methods : ["GET" , "POST" , "PUT" , "DELETE"],
        allowedHeaders:["Content-Type" , "Authorization"],
    })
);


app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`Server is Started on PORT: ${PORT}`);
})