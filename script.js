// Variables para el estado de la calculadora
let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let resetScreen = false;

// Elementos DOM
const outputElement = document.querySelector(".calculator__display--output");
const inputElement = document.querySelector(".calculator__display--input");
const numberButtons = document.querySelectorAll(".calculator__button--number");
const operationButtons = document.querySelectorAll(
    ".calculator__button--operation"
);
const equalsButton = document.querySelector(".calculator__button--equals");
const allClearButton = document.querySelector(".calculator__button--clear");
const deleteButton = document.querySelector(".calculator__button--delete");

// Funciones de la calculadora
function updateDisplay() {
    outputElement.textContent = currentOperand;

    if (operation != null && previousOperand !== "") {
        inputElement.textContent = `${previousOperand} ${getOperationSymbol(
            operation
        )}`;
    } else {
        inputElement.textContent = "";
    }
}

function getOperationSymbol(op) {
    switch (op) {
        case "+":
            return "+";
        case "-":
            return "−";
        case "*":
            return "×";
        case "/":
            return "÷";
        default:
            return op;
    }
}

function appendNumber(number) {
    if (currentOperand === "0" || resetScreen) {
        currentOperand = number;
        resetScreen = false;
    } else {
        currentOperand += number;
    }
}

function addDecimalPoint() {
    if (resetScreen) {
        currentOperand = "0.";
        resetScreen = false;
        return;
    }

    if (currentOperand.includes(".")) return;
    currentOperand += ".";
}

function chooseOperation(op) {
    if (currentOperand === "") return;

    if (previousOperand !== "") {
        compute();
    }

    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case "+":
            computation = prev + current;
            break;
        case "-":
            computation = prev - current;
            break;
        case "*":
            computation = prev * current;
            break;
        case "/":
            if (current === 0) {
                alert("No se puede dividir por cero");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    currentOperand = Math.round(computation * 100000000) / 100000000;
    operation = undefined;
    previousOperand = "";
    resetScreen = true;
}

function clear() {
    currentOperand = "0";
    previousOperand = "";
    operation = undefined;
}

function deleteLastDigit() {
    if (currentOperand.length === 1) {
        currentOperand = "0";
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Event Listeners
numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.textContent === ".") {
            addDecimalPoint();
        } else {
            appendNumber(button.textContent);
        }
        updateDisplay();
    });
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let op = button.textContent;
        if (op === "×") op = "*";
        if (op === "÷") op = "/";

        chooseOperation(op);
        updateDisplay();
    });
});

equalsButton.addEventListener("click", () => {
    compute();
    updateDisplay();
});

allClearButton.addEventListener("click", () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener("click", () => {
    deleteLastDigit();
    updateDisplay();
});

document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        appendNumber(e.key);
        updateDisplay();
    }

    if (e.key === ".") {
        addDecimalPoint();
        updateDisplay();
    }

    if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        chooseOperation(e.key);
        updateDisplay();
    }

    if (e.key === "Enter" || e.key === "=") {
        compute();
        updateDisplay();
    }

    if (e.key === "Escape") {
        clear();
        updateDisplay();
    }

    if (e.key === "Backspace") {
        deleteLastDigit();
        updateDisplay();
    }
});

updateDisplay();
