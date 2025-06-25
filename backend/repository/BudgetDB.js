const PouchDB = require('pouchdb');
//додавання плагіну для поуку в базі
PouchDB.plugin(require('pouchdb-find'));
//створення локальної бази данних
const db = new PouchDB('userDB');
//створення індексу для бази данних
db.createIndex({
    index: { fields: ['userId', 'type'] }
});

//реалізація CRUD операцій для роботи з інформацією користувача
const addUser = function (userId, username, email) {
    return new Promise((resolve, reject) => {
        db.put({
            _id: `user_${userId}`,
            type: "user",
            username: username,
            email: email
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const readUser = function (userId) {
    return new Promise((resolve, reject) => {
        db.get(`user_${userId}`).then(function (user) {
            resolve(user);
        }).catch(function (err) {
            reject(`User ${userId} doesn't exists.`);
        });
    });
}

const deleteUser = function (userId) {
    return readUser(userId).then(user => new Promise((resolve, reject) => {
        const related = db.find({
            selector: {
                userId: user._id
            }
        }).then((data) => {
            if (data.docs.length > 0) {
                reject(`Can't remove user ${userId}, some data is associated with the user: \n` + JSON.stringify(data.docs, null, 2));
            } else {
                db.remove(user._id, user._rev).then(function () {
                    resolve();
                }).catch(function () {
                    reject(`Cant remove user ${userId}.`);
                });
            }
        })
    }));
}

const updateUser = function (userId, username, email) {
    return new Promise((resolve, reject) => {
        db.get(`user_${userId}`).then(function (user) {
            return db.put({
                _id: `user_${userId}`,
                _rev: user._rev,
                type: "user",
                username: username,
                email: email
            });
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

const readIncome = function (userId) {
    return new Promise((resolve, reject) => {
        db.find({
            selector: {
                type: 'income',
                userId: `user_${userId}`
            }
        }).then((incCat) => {
            resolve(incCat.docs);
        })
            .catch(function (err) {
                reject(err);
            });
    });
}

const addIncome = function (incomeId, userId, amount, date, description, categoryId) {
    return readUser(userId).then(() => new Promise((resolve, reject) => {
        db.put({
            _id: `income_${incomeId}`,
            type: "income",
            userId: `user_${userId}`,
            amount: amount,
            date: date,
            description: description,
            categoryId: `${categoryId}`
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(`Income ${incomeId} already exists`);
            });
    }));
}

const updateIncome = function (incomeId, userId, amount, date, description) {
    return readUser(userId).then(() => new Promise((resolve, reject) => {
        db.get(`income_${incomeId}`).then((income) => {
            return db.put({
                _id: `income_${incomeId}`,
                _rev: income._rev,
                type: "income",
                userId: `user_${userId}`,
                amount: amount,
                date: date,
                description: description
            })
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(`Income ${incomeId} doesn't exists`);
            });
    }));
}

const deleteIncome = function (incomeId) {
    return new Promise((resolve, reject) => {
        db.get(incomeId)
            .then((doc) => {
                db.remove(doc).then(() => (resolve()))
                    .catch(function (e) {
                        reject(`Can't remove ${incomeId} doesn't exists`);
                    });
            })
            .catch(function (e) {
                reject(`Income ${incomeId} doesn't exists`);
            });
    });
}

const readExpense = function (userId) {
    return new Promise((resolve, reject) => {
        db.find({
            selector: {
                type: "expense",
                userId: `user_${userId}`
            }
        }).then((incCat) => {
            resolve(incCat.docs);
        })
            .catch(function (err) {
                reject(err);
            });
    });
}

const addExpense = function (expenseId, userId, amount, date, description, categoryId) {
    return readUser(userId).then(() => new Promise((resolve, reject) => {
        db.put({
            _id: `expense_${expenseId}`,
            type: "expense",
            userId: `user_${userId}`,
            amount: amount,
            date: date,
            description: description,
            categoryId: `${categoryId}`
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(`Expense ${expenseId} already exists`);
            });
    }));
}

const updateExpense = function (expenseId, userId, amount, date, description) {
    return readUser(userId).then(() => new Promise((resolve, reject) => {
        db.get(`expense_${expenseId}`).then((expense) => {
            return db.put({
                _id: `expense_${expenseId}`,
                _rev: expense._rev,
                type: "expense",
                userId: `user_${userId}`,
                amount: amount,
                date: date,
                description: description
            });
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(`Expense ${expenseId} doesn't exists`);
            });
    }));
}

const deleteExpense = function (expenseId) {
    return new Promise((resolve, reject) => {
        db.get(expenseId)
            .then((doc) => {
                db.remove(doc).then(() => (resolve()))
                    .catch(function (e) {
                        reject(`Can't remove ${expenseId} doesn't exists`);
                    });
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const addIncomeCategory = function (categoryId, userId, categoryName, description) {
    return new Promise((resolve, reject) => {
        db.put({
            _id: `incomeCat_${categoryId}`,
            type: "incomeCat",
            userId: `user_${userId}`,
            categoryName: categoryName,
            description: description
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const updateIncomeCategory = function (categoryId, categoryName, description) {
    return new Promise((resolve, reject) => {
        db.get(`incomeCat_${categoryId}`).then(inCat => {
            return db.put({
                _id: `incomeCat_${categoryId}`,
                _rev: inCat._rev,
                type: "incomeCat",
                categoryName: categoryName,
                description: description
            })
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const readIncomeCategory = function (userId) {
    return new Promise((resolve, reject) => {
        db.find({
            selector: {
                type: 'incomeCat',
                userId: `user_${userId}`
            }
        }).then((incCat) => {
            resolve(incCat.docs);
        })
            .catch(function (err) {
                reject(err);
            });
    });
}

const deleteIncomeCategory = function (categoryId) {
    return new Promise((resolve, reject) => {
        db.get(categoryId)
            .then( (doc) => {
                db.remove(doc).then(() => (resolve()))
                .catch(function (e) {
                    reject(`Can't remove ${categoryId} doesn't exists`);
                });
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const addExpenseCategory = function (categoryId, userId, categoryName, description) {
    return new Promise((resolve, reject) => {
        db.put({
            _id: `expenseCat_${categoryId}`,
            type: "expenseCat",
            userId: `user_${userId}`,
            categoryName: categoryName,
            description: description
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const updateExpenseCategory = function (categoryId, categoryName, description) {
    return new Promise((resolve, reject) => {
        db.get(`expenseCat_${categoryId}`).then(expCat => {
            return db.put({
                _id: `expenseCat_${categoryId}`,
                _rev: expCat._rev,
                type: "expenseCat",
                categoryName: categoryName,
                description
            });
        })
            .then(() => {
                resolve();
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

const readExpenseCategory = function (userId) {
    return new Promise((resolve, reject) => {
        db.find({
            selector: {
                type: 'expenseCat',
                userId: `user_${userId}`
            }
        }).then((expCat) => {
            resolve(expCat.docs);
        })
            .catch(function (err) {
                reject(err);
            });
    });
}

const deleteExpenseCategory = function (categoryId) {
    return new Promise((resolve, reject) => {
        db.get(categoryId)
            .then( (doc) => {
                db.remove(doc).then(() => (resolve()))
                .catch(function (e) {
                    reject(`Can't remove ${categoryId} doesn't exists`);
                });
            }).catch(function (err) {
            reject(err);
        });
    });
}

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