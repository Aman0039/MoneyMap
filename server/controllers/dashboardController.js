const Income = require("../models/Income");
const ExpenseModel = require("../models/Expense");
const { Types, isValidObjectId } = require("mongoose");

//Dashboard Data
const getDashboardData = async (req, res , next) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //fetch total income & expenses

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        const totalExpense = await ExpenseModel.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        //Get Income Transaction in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Data(Data.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        //Get Total Income for last 60 Days

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Get expense transactions in the last 30 days

        const last30daysExpenseTransactions = await ExpenseModel.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        //Get total expenses for last 30 days

        const expenseLast30days = last30daysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        //Fetch last 5 transactions ( income + expenses)

        const lastTransactions = [
            ...((await ExpenseModel.find({ userId })).toSorted({ date: -1 }).limit(5)).map(
                (txt) => ({
                    ...txt.toObject(),
                    type: "expense",
                })
            )
        ].sort((a, b) => b.date - a.date); // Sort Latest first

        //Final Response

        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30days,
                transactions: last30daysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },

            recentTransactions: lastTransactions,
        })
    } catch (error) {
        next(error);
    }
}

module.exports = getDashboardData;