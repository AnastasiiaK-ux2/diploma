// public/script.js

// Functions to interact with HTML forms and make AJAX requests

// Add User
function addUser() {
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, username, email })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// get User
function getUser() {
    const userId = document.getElementById('getUserId').value;

    fetch('/api/user?' + new URLSearchParams({
        id: userId
    }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// get Income
function getIncome() {
    const userId = document.getElementById('getIncomeId').value;

    fetch('/api/income?' + new URLSearchParams({
        id: userId
    }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// get Expense
function getExpense() {
    const userId = document.getElementById('getExpenseId').value;

    fetch('/api/expense?' + new URLSearchParams({
        id: userId
    }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Delete User
function deleteUser() {
    const userId = document.getElementById('deleteUserId').value;

    fetch('/api/user?' + new URLSearchParams({
        id: userId
    }), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Update User
function updateUser() {
    const userId = document.getElementById('updateUserId').value;
    const username = document.getElementById('updateUsername').value;
    const email = document.getElementById('updateEmail').value;

    fetch('/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, username, email })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Add Income
function addIncome() {
    const incomeId = document.getElementById('incomeId').value;
    const userId = document.getElementById('incomeUserId').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('incomeDate').value;
    const description = document.getElementById('incomeDescription').value;

    fetch('/api/income', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ incomeId, userId, amount, date, description })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Add Expense
function addExpense() {
    const expenseId = document.getElementById('expenseId').value;
    const userId = document.getElementById('expenseUserId').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value;

    fetch('/api/expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expenseId, userId, amount, date, description })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Add Income Category
function addIncomeCategory() {
    const categoryId = document.getElementById('incomeCategoryId').value;
    const categoryName = document.getElementById('incomeCategoryName').value;

    fetch('/api/incomeCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryId, categoryName })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Add Expense Category
function addExpenseCategory() {
    const categoryId = document.getElementById('expenseCategoryId').value;
    const categoryName = document.getElementById('expenseCategoryName').value;

    fetch('/api/expenseCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryId, categoryName })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log server response
            displayMessage(data); // Display message on UI
        })
        .catch(error => console.error('Error:', error));
}

// Helper function to display messages on UI
function displayMessage(message) {
    const consoleElem = document.getElementById('console');
    consoleElem.innerHTML += `${message}\n`;
}
