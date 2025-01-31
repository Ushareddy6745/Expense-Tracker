// Select DOM elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const filterCategory = document.getElementById("filter-category");
const ctx = document.getElementById('expenseChart');

let expenses = JSON.parse(localStorage.getItem("expenses")) || []; // Load expenses from local storage
let expenseChart; // Variable to store the chart instance

// Function to save expenses to local storage
function saveExpensesToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to update the total amount displayed
function updateTotalAmount() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total.toFixed(2);
}

// Function to render the pie chart
function renderChart(data) {
    if (expenseChart) {
        expenseChart.destroy(); // Destroy the existing chart instance
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#000000', // Food
                    '#A52A2A', // Transport
                    '#8B008B', // Entertainment
                    '#7FFF00'  // Other
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Function to calculate expenses by category and update the chart
function updateChart() {
    const categoryTotals = expenses.reduce((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
    }, {});

    renderChart(categoryTotals);
}

// Function to display expenses in the table
function displayExpenses(filteredExpenses = expenses) {
    expenseList.innerHTML = "";

    filteredExpenses.forEach(expense => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.iname}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    updateChart(); // Update the pie chart
    updateTotalAmount(); // Update the total amount
}

// Event listener for form submission
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const iname = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    const date = document.getElementById("expense-date").value;

    const expense = {
        id: Date.now(),
        iname,
        amount,
        category,
        date
    };

    expenses.push(expense);
    saveExpensesToLocalStorage();
    displayExpenses();
    expenseForm.reset();
});

// Event listener for delete and edit buttons
expenseList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = parseInt(e.target.dataset.id);
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpensesToLocalStorage();
        displayExpenses();
    }

    if (e.target.classList.contains("edit-btn")) {
        const id = parseInt(e.target.dataset.id);
        const expense = expenses.find(exp => exp.id === id);

        document.getElementById("expense-name").value = expense.iname;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("expense-date").value = expense.date;

        expenses = expenses.filter(exp => exp.id !== id);
        saveExpensesToLocalStorage();
        displayExpenses();
    }
});

// Event listener for category filter
filterCategory.addEventListener("change", (e) => {
    const category = e.target.value;
    if (category === "All") {
        displayExpenses(expenses);
    } else {
        const filteredExpenses = expenses.filter(exp => exp.category === category);
        displayExpenses(filteredExpenses);
    }
});

// Initial rendering of expenses and chart
displayExpenses();