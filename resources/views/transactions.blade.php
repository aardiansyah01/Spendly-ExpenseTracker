<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Spenly - Transactions</title>

    <script src="https://unpkg.com/feather-icons"></script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Transactions CSS -->
    <link rel="stylesheet" href="{{ asset('css/transactions.css') }}">

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

            <a href="/" class="nav-item">

                <i class="bi bi-house"></i>

                <span>
                    Dashboard
                </span>

            </a>


            <a href="/transactions" class="nav-item active">

                <i class="bi bi-clipboard"></i>

                <span>
                    Transactions
                </span>

            </a>

        </nav>


        <!-- Profile -->
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

        <div class="transactions-container">

            <!-- PAGE HEADER -->
            <section class="page-header">

                <div>

                    <h1>
                        Transactions
                    </h1>

                    <p>
                        Manage and review your expenses.
                    </p>

                </div>


                <button class="add-expense-button">

                    <i class="bi bi-plus-lg"></i>

                    <span>
                        Add Expense
                    </span>

                </button>

            </section>



            <!-- FILTER CARD -->
            <section class="filter-card">


                <!-- Search -->
                <div class="search-box">

                    <i class="bi bi-search"></i>

                    <input
                        type="text"
                        id="searchExpense"
                        placeholder="Search expenses..."
                    >

                </div>

                <!-- Category -->
                <select class="filter-select" id="categoryFilter">

                    <option value="all">
                        All Categories
                    </option>

                    <option value="Bills">
                        Bills
                    </option>

                    <option value="Education">
                        Education
                    </option>

                    <option value="Food">
                        Food
                    </option>

                    <option value="Shopping">
                        Shopping
                    </option>

                    <option value="Technology">
                        Technology
                    </option>

                    <option value="Transport">
                        Transport
                    </option>

                    <option value="Entertainment">
                        Entertainment
                    </option>

                </select>
                
                <!-- Month -->
                <select class="filter-select" id="monthFilter">

                    <option value="all">
                        All Months
                    </option>

                </select>

                <!-- Sort -->
                <select class="filter-select" id="sortFilter">

                    <option value="newest">
                        Newest first
                    </option>

                    <option value="oldest">
                        Oldest first
                    </option>

                    <option value="highest">
                        Highest amount
                    </option>

                    <option value="lowest">
                        Lowest amount
                    </option>

                </select>

            </section>

            <!-- TRANSACTION SUMMARY -->
            <div class="transaction-summary">

                <span id="expenseCount">
                    0 expenses
                </span>

                <span id="expenseTotal">
                    Total: Rp 0
                </span>

            </div>



            <!-- TRANSACTION TABLE -->
            <section class="transaction-card">


                <!-- Table Header -->
                <div class="transaction-header">

                    <div>
                        EXPENSE
                    </div>

                    <div>
                        CATEGORY
                    </div>

                    <div>
                        DATE
                    </div>

                    <div>
                        AMOUNT
                    </div>

                    <div>
                        ACTION
                    </div>

                </div>

            </section>

        </div>

    </main>

<!-- ADD EXPENSE MODAL -->
<div id="expenseModal" class="modal-overlay">

    <div class="expense-modal">

        <!-- Modal Header -->

        <div class="modal-header">

            <div>
                <h2>Add Expense</h2>

                <p>Record a new expense</p>
            </div>

            <button
                type="button"
                class="modal-close"
                id="closeExpenseModal"
            >
                &times;
            </button>

        </div>


        <!-- Modal Body -->
        <form id="expenseForm">

            <div class="modal-body">

                <!-- Expense Name -->
                <div class="form-group">

                    <label for="expenseName">
                        Expense Name
                    </label>

                    <input
                        type="text"
                        id="expenseName"
                        name="expense_name"
                        placeholder="e.g. Nasi Ayam Bakar"
                    >

                </div>


                <!-- Amount -->
                <div class="form-group">

                    <label for="expenseAmount">
                        Amount (Rp)
                    </label>

                    <input
                        type="number"
                        id="expenseAmount"
                        name="amount"
                        placeholder="Rp 0"
                        min="0"
                    >

                </div>


                <!-- Category + Date -->
                <div class="form-row">

                    <!-- Category -->
                    <div class="form-group">

                        <label for="expenseCategory">
                            Category
                        </label>

                        <select
                            id="expenseCategory"
                            name="category"
                        >

                            <option value="Food">
                                Food
                            </option>

                            <option value="Bills">
                                Bills
                            </option>

                            <option value="Education">
                                Education
                            </option>

                            <option value="Shopping">
                                Shopping
                            </option>

                            <option value="Technology">
                                Technology
                            </option>

                            <option value="Transport">
                                Transport
                            </option>

                            <option value="Entertainment">
                                Entertainment
                            </option>

                        </select>

                    </div>


                    <!-- Date -->
                    <div class="form-group">

                        <label for="expenseDate">
                            Date
                        </label>

                        <input
                            type="date"
                            id="expenseDate"
                            name="date"
                        >

                    </div>

                </div>

                <!-- Note -->
                <div class="form-group">

                    <label for="expenseNote">
                        Note <span>(optional)</span>
                    </label>

                    <textarea
                        id="expenseNote"
                        name="note"
                        placeholder="Any additional details..."
                    ></textarea>

                </div>

            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">

                <button
                    type="button"
                    class="cancel-button"
                    id="cancelExpense"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="save-button"
                >
                    Save Expense
                </button>

            </div>

        </form>

    </div>

</div>

</body>

</html>