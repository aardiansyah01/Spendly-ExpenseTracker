import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let allExpenses = [];

const addExpenseButton = document.querySelector(".add-expense-button");
const expenseModal = document.getElementById("expenseModal");
const closeExpenseModal = document.getElementById("closeExpenseModal");
const cancelExpense = document.getElementById("cancelExpense");
const expenseForm = document.getElementById("expenseForm");

let editingExpenseId = null;
let expenses = [];

// Views
async function loadExpenses() {
    const user = auth.currentUser;

    if (!user) {
        console.log("User belum login.");
        return;
    }

    try {
        const idToken = await user.getIdToken();

        const response = await fetch("/api/expenses", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${idToken}`,
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load expenses.");
        }

        console.log("Expenses loaded:", result);

        const expensesData = result.data || {};

        allExpenses = Object.entries(expensesData).map(([id, expense]) => ({
            id,
            ...expense,
        }));

        console.log("Expenses array:", allExpenses);

        updateMonthFilter();

        applyFilters();
    } catch (error) {
        console.error("Error loading expenses:", error);
    }
}

function updateMonthFilter() {
    const monthFilter = document.getElementById("monthFilter");

    if (!monthFilter) {
        return;
    }

    const months = new Map();

    allExpenses.forEach((expense) => {
        if (!expense.date) {
            return;
        }

        const [year, month] = expense.date.split("-");

        const key = `${year}-${month}`;

        if (!months.has(key)) {
            months.set(key, new Date(Number(year), Number(month) - 1, 1));
        }
    });

    const sortedMonths = [...months.entries()].sort((a, b) =>
        b[0].localeCompare(a[0]),
    );

    monthFilter.innerHTML = `
        <option value="all">
            All Months
        </option>
    `;

    sortedMonths.forEach(([key, date]) => {
        const option = document.createElement("option");

        option.value = key;

        option.textContent = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });

        monthFilter.appendChild(option);
    });
}

function applyFilters() {
    const searchInput = document.getElementById("searchExpense");

    const categoryFilter = document.getElementById("categoryFilter");

    const monthFilter = document.getElementById("monthFilter");

    const sortFilter = document.getElementById("sortFilter");

    const searchValue = searchInput?.value.trim().toLowerCase() || "";

    const categoryValue = categoryFilter?.value || "all";

    const monthValue = monthFilter?.value || "all";

    const sortValue = sortFilter?.value || "newest";

    let filteredExpenses = [...allExpenses];

    if (searchValue) {
        filteredExpenses = filteredExpenses.filter((expense) => {
            const name = String(expense.name || "").toLowerCase();

            const note = String(expense.note || "").toLowerCase();

            const category = String(expense.category || "").toLowerCase();

            return (
                name.includes(searchValue) ||
                note.includes(searchValue) ||
                category.includes(searchValue)
            );
        });
    }

    if (categoryValue !== "all") {
        filteredExpenses = filteredExpenses.filter(
            (expense) => expense.category === categoryValue,
        );
    }

    if (monthValue !== "all") {
        filteredExpenses = filteredExpenses.filter((expense) =>
            expense.date?.startsWith(monthValue),
        );
    }

    // SORT
    filteredExpenses.sort((a, b) => {
        if (sortValue === "newest") {
            return String(b.date || "").localeCompare(String(a.date || ""));
        }

        if (sortValue === "oldest") {
            return String(a.date || "").localeCompare(String(b.date || ""));
        }

        if (sortValue === "highest") {
            return Number(b.amount || 0) - Number(a.amount || 0);
        }

        if (sortValue === "lowest") {
            return Number(a.amount || 0) - Number(b.amount || 0);
        }

        return 0;
    });

    renderExpenses(filteredExpenses);
}

const searchExpense = document.getElementById("searchExpense");

const categoryFilter = document.getElementById("categoryFilter");

const monthFilter = document.getElementById("monthFilter");

const sortFilter = document.getElementById("sortFilter");

if (searchExpense) {
    searchExpense.addEventListener("input", applyFilters);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
}

if (monthFilter) {
    monthFilter.addEventListener("change", applyFilters);
}

if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
}

function renderExpenses(expenses) {
    const transactionCard = document.querySelector(".transaction-card");
    const transactionHeader = document.querySelector(".transaction-header");
    const expenseCount = document.getElementById("expenseCount");
    const expenseTotal = document.getElementById("expenseTotal");

    if (!transactionCard || !transactionHeader) {
        return;
    }

    transactionCard
        .querySelectorAll(".transaction-row")
        .forEach((row) => row.remove());

    const total = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount || 0);
    }, 0);

    // Update summary
    if (expenseCount) {
        expenseCount.textContent = `${expenses.length} expenses`;
    }

    if (expenseTotal) {
        expenseTotal.textContent = `Total: ${formatRupiah(total)}`;
    }

    expenses.forEach((expense) => {
        const row = createTransactionRow(expense);
        transactionCard.appendChild(row);
    });

    feather.replace();
}

function createTransactionRow(expense) {
    const row = document.createElement("div");
    row.className = "transaction-row";

    const categoryClass = getCategoryClass(expense.category);
    const categoryIcon = getCategoryIcon(expense.category);

    row.innerHTML = `
        <div class="expense-column">

            <div class="expense-icon ${categoryClass}-icon">
                ${categoryIcon}
            </div>

            <div class="expense-info">
                <strong>
                    ${escapeHtml(expense.name)}
                </strong>

                <span>
                    ${escapeHtml(expense.note || "")}
                </span>
            </div>

        </div>

        <div>
            <span class="category-badge ${categoryClass}">
                ${escapeHtml(expense.category)}
            </span>
        </div>

        <div class="transaction-date">
            ${formatDate(expense.date)}
        </div>

        <div class="transaction-amount">
            ${formatRupiah(expense.amount)}
        </div>

        <div class="transaction-actions">
            <button
                type="button"
                class="edit-expense-button"
                data-id="${escapeHtml(expense.id)}"
                title="Edit expense"
            >
                <i data-feather="edit-2"></i>
            </button>

            <button
                type="button"
                class="delete-expense-button"
                data-id="${escapeHtml(expense.id)}"
                title="Delete expense"
            >
                <i data-feather="trash-2"></i>
            </button>
        </div>
    `;

    return row;
}

function openEditModal(expense) {
    editingExpenseId = expense.id;

    document.getElementById("expenseName").value = expense.name;
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("expenseCategory").value = expense.category;
    document.getElementById("expenseDate").value = expense.date;
    document.getElementById("expenseNote").value = expense.note || "";

    document.querySelector("#expenseModal h2").textContent = "Edit Expense";

    const submitButton = expenseForm?.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.textContent = "Update Expense";
    }

    expenseModal.classList.add("show");
}

async function deleteExpense(expenseId) {
    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return;
    }

    const confirmed = confirm("Are you sure you want to delete this expense?");

    if (!confirmed) {
        return;
    }

    try {
        const idToken = await user.getIdToken();

        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${idToken}`,
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete expense.");
        }

        alert("Expense berhasil dihapus.");

        await loadExpenses();
    } catch (error) {
        console.error("Error deleting expense:", error);

        alert(error.message || "Terjadi kesalahan saat menghapus expense.");
    }
}

document.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".delete-expense-button");

    if (!deleteButton) {
        return;
    }

    const expenseId = deleteButton.dataset.id;

    deleteExpense(expenseId);
});

document.addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-expense-button");

    if (!editButton) {
        return;
    }

    const expenseId = editButton.dataset.id;

    const expense = allExpenses.find((item) => item.id === expenseId);

    if (!expense) {
        alert("Expense tidak ditemukan.");
        return;
    }

    openEditModal(expense);
});

function formatRupiah(amount) {
    return `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;
}

function formatDate(date) {
    if (!date) {
        return "-";
    }

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getCategoryClass(category) {
    return String(category || "")
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function getCategoryIcon(category) {
    const icons = {
        Food: `
            <i data-feather="coffee"></i>
        `,
        Bills: `
            <i data-feather="credit-card"></i>
        `,
        Education: `
            <i data-feather="book-open"></i>
        `,
        Shopping: `
            <i data-feather="shopping-bag"></i>
        `,
        Technology: `
            <i data-feather="monitor"></i>
        `,
        Transport: `
            <i data-feather="truck"></i>
        `,
        Entertainment: `
            <i data-feather="music"></i>
        `,
    };

    return icons[category] || `<i data-feather="dollar-sign"></i>`;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

// Modal
function openExpenseModal() {
    editingExpenseId = null;

    document.querySelector("#expenseModal h2").textContent = "Add Expense";

    const submitButton = expenseForm?.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.textContent = "Save Expense";
    }

    if (expenseModal) {
        expenseModal.classList.add("show");
    }
}

function closeExpenseModalFunction() {
    if (expenseModal) {
        expenseModal.classList.remove("show");
    }
}

// Open modal
if (addExpenseButton) {
    addExpenseButton.addEventListener("click", openExpenseModal);
}

// Close modal
if (closeExpenseModal) {
    closeExpenseModal.addEventListener("click", closeExpenseModalFunction);
}

// Cancel
if (cancelExpense) {
    cancelExpense.addEventListener("click", closeExpenseModalFunction);
}

// Close when clicking outside modal
if (expenseModal) {
    expenseModal.addEventListener("click", function (event) {
        if (event.target === expenseModal) {
            closeExpenseModalFunction();
        }
    });
}

// Close with Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeExpenseModalFunction();
    }
});

// Submit expense
if (expenseForm) {
    expenseForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        try {
            // Firebase ID Token
            const idToken = await user.getIdToken();

            const expenseData = {
                name: document.getElementById("expenseName").value,
                amount: document.getElementById("expenseAmount").value,
                category: document.getElementById("expenseCategory").value,
                date: document.getElementById("expenseDate").value,
                note: document.getElementById("expenseNote").value,
            };

            // Kirim ke Laravel
            const url = editingExpenseId
                ? `/api/expenses/${editingExpenseId}`
                : "/api/expenses";

            const method = editingExpenseId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(expenseData),
            });

            const responseText = await response.text();

            console.log("STATUS:", response.status);
            console.log("RESPONSE FROM LARAVEL:", responseText);

            let result;

            try {
                result = JSON.parse(responseText);
            } catch (error) {
                console.error("JSON PARSE ERROR:", error);
                console.error("RAW RESPONSE:", responseText);

                alert(
                    "Laravel mengirim response yang bukan JSON valid. Cek Console.",
                );

                return;
            }

            if (!response.ok) {
                throw new Error(result.message || "Failed to save expense.");
            }

            console.log("Expense saved:", result);

            alert(
                editingExpenseId
                    ? "Expense berhasil diperbarui!"
                    : "Expense berhasil ditambahkan!",
            );

            expenseForm.reset();
            editingExpenseId = null;

            closeExpenseModalFunction();

            await loadExpenses();
        } catch (error) {
            console.error("Error saving expense:", error);

            alert(error.message || "Terjadi kesalahan saat menyimpan expense.");
        }

        await loadExpenses();
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadExpenses();
    }
});
