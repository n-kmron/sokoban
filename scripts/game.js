"use strict";

//Declaration of variables
let level = 0;
let nbMoves = 0;
let direction = "player";

/**@type Array<State>*/
const states = [];

//Functions

/**
 * Displays the map of a level and defines the class of each element
 * @param {Number} level, the index of the levels array corresponding to the level number
 */
function buildLevel(level) {
    for (let i = 0; i < levels[level].map.length; i++) {
        $("#world").append(`<div class="line${i} flex"></div>`);

        for (let j = 0; j < levels[level].map[i].length; j++) {
            const element = levels[level].map[i][j];

            if (element === "x") {
                $(`.line${i}`).append("<div class=\"square target\"></div>");
            } else if (element === "#") {
                $(`.line${i}`).append("<div class=\"square box\"></div>");
            } else if (element === "@") {
                $(`.line${i}`).append("<div class=\"square box target\"></div>");
            } else if (element === " ") {
                $(`.line${i}`).append("<div class=\"square ground\"></div>");
            } else if (element === "🧍".charAt(0) || element === "🧍".charAt(1)) {
                $(`.line${i}`).append("<div class=\"square player\"></div>");
            } else {
                //if it's not the others, then it's a wall
                $(`.line${i}`).append("<div class=\"square wall\"></div>");
            }

            //the coding of the player exceeds the authorized number of bits therefore is coded on 2 characters: the char at makes it possible to display that the character or the player is present and not the other
        }
    }

    //allows to create a list with all the players therefore 2 because coded on 2 characters and removes 1 so that he can remove the extra one
    const list = $(".player");
    list[1].remove();
}

/**
 *
 * @returns the position of the player on the map
 */
function getPlayerPosition() {
    const x = $(".player").index(); //Lets fetch the line
    const y = $(".player").parent()
        .index();

    return {x, y};
}

/**
 *
 * @param {{x: number, y: number}} position
 * @returns the box at the given position
 */
function getSquareAt(position) {
    return $("#world").children()
        .eq(position.y)
        .children()
        .eq(position.x);
}

/**
 * Moves the player one space according to the directional arrow
 * @param {JQuery.KeyDownEvent} event
 */
function move(event) {
    let addX = 0; //x-axis variation for player destination
    let addY = 0; //Y-axis variation for player destination
    let addX2 = 0; //variation on the X axis for the destination of the box
    let addY2 = 0; //variation on the Y axis for the destination of the box

    const pos = getPlayerPosition();

    switch (event.key) {
    case "ArrowUp":
        addY = -1;
        addY2 = -2;
        direction = "top";
        break;
    case "ArrowDown":
        addY = +1;
        addY2 = +2;
        direction = "player";
        break;
    case "ArrowLeft":
        addX = -1;
        addX2 = -2;
        direction = "left";
        break;
    case "ArrowRight":
        addX = +1;
        addX2 = +2;
        direction = "right";
        break;
    }

    const destination = {x: pos.x + addX, y: pos.y + addY}; //new player position
    const destination2 = {x: pos.x + addX2, y: pos.y + addY2}; //new box position

    if (!allOnTarget()) {
        //State recording
        let state = undefined;
        if (getSquareAt(destination).hasClass("box")) {
            state = new State(pos, destination);
        } else {
            state = new State(pos);
        }
        pushBox(pos, destination, destination2);
        boxAndWall(destination, destination2);
        advance(pos, destination, destination2);
        states.push(state);
        if (
            !getSquareAt(destination).hasClass("wall") &&
        !boxAndWall(destination, destination2)
        ) {
            incrMoves(event);
        }
    }
}

/**
 * Execute the move
 * @param {{x: number;y: number;}} pos starting position
 * @param {{x: number;y: number;}} destination new position
 */
function doTheMove(pos, destination) {
    getSquareAt(pos).removeClass("player");
    getSquareAt(pos).removeClass("bottom");
    getSquareAt(pos).removeClass("top");
    getSquareAt(pos).removeClass("left");
    getSquareAt(pos).removeClass("right");
    getSquareAt(pos).addClass("ground");
    getSquareAt(destination).addClass("player");
    getSquareAt(destination).addClass(direction);
    if (level === 6 && allOnTarget()) {
        getSquareAt(destination).removeClass("player");
        getSquareAt(destination).removeClass("bottom");
        getSquareAt(destination).removeClass("top");
        getSquareAt(destination).removeClass("left");
        getSquareAt(destination).removeClass("right");
        getSquareAt(destination).addClass("won");
        $("h3").text("Congratulation, you won !");
    }
}
/**
 * Moves the player
 * @param {{x: number;y: number;}} pos starting position
 * @param {{x: number;y: number;}} destination new position
 * @param {{x: number;y: number;}} destination2 the element following the position
 */
function advance(pos, destination, destination2) {
    //this if handles targets (so they don't disappear)
    if (
        getSquareAt(pos).hasClass("target") &&
      !getSquareAt(destination).hasClass("wall") &&
      !boxAndWall(destination, destination2)
    ) {
        doTheMove(pos, destination);
        getSquareAt(pos).removeClass("ground");
        getSquareAt(pos).addClass("target");
        //this else handles the rest of the cases
    } else if (
        !getSquareAt(destination).hasClass("wall") &&
      !boxAndWall(destination, destination2)
    ) {
        doTheMove(pos, destination);
    }
}

/**
 * @param {{x: number;y: number;}} destination the next hurdle
 * @param {{x: number;y: number;}} destination2 the second next hurdle
 * @returns if the next obstacle is a box followed by a wall or a box followed by a box or a box on target followed by a box on target
 */
function boxAndWall(destination, destination2) {
    if (
        getSquareAt(destination).hasClass("box") &&
        getSquareAt(destination2).hasClass("wall") ||
        getSquareAt(destination).hasClass("box") &&
        getSquareAt(destination2).hasClass("box")
    ) {
        return true;
    }
    return false;
}
/**
 * Push a box
 * @param {{x: number, y: number}} pos starting position
 * @param {{x: number, y: number}} destination new position
 * @param {{x: number, y: number}} destination2 the new position of the box (if there is one)
 */
function pushBox(pos, destination, destination2) {
    if (
        getSquareAt(destination).hasClass("box")
    ) {
        //if it's a box
        if (
            !getSquareAt(destination2).hasClass("wall") &&
        !getSquareAt(destination2).hasClass("box")
        ) {
        //and that its new destination is neither a box nor a wall
            doTheMove(pos, destination);
            getSquareAt(destination).removeClass("box");
            getSquareAt(destination2).addClass("box");
        }
    }
    if (allOnTarget()) {
        const targets = document.getElementsByClassName("target");

        //for each element of the targets
        for (const element of targets) {
        //if the element is not a box (so it is not a box on a target)
            element.classList.add("allOnTarget");
        }
    }
}

/**
 * Increments movement counter
 * @param {JQuery.KeyDownEvent} event
 */
function incrMoves(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
        nbMoves += 1;
        $("span:first").text(nbMoves);
    }
}

/**
 * Check if all the boxes are on their target
 * @returns a boolean of the above condition
 */
function allOnTarget() {
    //all elements that have class 'target'
    const targets = document.getElementsByClassName("target");

    //for each element of the targets
    for (const element of targets) {
        //if the element is not a box (so it is not a box on a target)
        if (!element.classList.contains("box")) {
            return false;
        }
    }
    return true;
}

/**
 * Prepares a new level to be built
 */
function initLevel() {
    level += 1;
    buildLevel(level);
    nbMoves = 0;
    $("span:first").text(nbMoves);
}

/**
 * Complete the level by pressing the spacebar
 * @param {JQuery.KeyDownEvent} event
 */
function finishLevel(event) {
    if (event.key === " " && level < 6) {
        $("#world").children()
            .remove();
        initLevel();
        $("p:first").text(`Level ${level + 1}`);
    }
}

//Ready
$(() => {
    buildLevel(level);
    //the keydown event detects when a key is pressed;
    $(document).on("keydown", finishLevel);
    $(document).on("keydown", move);
    $("#level").text(`Level ${level + 1}`);
    $("button:first").on("click", function() {
        level -= 1;
        $("#world").children()
            .remove();
        initLevel();
    });

    //The backup (cancel the movements)
    $("#backup").on("click", function() {
        const compteur = states.length - 1;
        if (nbMoves > 0 && !allOnTarget()) {
            nbMoves -= 1;
            const diff = {x: getPlayerPosition().x - states[compteur].playerPosition.x,
                y: getPlayerPosition().y - states[compteur].playerPosition.y};

            const oldBox = states[compteur].boxPosition;
            const newBox = {x: getPlayerPosition().x + diff.x,
                y: getPlayerPosition().y + diff.y};

            $("span:first").text(nbMoves);
            doTheMove(getPlayerPosition(), states[compteur].playerPosition);
            if (oldBox !== undefined && newBox !== undefined) {
                getSquareAt(oldBox).addClass("box");
                getSquareAt(newBox).removeClass("box");
            }
            states.pop();
        }
    });
});
