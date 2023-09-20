//let gridObjects = document.getElementById("gridObjects");

//factory
const personFactory = (myTurn) => {
    const changeTurn = () => myTurn = !myTurn;
    const returnTurn = () => myTurn;
    return {changeTurn, returnTurn};
}

//factory: create a new object and add it to the document, slotting it into an array
const gridObjectFactory = (index) => {
    const addPanel = () => {
        gridObjects = document.getElementById("gridObjects");
        newPanel = document.createElement("div");
        gridObjects.appendChild(newPanel);
        return newPanel;
    };

    const panelIndex = index;

    const returnIndex = () => {return panelIndex};

    return{
        returnIndex, addPanel
    }


}

//test
const panelArray = [];
for (let index = 0; index < 9; index++) {
    var panel = gridObjectFactory(index);
    panel.addPanel();
    panel.returnIndex();
    panelArray.push(panel);
}



//module
const gameboardModule = (() => {

    //the scope is wrapped in here, nothing can access this
    function checkVictory(){

    }

    //and then we have to explicitly return the things we want to access
    return{
        checkForVictory: checkVictory
    }

})();
//ok, let's list all the things we need to be able to do
//have an array of tiles that are clickable
//when tile is clicked, the current player places their marker in that space
//the current player is determined randomly to start, then alternates after every tile click
//the marker is determined randomly at the same time as player
//after the marker is added, check for a win or a tie
//a player wins by having 3 of their marker in a row
//a player draws if there is no winner and there are no more open spaces
//a button to reset the game

//we are going to create multiple tiles
//onClick => changeMarker(currentPlayer.marker);
//reset();
//var index;
//on create => add to document in the correct spot, and insert self into the gameboard module

//multiple players
//var myIcon

//a single game manager
//array for the tile objects
//check to see if victory is achieved (long algorithm)
//restartGame()
//createGame(widthOfGrid)
//var players[]
//var currentPlayer