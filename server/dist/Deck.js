"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
//Deck.ts
class Card {
    constructor(suit, rank, name) {
        this.suit = suit;
        this.rank = rank;
        this.name = name;
    }
}
exports.Card = Card;
class Deck {
    constructor() {
        this.cards = [];
        this.initialize();
    }
    initialize() {
        const suits = ['♥', '♠', '♦', '♣'];
        const names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        // Create the deck of cards
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < names.length; j++) {
                this.cards.push(new Card(suits[i], values[j], names[j]));
            }
        }
    }
    shuffle() {
        // Shuffle logic here
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal() {
        // Shuffle the deck before dealing
        this.shuffle();
        // Deal logic here
        const hand = [];
        for (let i = 0; i < 13; i++) {
            hand.push(this.cards.pop());
        }
        return hand;
    }
}
exports.default = Deck;
