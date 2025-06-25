
const budgetApp = require('../repository/BudgetDB');

// Controller methods
const addUser = (req, res) => {
    const { userId, username, email } = req.body;
    budgetApp.addUser(userId, username, email).then(() => res.send(`User ${userId} added.`)).catch(err => {
        res.send(`Err: User ${userId} already exists.`);
    });
};

const updateUser = (req, res) => {
    const { id, username, email } = req.body;
    budgetApp.updateUser(id, username, email).then(() => res.send(`User ${id} updated.`)).catch(err => {
        res.send(`Err: User ${id} doesn't exists.`);
    });
};


const readUser = (req, res) => {
    const userId = req.query.id;
    budgetApp.readUser(userId).then((user) => res.send(JSON.stringify(user, null, 2))).catch(err => {
        res.send(`Err: Can't get user ${userId}`);
    });
};

const deleteUser = (req, res) => {
    const userId = req.query.id;
    budgetApp.deleteUser(userId).then(() => res.send(`User ${userId} is delete sucessfully.`)).catch(err => {
        res.send(err);
    });
};


// Income
const addIncome = (req, res) => {
    const { incomeId, userId, amount, date, description, categoryId } = req.body;
    budgetApp.addIncome(incomeId, userId, amount, date, description, categoryId)
        .then(() => res.send(`Income ${incomeId} added.`)).catch(err => {
            res.send(err);
        });
};

const updateIncome = (req, res) => {
    const { incomeId, userId, amount, date, description } = req.body;
    budgetApp.updateIncome(incomeId, userId, amount, date, description)
        .then(() => res.send(`Income ${incomeId} updated.`)).catch(err => {
            res.send(err);
        });
};

const readIncome = (req, res) => {
    const userId = req.query.userId;
    budgetApp.readIncome(userId).then((income) => res.send(JSON.stringify(income, null, 2))).catch(err => {
        res.send(`Err: Can't get income`);
    });
};

const deleteIncome = (req, res) => {
    const incomeId = req.query.id;
    budgetApp.deleteIncome(incomeId).then(() => res.send(`Income ${incomeId} is delete sucessfully.`)).catch(err => {
        res.send(`Err: Can't delete income ${incomeId}`);
    });
};


//Expense
const addExpense = (req, res) => {
    const { expenseId, userId, amount, date, description, categoryId } = req.body;
    budgetApp.addExpense(expenseId, userId, amount, date, description, expenseId, categoryId).then(() => {
        res.send(`Expense added.`);
    }).catch(err => {
        res.send(err);
    });
};

const updateExpense = (req, res) => {
    const { expenseId, userId, amount, date, description } = req.body;
    budgetApp.updateExpense(expenseId, userId, amount, date, description).then(() => {
        es.send(`Expense ${expenseId} updated.`);
    }).catch(err => {
        res.send(err);
    });
};

const readExpense = (req, res) => {
    const userId = req.query.userId;
    budgetApp.readExpense(userId).then((expense) => res.send(JSON.stringify(expense, null, 2))).catch(err => {
        res.send(`Err: Can't get expense`);
    });
};

const deleteExpense = (req, res) => {
    const expenseId = req.query.id;
    budgetApp.deleteExpense(expenseId).then(() => res.send(`Expense ${expenseId} is delete sucessfully.`)).catch(err => {
        res.send(`Err: Can't delete expense ${expenseId}`);
    });
};

//Income Categories
const addIncomeCategory = (req, res) => {
    const { categoryId, userId, categoryName, description } = req.body;
    budgetApp.addIncomeCategory(categoryId, userId, categoryName, description).then(() => {
        res.send(`Income category ${categoryId} added.`);
    }).catch(err => {
        res.send(`Err: Income category ${categoryId} already exists.`);
    });
};

const updateIncomeCategory = (req, res) => {
    const { categoryId, name, description } = req.body;
    budgetApp.updateIncomeCategory(categoryId, name, description).then(() => {
        res.send(`Income category ${categoryId} updated.`);
    }).catch(err => {
        res.send(`Err: Income category ${categoryId} already exists.`);
    });
};

const readIncomeCategory = (req, res) => {
    const userId = req.query.userId;
    budgetApp.readIncomeCategory(userId).then((income) => res.send(JSON.stringify(income, null, 2))).catch(err => {
        res.send(`Err: Can't get income category`);
    });
};

const deleteIncomeCategory = (req, res) => {
    const incomeId = req.query.id;
    budgetApp.deleteIncomeCategory(incomeId).then(() => res.send(`Income category ${incomeId} is delete sucessfully.`)).catch(err => {
        res.send(`Err: Can't delete income category ${incomeId}`);
    });
};

//Expense categories
const addExpenseCategory = (req, res) => {
    const { categoryId, userId, categoryName, description } = req.body;
    budgetApp.addExpenseCategory(categoryId, userId, categoryName, description).then(() => {
        res.send(`Expense category ${categoryId} added.`);
    }).catch(err => {
        res.send(`Err: Expense category ${categoryId} already exists.`);
    });
};

const updateExpenseCategory = (req, res) => {
    const { categoryId, categoryName, description } = req.body;
    budgetApp.updateExpenseCategory(categoryId, categoryName, description).then(() => {
        res.send(`Expense category ${categoryId} updated.`);
    }).catch(err => {
        res.send(`Err: Expense category ${categoryId} already exists.`);
    });
};

const readExpenseCategory = (req, res) => {
    const userId = req.query.userId;
    budgetApp.readExpenseCategory(userId).then((expense) => res.send(JSON.stringify(expense, null, 2))).catch(err => {
        res.send(`Err: Can't get expense category`);
    });
};

const deleteExpenseCategory = (req, res) => {
    const expenseId = req.query.id;
    budgetApp.deleteExpenseCategory(expenseId).then(() => res.send(`Expense category ${expenseId} is delete sucessfully.`)).catch(err => {
        res.send(`Err: Can't delete expense category ${expenseId}`);
    });
};

module.exports = {
    readUser,
    addUser,
    updateUser,
    deleteUser,
    readIncome,
    addIncome,
    updateIncome,
    deleteIncome,
    readExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    readIncomeCategory,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    readExpenseCategory,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory
};
