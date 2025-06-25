const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const budgetController = require('./controllers/budgetController');

const app = express();
const port = 3030;

// Налаштування Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Rest Api
// API для користувача
app.post('/api/user', budgetController.addUser);
app.put('/api/user', budgetController.updateUser);
app.get('/api/user', budgetController.readUser);
app.delete('/api/user', budgetController.deleteUser);

// API для роботи з доходами
app.post('/api/income', budgetController.addIncome);
app.put('/api/income', budgetController.updateIncome);
app.get('/api/income', budgetController.readIncome);
app.delete('/api/income', budgetController.deleteIncome);

//API для роботи з витратами
app.post('/api/expense', budgetController.addExpense);
app.put('/api/expense', budgetController.updateExpense);
app.get('/api/expense', budgetController.readExpense);
app.delete('/api/expense', budgetController.deleteExpense);

//API для роботи з категоріями доходів
app.post('/api/incomeCategory', budgetController.addIncomeCategory);
app.put('/api/incomeCategory', budgetController.updateIncomeCategory);
app.get('/api/incomeCategory', budgetController.readIncomeCategory);
app.delete('/api/incomeCategory', budgetController.deleteIncomeCategory);

//API для роботи з карегоріями витрат
app.post('/api/expenseCategory', budgetController.addExpenseCategory);
app.put('/api/expenseCategory', budgetController.updateExpenseCategory);
app.get('/api/expenseCategory', budgetController.readExpenseCategory);
app.delete('/api/expenseCategory', budgetController.deleteExpenseCategory);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
