// Transposition Cipher Implementation
window.addEventListener('DOMContentLoaded', () => {
    console.log('Transposition cipher page loaded');
});

function encryptMessage() {
    const keyword = document.getElementById('keywordInput').value.trim().toUpperCase();
    const message = document.getElementById('messageInput').value;
    const statusText = document.getElementById('statusText');
    
    if (!keyword) {
        statusText.textContent = 'Error: Please enter a keyword';
        statusText.className = 'error';
        return;
    }
    
    if (!message) {
        statusText.textContent = 'Error: Please enter a message';
        statusText.className = 'error';
        return;
    }
    
    try {
        const encrypted = columnarTranspositionEncrypt(message, keyword);
        document.getElementById('outputArea').value = encrypted;
        statusText.textContent = `Message encrypted with keyword "${keyword}"`;
        statusText.className = 'success';
    } catch (error) {
        statusText.textContent = `Error: ${error.message}`;
        statusText.className = 'error';
    }
}

function decryptMessage() {
    const keyword = document.getElementById('keywordInput').value.trim().toUpperCase();
    const message = document.getElementById('messageInput').value;
    const statusText = document.getElementById('statusText');
    
    if (!keyword) {
        statusText.textContent = 'Error: Please enter a keyword';
        statusText.className = 'error';
        return;
    }
    
    if (!message) {
        statusText.textContent = 'Error: Please enter a message';
        statusText.className = 'error';
        return;
    }
    
    try {
        const decrypted = columnarTranspositionDecrypt(message, keyword);
        document.getElementById('outputArea').value = decrypted;
        statusText.textContent = `Message decrypted with keyword "${keyword}"`;
        statusText.className = 'success';
    } catch (error) {
        statusText.textContent = `Error: ${error.message}`;
        statusText.className = 'error';
    }
}

function clearAll() {
    document.getElementById('keywordInput').value = '';
    document.getElementById('messageInput').value = '';
    document.getElementById('outputArea').value = '';
    document.getElementById('statusText').textContent = 'Ready to encrypt/decrypt';
    document.getElementById('statusText').className = '';
}

function columnarTranspositionEncrypt(plaintext, keyword) {
    // Remove spaces and convert to uppercase
    const text = plaintext.replace(/\s/g, '').toUpperCase();
    const key = keyword.toUpperCase();
    const keyLength = key.length;
    
    // Create column order based on alphabetical order of keyword
    const sortedKey = key.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char));
    
    const columnOrder = sortedKey.map(item => item.index);
    
    // Create grid
    const numRows = Math.ceil(text.length / keyLength);
    const grid = [];
    
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < keyLength; j++) {
            const charIndex = i * keyLength + j;
            row.push(charIndex < text.length ? text[charIndex] : 'X');
        }
        grid.push(row);
    }
    
    // Read columns in sorted order
    let ciphertext = '';
    for (let colIndex of columnOrder) {
        for (let row of grid) {
            ciphertext += row[colIndex];
        }
    }
    
    return ciphertext;
}

function columnarTranspositionDecrypt(ciphertext, keyword) {
    const key = keyword.toUpperCase();
    const keyLength = key.length;
    const textLength = ciphertext.length;
    const numRows = Math.ceil(textLength / keyLength);
    
    // Create column order based on alphabetical order of keyword
    const sortedKey = key.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char));
    
    const columnOrder = sortedKey.map(item => item.index);
    
    // Calculate column heights
    const fullColumns = textLength % keyLength || keyLength;
    const columnHeights = columnOrder.map((_, i) => 
        i < fullColumns ? numRows : numRows - 1
    );
    
    // Create grid
    const grid = Array(numRows).fill().map(() => Array(keyLength).fill(''));
    
    // Fill grid column by column in sorted order
    let charIndex = 0;
    for (let i = 0; i < keyLength; i++) {
        const colIndex = columnOrder[i];
        const height = columnHeights[i];
        for (let row = 0; row < height; row++) {
            grid[row][colIndex] = ciphertext[charIndex++];
        }
    }
    
    // Read grid row by row
    let plaintext = '';
    for (let row of grid) {
        plaintext += row.join('');
    }
    
    // Remove padding 'X' characters from the end
    plaintext = plaintext.replace(/X+$/, '');
    
    return plaintext;
}
