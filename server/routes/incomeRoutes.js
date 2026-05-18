const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addIncome, getAllIncome, downloadIncomeExcel, deleteIncome } = require("../controlllers/incomeController");


const incomeRoutes = express.Router();

incomeRoutes.post("/add" , protect , addIncome);
incomeRoutes.get("/get" , protect , getAllIncome);
incomeRoutes.get("/downloadexcel" , protect , downloadIncomeExcel);
incomeRoutes.get("/:id" , protect , deleteIncome);



module.exports = incomeRoutes;