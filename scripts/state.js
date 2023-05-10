"use strict";

//Classes

/**
 * Crée une sauvegarde de l'état du jeu avant un déplacement
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
        return {...this._playerPosition}; //Les '...' permettent de retourner une copie qui n'est donc pas modifiable
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
