export const SIZE = 8;
export const CELL_SIZE = 50;

export const OCEAN = "O";
export const HIT = "X";
export const FIRE = "*";
export const SHIP = "<";

// Ship sizes and their required hits
export const SHIPS = [
    { size: 3, hits: 0 },
    { size: 3, hits: 0 },
    { size: 2, hits: 0 },
    { size: 2, hits: 0 },
    { size: 1, hits: 0 }
];

export const COLORS = {
    [OCEAN]: "#ADD8E6",  // Light blue
    [HIT]: "#FF6347",    // Tomato red
    [FIRE]: "#FFD700",   // Gold
    [SHIP]: "#228B22"    // Forest green
};