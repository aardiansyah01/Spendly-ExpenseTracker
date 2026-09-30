import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let monthlyBudget = 1500000;

let allExpenses = [];

// FORMAT RUPIAH
function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

// FORMAT TANGGAL
function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// CATEGORY ICON
function getCategoryIcon(category) {
    const icons = {
        Food: "coffee",
        Bills: "file-text",
        Education: "book-open",
        Shopping: "shopping-bag",
        Technology: "monitor",
        Transport: "truck",
    };

    return icons[category] || "circle";
}

// CURRENT MONTH
function getCurrentMonth() {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: now.getMonth(),
    };
}

// TAKE EXPENSES
async function loadDashboardExpenses(user) {
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

        const expensesData = result.data || {};

        allExpenses = Object.entries(expensesData).map(([id, expense]) => ({
            id,
            ...expense,
        }));

        updateDashboard();
    } catch (error) {
        console.error("Error loading dashboard expenses:", error);
    }
}

// GET BUDGET
async function loadDashboardBudget(user) {
    try {
        const { year, month } = getCurrentMonth();

        const formattedMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

        const idToken = await user.getIdToken();

        const response = await fetch(`/api/budget?month=${formattedMonth}`, {
            method: "GET",

            headers: {
                Authorization: `Bearer ${idToken}`,
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load budget.");
        }

        monthlyBudget = Number(result.amount || 0);

        updateDashboard();
    } catch (error) {
        console.error("Error loading dashboard budget:", error);
    }
}

// UPDATE DASHBOARD
function updateDashboard() {
    const { year, month } = getCurrentMonth();

    const currentMonthExpenses = allExpenses.filter((expense) => {
        if (!expense.date) {
            return false;
        }

        const date = new Date(expense.date);

        return date.getFullYear() === year && date.getMonth() === month;
    });

    // TOTAL SPENT
    const totalSpent = currentMonthExpenses.reduce((total, expense) => {
        return total + Number(expense.amount || 0);
    }, 0);

    // REMAINING
    const remaining = monthlyBudget - totalSpent;

    // BUDGET PERCENTAGE
    let percentage = 0;

    if (monthlyBudget > 0) {
        percentage = (totalSpent / monthlyBudget) * 100;
    }

    // RULES BAR
    const progressPercentage = Math.min(Math.max(percentage, 0), 100);

    // UPDATE STATISTICS
    const totalSpentElement = document.getElementById("totalSpent");

    const totalSpentPercentageElement = document.getElementById(
        "totalSpentPercentage",
    );

    const monthlyBudgetElement = document.getElementById("monthlyBudget");

    const remainingBudgetElement = document.getElementById("remainingBudget");

    if (totalSpentElement) {
        totalSpentElement.textContent = formatRupiah(totalSpent);
    }

    if (totalSpentPercentageElement) {
        totalSpentPercentageElement.textContent = `${Math.round(percentage)}% of budget`;
    }

    if (monthlyBudgetElement) {
        monthlyBudgetElement.textContent = formatRupiah(monthlyBudget);
    }

    if (remainingBudgetElement) {
        remainingBudgetElement.textContent = formatRupiah(
            Math.max(remaining, 0),
        );
    }

    // UPDATE MONTH
    const budgetMonthElement = document.getElementById("budgetMonth");

    const currentMonthElement = document.querySelector(".current-month");

    const monthText = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    if (budgetMonthElement) {
        budgetMonthElement.textContent = monthText;
    }

    if (currentMonthElement) {
        currentMonthElement.textContent = monthText;
    }

    // UPDATE BUDGET CARD
    const budgetPercentageElement = document.getElementById("budgetPercentage");

    const budgetProgressElement = document.getElementById("budgetProgress");

    const budgetSpentElement = document.getElementById("budgetSpent");

    const budgetAmountElement = document.getElementById("budgetAmount");

    const budgetRemainingElement = document.getElementById("budgetRemaining");

    if (budgetPercentageElement) {
        budgetPercentageElement.textContent = `${Math.round(percentage)}%`;
    }

    if (budgetProgressElement) {
        budgetProgressElement.style.width = `${progressPercentage}%`;
    }

    if (budgetSpentElement) {
        budgetSpentElement.textContent = `Spent: ${formatRupiah(totalSpent)}`;
    }

    if (budgetAmountElement) {
        budgetAmountElement.textContent = `Budget: ${formatRupiah(monthlyBudget)}`;
    }

    if (budgetRemainingElement) {
        budgetRemainingElement.textContent = formatRupiah(
            Math.max(remaining, 0),
        );
    }

    renderRecentExpenses();
    renderSpendingOverview(currentMonthExpenses);
}

// RECENT EXPENSES
function renderRecentExpenses() {
    const container = document.getElementById("recentExpenses");

    if (!container) {
        return;
    }

    // TAKE 3
    const recentExpenses = [...allExpenses]
        .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 3);

    if (recentExpenses.length === 0) {
        container.innerHTML = `
            <div class="expense-item">
                <div class="expense-info">
                    <span>No expenses yet.</span>
                </div>
            </div>
        `;

        return;
    }

    container.innerHTML = recentExpenses
        .map((expense) => {
            const category = expense.category || "Other";

            const icon = getCategoryIcon(category);

            const categoryClass = category.toLowerCase().replace(/\s+/g, "-");

            return `
                <div class="expense-item">

                    <div class="expense-left">

                        <div class="expense-icon ${categoryClass}">
                            <i data-feather="${icon}"></i>
                        </div>

                        <div class="expense-info">

                            <strong>
                                ${escapeHtml(expense.name)}
                            </strong>

                            <div>

                                <span class="category ${categoryClass}-text">
                                    ${escapeHtml(category)}
                                </span>

                                <span class="separator">
                                    •
                                </span>

                                <span>
                                    ${formatDate(expense.date)}
                                </span>

                            </div>

                        </div>

                    </div>

                    <strong class="expense-price">
                        ${formatRupiah(Number(expense.amount || 0))}
                    </strong>

                </div>
            `;
        })
        .join("");

    if (window.feather) {
        window.feather.replace();
    }
}

// SPENDING OVERVIEW
function renderSpendingOverview(expenses) {
    const categoryTotals = {};

    // TOTAL PER CATEGORY
    expenses.forEach((expense) => {
        const category = expense.category || "Other";

        const amount = Number(expense.amount || 0);

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += amount;
    });

    const total = Object.values(categoryTotals).reduce(
        (sum, value) => sum + value,
        0,
    );

    // DONUT TOTAL
    const chartTotal = document.getElementById("chartTotal");

    if (chartTotal) {
        chartTotal.textContent = formatCompactRupiah(total);
    }

    // DONUT CHART
    const donutChart = document.querySelector(".donut-chart");

    const categories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1],
    );

    if (donutChart && total > 0) {
        const colors = [
            "#EF4444",
            "#8B5CF6",
            "#F97316",
            "#EC4899",
            "#0EA5E9",
            "#EAB308",
            "#14B8A6",
            "#6366F1",
        ];

        let currentPercentage = 0;

        const gradientParts = categories.map(([category, amount], index) => {
            const percentage = (amount / total) * 100;

            const start = currentPercentage;

            currentPercentage += percentage;

            const end = currentPercentage;

            return `${colors[index % colors.length]} ${start}% ${end}%`;
        });

        donutChart.style.background = `conic-gradient(${gradientParts.join(", ")})`;
    }

    // LEGEND

    const legend = document.getElementById("chartLegend");

    if (legend) {
        if (total === 0) {
            legend.innerHTML = `
                <div class="legend-more">
                    No expenses this month
                </div>
            `;
        } else {
            legend.innerHTML = categories
                .slice(0, 6)
                .map(([category, amount], index) => {
                    const percentage = Math.round((amount / total) * 100);

                    const colors = [
                        "#EF4444",
                        "#8B5CF6",
                        "#F97316",
                        "#EC4899",
                        "#0EA5E9",
                        "#EAB308",
                    ];

                    return `
                            <div class="legend-item">

                                <span
                                    class="legend-color"
                                    style="
                                        background: ${colors[index % colors.length]};
                                    "
                                ></span>

                                <span>
                                    ${escapeHtml(category)}
                                </span>

                                <strong>
                                    ${percentage}%
                                </strong>

                            </div>
                        `;
                })
                .join("");
        }
    }

    renderBarChart(categories, total);
}

// BAR CHART
function renderBarChart(categories, total) {
    const barChart = document.getElementById("barChart");

    if (!barChart) {
        return;
    }

    if (categories.length === 0) {
        barChart.innerHTML = `
            <div class="legend-more">
                No expenses this month
            </div>
        `;

        return;
    }

    // Take maks 6 kategori
    const topCategories = categories.slice(0, 6);

    const maxAmount = Math.max(
        ...topCategories.map(([category, amount]) => amount),
    );

    barChart.innerHTML = topCategories
        .map(([category, amount]) => {
            const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

            return `
                    <div class="bar-item">

                        <div
                            class="bar"
                            style="height: ${height}%"
                            title="${escapeHtml(category)}: ${formatRupiah(amount)}"
                        ></div>

                        <span>
                            ${escapeHtml(category)}
                        </span>

                    </div>
                `;
        })
        .join("");
}

// RUPIAH
function formatCompactRupiah(amount) {
    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1).replace(".0", "")}jt`;
    }

    if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}k`;
    }

    return formatRupiah(amount);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// QUICK ADD
const quickAddAmount = document.getElementById("quickAddAmount");
const quickAddCategory = document.getElementById("quickAddCategory");
const quickAddButton = document.getElementById("quickAddButton");

if (quickAddButton) {
    quickAddButton.addEventListener("click", async () => {
        const amountText = quickAddAmount.value.trim();
        const category = quickAddCategory.value;

        const amount = Number(amountText.replace(/\D/g, ""));

        if (!amount || amount <= 0) {
            alert("Masukkan nominal yang valid.");
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            alert("Silakan login terlebih dahulu.");
            return;
        }

        try {
            quickAddButton.disabled = true;
            quickAddButton.textContent = "Adding...";

            const idToken = await user.getIdToken();

            const response = await fetch("/api/expenses", {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${idToken}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name: "Quick Add",
                    amount: amount,
                    category: category,
                    date: new Date().toISOString(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add expense.");
            }

            console.log("Quick Add berhasil:", result);

            quickAddAmount.value = "";

            await loadDashboardExpenses(user);
        } catch (error) {
            console.error("Quick Add error:", error);

            alert(
                error.message ||
                    "Gagal menambahkan expense. Silakan coba lagi.",
            );
        } finally {
            quickAddButton.disabled = false;
            quickAddButton.textContent = "+ Add";
        }
    });
}

// FIREBASE AUTH
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No Firebase user logged in.");

        return;
    }

    console.log("Dashboard logged in as:", user.email);

    loadDashboardExpenses(user);
    loadDashboardBudget(user);
});
