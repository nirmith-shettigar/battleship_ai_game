import { SIZE, OCEAN, SHIP } from './constants.js';

export function isValidPlacement(board, row, col, size, direction) {
    if (direction === 'h' && col + size <= SIZE) {
        return Array(size).fill().every((_, i) => board[row][col + i] === OCEAN);
    }
    if (direction === 'v' && row + size <= SIZE) {
        return Array(size).fill().every((_, i) => board[row + i][col] === OCEAN);
    }
    return false;
}

export function placeShip(board, row, col, size, direction) {
    if (direction === 'h') {
        for (let i = 0; i < size; i++) {
            board[row][col + i] = SHIP;
        }
    } else if (direction === 'v') {
        for (let i = 0; i < size; i++) {
            board[row + i][col] = SHIP;
        }
    }
}