let gridPanels = document.getElementsByClassName("gridPanel");

//factory
const personFactory = (myTurn) => {
    const changeTurn = () => myTurn = !myTurn;
    const returnTurn = () => myTurn;
    return {changeTurn, returnTurn};
}

//factory: create a new object and add it to the document, slotting it into an array
const gridObjectFactory = (index) => {

}

let body = document.getElementsByTagName("body");

//module
const gameboardModule = (() => {

})();