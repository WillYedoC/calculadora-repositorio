// Variables para el estado de la calculadora
let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let resetScreen = false;
let history = new Array();

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
const historyPanel = document.querySelector(".history__panel");
const toggleHistory = document.querySelector(".toggle_history");
const historyPrinciple = document.querySelector(".history");
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
function displayHistory(){
    historyPanel.innerHTML = "";

    if (history.length === 0) {
        historyPanel.innerHTML = '<div class="history__empty">Sin operaciones aún</div>';
        ensureClearButtonUsesStorageAware();
        return;
    }

    history.slice().reverse().forEach((element) => {
        const item = document.createElement('div');
        item.className = 'history__item';
        item.textContent = element;

        item.addEventListener('click', () => {
            const parts = element.split('=');
            if (parts.length > 1) {
                currentOperand = parts[1].trim();
                updateDisplay();
            }
        });

        historyPanel.appendChild(item);
    });
    ensureClearButtonUsesStorageAware();
}
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case "+":
            computation = prev + current;
            history.push(`${prev} + ${current} = ${prev+current}`);
            break;
        case "-":
            computation = prev - current;
            history.push(`${prev} - ${current} = ${prev - current}`);
            break;
        case "*":
            computation = prev * current;
            history.push(`${prev} * ${current} = ${prev * current}` );
            break;
        case "/":
            if (current === 0) {
                alert("No se puede dividir por cero");
                clear();
                return;
            }
            computation = prev / current;
            history.push(`${prev} / ${current} = ${prev / current}`);
            break;
        default:
            return;
    }

    currentOperand = Math.round(computation * 100000000) / 100000000;
    operation = undefined;
    previousOperand = "";
    resetScreen = true;
    saveHistory();
}

function clear() {
    currentOperand = "0";
    previousOperand = "";
    operation = undefined;
}

function clearHistory() {
    history = [];
    displayHistory();
}

const originalClearHistory = clearHistory;
function clearHistoryAndStorage() {
    originalClearHistory();
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.warn('No se pudo limpiar LocalStorage', e);
    }
}


function ensureClearButtonUsesStorageAware() {
    const btn = historyPrinciple.querySelector('.history__clear');
    if (btn) {
        btn.removeEventListener('click', clearHistory);
        btn.addEventListener('click', clearHistoryAndStorage);
    }
}

const STORAGE_KEY = 'calculadora_historial_v1';

function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('No se pudo guardar el historial en LocalStorage', e);
    }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            history = parsed;
        }
    } catch (e) {
        console.warn('Error al cargar historial desde LocalStorage', e);
    }
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
    displayHistory();
});

allClearButton.addEventListener("click", () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener("click", () => {
    deleteLastDigit();
    updateDisplay();
});
toggleHistory.addEventListener('click', () => {
    historyPrinciple.classList.toggle('open');
    if (historyPrinciple.classList.contains('open')) displayHistory();
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

loadHistory();
displayHistory();

updateDisplay();
