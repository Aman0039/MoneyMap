const express = require("express");
const { addIncome, getAllIncome, downloadIncomeExcel, deleteIncome } = require("../controllers/incomeController");
const protect = require("../middleware/authMiddleware");


const incomeRoutes = express.Router();

incomeRoutes.post("/add" , protect , addIncome);
incomeRoutes.get("/get" , protect , getAllIncome);
incomeRoutes.get("/downloadexcel" , protect , downloadIncomeExcel);
incomeRoutes.get("/:id" , protect , deleteIncome);



module.exports = incomeRoutes;