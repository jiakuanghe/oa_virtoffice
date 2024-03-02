import {LAYERS, MAP_DIMENSIONS, SOLID_TILES} from './mapConstants';

/**
 * Check if the given position is a solid tile
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is a solid tile, false otherwise
 */
export const isSolidTile = (x, y) => {
    for (let layer of LAYERS) {
        if (SOLID_TILES.includes(layer[y][x])) {
            return true;
        }
    }
    return false;
};

/**
 * Check if the given position is at the edge of the map
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is at the edge of the map, false otherwise
 */
export const isMapEdge = (x, y) => {
    const {ROWS, COLS} = MAP_DIMENSIONS;
    return (x < 0 || x >= COLS || y < 0 || y >= ROWS)
};

/**
 * Check if the given position is a solid tile or at the edge of the map
 *
 * @param x The new x position
 * @param y The new y position
 * @returns {boolean} true if the position is a solid tile or at the edge of the map, false otherwise
 */
export const checkMapCollision = (x, y) => {
    return isMapEdge(x,y) || isSolidTile(x,y);
};
