// --- ELEMEN DARI HTML ---
const gameBoard = document.getElementById('game-board');
const playerPion = document.getElementById('player-pion');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const diceResultDiv = document.getElementById('dice-result');
const messageDiv = document.getElementById('message');

// --- KONFIGURASI GAME ---
const boardSize = 100;
let playerPosition = 0; // Mulai dari luar papan (posisi 0)
const snakesAndLadders = {
    // Ular (dari kepala ke ekor)
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
    // Tangga (dari bawah ke atas)
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

// --- FUNGSI-FUNGSI GAME ---

// 1. Membuat Papan Permainan secara otomatis
function createBoard() {
    for (let i = boardSize; i >= 1; i--) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = `tile-${i}`;
        tile.innerText = i;
        
        // Tandai petak ular atau tangga dengan gambar
        if (snakesAndLadders[i]) {
            if (i > snakesAndLadders[i]) { // Jika turun, itu ular
                tile.classList.add('snake');
            } else { // Jika naik, itu tangga
                tile.classList.add('ladder');
            }
        }
        
        gameBoard.appendChild(tile);
    }
}

// 2. Menggerakkan Pion ke Petak yang Benar
function updatePionPosition() {
    if (playerPosition === 0) return; // Jangan gerak jika masih di luar papan
    const targetTile = document.getElementById(`tile-${playerPosition}`);
    const targetRect = targetTile.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    // Hitung posisi pion relatif terhadap papan
    playerPion.style.bottom = `${targetRect.bottom - boardRect.bottom}px`;
    playerPion.style.left = `${targetRect.left - boardRect.left}px`;
}

// 3. Mengocok Dadu dan Menjalankan Giliran
function rollDice() {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    diceResultDiv.innerText = diceValue;

    if (playerPosition + diceValue <= boardSize) {
        playerPosition += diceValue;
        messageDiv.innerText = `Kamu maju ke petak ${playerPosition}.`;
    } else {
        messageDiv.innerText = `Angka terlalu besar, kamu tetap di petak ${playerPosition}.`;
    }
    
    // Periksa apakah mendarat di ular atau tangga
    if (snakesAndLadders[playerPosition]) {
        const destination = snakesAndLadders[playerPosition];
        const isSnake = playerPosition > destination;
        
        setTimeout(() => { // Kasih jeda biar kelihatan
            messageDiv.innerText = isSnake 
                ? `Ups! Kamu kena ular dan turun ke petak ${destination}.`
                : `Asyik! Kamu dapat tangga dan naik ke petak ${destination}!`;
            playerPosition = destination;
            updatePionPosition();
        }, 1000); // Jeda 1 detik
    }

    updatePionPosition();

    // Cek Kemenangan
    if (playerPosition === boardSize) {
        messageDiv.innerText = '🎉 SELAMAT, KAMU MENANG! 🎉';
        rollDiceBtn.disabled = true; // Matikan tombol jika sudah menang
    }
}

// --- INISIALISASI GAME ---
createBoard();
rollDiceBtn.addEventListener('click', rollDice);
