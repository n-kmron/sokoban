"use strict";

//Classes

/**
 * Creates a save game state before a move
 */
class State {
    /**
   * @param {{x: number,y: number;}} playerPosition
   * @param {{x: number,y: number;} | undefined} boxPosition
   */
    constructor(playerPosition, boxPosition = undefined) {
        /** @private */
        this._playerPosition = {...playerPosition};

        /** @private */
        this._boxPosition = boxPosition === undefined ? undefined : {...boxPosition};
    }

    /** @returns {{x: number,y: number;}}  */
    get playerPosition() {
        return {...this._playerPosition}; // The '...' return a copy which is therefore not modifiable
    }

    /** @returns {{x: number,y: number;} | undefined} */
    get boxPosition() {
        if (this._boxPosition !== undefined) {
            return {...this._boxPosition};
        } else {
            return undefined;
        }
    }
}
