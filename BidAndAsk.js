"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidAndAsk = exports.BidType = void 0;
//BidAndAsk.ts
const Players_1 = require("./Players");
var BidType;
(function (BidType) {
    BidType["Pass"] = "Pass";
    BidType["Suit"] = "Suit";
    BidType["Double"] = "Double";
    BidType["Redouble"] = "Redouble";
})(BidType || (exports.BidType = BidType = {}));
class BidAndAsk {
    constructor() {
        this.players = {};
        this.turnOrder = [Players_1.Position.North, Players_1.Position.East, Players_1.Position.South, Players_1.Position.West];
    }
    makeBid(position, bid) {
        // Validate the bid
        if (!this.isValidBid(position, bid)) {
            console.log('Invalid bid:', bid);
            return false;
        }
        // Add the bid to the bidding history
        this.players[position] = { position, bid };
        // Handle special bids
        switch (this.getContractType(bid)) {
            case BidType.Pass:
                // Handle pass bid
                break;
            case BidType.Double:
                // Handle double bid
                break;
            case BidType.Redouble:
                // Handle redouble bid
                break;
            case BidType.Suit:
                // Handle suit bid
                break;
        }
        // Send updated bidding information to players
        this.sendBiddingUpdate();
        return true;
    }
    sendMelding(position, message) {
        // Implement logic for sending a message/meld
        // This could include chat functionality or other in-game messages
        return true;
    }
    getNextBiddingPlayer() {
        const nextPlayer = this.turnOrder.shift();
        if (nextPlayer) {
            this.turnOrder.push(nextPlayer);
            return nextPlayer;
        }
        // If all players have bid, return null
        return null;
    }
    isValidBid(position, bid) {
        // Validate if bid is in correct format
        if (!bid) {
            console.log('Invalid bid format');
            return false;
        }
        // Validate if bid follows Bridge rules
        if (!this.isValidBidFormat(bid)) {
            console.log('Invalid bid format');
            return false;
        }
        // Additional validation logic based on Bridge bidding rules can be implemented here
        // Check if bid is valid for the player's position
        const lastBid = this.getLastBid();
        if (lastBid && position === lastBid.position) {
            if (bid === BidType.Pass || bid === BidType.Redouble) {
                return true;
            }
            console.log('It is not your turn to bid');
            return false;
        }
        return true;
    }
    isValidBidFormat(bid) {
        // Validate if bid format follows Bridge rules
        const suitRegex = /^[1-7][♥♠♦♣]$/; // Regex pattern for suit bids like "1♠"
        return suitRegex.test(bid) || Object.values(BidType).includes(bid);
    }
    getLastBid() {
        // Get the last bid made by any player
        const keys = Object.keys(this.players);
        if (keys.length > 0) {
            const lastKey = keys[keys.length - 1];
            return this.players[lastKey];
        }
        return undefined;
    }
    getContractType(bid) {
        // Determine the type of contract based on the bid
        // (Pass, Double, Redouble, or Suit)
        // Implement logic to categorize bids
        // This is a placeholder implementation
        return BidType.Pass;
    }
    sendBiddingUpdate() {
        // Send updated bidding information to players
        // This method could notify players of the current bidding status
        // and any new bids made by opponents
    }
}
exports.BidAndAsk = BidAndAsk;
