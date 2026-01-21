let failedAttempts = localStorage.getItem('failedAttempts') ? parseInt(localStorage.getItem('failedAttempts')) : 0;
const correctPassword = 'lavish1234';

function checkPassword() {
  const password = document.getElementById('passwordInput').value;
  const messageElement = document.querySelector('.message');
  
  if (password === '' || password === null) {
    messageElement.textContent = 'Please enter a password';
    messageElement.style.color = '#ffff00';
    return;
  }
  
  if (password === correctPassword) {
    messageElement.textContent = 'ACCESS GRANTED';
    messageElement.classList.remove('incorrect');
    messageElement.classList.add('correct');
    localStorage.removeItem('failedAttempts');
    document.getElementById('passwordInput').value = '';
    setTimeout(() => {
      window.location.href = 'page3.html';
    }, 1500);
  } else if (password === 'resetattempts1234') {
    localStorage.setItem('page3Attempts', '0');
    messageElement.textContent = 'Attempts reset';
    messageElement.classList.remove('incorrect');
    messageElement.classList.add('correct');
    document.getElementById('passwordInput').value = '';
    setTimeout(() => {
      messageElement.textContent = 'ACCESS GRANTED';
    }, 2000);
  } else {
    failedAttempts++;
    localStorage.setItem('failedAttempts', failedAttempts);
    
    const attemptsRemaining = 3 - failedAttempts;
    messageElement.textContent = `Incorrect, ${attemptsRemaining} attempts remaining`;
    messageElement.classList.remove('correct');
    messageElement.classList.add('incorrect');
    
    if (failedAttempts >= 3) {
      setTimeout(() => {
        messageElement.textContent = 'Too many failed attempts';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }, 1500);
    }
    
    document.getElementById('passwordInput').value = '';
  }
}

// Allow Enter key to submit password
document.getElementById('passwordInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    checkPassword();
  }
});
