document.addEventListener('DOMContentLoaded', () => {
    const rounds = ['King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace'];
    let currentRoundIndex = 0;

    const updateCurrentRound = () => {
        document.getElementById('current-round').textContent = `Bodger is: ${rounds[currentRoundIndex]}`;
        highlightCurrentRound();
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

    document.getElementById('reset-scores').addEventListener('click', () => {
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index > 0) cell.textContent = '';
            });
        });
        updateTotals();
    });

    document.getElementById('next-round').addEventListener('click', () => {
        if (currentRoundIndex < rounds.length - 1) {
            currentRoundIndex++;
            updateCurrentRound();
        } else {
            alert("You've reached the final round (Ace).");
        }
    });

    updateCurrentRound();
});
