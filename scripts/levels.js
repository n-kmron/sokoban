"use strict";

/**
 * @typedef {Object} Level Description of a Sokoban level.
 * @property {"easy" | "medium" | "difficult"} difficulty The difficulty of the game.
 * @property {number} [best] The minimum number of moves to win.
 * @property {string[]} map
 * The level map, line by line, with the following meaning for each symbol:
 *   * `ðŸ§` â€“ the player,
 *   * `x` â€“ a target,
 *   * `#` â€“ a box,
 *   * `@` â€“ a box on a target,
 *   * ` ` â€“ (space) the ground,
 *   * *autre* â€“ a wall.
 */

/**
 * *global* data structure for data concerning the different levels of the game.
 * @type {Level[]}
 */
const levels = [
    {
        difficulty: "easy",
        best: 10,
        map: [
            "          ",
            "   ┌─┐    ",
            "   │x│    ",
            "   │ └──┐ ",
            " ┌─┘#🧍#x│ ",
            " │x # ┌─┘ ",
            " └──┐#│   ",
            "    │x│   ",
            "    └─┘   ",
            "          ",
        ],
    },
    {
        difficulty: "easy",
        best: 89,
        map: [
            "           ",
            " ┌───┐     ",
            " │🧍  │ ┌─┐ ",
            " │ ##│ │x│ ",
            " │ # └─┘x│ ",
            " └┬┐    x│ ",
            "  ├┘  ╷  │ ",
            "  │   ├──┘ ",
            "  │   │    ",
            "  └───┘    ",
            "           ",
        ],
    },
    {
        difficulty: "easy",
        best: 33,
        map: [
            "        ",
            "  ┌──┐  ",
            " ┌┘  │  ",
            " │🧍# │  ",
            " ├┐# └┐ ",
            " ├┘ # │ ",
            " │x#  │ ",
            " │xx@x│ ",
            " └────┘ ",
            "        ",
        ],
    },
    {
        difficulty: "medium",
        best: 253,
        map: [
            "                     ",
            "     ┌───┐           ",
            "     │   │           ",
            "     │#  │           ",
            "   ┌─┘  #└┐          ",
            "   │  # # │          ",
            " ┌─┘ │ ┌┐ │   ┌────┐ ",
            " │   │ └┘ └───┘  xx│ ",
            " │ #  #          xx│ ",
            " └───┐ ═══ ╷🧍┌┐  xx│ ",
            "     │     ├───────┘ ",
            "     └─────┘         ",
            "                     ",
        ],
    },
    {
        difficulty: "medium",
        map: [
            "                 ",
            " ┌────┬──────┐   ",
            " │xx  │      └─┐ ",
            " │xx  │ #  #   │ ",
            " │xx  ╵#──┬┐   │ ",
            " │xx    🧍 └┘   │ ",
            " │xx  ╷ ╷  #  ╶┤ ",
            " └─┬──┘ └╴# #  │ ",
            "   │ #  # # #  │ ",
            "   │           │ ",
            "   └───────────┘ ",
            "                 ",
        ],
    },
    {
        difficulty: "medium",
        map: [
            "                    ",
            "         ┌──────┐   ",
            "         │     🧍│   ",
            "         │ #═# ┌┘   ",
            "         │ #  #│    ",
            "         ├╴# # │    ",
            " ┌──────┬┤ # ═ └─┐  ",
            " │xxxx  └┘ #  #  │  ",
            " ├╴xxx    #  #   │  ",
            " │xxxx  ┌────────┘  ",
            " └──────┘           ",
            "                    ",
        ],
    },
    {
        difficulty: "difficult",
        best: 57,
        map: [
            "              ",
            "  ┌──┐  ┌───┐ ",
            " ┌┘  │  │   │ ",
            " │ # └──┘#  │ ",
            " │  #xxxx # │ ",
            " └┐    ╷ 🧍 ┌┘ ",
            "  └────┴───┘  ",
            "              ",
        ],
    },
];
