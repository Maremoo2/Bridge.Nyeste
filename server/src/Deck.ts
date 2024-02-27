//Kortstokk.ts
export class Kort {
    constructor(
        public farge: string,
        public rangering: number,
        public navn: string
    ) {}
}

export default class Kortstokk {
    private kort: Kort[];

    constructor() {
        this.kort = [];
        this.initialiser();
    }

    private initialiser(): void {
        const farger = ['♥', '♠', '♦', '♣'];
        const navn = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Knekt', 'Dame', 'Konge','Ess'];
        const verdier = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14];

        // Opprett kortstokken
        for (let i = 0; i < farger.length; i++) {
            for (let j = 0; j < navn.length; j++) {
                this.kort.push(new Kort(farger[i], verdier[j], navn[j]));
            }
        }
    }

    stokk(): void {
        // Stokkingslogikk her
        for (let i = this.kort.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.kort[i], this.kort[j]] = [this.kort[j], this.kort[i]];
        }
    }

    delUt(): Kort[] {
        // Stokk kortstokken før utdeling
        this.stokk();
    
        // Utdelingslogikk her
        const hånd: Kort[] = [];
        for (let i = 0; i < 13; i++) {
            hånd.push(this.kort.pop()!);
        }
        return hånd;
    }
    
}

