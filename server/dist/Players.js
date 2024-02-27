"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spillere = exports.router = exports.spillereMedKort = exports.Posisjon = exports.Farge = void 0;
//Players.ts
const express_1 = __importDefault(require("express"));
// Definer Suit enum
var Farge;
(function (Farge) {
    Farge["Hjerter"] = "\u2665";
    Farge["Spar"] = "\u2660";
    Farge["Ruter"] = "\u2666";
    Farge["Kl\u00F8ver"] = "\u2663";
})(Farge || (exports.Farge = Farge = {}));
// Definer Position enum
var Posisjon;
(function (Posisjon) {
    Posisjon["Nord"] = "nord";
    Posisjon["\u00D8st"] = "\u00F8st";
    Posisjon["S\u00F8r"] = "s\u00F8r";
    Posisjon["Vest"] = "vest";
})(Posisjon || (exports.Posisjon = Posisjon = {}));
const router = express_1.default.Router();
exports.router = router;
// Definer spillere med oppdaterte typer
exports.spillereMedKort = [
    { navn: 'Nord', postkasseId: 1, kort: [] },
    { navn: 'Øst', postkasseId: 2, kort: [] },
    { navn: 'Sør', postkasseId: 3, kort: [] },
    { navn: 'Vest', postkasseId: 4, kort: [] },
];
// Definer posisjoner
const posisjoner = [Posisjon.Nord, Posisjon.Sør, Posisjon.Øst, Posisjon.Vest];
// Hold styr på tildelte posisjoner
let tildeltePosisjoner = [];
exports.spillere = [];
// Sluttpunkt for å hente listen over spillere
router.get('/spillere', (req, res) => {
    res.json(exports.spillere);
});
// Sluttpunkt for å registrere spillere (opprett en ny spiller)
router.post('/registrer', (req, res) => {
    if (exports.spillere.length >= 4) {
        return res.status(400).json({ success: false, error: 'Maksimalt antall spillere nådd' });
    }
    const spillernavn = req.body.spillernavn;
    if (!spillernavn) {
        return res.status(400).json({ success: false, error: 'Spillernavn er påkrevd' });
    }
    // Bland posisjoner for å tildele tilfeldig
    let tilgjengeligePosisjoner = posisjoner.filter(pos => !tildeltePosisjoner.includes(pos));
    const tilfeldigPosisjon = tilgjengeligePosisjoner[Math.floor(Math.random() * tilgjengeligePosisjoner.length)];
    // Tildel posisjon til spiller
    const nySpiller = { navn: spillernavn, posisjon: tilfeldigPosisjon };
    exports.spillere.push(nySpiller);
    tildeltePosisjoner.push(tilfeldigPosisjon);
    return res.json({ success: true, spiller: nySpiller, melding: `${spillernavn} registrert vellykket` });
});
exports.default = router;
