require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

//Middleware to handle cors
app.use(
    cors({
        // it will allow the access for all CLIENT to save from it remove the "*" and only keep the client URL.
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json()); //body parser;

//test route
app.get("/" , (req , res) => {
    res.status(200).json({message : "Route Health is ok!"})
})

connectDB();
//authRouter
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/income", incomeRoutes)
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is Started on PORT: ${PORT}`);
})