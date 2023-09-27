
//const panelArray = [];


//module
const gameManagerModule = (() => {

    let panelArray = [];
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;

    function beginGameLogic(width){
        //create players (no AI atm, give one X and one O)
        player1 = personFactory("X");
        player2 = personFactory("O");
        currentPlayer = player1;
        //create grid (3x3 for now, expandable on subsequent resets)
        for (let index = 0; index < width * width; index++) {
            var panel = gridObjectFactory(index);
            panelArray.push(panel);
        }
    }

    function updateWidth(){
        //get the correct element and if it is a number within certain amount,
        //like 3x3 to 10x10, update the currentWidth var to be that number
        //then reset grid (needs function TODO)
        currentWidth = document.getElementById("widthInput").value;
        if (!isNaN(currentWidth)){
            if (currentWidth >= minWidth && currentWidth <= maxWidth){
                //the number is within bounds
                resetGrid();
                parseInt(currentWidth);
                panelArray = [];
                document.documentElement.style.setProperty('--current_width', currentWidth);
                beginGameLogic(currentWidth);
            }
            else{
                alert("The new width must be between "+ minWidth +" and "+ maxWidth +" (inclusive)");
            }
        }
        else{
            alert("The new width needs to be a number.")
        }
    }

    function resetGrid(){
        let gridChildren = document.getElementById("gridObjects");
        while (gridChildren.firstChild) {
            gridChildren.removeChild(gridChildren.lastChild);
        }
    }

    //the scope is wrapped in here, nothing can access this
    //massive algo to check for victory
    function checkVictory(){
        //the painful bit.

        //we check this every time we place a symbol down.
        //there's gonna be some wasted effort here but that's okay.
        //first extract all the panels that have a symbol
        let panelsWithSymbol = [];
        for (let index = 0; index < panelArray.length; index++) {
            if(panelArray[index].hasSymbol){
                panelsWithSymbol.push(panelArray[index]);
            }
            
        }
        //for a victory, we need to iterate through each part of the algorithm
        //a number of times equal to the current width of the grid (eg 3x3, etc)
        //also, this needs to happen for each of the 4 directions we're checking in:
        //down, right, down-left, and down-right
        //the others don't need to be checked cause they're covered by the counterpart
        //panels going up, left, up-left, and up-right
        let foundVictory = false;
        let winningArray = [];

        const directions = {
            Right: 0,
            Down: 1,
            DownRight: 2,
            DownLeft: 3
        }

        //use a loop and the above enum to iterate through different directions,
        //as the only thing that really changes is the algorithm
        //check right
        //for each panel:
        for (let i = 0; i < Object.values(directions).length; i++) {
            if(foundVictory == false){
                for (let panelIndex = 0; panelIndex < panelsWithSymbol.length; panelIndex++) {
                    const panelObj = panelsWithSymbol[panelIndex];
                    let allSame = true;
                    let currentSymbol = panelObj.mySymbol;
                    let correctArray = [];
                    if (foundVictory == false){
                        for (let index = 0; index < currentWidth; index++) {
                            //const element = array[index];
                            let currentIndex;
                            //switch depending on the direction
                            switch (i) {
                                case directions.Right:
                                    currentIndex = index;
                                    currentIndex += panelObj.returnIndex();
                                    //also has to be on same row, though

                                    //alert("checking:" + currentIndex);
                                    break;
                                case directions.Down:
                                    //currentIndex = index;
                                    currentIndex = panelObj.returnIndex() + (index * currentWidth);
                                    break;
                                case directions.DownRight:
                                    //only need to check exactly the first item
                                    if(panelObj.returnIndex() == 0){
                                        currentIndex = 0;
                                        currentIndex += (index * currentWidth) + index;
                                    }
                                    break;
                                case directions.DownLeft:
                                    //same again, except only need to start at the top right corner
                                    if(panelObj.returnIndex() == currentWidth - 1){
                                        currentIndex = currentWidth;
                                        currentIndex += (index * currentWidth) - (index + 1);
                                    }
                                    break;
                                default:
                                    break;
                            }
                            /*
                            currentIndex = index - 1;
                            currentIndex += panelObj.returnIndex();
                            */
                            //alert("current index:" + currentIndex);
                            if(currentIndex <= panelArray.length - 1){
                                //alert("current index is less than or equal to panel array length");
                                if(panelArray[currentIndex].mySymbol == currentSymbol){
                                    //add to some other array to draw the line on
                                    correctArray.push(panelArray[currentIndex]);
                                    //alert("correct array push")
                                }
                                else{
                                    allSame = false;
                                    //alert("all same is false");
                                }
                            }
                        }
                    }
                    if(allSame && correctArray.length == currentWidth /*&& correctArray[correctArray.length - 1].returnIndex() % currentWidth == 0*/){
                        //need to do some specific checking, eg Right must be on same row
                        switch (i) {
                            case directions.Right:
                                if((correctArray[correctArray.length - 1].returnIndex() + 1) % currentWidth == 0){
                                    foundVictory = true;
                                    winningArray = correctArray;
                                }
                                break;
                        
                            default:
                                foundVictory = true;
                                winningArray = correctArray;
                                break;
                        }
                        //foundVictory = true;
                        //winningArray = correctArray;
                    }
                    else{
                        //alert("didn't work: 1: " + allSame);
                        //alert("didn't work: 2: " + correctArray.length == currentWidth);
                        //alert("didn't work: 3: " + correctArray[correctArray.length - 1].returnIndex() % currentWidth == 0);
                    }
                }
            }
        }
        //check the current index, current index + 1, etc... until currentWidth iterations
        //if all are the same symbol, and there's exactly currentWidth amount, and the last index is an exact multiple of currentWidth
        //victory


        //check down
        //for each panel
        //check current index, current index + currentWidth, etc... until currentWidth iterations
        //if all are same symbol, and there's exactly currentWidth amount, and the last index is less than currentWidth * currentWidth (mostly for error checking)
        //victory

        //check down-right
        //check ONLY the first index
        //check current index, current index + currentWidth + 1, etc... until currentwidth iterations
        //if all are same symbol, and exactly currentWidth amount
        //victory

        //check down-left
        //check ONLY [currentWidth]
        //check current index, current index + currentWidth - 1, etc... until currentWidth iterations
        //if all are same symbol, and exactly currentWidth amount
        //victory

        //then draw the victory on the screen
        if(foundVictory == true){
            //use the winning array and draw a victory line
            //draw(correctArray);
            alert("You win!");
        }
        //a simple alert will do temporarily
    }

    //debug function mostly
    function sayIndex(index){
        //alert(index);
    }

    //applies the current player's marker to the panel of index, if that index is free
    function applyMarker(index){
        item = panelArray[index];
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
        applyMarker,
        updateWidth
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
    newPanel.addEventListener("click", function(){
        gameManagerModule.checkForVictory();
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

//initialise at 3, let them create their own width on resets
let currentWidth = 3;
let minWidth = 3;
let maxWidth = 10;
document.getElementById("resetButton").addEventListener("click", gameManagerModule.updateWidth);
gameManagerModule.beginGameLogic(currentWidth);