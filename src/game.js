import { Board } from './board.js';
import { SIZE, SHIPS, OCEAN, HIT, FIRE, SHIP } from './constants.js';
import { AI } from './ai.js';
import { isValidPlacement, placeShip } from './ship-placement.js';

export class Game {
    constructor() {
        this.initGame();
    }

    initGame() {
        this.playerBoard = new Board(document.getElementById('playerBoard'), true);
        this.aiBoard = new Board(document.getElementById('aiBoard'), false);
        this.messageElement = document.getElementById('message');
        this.ai = new AI();
        
        this.playerTurn = true;
        this.placing = true;
        this.currentShip = 0;
        this.placementDirection = 'h';
        this.gameOver = false;
        
        // Initialize ships with their hit counts
        this.playerShips = SHIPS.map(ship => ({ ...ship }));
        this.aiShips = SHIPS.map(ship => ({ ...ship }));
        
        this.setupEventListeners();
        this.autoPlaceAIShips();
        this.setMessage("Place your ships! Press SPACE to rotate, click to place.");
        this.updateRestartButton(false);
    }

    setupEventListeners() {
        this.aiBoard.canvas.addEventListener('click', (e) => {
            if (!this.gameOver && !this.placing && this.playerTurn) {
                const { row, col } = this.aiBoard.getGridPosition(e.clientX, e.clientY);
                this.handlePlayerTurn(row, col);
            }
        });

        this.playerBoard.canvas.addEventListener('click', (e) => {
            if (this.placing) {
                const { row, col } = this.playerBoard.getGridPosition(e.clientX, e.clientY);
                this.handleShipPlacement(row, col);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.placing) {
                this.placementDirection = this.placementDirection === 'h' ? 'v' : 'h';
                this.setMessage(`Place your ships! Current direction: ${this.placementDirection === 'h' ? 'horizontal' : 'vertical'}`);
            }
        });

        const restartBtn = document.getElementById('restartButton');
        restartBtn.addEventListener('click', () => this.initGame());
    }

    updateRestartButton(show) {
        const restartBtn = document.getElementById('restartButton');
        restartBtn.style.display = show ? 'block' : 'none';
    }

    setMessage(msg) {
        this.messageElement.textContent = msg;
    }

    checkWinCondition() {
        const playerLost = this.playerShips.every(ship => ship.hits >= ship.size);
        const aiLost = this.aiShips.every(ship => ship.hits >= ship.size);

        if (playerLost) {
            this.gameOver = true;
            this.setMessage("Game Over - Computer Wins!");
            this.updateRestartButton(true);
            return true;
        }
        if (aiLost) {
            this.gameOver = true;
            this.setMessage("Congratulations - You Win!");
            this.updateRestartButton(true);
            return true;
        }
        return false;
    }

    handleShipPlacement(row, col) {
        if (isValidPlacement(this.playerBoard.grid, row, col, SHIPS[this.currentShip].size, this.placementDirection)) {
            placeShip(this.playerBoard.grid, row, col, SHIPS[this.currentShip].size, this.placementDirection);
            this.currentShip++;
            this.playerBoard.draw(true);

            if (this.currentShip >= SHIPS.length) {
                this.placing = false;
                this.setMessage("Your turn! Click on enemy waters to attack.");
            }
        }
    }

    handlePlayerTurn(row, col) {
        if (this.aiBoard.grid[row][col] === OCEAN || this.aiBoard.grid[row][col] === SHIP) {
            const hit = this.aiBoard.grid[row][col] === SHIP;
            this.aiBoard.grid[row][col] = hit ? HIT : FIRE;
            
            if (hit) {
                // Find the first non-destroyed ship and increment its hits
                const shipToHit = this.aiShips.find(ship => ship.hits < ship.size);
                if (shipToHit) shipToHit.hits++;
                this.setMessage("Hit! Your turn again.");
            } else {
                this.setMessage("Miss! AI's turn...");
                this.playerTurn = false;
                setTimeout(() => this.handleAITurn(), 1000);
            }
            
            this.aiBoard.draw(false); // Never reveal AI ships
            
            if (this.checkWinCondition()) return;
        }
    }

    handleAITurn() {
        const [row, col] = this.ai.getNextMove(this.playerBoard.grid);
        const hit = this.playerBoard.grid[row][col] === SHIP;
        
        this.playerBoard.grid[row][col] = hit ? HIT : FIRE;
        if (hit) {
            // Find the first non-destroyed ship and increment its hits
            const shipToHit = this.playerShips.find(ship => ship.hits < ship.size);
            if (shipToHit) shipToHit.hits++;
            this.setMessage("AI hit your ship!");
            this.playerBoard.draw(true);
            this.ai.handleResult(row, col, hit);
            
            if (!this.checkWinCondition()) {
                setTimeout(() => this.handleAITurn(), 1000);
            }
        } else {
            this.setMessage("AI missed! Your turn.");
            this.playerBoard.draw(true);
            this.ai.handleResult(row, col, hit);
            this.playerTurn = true;
        }
    }

    autoPlaceAIShips() {
        for (const ship of SHIPS) {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * SIZE);
                const col = Math.floor(Math.random() * SIZE);
                const direction = Math.random() < 0.5 ? 'h' : 'v';
                
                if (isValidPlacement(this.aiBoard.grid, row, col, ship.size, direction)) {
                    placeShip(this.aiBoard.grid, row, col, ship.size, direction);
                    placed = true;
                }
            }
        }
        this.aiBoard.draw(false); // Never reveal AI ships
    }
}