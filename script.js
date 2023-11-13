
//const panelArray = [];


//module
const gameManagerModule = (() => {

    let panelArray = [];
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;
    let gameVictory = false;

    function beginGameLogic(width){
        //create players (no AI atm, give one X and one O)
        player1 = personFactory("X");
        player2 = personFactory("O");
        currentPlayer = player1;
        updateNextPlayerDisplay(currentPlayer);
        drawLineModule.resetLine();
        //create grid (3x3 for now, expandable on subsequent resets)
        for (let index = 0; index < width * width; index++) {
            var panel = gridObjectFactory(index);
            panelArray.push(panel);
        }
    }

    function updateWidth(){
        //get the correct element and if it is a number within certain amount,
        //like 3x3 to 10x10, update the currentWidth var to be that number
        gameVictory = false;
        prevWidth = currentWidth;
        drawLineModule.resetLine();
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
                if(currentWidth == ""){
                    //the number is not specified, reset with current dimension
                    currentWidth = prevWidth;
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
        }
        else{
            alert("The new width needs to be a number.");
        }
    }

    //remove current items only
    function resetGrid(){
        let gridChildren = document.getElementById("gridObjects");
        while (gridChildren.firstChild) {
            gridChildren.removeChild(gridChildren.lastChild);
        }
        drawLineModule.resetLine();
    }

    //remove then repopulate
    function restartGrid(){
        drawLineModule.resetLine();
        gameVictory = false;
        resetGrid();
        parseInt(currentWidth);
        panelArray = [];
        document.documentElement.style.setProperty('--current_width', currentWidth);
        beginGameLogic(currentWidth);
    }

    //massive algo to check for victory
    function checkVictory(){

        //if the game has not already been won
        if(gameVictory == false){
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
            //check right, down, down-right, down-left for each panel
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
            let correctArray = [];
            for (let i = 0; i < Object.values(directions).length; i++) {
                if(foundVictory == false){
                    for (let panelIndex = 0; panelIndex < panelsWithSymbol.length; panelIndex++) {
                        const panelObj = panelsWithSymbol[panelIndex];
                        let allSame = true;
                        let currentSymbol = panelObj.mySymbol;
                        correctArray = [];
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
                                if(currentIndex <= panelArray.length - 1){
                                    if(panelArray[currentIndex].mySymbol == currentSymbol){
                                        //add to some other array to draw the line on
                                        correctArray.push(panelArray[currentIndex]);
                                    }
                                    else{
                                        allSame = false;
                                    }
                                }
                            }
                        }
                        if(allSame && correctArray.length == currentWidth){
                            //need to do some specific checking, eg Right must be on same row
                            switch (i) {
                                case directions.Right:
                                    if((correctArray[correctArray.length - 1].returnIndex() + 1) % currentWidth == 0){
                                        foundVictory = true;
                                        gameVictory = true;
                                        winningArray = correctArray;
                                    }
                                    break;
                            
                                default:
                                    foundVictory = true;
                                    gameVictory = true;
                                    winningArray = correctArray;
                                    break;
                            }
                        }
                        else{

                        }
                    }
                }
            }

            //then draw the victory on the screen
            if(foundVictory == true){
                //use the winning array and draw a victory line
                //draw(correctArray);
                alert("You win!");
                //just need to make an array of the elements
                let objArray = [];
                //alert(winningArray.length);
                for (let index = 0; index < winningArray.length; index++) {
                    objArray.push(winningArray[index].myObject);
                }
                //alert(objArray.length);
                drawLineModule.drawLineBetweenElements(objArray);
            }
            else if(panelsWithSymbol.length == panelArray.length){
                alert("A draw!");
            }
            //a simple alert will do temporarily
        }
    }

    //debug function mostly
    function sayIndex(index){
        //alert(index);
    }

    //applies the current player's marker to the panel of index, if that index is free
    function applyMarker(index){
            if(gameVictory == false){
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
                updateNextPlayerDisplay(currentPlayer);
            }
            else{
                alert("You can't play on a tile that's already got a symbol!");
            }

        }
    }

    function updateNextPlayerDisplay(currentPlayerSymbol){
        //update the content of the display with the correct id to show the player who places next
        let header = document.getElementById("nextPlayerDisplay");
        header.textContent = currentPlayerSymbol.mySymbol;
    }

    //and then we have to explicitly return the things we want to access
    return{
        beginGameLogic,
        checkForVictory: checkVictory,
        sayIndex: sayIndex,
        applyMarker,
        updateWidth,
        restartGrid
    }

})();

const drawLineModule = (() => {

    //vars for tweaking
    let canvasLineWidth = 5;
    let canvasLineColour = "green";
    //draw a line between multiple elements, ideally only between the first and last ones
    function drawLineBetweenElements(elements){

        

        //draw line between first element and last element
        let firstElement = elements[0];
        let lastElement = elements[elements.length - 1];
        let firstPos = getElementCenterPosition(firstElement);
        let lastPos = getElementCenterPosition(lastElement);
        //alert(firstPosition.centerX + " " + firstPosition.centerY);


        //what's the space that we're drawing it on? maybe the gridObjects?
        //nope, needs to be a canvas. create a canvas with the dimensions of gridObjects
        let canvas = document.createElement("canvas");
        canvas.id = "canvas";

        let objectSize = document.getElementById("body").getBoundingClientRect();

        canvas.width = objectSize.width;
        canvas.height = objectSize.height;
        canvas.style.position = "absolute";
        canvas.style.left = objectSize.left;
        canvas.style.top = objectSize.top;
        document.getElementById("body").appendChild(canvas);
        let line = canvas.getContext("2d");
        line.beginPath();
        line.moveTo(firstPos.centerX, firstPos.centerY);
        line.strokeStyle = canvasLineColour;
        line.lineWidth = canvasLineWidth;
        line.lineTo(lastPos.centerX, lastPos.centerY);
        line.stroke();
    }

    //input an element, and get out a position to draw the line to
    function getElementCenterPosition(element){
        let rect = element.getBoundingClientRect();
        let centerX = (rect.left + rect.right) / 2;
        let centerY = (rect.top + rect.bottom) / 2;
        let center = {
            centerX,
            centerY
        };
        return center;
    }

    //remove the current line and reset the canvas
    function resetLine(){
        let canvas = document.getElementById("canvas");
        if(canvas != null){
            let obj = canvas.getContext("2d");
            obj.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return{
        drawLineBetweenElements,
        resetLine
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



//after the marker is added, check for a win or a tie
//a player draws if there is no winner and there are no more open spaces

//initialise at 3, let them create their own width on resets
let currentWidth = 3;
let minWidth = 3;
let maxWidth = 10;
document.getElementById("resizeButton").addEventListener("click", gameManagerModule.updateWidth);
document.getElementById("restartButton").addEventListener("click", gameManagerModule.restartGrid)
gameManagerModule.beginGameLogic(currentWidth);

//TODO:
//display the current player on the right side of the screen
//figure out button aligning better
//somehow come up with a bot player?
//let player choose between playing against bot or player
//maybe colour the player's symbols a little differently?
//probably some more features after that
//add a footer
//add my own github link to the footer