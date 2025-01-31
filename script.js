// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emails = document.getElementById('email').value;
    const passwords = document.getElementById('password').value;
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.emails === emails && user.passwords === passwords) {
      alert('Login successful!');
      window.location.href ='dashboard.html';
    } else {
      alert('Invalid email or password!');

    }
  });
  

   // Registration
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emails = document.getElementById('regEmail').value;
    const passwords = document.getElementById('regPassword').value;
    const confirmPasswords = document.getElementById('confirmPassword').value;
    if (passwords !== confirmPasswords) {
      alert('Passwords do not match!');
      return;
    }
  
    localStorage.setItem('user', JSON.stringify({ emails, passwords }));
    alert('Registration successful!');
    window.location.href = 'login.html';
  });


    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");


 //// Load expenses from local storage or initialize as empty array
      let expenses = JSON.parse(localStorage.getItem("expenses")) || [];  

      //     // Display expenses on page load
            displayExpenses(expenses);
            updateTotalAmount();

              // Form submission event
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
        displayExpenses(expenses);
        updateTotalAmount();
        expenseForm.reset();
    });

     // Event delegation for edit and delete buttons
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.iname;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            saveExpensesToLocalStorage();
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

     // Filter expenses by category

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

     // Display expenses in the table
    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `<td>${expense.iname}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>`;
            expenseList.appendChild(row);
        });
    }

    //  Update the total amount of expenses
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
    
     // Save expenses to local storage
    function saveExpensesToLocalStorage() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }



