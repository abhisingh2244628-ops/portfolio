// ================================
// DOM ELEMENT SELECTION
// ================================
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("balance");

// ================================
// TRANSACTIONS ARRAY
// ================================
let transactions = [];

// ================================
// LOCALSTORAGE FUNCTIONS
// ================================
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("transactions"));
    if (data) {
        transactions = data;
        transactions.forEach(addTransactionToList);
        updateBalance();
    }
}

// ================================
// UPDATE BALANCE
// ================================
function updateBalance() {
    let total = 0;
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        const amt = Number(t.amount);
        if (amt > 0) income += amt;
        else expense += Math.abs(amt);
        total += amt;
    });

    balanceDisplay.textContent = `Balance: ₹${total} (Income: ₹${income} | Expense: ₹${expense})`;
}

// ================================
// ADD TRANSACTION TO UI
// ================================
function addTransactionToList(transaction) {
    const li = document.createElement("li");

    li.textContent = `${transaction.text} : ₹${transaction.amount} `;

    // Color coding: green = income, red = expense
    if(transaction.amount > 0) {
        li.style.borderLeft = "5px solid #4CAF50";
    } else {
        li.style.borderLeft = "5px solid #FF4D4D";
    }

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.style.marginLeft = "10px";
    delBtn.style.cursor = "pointer";
    delBtn.style.background = "#ff4d4d";
    delBtn.style.color = "#fff";
    delBtn.style.border = "none";
    delBtn.style.borderRadius = "5px";
    delBtn.style.padding = "2px 6px";

    delBtn.addEventListener("click", function() {
        transactionList.removeChild(li);
        transactions = transactions.filter(t => t !== transaction);
        updateBalance();
        saveToLocalStorage();
    });

    li.appendChild(delBtn);
    transactionList.appendChild(li);
}

// ================================
// FORM SUBMISSION
// ================================
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();

    if (description === "" || amount === "") {
        alert("Please enter both description and amount!");
        return;
    }

    const transaction = {
        text: description,
        amount: Number(amount)
    };

    transactions.push(transaction);
    addTransactionToList(transaction);
    updateBalance();
    saveToLocalStorage();

    descriptionInput.value = "";
    amountInput.value = "";
});

// ================================
// LOAD DATA ON PAGE LOAD
// ================================
loadFromLocalStorage();