    // Game State
        const gameState = {
            team1: { name: "Team 1", score: 0, wickets: 0, overs: 0, balls: 0 },
            team2: { name: "Team 2", score: 0, wickets: 0, overs: 0, balls: 0 },
            currentBatting: 1,
            maxOvers: 5,
            maxWickets: 10,
            gameOver: false,
            inningsComplete: false,
            players: [
                { name: "Batsman 1", runs: 0, balls: 0, wickets: 0 },
                { name: "Batsman 2", runs: 0, balls: 0, wickets: 0 },
                { name: "Bowler 1", runs: 0, balls: 0, wickets: 0 },
                { name: "Bowler 2", runs: 0, balls: 0, wickets: 0 }
            ],
            currentBatsmanIndex: 0,
            currentBowlerIndex: 2
        };

        // Get DOM elements
        let team1ScoreEl, team2ScoreEl, commentaryEl, hitButton, bowlButton, playerListEl;

        // Initialize game
        function initGame() {
            console.log("Initializing game...");
            
            // Get elements
            team1ScoreEl = document.getElementById('team1-score');
            team2ScoreEl = document.getElementById('team2-score');
            commentaryEl = document.getElementById('commentary-text');
            hitButton = document.getElementById('hit-button');
            bowlButton = document.getElementById('bowl-button');
            playerListEl = document.getElementById('player-list');

            // Check if elements exist
            if (!team1ScoreEl || !team2ScoreEl || !commentaryEl || !hitButton || !bowlButton || !playerListEl) {
                console.error("Some elements not found!");
                return;
            }

            console.log("All elements found!");

            // Add event listeners
            hitButton.onclick = handleHit;
            bowlButton.onclick = handleBowl;

            // Initial update
            updateScoreboard();
            updatePlayerStats();
            updateCommentary("Welcome! Team 1 will bat first. Click Hit or Bowl to start!");
        }

        // Update scoreboard
        function updateScoreboard() {
            const t1 = gameState.team1;
            const t2 = gameState.team2;
            team1ScoreEl.textContent = t1.score + "/" + t1.wickets + " (" + t1.overs + "." + t1.balls + ")";
            team2ScoreEl.textContent = t2.score + "/" + t2.wickets + " (" + t2.overs + "." + t2.balls + ")";
        }

        // Update player stats
        function updatePlayerStats() {
            playerListEl.innerHTML = '';
            
            for (let i = 0; i < gameState.players.length; i++) {
                const player = gameState.players[i];
                const div = document.createElement('div');
                div.className = 'player-card';
                
                const isBatting = i === gameState.currentBatsmanIndex && gameState.currentBatting === 1;
                const isBowling = i === gameState.currentBowlerIndex && gameState.currentBatting === 1;
                
                let status = '';
                if (isBatting) status = ' 🏏 Batting';
                if (isBowling) status = ' ⚾ Bowling';
                
                div.innerHTML = '<h3>' + player.name + status + '</h3><p>Runs: ' + player.runs + ' | Balls: ' + player.balls + ' | Wickets: ' + player.wickets + '</p>';
                
                if (isBatting) {
                    div.style.backgroundColor = '#e8f5e9';
                    div.style.borderColor = '#4caf50';
                }
                if (isBowling) {
                    div.style.backgroundColor = '#fff3e0';
                    div.style.borderColor = '#ff9800';
                }
                
                playerListEl.appendChild(div);
            }
        }

        // Update commentary
        function updateCommentary(text) {
            commentaryEl.textContent = text;
            commentaryEl.style.animation = 'fadeIn 0.5s';
        }

        // Handle hit
        function handleHit() {
            if (gameState.gameOver) {
                updateCommentary("Game over! Refresh to play again.");
                return;
            }
            const outcomes = [0, 1, 2, 3, 4, 6, 'wicket', 0, 1, 2, 3, 4];
            const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            processBall(outcome);
        }

        // Handle bowl
        function handleBowl() {
            if (gameState.gameOver) {
                updateCommentary("Game over! Refresh to play again.");
                return;
            }
            const outcomes = [0, 0, 0, 1, 1, 2, 3, 4, 6, 'wicket', 'wicket'];
            const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            processBall(outcome);
        }

        // Process ball
        function processBall(outcome) {
            const team = gameState.currentBatting === 1 ? gameState.team1 : gameState.team2;
            const batsman = gameState.players[gameState.currentBatsmanIndex];
            const bowler = gameState.players[gameState.currentBowlerIndex];
            
            if (outcome === 'wicket') {
                team.wickets++;
                bowler.wickets++;
                
                const scoreboard = document.getElementById('scoreboard');
                scoreboard.style.animation = 'shake 0.5s';
                setTimeout(() => { scoreboard.style.animation = ''; }, 500);
                
                updateCommentary('🎯 WICKET! ' + batsman.name + ' is OUT! Wickets: ' + team.wickets);
                
                gameState.currentBatsmanIndex = (gameState.currentBatsmanIndex + 1) % 4;
                
                if (team.wickets >= gameState.maxWickets) {
                    endInnings();
                    return;
                }
            } else {
                team.score += outcome;
                batsman.runs += outcome;
                
                if (outcome === 0) {
                    updateCommentary('Dot ball! No run scored.');
                } else if (outcome === 4) {
                    const container = document.querySelector('.container');
                    container.style.animation = 'pulse 0.5s';
                    setTimeout(() => { container.style.animation = ''; }, 500);
                    updateCommentary('🎉 FOUR! Great shot! Score: ' + team.score + '/' + team.wickets);
                } else if (outcome === 6) {
                    const container = document.querySelector('.container');
                    container.style.animation = 'pulse 0.5s';
                    setTimeout(() => { container.style.animation = ''; }, 500);
                    updateCommentary('🚀 SIX! Massive hit! Score: ' + team.score + '/' + team.wickets);
                } else {
                    updateCommentary(batsman.name + ' scores ' + outcome + ' run(s). Score: ' + team.score + '/' + team.wickets);
                }
            }
            
            batsman.balls++;
            team.balls++;
            
            if (team.balls >= 6) {
                team.balls = 0;
                team.overs++;
                gameState.currentBowlerIndex = (gameState.currentBowlerIndex + 1) % 4;
                
                updateCommentary('End of over ' + team.overs + '. Score: ' + team.score + '/' + team.wickets);
                
                if (team.overs >= gameState.maxOvers) {
                    endInnings();
                    return;
                }
            }
            
            if (gameState.inningsComplete && gameState.currentBatting === 2 && gameState.team2.score > gameState.team1.score) {
                endGame();
                return;
            }
            
            updateScoreboard();
            updatePlayerStats();
        }

        // End innings
        function endInnings() {
            if (!gameState.inningsComplete) {
                gameState.inningsComplete = true;
                gameState.currentBatting = 2;
                gameState.currentBatsmanIndex = 0;
                gameState.currentBowlerIndex = 2;
                
                updateCommentary('🏏 Innings over! Team 1: ' + gameState.team1.score + '/' + gameState.team1.wickets + '. Team 2 needs ' + (gameState.team1.score + 1) + ' runs to win!');
                
                updateScoreboard();
                updatePlayerStats();
            } else {
                endGame();
            }
        }

        // End game
        function endGame() {
            gameState.gameOver = true;
            
            const s1 = gameState.team1.score;
            const s2 = gameState.team2.score;
            
            let result = '';
            if (s1 > s2) {
                result = '🏆 TEAM 1 WINS by ' + (s1 - s2) + ' runs!';
            } else if (s2 > s1) {
                const wicketsLeft = gameState.maxWickets - gameState.team2.wickets;
                result = '🏆 TEAM 2 WINS by ' + wicketsLeft + ' wickets!';
            } else {
                result = '🤝 TIE! Both scored ' + s1 + ' runs!';
            }
            
            updateCommentary('🎮 GAME OVER! ' + result);
            
            hitButton.disabled = true;
            bowlButton.disabled = true;
            
            updateScoreboard();
            updatePlayerStats();
        }

        // Start when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGame);
        } else {
            initGame();
        }