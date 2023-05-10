"use strict";

//Déclaration de variables
let niveau = 0;
let nbMoves = 0;
let direction = "player";

/**@type Array<State>*/
const states = [];

//Fonctions

/**
 * Affiche la map d'un niveau et défini la classe de chaque élément
 * @param {Number} level, l'indice du tableau levels correspondant au n° du niveau
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
                //si ce n'est pas les autres, alors c'est un mur
                $(`.line${i}`).append("<div class=\"square wall\"></div>");
            }

            //le codage du joueur dépasse le nombre de bits autorisé donc est codé sur 2 caractères : le char at permet d'afficher que le caractère ou le joueur est présent et pas l'autre
        }
    }

    //permet de créer une liste avec tous les joueurs donc 2 car codé sur 2 caractères et en enlève 1 pour qu'il puisse enlever celui en trop
    const list = $(".player");
    list[1].remove();
}

/**
 *
 * @returns la position du joueur sur la carte
 */
function getPlayerPosition() {
    const x = $(".player").index(); //Permet d'aller chercher la ligne
    const y = $(".player").parent()
        .index();

    return {x, y};
}

/**
 *
 * @param {{x: number, y: number}} position
 * @returns la case à la position donnée
 */
function getSquareAt(position) {
    return $("#world").children()
        .eq(position.y)
        .children()
        .eq(position.x);
}

/**
 * Déplace le joueur d'une case en fonction de la flèche directionnelle
 * @param {JQuery.KeyDownEvent} event
 */
function move(event) {
    let addX = 0; //variation sur l'axe des X pour la destination du joueur
    let addY = 0; //variation sur l'axe des Y pour la destination du joueur
    let addX2 = 0; //variation sur l'axe des X pour la destination de la boite
    let addY2 = 0; //variation sur l'axe des Y pour la destination de la boite

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

    const destination = {x: pos.x + addX, y: pos.y + addY}; //nouvelle position du joueur
    const destination2 = {x: pos.x + addX2, y: pos.y + addY2}; //nouvelle position de la boite

    if (!allOnTarget()) {
        //Enregistrement de l'état
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
 * Exécute le déplacement
 * @param {{x: number;y: number;}} pos la position de départ
 * @param {{x: number;y: number;}} destination la nouvelle position
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
    if (niveau === 6 && allOnTarget()) {
        getSquareAt(destination).removeClass("player");
        getSquareAt(destination).removeClass("bottom");
        getSquareAt(destination).removeClass("top");
        getSquareAt(destination).removeClass("left");
        getSquareAt(destination).removeClass("right");
        getSquareAt(destination).addClass("won");
        $("h3").text("Féliciation, vous avez gagné !");
    }
}
/**
 * Déplace le joueur
 * @param {{x: number;y: number;}} pos la position de départ
 * @param {{x: number;y: number;}} destination la nouvelle position
 * @param {{x: number;y: number;}} destination2 l'élément suivant la position
 */
function advance(pos, destination, destination2) {
    //ce if gère les cibles (pour qu'elles ne disparaissent pas)
    if (
        getSquareAt(pos).hasClass("target") &&
      !getSquareAt(destination).hasClass("wall") &&
      !boxAndWall(destination, destination2)
    ) {
        doTheMove(pos, destination);
        getSquareAt(pos).removeClass("ground");
        getSquareAt(pos).addClass("target");
        //ce else gère le reste des cas
    } else if (
        !getSquareAt(destination).hasClass("wall") &&
      !boxAndWall(destination, destination2)
    ) {
        doTheMove(pos, destination);
    }
}

/**
 * @param {{x: number;y: number;}} destination le prochain obstacle
 * @param {{x: number;y: number;}} destination2 le second prochain obstacle
 * @returns si le prochain obstacle est une boite suivie d'un mur ou une boite suivie d'une boite ou une boite sur cible suivie d'une boite sur cible
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
 * Pousse une boite
 * @param {{x: number, y: number}} pos la position de départ
 * @param {{x: number, y: number}} destination la nouvelle position
 * @param {{x: number, y: number}} destination2 la nouvelle position de la boite (si il y en a une)
 */
function pushBox(pos, destination, destination2) {
    if (
        getSquareAt(destination).hasClass("box")
    ) {
        //si c'est une boite
        if (
            !getSquareAt(destination2).hasClass("wall") &&
        !getSquareAt(destination2).hasClass("box")
        ) {
        //et que sa nouvelle destination n'est ni une boite, ni un mur
            doTheMove(pos, destination);
            getSquareAt(destination).removeClass("box");
            getSquareAt(destination2).addClass("box");
        }
    }
    if (allOnTarget()) {
        const targets = document.getElementsByClassName("target");

        //pour chaque élément des cibles
        for (const element of targets) {
        //si l'élément n'est pas une boîte (ce n'est donc pas une boîte sur une cible)
            element.classList.add("allOnTarget");
        }
    }
}

/**
 * Incrémente le compteur de mouvement
 * @param {JQuery.KeyDownEvent} event
 */
function incrMoves(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
        nbMoves += 1;
        $("span:first").text(nbMoves);
    }
}

/**
 * Vérifie si toutes les boites sont sur leur cible
 * @returns un boolean de la condition ci-dessus
 */
function allOnTarget() {
    //tous les éléments qui ont la classe 'target'
    const targets = document.getElementsByClassName("target");

    //pour chaque élément des cibles
    for (const element of targets) {
        //si l'élément n'est pas une boîte (ce n'est donc pas une boîte sur une cible)
        if (!element.classList.contains("box")) {
            return false;
        }
    }
    return true;
}

/**
 * Prépare un nouveau niveau à être construit
 */
function initLevel() {
    niveau += 1;
    buildLevel(niveau);
    nbMoves = 0;
    $("span:first").text(nbMoves);
}

/**
 * Termine le niveau en appuyant sur la barre espace
 * @param {JQuery.KeyDownEvent} event
 */
function finishLevel(event) {
    if (event.key === " " && niveau < 6) {
        $("#world").children()
            .remove();
        initLevel();
        $("p:first").text(`Niveau ${niveau + 1}`);
    }
}

//Ready
$(() => {
    buildLevel(niveau);
    //l'event keydown détecte quand un touche est enffoncée;
    $(document).on("keydown", finishLevel);
    $(document).on("keydown", move);
    $("#level").text(`Niveau ${niveau + 1}`);
    $("button:first").on("click", function() {
        niveau -= 1;
        $("#world").children()
            .remove();
        initLevel();
    });

    //La backup (annuler les mouvements)
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
