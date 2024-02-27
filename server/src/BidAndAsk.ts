//BudOgSpørsmål.ts
import { Posisjon } from './Players';

export enum Budtype {
    Pass = 'Pass',
    Farge = 'Farge',
    Dobbel = 'Dobbel',
    Gjentredobbel = 'Gjentredobbel'
}

export class BudOgSpørsmål {
    private spillere: { [key: string]: { posisjon: Posisjon, bud: Budtype } };
    private turRekkefølge: Posisjon[];
    private nesteBudgiverIndex: number;
    private passCounter: number;
    private budhistorikk: { posisjon: Posisjon, bud: Budtype }[];
    private spilletHarStartet: boolean;
    private høyesteBud: { posisjon: Posisjon, bud: Budtype } | null;


    constructor() {
        this.spillere = {};
        this.turRekkefølge = [Posisjon.Nord, Posisjon.Øst, Posisjon.Sør, Posisjon.Vest];
        this.nesteBudgiverIndex = 0; // Start med Nord
        this.passCounter = 0;
        this.budhistorikk = [];
        this.spilletHarStartet = false;
        this.høyesteBud = null;
    }

    gjørBud(posisjon: Posisjon, bud: string): boolean {
        // Sjekk om spillet har startet, og hvis det har det, returner false
        if (this.spilletHarStartet) {
            console.log('Spillet har allerede startet. Du kan ikke gjøre flere bud.');
            return false;
        }

    // Valider budet
        if (!this.erGyldigBud(posisjon, bud)) {
            console.log('Ugyldig bud!:', bud);
            return false;
        }

    // Sjekk om den gitte posisjonen er den som skal by
        if (posisjon !== this.turRekkefølge[this.nesteBudgiverIndex]) {
            console.log('Det er ikke din tur til å by');
            return false;
        }
// Legg til budet i budhistorikken
        this.budhistorikk.push({ posisjon, bud: Budtype[bud as keyof typeof Budtype] });

// Check if the new bid is higher
        if (this.erHøyereBud(Budtype[bud as keyof typeof Budtype])) {
            this.høyesteBud = { posisjon, bud: Budtype[bud as keyof typeof Budtype] };
        }

        // Øk telleren hvis det er et Pass-bud
        if (bud === Budtype.Pass) {
            this.passCounter++;
        
        // Sjekk om tre Pass-bud er gitt på rad
            if (this.passCounter >= 3) {
                this.startSpillet();
            }
        } else {
        // Tilbakestill telleren hvis det ikke er et Pass-bud
            this.passCounter = 0;
        }

        // Oppdater index for neste budgiver
        this.nesteBudgiverIndex = (this.nesteBudgiverIndex + 1) % this.turRekkefølge.length;

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

    private startSpillet() {
        // Legg til logikk for å starte spillet her
        console.log('Spillet starter nå!');
        this.spilletHarStartet = true;
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
    

    private sisteBud(): { posisjon: Posisjon, bud: Budtype } | undefined {
        // Hent det siste budet som ble gjort av en hvilken som helst spiller
        if (this.budhistorikk.length > 0) {
            return this.budhistorikk[this.budhistorikk.length - 1];
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

    private erHøyereBud(bud: string): boolean {
        // Implementer logikk for å sammenligne bud og avgjøre om det nye budet er høyere enn det høyeste budet
        if (!this.høyesteBud) {
            return true; // Hvis det ikke er noe høyeste bud ennå, er ethvert bud automatisk høyere
        }

        // Sammenlign det nye budet med det høyeste budet
        // Implementer din egen sammenligningslogikk her basert på spillereglene
        const nyttBudVerdi = this.parseBudVerdi(bud);
        const høyesteBudVerdi = this.parseBudVerdi(this.høyesteBud.bud);

        return nyttBudVerdi > høyesteBudVerdi;
    }

    private parseBudVerdi(bud: string): number {
        // Implementer logikk for å konvertere budverdien til et tall for sammenligning
        // Eksempel: "1♦" => 7, "7NT" => 14, osv.
        // Dette er en plassholderimplementering
        return 0;
    }

    getBudhistorikk(): { posisjon: Posisjon, bud: Budtype }[] {
        return this.budhistorikk;
    }
}
