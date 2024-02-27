//BudOgSpørsmål.ts
import { Posisjon } from './Players';

export enum Budtype {
    Pass = 'Pass',
    Farge = 'Farge',
    Dobbel = 'Dobbel',
    Gjentredobbel = 'Gjentredobbel'
}

export class BudOgSpørsmål {
    private spillere: { [key: string]: { posisjon: Posisjon, bud: string } };
    private turRekkefølge: Posisjon[];

    constructor() {
        this.spillere = {};
        this.turRekkefølge = [Posisjon.Nord, Posisjon.Øst, Posisjon.Sør, Posisjon.Vest];
    }

    gjørBud(posisjon: Posisjon, bud: string): boolean {
        // Valider budet
        if (!this.erGyldigBud(posisjon, bud)) {
            console.log('Hva mener du?:', bud);
            return false;
        }

        // Legg til budet i budhistorikken
        this.spillere[posisjon] = { posisjon, bud };

        // Behandle spesielle bud
        switch (this.getKontraktstype(bud)) {
            case Budtype.Pass:
                // Håndter pass-budet
                break;
            case Budtype.Dobbel:
                // Håndter dobbelt-budet
                break;
            case Budtype.Gjentredobbel:
                // Håndter gjentredobbel-budet
                break;
            case Budtype.Farge:
                // Håndter farge-budet
                break;
        }

        // Send oppdatert budinformasjon til spillere
        this.sendBudOppdatering();

        return true;
    }

    sendMelding(posisjon: Posisjon, melding: string): boolean {
        // Implementer logikk for å sende en melding
        // Dette kan inkludere chat-funksjonalitet eller andre meldinger i spillet
        return true;
    }

    hentNesteBudgiver(): Posisjon | null {
        const nesteSpiller = this.turRekkefølge.shift();
        if (nesteSpiller) {
            this.turRekkefølge.push(nesteSpiller);
            return nesteSpiller;
        }
        // Hvis alle spillere har bydd, returner null
        return null;
    }

    private erGyldigBud(posisjon: Posisjon, bud: string): boolean {
        // Valider om budet er i riktig format
        if (!bud) {
            console.log('Ugyldig budformat');
            return false;
        }

        // Valider om budet følger Bridgereglene
        if (!this.erGyldigBudFormat(bud)) {
            console.log('Ugyldig budformat');
            return false;
        }

        // Tilleggsvalidering basert på Bridgereglene kan implementeres her

        // Sjekk om budet er gyldig for spillerens posisjon
        const sisteBud = this.sisteBud();
        if (sisteBud && posisjon === sisteBud.posisjon) {
            if (bud === Budtype.Pass || bud === Budtype.Gjentredobbel) {
                return true;
            }
            console.log('Det er ikke din tur til å by');
            return false;
        }

        return true;
    }

    private erGyldigBudFormat(bud: string): boolean {
        // Valider om budformatet følger Bridgereglene
        const fargeRegex = /^[1-7][♥♠♦♣]$/; // Regex-mønster for fargebud som "1♠"
        return fargeRegex.test(bud) || Object.values(Budtype).includes(bud as Budtype);
    }
    

    private sisteBud(): { posisjon: Posisjon, bud: string } | undefined {
        // Hent det siste budet som ble gjort av en hvilken som helst spiller
        const nøkler = Object.keys(this.spillere);
        if (nøkler.length > 0) {
            const sisteNøkkel = nøkler[nøkler.length - 1];
            return this.spillere[sisteNøkkel];
        }
        return undefined;
    }

    private getKontraktstype(bud: string): Budtype {
        // Avgjør kontraktstypen basert på budet
        // (Pass, Dobbel, Gjentredobbel eller Farge)
        // Implementer logikk for å kategorisere bud

        // Dette er en plassholderimplementering
        return Budtype.Pass;
    }

    private sendBudOppdatering(): void {
        // Send oppdatert budinformasjon til spillere
        // Denne metoden kan varsle spillere om den nåværende budstatusen
        // og eventuelle nye bud gjort av motstanderne
    }
}
