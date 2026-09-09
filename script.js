document.addEventListener('DOMContentLoaded', () => {
    const rounds = ['King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace'];
    let currentRoundIndex = 0;
const STORAGE_KEY = 'bodger-game-state';
let isClearing = false;

// Load game state from localStorage
const loadGameState = () => {
    // Always clear player names first
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`player${i}`);
        if (input) {
            input.value = '';
        }
    }
    
    // Always clear score inputs first
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.value = '';
    });
    
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
            const scoreInputs = document.querySelectorAll('.score-input');
            scoreInputs.forEach((input, index) => {
                const key = `score${index}`;
                if (state[key]) {
                    input.value = state[key];
                }
            });
            
            console.log('Game state loaded from localStorage');
        } catch (e) {
            console.error('Error loading game state:', e);
        }
    }
};

// Save game state to localStorage
const saveGameState = () => {
    // Don't save if we're in the process of clearing
    if (isClearing) {
        return;
    }
    
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
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach((input, index) => {
        if (input.value.trim()) {
            const key = `score${index}`;
            state[key] = input.value;
        }
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
        const scoreInputs = document.querySelectorAll('.score-input');

        scoreInputs.forEach((input, index) => {
            const playerIndex = index % 5;
            const score = parseInt(input.value, 10);
            if (!isNaN(score)) {
                totals[playerIndex] += score;
            }
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

    // Set up event listeners for all score inputs
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.addEventListener('input', updateTotals);
        input.addEventListener('change', saveGameState);
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
        const scoreInputs = document.querySelectorAll('.score-input');
        scoreInputs.forEach(input => {
            input.value = '';
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
            isClearing = true;
            localStorage.removeItem(STORAGE_KEY);
            // Clear all service worker caches before reloading
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        caches.delete(cacheName);
                    });
                    location.reload();
                });
            } else {
                location.reload();
            }
        }
    });
    
    // Load game state on page load
    loadGameState();
    updateCurrentRound();
    updateTotals();
    
    // Auto-save game state every 10 seconds
    setInterval(saveGameState, 10000);
    
    // Save game state before unload (but not during clearing)
    window.addEventListener('beforeunload', saveGameState);
});
