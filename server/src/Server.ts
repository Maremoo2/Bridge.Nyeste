//Server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import http from 'http';
import { Posisjon } from './Players';
import Deck, { Kort } from './Deck'; // Importer Card fra Deck
import { BudOgSpørsmål, Budtype } from './BidAndAsk';

const app: Express = express();
const port = 2000;

app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Mellomvare for å håndtere CORS-headere
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Server statiske filer
app.use("/", express.static(path.join(__dirname, "../../Client/dist")));

// Spillere
export let players: { name: string, position: Posisjon }[] = [];

// Sluttpunkt for å hente listen over spillere
app.get('/api/spillere', (req: Request, res: Response) => {
  res.json(players);
});

// Sluttpunkt for å registrere spillere (opprett en ny spiller)
app.post('/api/registrer', (req: Request, res: Response) => {
  if (players.length >= 4) {
    return res.status(400).json({ success: false, error: 'Maksimalt antall spillere nådd' });
  }

  const playerName: string = req.body.playerName;

  if (!playerName) {
    return res.status(400).json({ success: false, error: 'Spillernavn er påkrevd' });
  }

  // Tildel posisjon til spiller
  const positions: Posisjon[] = [Posisjon.Nord, Posisjon.Sør, Posisjon.Øst, Posisjon.Vest];
  const availablePositions = positions.filter(pos => !players.some(player => player.position === pos));
  if (availablePositions.length === 0) {
    return res.status(400).json({ success: false, error: 'Alle posisjoner er opptatt' });
  }
  const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

  // Legg til spiller i listen
  const newPlayer = { name: playerName, position: randomPosition };
  players.push(newPlayer);

  return res.json({ success: true, player: newPlayer, message: `${playerName} registrert vellykket` });
});

// Bud og Spørsmål
const budOgSpørsmål = new BudOgSpørsmål(); // Opprett en instans av BudOgSpørsmål

// Eksempelbruk
app.post('/api/bud', (req: Request, res: Response) => {
  const { position, bid } = req.body;
  if (!position || !bid) {
    return res.status(400).json({ success: false, error: 'Posisjon og bud er påkrevd' });
  }

  const success = budOgSpørsmål.gjørBud(position, bid);
  if (success) {
    return res.json({ success: true, message: 'Bud utført vellykket' });
  } else {
    return res.status(400).json({ success: false, error: 'Feilet i å gjøre bud' });
  }
});

// Kortstokk
const kortstokk = new Deck(); // Opprett en instans av Deck

let nordHånd: Kort[], østHånd: Kort[], sydHånd: Kort[], vestHånd: Kort[]; // Definer hender globalt
let kortDelt = false; // Variabel for å spore om kort er delt

app.get('/api/del', (req: Request, res: Response) => {
  if (kortDelt) {
    return res.status(400).json({ success: false, message: 'Kortene er allerede delt' });
  }

  // Del kort til hver spiller
  nordHånd = kortstokk.delUt();
  østHånd = kortstokk.delUt();
  sydHånd = kortstokk.delUt();
  vestHånd = kortstokk.delUt();

  kortDelt = true; // Oppdater variabelen for å indikere at kort er delt

  // Beregn antallet kort i hver hånd
  const nordHåndAntall = nordHånd.length;
  const østHåndAntall = østHånd.length;
  const sydHåndAntall = sydHånd.length;
  const vestHåndAntall = vestHånd.length;

  // Returner hendene til alle spillere sammen med antall kort
  return res.json({
    success: true,
    message: 'Kortene er delt',
    hender: {
      nord: nordHånd,
      øst: østHånd,
      syd: sydHånd,
      vest: vestHånd
    },
    tellinger: {
      nord: nordHåndAntall,
      øst: østHåndAntall,
      syd: sydHåndAntall,
      vest: vestHåndAntall
    }
  });
});


// Sluttpunkt for å se Nordens hånd
app.get('/api/nord-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: nordHånd
  });
});

// Sluttpunkt for å se Østs hånd
app.get('/api/ost-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: østHånd
  });
});

// Sluttpunkt for å se Sørs hånd
app.get('/api/syd-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: sydHånd
  });
});

// Sluttpunkt for å se Vestens hånd
app.get('/api/vest-hand', (req: Request, res: Response) => {
  if (!kortDelt) {
    return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
  }
  res.json({
    success: true,
    hånd: vestHånd
  });
});


// Opprett en HTTP-server og fest Express-appen
const server = http.createServer(app);

// Serverlytting
server.listen(port, () => {
  console.log(`Serveren lytter på http://localhost:${port}`);
});

// Behandle SIGTERM
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Serveren terminert');
  });
});
