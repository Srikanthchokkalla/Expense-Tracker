// when user enters Sign up process
let showSignup = document.getElementById("showSignup")
let showLogin = document.getElementById("showLogin")

let signupForm = document.getElementById("signupForm")
let loginForm = document.getElementById("loginForm")

showSignup.addEventListener("click", () => {
    loginForm.style.display = "none"
    signupForm.style.display = "block"
})

showLogin.addEventListener("click", () => {
    loginForm.style.display = "block"
    signupForm.style.display = "none"

})

let signupBtn = document.getElementById("signupBtn")
signupBtn.addEventListener("click", (event) => {
    event.preventDefault()
    let signupUsername = document.getElementById("signupUsername").value
    let signupPassword = document.getElementById("signupPassword").value
    let signupConfirmPassword = document.getElementById("signupConfirmPassword").value

    let signupMessage = document.getElementById("signupMessage")

    if (!signupUsername || !signupPassword || !signupConfirmPassword) {
        signupMessage.innerHTML = "All fields are required."
        return

    }
    if (signupPassword !== signupConfirmPassword) {
        signupMessage.innerHTML = "Passwords do not match."
        return
    }
    if (localStorage.getItem(signupUsername)) {
        signupMessage.innerHTML = "Username already exists."
        return
    }

    localStorage.setItem(signupUsername, signupPassword);

    signupMessage.innerHTML = "Signup successful! You can login now."
    signupMessage.style.color = "green";

    document.getElementById("signupUsername").value = ""
    document.getElementById("signupPassword").value = ""
    document.getElementById("signupConfirmPassword").value = ""

})

// when user enters Login process
let loginBtn = document.getElementById("loginBtn")
loginBtn.addEventListener("click", (event) => {
    event.preventDefault()
    let loginUsername = document.getElementById("loginUsername").value
    let loginPassword = document.getElementById("loginPassword").value

    let loginMessage = document.getElementById("loginMessage")

    if (!loginUsername || !loginPassword) {
        loginMessage.innerHTML = "Both fields are required."
        return
    }

    let storedPassword = localStorage.getItem(loginUsername)
    if (storedPassword && storedPassword == loginPassword) {
        loginMessage.innerHTML = "Login successful!"
        loginMessage.style.color = "green"

        document.getElementById("authentiForm").style.display = "none"
        document.getElementById("trackForm").style.display = "block"

        setTimeout(() => {
            renderExpenseTracker()
        }, 1000)
    }
    else {
        loginMessage.innerHTML = "Invalid username or password."
        loginMessage.style.color = "red"
    }
})

let totalAmount = 0;
let expenseData = {}; // Object to store categories and their total amounts
let pieChart;
function renderExpenseTracker() {
    let addExpenseBtn = document.getElementById("addExpenseBtn")
    addExpenseBtn.addEventListener("click", (event) => {
        event.preventDefault()
        let amountInput = document.getElementById("amount").value
        let category = document.getElementById("category").value
        let date = document.getElementById("date").value

        let amount = parseFloat(amountInput);
        if (amount && category && date) {
            setTimeout(() => {
                let expensesLists = document.getElementById("expense-list");
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.innerHTML = `
                                <div class="expenseListSum">
                                    <div><span class="expenseSummary">${amount} - ${category} - ${date}</span></div>
                                    <div>
                                        <button class="btn btn-danger deleteBtn">Delete</button>
                                    </div>
                                </div>
                            `;
                expensesLists.appendChild(listItem);
                totalAmount += amount;
                updateTotalAmountDisplay(totalAmount);

                if (expenseData[category]) {
                    expenseData[category] += amount;
                } else {
                    expenseData[category] = amount;
                }

                clearExpenseFields()
                document.getElementById("expenseList").style.display = "block";
                document.getElementById("trackForm").style.display = "none";

                updatePieChart();

                addExpenseEventListeners(listItem, amount,category)
                backBtn()
            }, 1000)
        }
        else {
            alert("Please fill out all fields")
        }
    })
}

function clearExpenseFields() {
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
}

function toggleForms() {
    document.getElementById("expenseList").style.display = "none";
    document.getElementById("trackForm").style.display = "block";
}

function updateTotalAmountDisplay(totalAmount) {
    document.getElementById("totalAmount").innerHTML = `Total Amount: ${totalAmount}`
}


function addExpenseEventListeners(listItem, amount,category) {
    let deleteBtn = listItem.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
        listItem.remove()
        totalAmount -= amount;
        updateTotalAmountDisplay(totalAmount);

        if (expenseData[category]) {
            expenseData[category] -= amount;
            if (expenseData[category] <= 0) {
                delete expenseData[category]; // Remove the category if no amount left
            }
        }

        // Update the pie chart after deleting the expense
        updatePieChart();
    })
}

function updatePieChart() {
    let ctx = document.getElementById("expensePieChart").getContext("2d");

    // Get categories and their amounts for the chart
    let categories = Object.keys(expenseData);
    let amounts = Object.values(expenseData);

    if (pieChart) {
        pieChart.destroy(); // Destroy the previous chart to avoid overlap
    }

    // Create a gradient for the chart
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 1)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 1)');

    // Create the pie chart with updated data
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [gradient, 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}


function backBtn() {
    document.getElementById("backBtn").addEventListener("click", () => {
        toggleForms()
        addExpenseBtn.textContent = "Add Expense"
        clearExpenseFields()
    })
}
backBtn()

