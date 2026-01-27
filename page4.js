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
        // Convert to lowercase and remove spaces
        const formattedOutput = encrypted.toLowerCase().replace(/\s/g, '');
        document.getElementById('outputArea').value = formattedOutput;
        statusText.textContent = 'Message encrypted';
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
        // Convert to lowercase and remove spaces
        const formattedOutput = decrypted.toLowerCase().replace(/\s/g, '');
        document.getElementById('outputArea').value = formattedOutput;
        statusText.textContent = 'Message decrypted';
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

function copyOutput() {
    const outputArea = document.getElementById('outputArea');
    const statusText = document.getElementById('statusText');
    
    if (!outputArea.value) {
        statusText.textContent = 'Nothing to copy';
        statusText.className = 'error';
        return;
    }
    
    outputArea.select();
    outputArea.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(outputArea.value).then(() => {
        statusText.textContent = 'Copied to clipboard!';
        statusText.className = 'success';
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        statusText.textContent = 'Copied to clipboard!';
        statusText.className = 'success';
    });
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
            if (charIndex < text.length) {
                row.push(text[charIndex]);
            } else {
                row.push('');
            }
        }
        grid.push(row);
    }
    
    // Read columns in sorted order
    let ciphertext = '';
    for (let colIndex of columnOrder) {
        for (let row of grid) {
            if (row[colIndex]) {
                ciphertext += row[colIndex];
            }
        }
    }
    
    return ciphertext;
}

function columnarTranspositionDecrypt(ciphertext, keyword) {
    const key = keyword.toUpperCase();
    const keyLength = key.length;
    const text = ciphertext.toUpperCase().replace(/\s/g, '');
    const textLength = text.length;
    const numRows = Math.ceil(textLength / keyLength);
    
    // Create column order based on alphabetical order of keyword
    const sortedKey = key.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char));
    
    const columnOrder = sortedKey.map(item => item.index);
    
    // Calculate how many characters each column has based on original positions
    const originalColumnHeights = [];
    for (let col = 0; col < keyLength; col++) {
        let height = 0;
        for (let row = 0; row < numRows; row++) {
            const charIndex = row * keyLength + col;
            if (charIndex < textLength) {
                height++;
            }
        }
        originalColumnHeights[col] = height;
    }
    
    // Create grid
    const grid = Array(numRows).fill().map(() => Array(keyLength).fill(''));
    
    // Fill grid column by column in sorted order
    let charIndex = 0;
    for (let i = 0; i < keyLength; i++) {
        const colIndex = columnOrder[i];
        const height = originalColumnHeights[colIndex];
        for (let row = 0; row < height; row++) {
            grid[row][colIndex] = text[charIndex++];
        }
    }
    
    // Read grid row by row
    let plaintext = '';
    for (let row of grid) {
        plaintext += row.join('');
    }
    
    return plaintext;
}
