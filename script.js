document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('td');
    const rounds = ['King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace'];
    let currentRoundIndex = 0;

    const updateCurrentRound = () => {
        document.getElementById('current-round').textContent = `Current Round: ${rounds[currentRoundIndex]}`;
    };

    const updateTotals = () => {
        const totals = [0, 0, 0, 0, 0];
        cells.forEach((cell, index) => {
            if (index % 6 !== 0) {
                const score = parseInt(cell.textContent, 10);
                if (!isNaN(score)) {
                    totals[(index % 6) - 1] += score;
                }
            }
        });
        totals.forEach((total, index) => {
            document.getElementById(`total-player${index + 1}`).textContent = total;
        });
    };

    const resetScores = () => {
        cells.forEach(cell => {
            cell.textContent = '';
        });
        updateTotals();
    };

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const score = prompt('Enter score:');
            if (score !== null) {
                cell.textContent = score;
                updateTotals();
            }
        });
    });

    document.getElementById('reset-scores').addEventListener('click', resetScores);

    updateCurrentRound();
});
