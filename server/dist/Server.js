"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.players = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const Players_1 = require("./Players");
const Deck_1 = __importDefault(require("./Deck")); // Import Card from Deck
const BidAndAsk_1 = require("./BidAndAsk");
const app = (0, express_1.default)();
const port = 2000;
app.use(express_1.default.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Middleware to handle CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Serve static files
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../Client/dist")));
// Players
exports.players = [];
// Endpoint to get the list of players
app.get('/api/players', (req, res) => {
    res.json(exports.players);
});
// Endpoint to register players (create a new player)
app.post('/api/register', (req, res) => {
    if (exports.players.length >= 4) {
        return res.status(400).json({ success: false, error: 'Maximum number of players reached' });
    }
    const playerName = req.body.playerName;
    if (!playerName) {
        return res.status(400).json({ success: false, error: 'Player name is required' });
    }
    // Assign position to player
    const positions = [Players_1.Position.North, Players_1.Position.South, Players_1.Position.East, Players_1.Position.West];
    const availablePositions = positions.filter(pos => !exports.players.some(player => player.position === pos));
    if (availablePositions.length === 0) {
        return res.status(400).json({ success: false, error: 'All positions are occupied' });
    }
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    // Add player to the list
    const newPlayer = { name: playerName, position: randomPosition };
    exports.players.push(newPlayer);
    return res.json({ success: true, player: newPlayer, message: `${playerName} registered successfully` });
});
// Bid and Ask
const bidAndAsk = new BidAndAsk_1.BidAndAsk(); // Create an instance of BidAndAsk
// Example usage
app.post('/api/bid', (req, res) => {
    const { position, bid } = req.body;
    if (!position || !bid) {
        return res.status(400).json({ success: false, error: 'Position and bid are required' });
    }
    const success = bidAndAsk.makeBid(position, bid);
    if (success) {
        return res.json({ success: true, message: 'Bid made successfully' });
    }
    else {
        return res.status(400).json({ success: false, error: 'Failed to make bid' });
    }
});
// Deck
const deck = new Deck_1.default(); // Create an instance of Deck
let northHand, eastHand, southHand, westHand; // Define hands globally
let cardsDealt = false; // Variable to track whether cards have been dealt
app.get('/api/deal', (req, res) => {
    if (cardsDealt) {
        return res.status(400).json({ success: false, message: 'Cards are already dealt' });
    }
    // Deal cards to each player
    northHand = deck.deal();
    eastHand = deck.deal();
    southHand = deck.deal();
    westHand = deck.deal();
    cardsDealt = true; // Update the variable to indicate that cards have been dealt
    // Calculate the count of cards in each hand
    const northHandCount = northHand.length;
    const eastHandCount = eastHand.length;
    const southHandCount = southHand.length;
    const westHandCount = westHand.length;
    // Return the hands of all players along with the card count
    return res.json({
        success: true,
        message: 'Cards have been dealt',
        hands: {
            north: northHand,
            east: eastHand,
            south: southHand,
            west: westHand
        },
        counts: {
            north: northHandCount,
            east: eastHandCount,
            south: southHandCount,
            west: westHandCount
        }
    });
});
// Endpoint to view North's hand
app.get('/api/north-hand', (req, res) => {
    if (!cardsDealt) {
        return res.status(400).json({ success: false, error: 'Cards have not been dealt yet' });
    }
    res.json({
        success: true,
        hand: northHand
    });
});
// Endpoint to view East's hand
app.get('/api/east-hand', (req, res) => {
    if (!cardsDealt) {
        return res.status(400).json({ success: false, error: 'Cards have not been dealt yet' });
    }
    res.json({
        success: true,
        hand: eastHand
    });
});
// Endpoint to view South's hand
app.get('/api/south-hand', (req, res) => {
    if (!cardsDealt) {
        return res.status(400).json({ success: false, error: 'Cards have not been dealt yet' });
    }
    res.json({
        success: true,
        hand: southHand
    });
});
// Endpoint to view West's hand
app.get('/api/west-hand', (req, res) => {
    if (!cardsDealt) {
        return res.status(400).json({ success: false, error: 'Cards have not been dealt yet' });
    }
    res.json({
        success: true,
        hand: westHand
    });
});
// Create an HTTP server and attach the Express app
const server = http_1.default.createServer(app);
// Server listening
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
// Handle SIGTERM
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server terminated');
    });
});
