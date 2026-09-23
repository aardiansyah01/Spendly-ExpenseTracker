import { auth } from "./firebase";

const openBudgetModalButton = document.getElementById("openBudgetModal");

const budgetModal = document.getElementById("budgetModal");

const closeBudgetModalButton = document.getElementById("closeBudgetModal");

const cancelBudgetButton = document.getElementById("cancelBudget");

const budgetForm = document.getElementById("budgetForm");

// OPEN MODAL
function openBudgetModal() {
    if (!budgetModal) {
        return;
    }

    budgetModal.classList.add("show");
}

// CLOSE MODAL
function closeBudgetModal() {
    if (!budgetModal) {
        return;
    }

    budgetModal.classList.remove("show");
}

// BUTTON
if (openBudgetModalButton) {
    openBudgetModalButton.addEventListener("click", openBudgetModal);
}

if (closeBudgetModalButton) {
    closeBudgetModalButton.addEventListener("click", closeBudgetModal);
}

if (cancelBudgetButton) {
    cancelBudgetButton.addEventListener("click", closeBudgetModal);
}

// CLICK OUTSIDE MODAL
if (budgetModal) {
    budgetModal.addEventListener("click", function (event) {
        if (event.target === budgetModal) {
            closeBudgetModal();
        }
    });
}

// ESCAPE KEY
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeBudgetModal();
    }
});

// SAVE
if (budgetForm) {
    budgetForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const month = budgetForm.querySelector('[name="month"]').value;

        const amount = budgetForm.querySelector('[name="amount"]').value;

        if (!month || !amount) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            //Firebase ID Token
            const user = auth.currentUser;

            if (!user) {
                alert("User is not logged in.");
                return;
            }

            const idToken = await user.getIdToken();

            // Laravel Send
            const response = await fetch("/api/budget", {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                    Accept: "application/json",
                },

                body: JSON.stringify({
                    month: month,
                    amount: Number(amount),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Budget save error:", data);

                alert(data.message || "Failed to save budget.");

                return;
            }

            alert("Budget saved successfully!");

            closeBudgetModal();

            budgetForm.reset();
        } catch (error) {
            console.error("Budget save error:", error);

            alert("Something went wrong while saving the budget.");
        }
    });
}
