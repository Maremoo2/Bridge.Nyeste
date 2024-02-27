"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.players = void 0;
//Server.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const Players_1 = require("./Players");
const Deck_1 = __importDefault(require("./Deck")); // Importer kort fra Deck
const BidAndAsk_1 = require("./BidAndAsk");
const app = (0, express_1.default)();
const port = 2000;
app.use(express_1.default.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Mellomvare for å håndtere CORS-headere
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Server statiske filer
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../Client/dist")));
// Spillere
exports.players = [];
// Sluttpunkt for å hente listen over spillere
app.get('/api/spillere', (req, res) => {
    res.json(exports.players);
});
// Sluttpunkt for å registrere spillere (opprett en ny spiller)
app.post('/api/registrer', (req, res) => {
    if (exports.players.length >= 4) {
        return res.status(400).json({ success: false, error: 'Maksimalt antall spillere nådd' });
    }
    const playerName = req.body.playerName;
    if (!playerName) {
        return res.status(400).json({ success: false, error: 'Spillernavn er påkrevd' });
    }
    // Tildel posisjon til spiller
    const positions = [Players_1.Posisjon.Nord, Players_1.Posisjon.Sør, Players_1.Posisjon.Øst, Players_1.Posisjon.Vest];
    const availablePositions = positions.filter(pos => !exports.players.some(player => player.position === pos));
    if (availablePositions.length === 0) {
        return res.status(400).json({ success: false, error: 'Alle posisjoner er opptatt' });
    }
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    // Legg til spiller i listen
    const newPlayer = { name: playerName, position: randomPosition };
    exports.players.push(newPlayer);
    return res.json({ success: true, player: newPlayer, message: `${playerName} registrert vellykket` });
});
// Bud og Spørsmål
const budOgSpørsmål = new BidAndAsk_1.BudOgSpørsmål(); // Opprett en instans av BudOgSpørsmål
// Eksempelbruk
app.post('/api/bud', (req, res) => {
    const { position, bid } = req.body;
    if (!position || !bid) {
        return res.status(400).json({ success: false, error: 'Posisjon og bud er påkrevd' });
    }
    const success = budOgSpørsmål.gjørBud(position, bid);
    if (success) {
        return res.json({ success: true, message: 'Bud utført vellykket' });
    }
    else {
        return res.status(400).json({ success: false, error: 'Feilet i å gjøre bud' });
    }
});
// Endpoint for getting the bid history
app.get('/api/budhistorikk', (req, res) => {
    const budhistorikk = budOgSpørsmål.getBudhistorikk();
    res.json(budhistorikk);
});
// Kortstokk
const kortstokk = new Deck_1.default(); // Opprett en instans av Deck
let nordHånd, østHånd, sydHånd, vestHånd; // Definer hender globalt
let kortDelt = false; // Variabel for å spore om kort er delt
app.get('/api/del', (req, res) => {
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
app.get('/api/nord-hand', (req, res) => {
    if (!kortDelt) {
        return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
    }
    res.json({
        success: true,
        hånd: nordHånd
    });
});
// Sluttpunkt for å se Østs hånd
app.get('/api/ost-hand', (req, res) => {
    if (!kortDelt) {
        return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
    }
    res.json({
        success: true,
        hånd: østHånd
    });
});
// Sluttpunkt for å se Sørs hånd
app.get('/api/syd-hand', (req, res) => {
    if (!kortDelt) {
        return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
    }
    res.json({
        success: true,
        hånd: sydHånd
    });
});
// Sluttpunkt for å se Vestens hånd
app.get('/api/vest-hand', (req, res) => {
    if (!kortDelt) {
        return res.status(400).json({ success: false, error: 'Kortene er ikke delt ennå' });
    }
    res.json({
        success: true,
        hånd: vestHånd
    });
});
// Opprett en HTTP-server og fest Express-appen
const server = http_1.default.createServer(app);
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
