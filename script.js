
//const panelArray = [];


//module
const gameManagerModule = (() => {

    const panelArray = [];
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;

    function beginGameLogic(){
        //create players (no AI atm, give one X and one O)
        player1 = personFactory("X");
        player2 = personFactory("O");
        currentPlayer = player1;
        //create grid (3x3 for now, expandable later)
        for (let index = 1; index <= 9; index++) {
            var panel = gridObjectFactory(index);
            panelArray.push(panel);
        }
    }

    //the scope is wrapped in here, nothing can access this
    //massive algo to check for victory
    function checkVictory(){

    }

    //debug function mostly
    function sayIndex(index){
        //alert(index);
    }

    //applies the current player's marker to the panel of index, if that index is free
    function applyMarker(index){
        item = panelArray[index-1];
        if(!item.hasSymbol){
            //apply current player's marker, switch to other player
            item.assignSymbol(currentPlayer.returnSymbol());
            if(currentPlayer === player1){
                currentPlayer = player2;
            }
            else{
                currentPlayer = player1;
            }
            item.hasSymbol = true;
        }
        else{
            alert("You can't play on a tile that's already got a symbol!");
        }

    }

    //and then we have to explicitly return the things we want to access
    return{
        beginGameLogic,
        checkForVictory: checkVictory,
        sayIndex: sayIndex,
        applyMarker
    }

})();


//factory
const personFactory = (playerSymbol) => {
    const personObject = Object.create(null, {
        mySymbol:{
            value: playerSymbol,
            writable: false
        },
        returnSymbol:{
            value: function(){
                return this.mySymbol;
            
            },
            writable: false
        }
    });

    return personObject;
}

//factory: create a new object and add it to the document, slotting it into an array
const gridObjectFactory = (index) => {
    const gridObjects = document.getElementById("gridObjects");
    const newPanel = document.createElement("div");
    newPanel.classList.add("gridPanel");
    newPanel.addEventListener("click", function(){
        gameManagerModule.applyMarker(panelObject.returnIndex());
    });
    gridObjects.appendChild(newPanel);

    const panelObject = Object.create(null, {
        myObject:{
            value: newPanel,
            writable: true
        },
        hasSymbol:{
            value: false,
            writable: true
        },
        panelIndex:{
            value: index,
            writable: false
        },
        returnIndex:{
            value: function(){
                return this.panelIndex;
            },
            writable: false
        },
        mySymbol:{
            value: null,
            writable: true
        },
        assignSymbol:{
            value: function(symbol){
                this.mySymbol = symbol;
                this.myObject.textContent = symbol;
                //alert(symbol);
            },
            writable: false
        },
    });

    return panelObject;


}

//test





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

gameManagerModule.beginGameLogic();