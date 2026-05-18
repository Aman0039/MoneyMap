const ExpenseModel = require("../models/Expense");
const xlsx = require("xlsx");


//Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {

        const { icon, category, amount, date } = req.body;

        //Validation Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ messagee: "All fields are required" });
        }

        const newExpense = new ExpenseModel({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Get All Expenses Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await ExpenseModel.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

//Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await ExpenseModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await ExpenseModel.find({ userId }).sort({ date: -1 });

        //prepare data for excel

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.Amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({message : "Internal Server Error"})
    }
}