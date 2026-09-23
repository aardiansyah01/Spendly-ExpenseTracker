<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Spenly - Dashboard</title>

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <script src="https://unpkg.com/feather-icons"></script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Dashboard CSS -->
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>

<body>

<div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <!-- Logo -->
        <div class="sidebar-logo">

            <div class="logo-icon">
                <i class="bi bi-currency-dollar"></i>
            </div>

            <span>Spenly</span>

        </div>


        <!-- Navigation -->
        <nav class="sidebar-nav">

            <a href="#" class="nav-item active">
                <i class="bi bi-house"></i>
                <span>Dashboard</span>
            </a>

            <a href="/transactions" class="nav-item">
                <i class="bi bi-clipboard"></i>
                <span>Transactions</span>
            </a>

        </nav>


        <!-- User Profile -->
        <div class="sidebar-profile">

            <div class="profile-avatar" id="profileAvatar">
                ?
            </div>

            <div class="profile-info">
                <strong id="profileName">Guest</strong>
                <span id="profileEmail">Not logged in</span>
            </div>

        </div>

        <div class="sidebar-auth-action" id="sidebarAuthAction">
        </div>

    </aside>


    <!-- MAIN CONTENT -->
    <main class="main-content">

        <div class="dashboard-container">

            <!-- HEADER -->
            <section class="dashboard-header">

                <h1>
                    Good evening
                </h1>

                <p>
                    Here's your spending overview.
                </p>

                <span class="current-month">
                    For This Month
                </span>

            </section>


            <!-- STATISTICS -->
            <section class="stats-grid">

                    <!-- Total Spent -->
                <div class="stat-card">

                    <div class="stat-icon spent-icon">
                        <i class="bi bi-wallet2"></i>
                    </div>

                    <div class="stat-value" id="totalSpent">
                        Rp 0
                    </div>

                    <div class="stat-title">
                        Total Spent
                    </div>

                    <div class="stat-description" id="totalSpentPercentage">
                        0% of budget
                    </div>

                </div>

                <!-- Monthly Budget -->
                <div class="stat-card">

                    <div class="stat-icon budget-icon">
                        <i class="bi bi-bar-chart"></i>
                    </div>

                    <div class="stat-value" id="monthlyBudget">
                        Rp 1.500.000
                    </div>

                    <div class="stat-title">
                        Monthly Budget
                    </div>

                    <div class="stat-description" id="budgetMonth">
                        September 2026
                    </div>

                </div>

                <!-- Remaining -->
                <div class="stat-card">

                    <div class="stat-icon remaining-icon">
                        <i class="bi bi-check-circle"></i>
                    </div>

                    <div class="stat-value" id="remainingBudget">
                        Rp 1.500.000
                    </div>

                    <div class="stat-title">
                        Remaining
                    </div>

                    <div class="stat-description">
                        Left to spend
                    </div>

                </div>

            </section>


            <!-- MAIN GRID -->
            <section class="dashboard-grid">

                <!-- LEFT COLUMN -->
                <div class="left-column">


                    <!-- MONTHLY BUDGET -->
                    <div class="card budget-card">

                        <div class="card-header budget-header">
                            <div>
                                <h3>Monthly Budget</h3>

                                <button
                                    type="button"
                                    class="budget-setting-button"
                                    id="openBudgetModal"
                                    title="Setting Monthly Budget"
                                >
                                    <i data-feather="settings"></i>
                                </button>
                            </div>

                            <strong class="budget-percentage" id="budgetPercentage">
                                0%
                            </strong>
                        </div>


                        <!-- Progress Bar -->
                        <div class="progress-container">

                            <div class="progress-bar"
                                id="budgetProgress"
                                style="width: 0%;">
                            </div>

                        </div>


                        <!-- Budget Information -->
                        <div class="budget-info">

                            <span id="budgetSpent">
                                Spent: Rp 0
                            </span>

                            <span id="budgetAmount">
                                Budget: Rp 1.500.000
                            </span>

                        </div>


                        <div class="budget-bottom">

                            <span>
                                Remaining
                            </span>

                            <strong id="budgetRemaining">
                                Rp 1.500.000
                            </strong>

                        </div>

                    </div>


                    <!-- QUICK ADD -->
                    <div class="quick-add">

                        <div class="quick-add-title">
                            <div class="quick-add-icon">
                                <i class="bi bi-plus"></i>
                            </div>

                            <span>Quick Add</span>
                        </div>


                        <div class="quick-add-form">

                            <input
                                type="text"
                                placeholder="Rp 25.000"
                                value="Rp 25.000"
                            >

                            <select>

                                <option>Food</option>
                                <option>Bills</option>
                                <option>Education</option>
                                <option>Shopping</option>
                                <option>Technology</option>
                                <option>Transport</option>

                            </select>

                            <button>
                                + Add
                            </button>

                        </div>

                    </div>


                    <!-- RECENT EXPENSES -->
                    <div class="card recent-card">

                        <div class="recent-header">

                            <h2>
                                Recent Expenses
                            </h2>

                            <a href="/transactions">
                                + Add Expense
                            </a>

                        </div>

                        <div id="recentExpenses">

                        </div>

                    </div>
                </div>


                <div class="right-column">

                    <!-- SPENDING OVERVIEW -->
                    <div class="card spending-card">

                        <h2>
                            Spending Overview
                        </h2>


                        <!-- Chart -->
                        <div class="chart-area">

                            <div class="donut-chart">

                                <div class="donut-center">
                                    <span>Total</span>
                                    <strong id="chartTotal">Rp 0</strong>
                                </div>

                            </div>


                            <!-- Legend -->
                            <div class="chart-legend" id="chartLegend">

                            </div>

                        </div>


                        <!-- Bar Chart -->
                        <div class="bar-chart" id="barChart">

                        </div>

                    </div>

                </div>

            </section>

        </div>

    </main>

</div>

<!-- BUDGET SETTING MODAL -->

<div class="budget-modal" id="budgetModal">

    <div class="budget-modal-content">

        <div class="budget-modal-header">

            <div>
                <h3>Set Monthly Budget</h3>
                <p>Set your spending limit for a specific month.</p>
            </div>

            <button
                type="button"
                class="budget-modal-close"
                id="closeBudgetModal"
            >
                <i data-feather="x"></i>
            </button>

        </div>


        <form id="budgetForm">

            <div class="budget-form-group">

                <label for="budgetMonth">
                    Month
                </label>

                <input
                    type="month"
                    id="budgetMonth"
                    name="month"
                    required
                >

            </div>


            <div class="budget-form-group">

                <label for="budgetAmountInput">
                    Monthly Budget
                </label>

                <div class="budget-input-wrapper">

                    <span>Rp</span>

                    <input
                        type="number"
                        id="budgetAmountInput"
                        name="amount"
                        min="0"
                        step="1000"
                        placeholder="1500000"
                        required
                    >

                </div>

            </div>


            <div class="budget-modal-actions">

                <button
                    type="button"
                    class="budget-cancel-button"
                    id="cancelBudget"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="budget-save-button"
                >
                    Save Budget
                </button>

            </div>

        </form>

    </div>

</div>

</body>

<script>
    feather.replace();
</script>

</html>