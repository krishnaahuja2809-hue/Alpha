
class Calculator {
  constructor(prevOperandEl, currentOperandEl) {
    this.prevOperandEl = prevOperandEl;
    this.currentOperandEl = currentOperandEl;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.prevOperand = '';
    this.operator = undefined;
  }

  delete() {
    if (this.currentOperand === '0') return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === '') this.currentOperand = '0';
  }

  appendNumber(number) {

    if (number === '.' && this.currentOperand.includes('.')) return;

    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperator(op) {
    if (this.currentOperand === '0' && this.prevOperand === '') return;

    if (this.prevOperand !== '') {
      this.compute();
    }

    this.operator = op;
    this.prevOperand = this.currentOperand;
    this.currentOperand = '0';
  }

  compute() {
    let result;
    const prev = parseFloat(this.prevOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.currentOperand = "Can't divide by 0";
          this.prevOperand = '';
          this.operator = undefined;
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = parseFloat(result.toFixed(8)).toString();
    this.operator = undefined;
    this.prevOperand = '';
  }

  formatDisplay(operand) {
    if (operand === "Can't divide by 0") return operand;

    const stringOperand = operand.toString();
    const [intPart, decimalPart] = stringOperand.split('.');
    const intDigits = parseFloat(intPart);

    let integerDisplay;
    if (isNaN(intDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = intDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalPart != null) {
      return `${integerDisplay}.${decimalPart}`;
    }
    return integerDisplay;
  }

  updateDisplay() {
    this.currentOperandEl.innerText = this.formatDisplay(this.currentOperand);

    if (this.operator != null) {
      this.prevOperandEl.innerText = `${this.formatDisplay(this.prevOperand)} ${this.operator}`;
    } else {
      this.prevOperandEl.innerText = '';
    }
  }
}

const prevOperandEl = document.getElementById('prevOperand');
const currentOperandEl = document.getElementById('currentOperand');
const calculator = new Calculator(prevOperandEl, currentOperandEl);


document.querySelectorAll('[data-num]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.num);
    calculator.updateDisplay();
  });
});


document.querySelectorAll('[data-op]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperator(button.dataset.op);
    calculator.updateDisplay();
  });
});

document.getElementById('equalsBtn').addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

document.getElementById('clearBtn').addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});


window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    calculator.appendNumber(e.key);
  } else if (e.key === '.') {
    calculator.appendNumber('.');
  } else if (e.key === '+') {
    calculator.chooseOperator('+');
  } else if (e.key === '-') {
    calculator.chooseOperator('-');
  } else if (e.key === '*') {
    calculator.chooseOperator('×');
  } else if (e.key === '/') {
    e.preventDefault();
    calculator.chooseOperator('÷');
  } else if (e.key === 'Enter' || e.key === '=') {
    calculator.compute();
  } else if (e.key === 'Backspace') {
    calculator.delete();
  } else if (e.key === 'Escape') {
    calculator.clear();
  } else {
    return;
  }
  calculator.updateDisplay();
});
