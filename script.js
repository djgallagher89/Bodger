document.addEventListener('DOMContentLoaded', () => {
    const rounds = ['King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace'];
    let currentRoundIndex = 0;
const STORAGE_KEY = 'bodger-game-state';

// Load game state from localStorage
const loadGameState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const state = JSON.parse(saved);
            currentRoundIndex = state.currentRoundIndex || 0;
            
            // Restore player names
            for (let i = 1; i <= 5; i++) {
                const input = document.getElementById(`player${i}`);
                if (input && state[`player${i}`]) {
                    input.value = state[`player${i}`];
                }
            }
            
            // Restore scores
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, colIndex) => {
                    if (colIndex > 0) {
                        const key = `row${rowIndex}-col${colIndex}`;
                        if (state[key]) {
                            cell.textContent = state[key];
                        }
                    }
                });
            });
            
            console.log('Game state loaded from localStorage');
        } catch (e) {
            console.error('Error loading game state:', e);
        }
    }
};

// Save game state to localStorage
const saveGameState = () => {
    const state = {
        currentRoundIndex: currentRoundIndex,
    };
    
    // Save player names
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`player${i}`);
        if (input && input.value.trim()) {
            state[`player${i}`] = input.value;
        }
    }
    
    // Save scores
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, colIndex) => {
            if (colIndex > 0 && cell.textContent.trim()) {
                const key = `row${rowIndex}-col${colIndex}`;
                state[key] = cell.textContent.trim();
            }
        });
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('Game state saved to localStorage');
};

    const updateCurrentRound = () => {
        document.getElementById('current-round').textContent = `Bodger is: ${rounds[currentRoundIndex]}`;
        highlightCurrentRound();
        saveGameState();
    };

    const updateTotals = () => {
        const totals = [0, 0, 0, 0, 0];
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index > 0) {
                    const score = parseInt(cell.textContent.trim(), 10);
                    if (!isNaN(score)) {
                        totals[index - 1] += score;
                    }
                }
            });
        });

        totals.forEach((total, index) => {
            document.getElementById(`total-player${index + 1}`).textContent = total;
       });
         saveGameState();
    };

    const highlightCurrentRound = () => {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.classList.toggle('highlight', index === currentRoundIndex);
        });
    };

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index > 0) {
                cell.setAttribute('contenteditable', 'true');
                cell.addEventListener('input', updateTotals);
            }
        });
    });

   // Player name input tracking
for (let i = 1; i <= 5; i++) {
    const input = document.getElementById(`player${i}`);
    if (input) {
        input.addEventListener('change', saveGameState);
    }
}
 document.getElementById('reset-scores').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all scores?')) {  
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index > 0) cell.textContent = '';
            });
        });
        updateTotals();
    }  
});

    document.getElementById('next-round').addEventListener('click', () => {
    currentRoundIndex = (currentRoundIndex + 1) % rounds.length;
    updateCurrentRound();
});

    document.getElementById('clear-all').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data and start fresh?')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });
    
    // Load game state on page load
    loadGameState();
    updateCurrentRound();
    updateTotals();
    
    // Auto-save game state every 10 seconds
    setInterval(saveGameState, 10000);
    
    // Save game state before unload
    window.addEventListener('beforeunload', saveGameState);
});
