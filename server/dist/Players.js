"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.players = exports.router = exports.spillere = exports.Position = exports.Suit = void 0;
//Players.ts
const express_1 = __importDefault(require("express"));
// Define Suit enum
var Suit;
(function (Suit) {
    Suit["Hearts"] = "\u2665";
    Suit["Spades"] = "\u2660";
    Suit["Diamonds"] = "\u2666";
    Suit["Clubs"] = "\u2663";
})(Suit || (exports.Suit = Suit = {}));
// Define Position enum
var Position;
(function (Position) {
    Position["North"] = "north";
    Position["East"] = "east";
    Position["South"] = "south";
    Position["West"] = "west";
})(Position || (exports.Position = Position = {}));
const router = express_1.default.Router();
exports.router = router;
// Define spillere with updated types
exports.spillere = [
    { navn: 'North', postkasseId: 1, kort: [] },
    { navn: 'East', postkasseId: 2, kort: [] },
    { navn: 'South', postkasseId: 3, kort: [] },
    { navn: 'West', postkasseId: 4, kort: [] },
];
// Define positions
const positions = [Position.North, Position.South, Position.East, Position.West];
// Keep track of assigned positions
let assignedPositions = [];
exports.players = [];
// Endpoint to get the list of players
router.get('/players', (req, res) => {
    res.json(exports.players);
});
// Endpoint to register players (create a new player)
router.post('/register', (req, res) => {
    if (exports.players.length >= 4) {
        return res.status(400).json({ success: false, error: 'Maximum number of players reached' });
    }
    const playerName = req.body.playerName;
    if (!playerName) {
        return res.status(400).json({ success: false, error: 'Player name is required' });
    }
    // Shuffle positions to assign randomly
    let availablePositions = positions.filter(pos => !assignedPositions.includes(pos));
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    // Assign position to player
    const newPlayer = { name: playerName, position: randomPosition };
    exports.players.push(newPlayer);
    assignedPositions.push(randomPosition);
    return res.json({ success: true, player: newPlayer, message: `${playerName} registered successfully` });
});
exports.default = router;
