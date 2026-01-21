const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('[data-number]');
const functionButtons = document.querySelectorAll('[data-action]');

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;
let decimalHoldStart = null;

// Update display
function updateDisplay() {
  display.value = currentInput;
}

// Allow clicking on display to input numbers
display.addEventListener('click', () => {
  display.focus();
});

// Handle keyboard input for display - only accept numbers and operations
display.addEventListener('keydown', (e) => {
  e.preventDefault(); // Prevent default input behavior
  const key = e.key;
  
  if (/^[0-9]$/.test(key)) {
    // Number key pressed
    if (shouldResetDisplay) {
      currentInput = key;
      shouldResetDisplay = false;
    } else {
      currentInput = currentInput === '0' ? key : currentInput + key;
    }
    updateDisplay();
  } else if (key === '.') {
    // Decimal point
    if (!currentInput.includes('.')) {
      currentInput += '.';
    }
    updateDisplay();
  } else if (key === 'Backspace') {
    // Delete last digit
    if (currentInput !== '0') {
      currentInput = currentInput.slice(0, -1) || '0';
    }
    updateDisplay();
  } else if (key === 'Enter') {
    // Equals
    if (currentInput === '1337') {
      const failedAttempts = localStorage.getItem('failedAttempts') ? parseInt(localStorage.getItem('failedAttempts')) : 0;
      
      if (failedAttempts >= 3) {
        display.value = 'ACCESS DENIED';
        display.style.color = '#ff0000';
        setTimeout(() => {
          currentInput = '0';
          display.style.color = '#00ff88';
          updateDisplay();
        }, 2000);
        operation = null;
        previousInput = '';
        shouldResetDisplay = true;
        display.blur();
        return;
      }
      
      display.value = 'UNLOCKING';
      display.style.color = '#00ff88';
      setTimeout(() => {
        window.location.href = 'page2.html';
      }, 1500);
      operation = null;
      previousInput = '';
      shouldResetDisplay = true;
      display.blur();
      return;
    }
    calculate();
    display.blur();
  }
});

// Handle number button clicks
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const number = button.dataset.number;
    
    if (shouldResetDisplay) {
      currentInput = number;
      shouldResetDisplay = false;
    } else {
      currentInput = currentInput === '0' ? number : currentInput + number;
    }
    
    updateDisplay();
  });
});

// Handle function button clicks
functionButtons.forEach(button => {
  let holdTimer = null;
  let isHolding = false;
  
  // Add hold detection for decimal button only
  if (button.dataset.action === 'decimal') {
    button.addEventListener('mousedown', (e) => {
      // Only allow reset if the exact sequence was entered: 121408 → x^y → 3
      // This prevents cheating by just typing the result number
      const isResetCode = (previousInput === '121408' && operation === 'exponent' && currentInput === '3');
      
      console.log('Decimal hold check:', { previousInput, operation, currentInput, isResetCode });
      
      if (isResetCode) {
        isHolding = true;
        holdTimer = setTimeout(() => {
          display.value = 'Attempts reset';
          display.style.color = '#00ff00';
          localStorage.removeItem('failedAttempts');
          localStorage.setItem('failedAttempts', '0');
          
          currentInput = '0';
          operation = null;
          previousInput = '';
          shouldResetDisplay = false;
          updateDisplay();
          isHolding = false;
          
          setTimeout(() => {
            display.style.color = '#00ff88';
          }, 2000);
        }, 3000);
      }
    });
    
    button.addEventListener('mouseup', () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      isHolding = false;
    });
    
    button.addEventListener('mouseleave', () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      isHolding = false;
    });
  }
  
  button.addEventListener('click', () => {
    // Skip click if decimal was being held for reset
    if (isHolding) return;
    
    const action = button.dataset.action;
    
    switch (action) {
      case 'clear':
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetDisplay = false;
        break;
        
      case 'delete':
        if (currentInput !== '0') {
          currentInput = currentInput.slice(0, -1) || '0';
        }
        break;
        
      case 'decimal':
        if (!currentInput.includes('.')) {
          currentInput += '.';
        }
        break;
        
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        if (operation !== null) {
          calculate();
        }
        previousInput = currentInput;
        operation = action;
        shouldResetDisplay = true;
        break;
        
      case 'equals':
        // Check for easter egg
        if (currentInput === '1337') {
          const failedAttempts = localStorage.getItem('failedAttempts') ? parseInt(localStorage.getItem('failedAttempts')) : 0;
          
          if (failedAttempts >= 3) {
            display.value = 'ACCESS DENIED';
            display.style.color = '#ff0000';
            setTimeout(() => {
              currentInput = '0';
              display.style.color = '#00ff88';
              updateDisplay();
            }, 2000);
            operation = null;
            previousInput = '';
            shouldResetDisplay = true;
            return;
          }
          
          display.value = 'UNLOCKING';
          display.style.color = '#00ff88';
          setTimeout(() => {
            window.location.href = 'page2.html';
          }, 1500);
          operation = null;
          previousInput = '';
          shouldResetDisplay = true;
          return;
        }
        calculate();
        break;
        
      case 'exponent':
        if (operation !== null) {
          calculate();
        }
        previousInput = currentInput;
        operation = 'exponent';
        shouldResetDisplay = true;
        break;
        
      case 'e':
        currentInput = Math.E.toString();
        shouldResetDisplay = true;
        break;
    }
    
    updateDisplay();
  });
});

// Perform calculation
function calculate() {
  if (operation === null || shouldResetDisplay) return;
  
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;
  
  switch (operation) {
    case 'add':
      result = prev + current;
      break;
    case 'subtract':
      result = prev - current;
      break;
    case 'multiply':
      result = prev * current;
      break;
    case 'divide':
      result = prev / current;
      break;
    case 'exponent':
      result = Math.pow(prev, current);
      break;
    default:
      return;
  }
  
  // Easter egg: check for secret code
  if (currentInput === '121408') {
    display.value = 'ACCESS GRANTED';
    display.style.color = '#00ff00';
    setTimeout(() => {
      window.location.href = 'page2.html';
    }, 1500);
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
    return;
  }
  
  currentInput = result.toString();
  operation = null;
  previousInput = '';
  shouldResetDisplay = true;
}

// Initialize display
updateDisplay();
