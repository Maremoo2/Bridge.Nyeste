For å snakke med client:
npm install express @types/express
-------------------------------------------------------
GitHUB commands
Here's a recap of the steps they should follow after making changes:
Make Changes: Modify the files as needed.
Stage Changes: Stage the modified files to be included in the next commit:

git add .
Commit Changes: Commit the staged changes with a descriptive message:


git commit -m "Description of changes made"
Push Changes: Push the committed changes to the remote repository:

git push origin main
---------------------------- POSTMAN COMMANDS-----------------------------------------
Register Players: Send a POST request to http://localhost:2000/api/register with JSON data in the request body containing the player's name. For example:

json
Copy code
{
    "playerName": "John"
}
This will register a player with the name "John".

Get List of Players: Send a GET request to http://localhost:2000/api/players to retrieve the list of registered players.

Make Bids: Send a POST request to http://localhost:2000/api/bid with JSON data containing the position and bid. For example:

json
Copy code
{
    "position": "North",
    "bid": "Pass"
}
{
    "position": "north",
    "bid": "1♠"
}
{
    "position": "south",
    "bid": "Double"
}

This will make a bid of "Pass" for the player in the North position.

Deal Cards: Send a GET request to http://localhost:2000/api/deal to deal a hand of cards from the deck.
GET http://localhost:2000/api/north-hand

