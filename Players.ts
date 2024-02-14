//Players.ts
import express, { Request, Response } from 'express';

// Define Suit enum
export enum Suit {
  Hearts = '♥',
  Spades = '♠',
  Diamonds = '♦',
  Clubs = '♣'
}

// Define Position enum
export enum Position {
  North = "north",
  East = "east",
  South = "south",
  West = "west",
}

const router = express.Router();

// Define spillere with updated types
export const spillere: { navn: string; postkasseId: number; kort: { farge: Suit; navn: string; verdi: number }[] }[] = [
  { navn: 'North', postkasseId: 1, kort: [] },
  { navn: 'East', postkasseId: 2, kort: [] },
  { navn: 'South', postkasseId: 3, kort: [] },
  { navn: 'West', postkasseId: 4, kort: [] },
];

export { router };

// Define positions
const positions: Position[] = [Position.North, Position.South, Position.East, Position.West];

// Keep track of assigned positions
let assignedPositions: Position[] = [];

export let players: { name: string, position: Position }[] = [];

// Endpoint to get the list of players
router.get('/players', (req: Request, res: Response) => {
  res.json(players);
});

// Endpoint to register players (create a new player)
router.post('/register', (req: Request, res: Response) => {
  if (players.length >= 4) {
    return res.status(400).json({ success: false, error: 'Maximum number of players reached' });
  }

  const playerName: string = req.body.playerName;

  if (!playerName) {
    return res.status(400).json({ success: false, error: 'Player name is required' });
  }

  // Shuffle positions to assign randomly
  let availablePositions = positions.filter(pos => !assignedPositions.includes(pos));
  const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

  // Assign position to player
  const newPlayer = { name: playerName, position: randomPosition };
  players.push(newPlayer);
  assignedPositions.push(randomPosition);

  return res.json({ success: true, player: newPlayer, message: `${playerName} registered successfully` });
});

export default router;
