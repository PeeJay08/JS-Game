const imageObjectDefinition = [
    {id:1, imagePath:'images/mario.png'},
    {id:2, imagePath:'images/luigi.png'},
    {id:3, imagePath:'images/yoshi.png'},
    {id:4, imagePath:'images/Bowser.png'}
]
const bowserId = 4;
const imageBackImgPath = 'images/Mario-logo.png';
let images = [];
const playGameButton = document.getElementById('playGame')
const imageContainerElem = document.querySelector('.image-container')
const collapseGridAreaTemplate = '"a a" "a a"';
const cardCollectCell = ".image-pos-a";
const numImages = imageObjectDefinition.length
let imagePositions = [];
let gameInProgress = false;
let shufflingInProgress = false;
let imagesRevealed = false;
const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round')
const roundElem = document.querySelector('.round')
const winColor = "green";
const winningSound = new Audio('audios/Mario-Woo-Hoo-Sound-Effect.mp3')
const loseColor = "red";
const losingSound = new Audio('audios/Luigi-Mamma-Mia-Sound-Effect.mp3')
const primaryColor = "black";
const gameOverSound = new Audio('audios/gameover.wav')
const shufflingSound = new Audio('audios/loop-shuffle-bars.mp3')
let roundNum = 0;
let maxRounds = 4;
let score = 0
/* <div class="card">
<div class="card-inner">
  <div class="card-front">
    <img src="images/card-JackClubs.png" alt="Jack of Club" class="card-img">
  </div>
  <div class="card-back">
    <img src="images/card-back-Blue.png" alt="Back of the Card" class="card-img">
  </div>
</div>
</div> */
loadGame();
function gameOver(){
    updateStatusElem(scoreContainerElem,"none")
    updateStatusElem(roundContainerElem,"none")
    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' button to play again`
    updateStatusElem(currentGameStatusElem,"block",primaryColor,gameOverMessage, gameOverSound.play())    
    gameInProgress = false       
    playGameButton.disabled = false           
}
function endRound(){
    setTimeout(() => {
        if(roundNum == maxRounds){
            gameOver();
            return
        }else {
            startRound();
        }
    }, 3000)
}
function chooseImage(image){
    if(canChooseImage()){
        evaluateImageChoise(image)
        flipImage(image,false)
        setTimeout(() => {
            flipImages(false)
            updateStatusElem(currentGameStatusElem,"block",primaryColor,"Character Positions Revealed")
            endRound();
        },3000)
        imagesRevealed = true
    }
}
function calculateScoreToAdd(roundNum){
    if(roundNum == 1){
        return 100
    }else if (roundNum == 2){
        return 50
    }else if (roundNum == 3){
        return 25
    }else{
        return 10
    }
}
function calculateScore(){
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd;
}
function updateScore(){
    calculateScore();
    updateStatusElem(scoreElem,"block",primaryColor, `Score <span class = 'badge'>${score}</span>`)
}
function updateStatusElem(elem, display, color, innerHTML){
    elem.style.display = display
    if(arguments.length > 2){
        elem.style.color = color;
        elem.innerHTML = innerHTML;
    }
}
function outputChoiceFeedBack(hit){
    if(hit){
        updateStatusElem(currentGameStatusElem,"block", winColor, "Hit!! - Well Done!! (〜^∇^)〜", winningSound.play())
    }else{
        updateStatusElem(currentGameStatusElem,"block", loseColor, "Missed!! ( ɵ̥̥‸ɵ̥̥)",losingSound.play())
    }
}
function evaluateImageChoise(image){
    if(image.id == bowserId){
        updateScore()
        outputChoiceFeedBack(true)
    }else {
        outputChoiceFeedBack(false)
    }
}
function canChooseImage(){
    return gameInProgress == true && !shufflingInProgress && !imagesRevealed
}
function loadGame(){
    createImages();
    images = document.querySelectorAll('.image')
    imageFlyInEffect();
    playGameButton.addEventListener('click', ()=>  startGame())
    updateStatusElem(scoreContainerElem,"none")
    updateStatusElem(roundContainerElem,"none")
}
function startGame(){
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    newGame();
    startRound();
}
function newGame(){
    score = 0;
    roundNum = 0;
    shufflingInProgress = false;
    updateStatusElem(scoreContainerElem,"flex")
    updateStatusElem(roundContainerElem,"flex")
    updateStatusElem(scoreElem, "block",primaryColor, `Score <span class = 'badge'>${score}</span>`)
    updateStatusElem(roundElem, "block",primaryColor, `Round <span class = 'badge'>${roundNum}</span>`)
}
function startRound(){
    newRound();
    collectImages();
    flipImages(true);
    shuffleImages();
}
function newRound(){
    roundNum++
    playGameButton.disabled = true
    gameInProgress = true
    shufflingInProgress = true
    imagesRevealed = false
    updateStatusElem(currentGameStatusElem, "block", primaryColor, "Shuffling the characters...")
    updateStatusElem(roundElem, "block", primaryColor, `Round <span class = 'badge'>${roundNum}</span>`)
}
function collectImages(){
    transformGridArea(collapseGridAreaTemplate);
    addCardsToGridCell(cardCollectCell)
}
function transformGridArea(areas){
    imageContainerElem.style.gridTemplateAreas = areas;
}
function addCardsToGridCell(cellPositionClass){
    const cellPositionElem = document.querySelector(cellPositionClass);
    images.forEach((image, index) => {
        addChildElement(cellPositionElem, image);
    });
}
function flipImage(image, flipToBack){
    const innerImageElem = image.firstChild
    if(flipToBack && !innerImageElem.classList.contains('flip-it')){
        innerImageElem.classList.add('flip-it')
    }else if(innerImageElem.classList.contains('flip-it')){
        innerImageElem.classList.remove('flip-it')
    }
}
function flipImages(flipToBack){
    images.forEach((image, index) => {
        setTimeout(() =>{
            flipImage(image, flipToBack)
        },index * 100)
    })
}
function imageFlyInEffect(){
    const id = setInterval(flyIn, 5)
    let imageCount = 0;
    let count = 0;
    function flyIn(){
        count++;
        if(imageCount == numImages){
            clearInterval(id);
            playGameButton.style.display = "inline-block"
        }
        if(count == 1 || count == 250 || count == 500 || count == 750){
            imageCount++;
            let image = document.getElementById(imageCount)
            image.classList.remove("fly-in")
        }
    }
}
function removeShuffleClasses(){
    images.forEach((image) => {
        image.classList.remove("shuffle-left")
        image.classList.remove("shuffle-right")
    })
}
function animateShuffle(shuffleCount){
    const random1 = Math.floor(Math.random() * numImages) + 1
    const random2 = Math.floor(Math.random() * numImages) + 1
    let image1 = document.getElementById(random1)
    let image2 = document.getElementById(random2)

    if(shuffleCount % 4 == 0){
        image1.classList.toggle("shuffle-left")
        image1.style.zIndex = 100;
    }
    if(shuffleCount % 10 == 0){
        image2.classList.toggle("shuffle-right")
        image2.style.zIndex = 200;
    }
}
function shuffleImages(){
    let shuffleCount = 0;
    const id = setInterval(shuffle, 12)
    function shuffle(){
        randomizeImagePositions();
        animateShuffle(shuffleCount);
        shufflingSound.play();
        if(shuffleCount == 500){
            clearInterval(id);
            shufflingInProgress = false;
            removeShuffleClasses();
            dealImages();
            updateStatusElem(currentGameStatusElem,"block",primaryColor,"Please choose an image that you think is the enemy Bowser..")
        } else{
            shuffleCount++;
        }
    }
}
function randomizeImagePositions(){
    const random1 = Math.floor(Math.random() * numImages) + 1
    const random2 = Math.floor(Math.random() * numImages) + 1
    const temp = imagePositions[random1 - 1];
    imagePositions[random1 - 1] = imagePositions[random2 - 1]
    imagePositions[random2 - 1] = temp;
}
function dealImages(){
    addImagesToAppropriateCells();
    const areasTemplate = returnGridAreasMappedToImagePos();
    transformGridArea(areasTemplate)
}
function returnGridAreasMappedToImagePos(){
    let firstPart = "";
    let secondPart = "";
    let areas = "";
    images.forEach((image, index) => {
        if(imagePositions[index] == 1){
            areas = areas + "a "
        }else if(imagePositions[index] == 2){
            areas = areas + "b "
        }else if(imagePositions[index] == 3){
            areas = areas + "c "
        }else if (imagePositions[index] == 4){
            areas = areas + "d "
        }
        if(index == 1){
            firstPart = areas.substring(0, areas.length - 1)
            areas = "";
        }else if(index == 3){
            secondPart = areas.substring(0, areas.length - 1)
        }
    })
    return `"${firstPart}" "${secondPart}"`
}
function addImagesToAppropriateCells(){
    images.forEach((image) => {
        addCardToGridCell(image)
    })
}
function createImages(){
    imageObjectDefinition.forEach((imageItem) =>{
        createImage(imageItem)
    })
}
function createImage(imageItem){
    // create div elements that make up a card
    const imageElem = createElement('div');
    const imageInnerElem = createElement('div');
    const imageFrontElem = createElement('div');
    const imageBackElem = createElement('div');
    // create front and back image elements for a card
    const imageFront = createElement('img');
    const imageBack = createElement('img');
    // add class and id to card element
    addClassToElement(imageElem , 'image');
    addClassToElement(imageElem , 'fly-in');
    addIdToElement(imageElem , imageItem.id);
    //add class to inner card element
    addClassToElement(imageInnerElem, 'image-inner');
    //add class to front card element
    addClassToElement(imageFrontElem, 'image-front');
    //add class to back card element
    addClassToElement(imageBackElem, 'image-back');
    //add src att and appropriate value to img element (back of card)
    addSrcToImageElem(imageBack, imageBackImgPath);
    //add src att and appropriate value to img elemenet (front of card)
    addSrcToImageElem(imageFront, imageItem.imagePath);
    //assign class to back img element (back of card)
    addClassToElement(imageBack, 'card-img');
    //assign class to front img element (front of card)
    addClassToElement(imageFront, 'card-img');
    //add front img element as child element (front card)
    addChildElement(imageFrontElem, imageFront)
    //add back img element as child element (back card)
    addChildElement(imageBackElem, imageBack)
    //add front card elem as child elem to inner card elem
    addChildElement(imageInnerElem, imageFrontElem)
    //add back card elem as child elem to inner card elem
    addChildElement(imageInnerElem, imageBackElem)
    //add inner card elem as child elem to card elem
    addChildElement(imageElem , imageInnerElem)
    // add card elem as child elem to appropriate grid cell
    addCardToGridCell(imageElem )
    initializeImagePositions(imageElem )
    attachClickEventHandlerToImage(imageElem )
}
function attachClickEventHandlerToImage(image){
    image.addEventListener('click', () => chooseImage(image))
}
function initializeImagePositions(image){
    imagePositions.push(image.id)
}
function createElement(elemType){
    return document.createElement(elemType);
}
function addClassToElement(elem, className){
    elem.classList.add(className);
}
function addIdToElement(elem, id){
    elem.id = id;
}
function addSrcToImageElem(imgElem, src){
    imgElem.src = src
}
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem);
}
function addCardToGridCell(image){
    const imagePositionClassName = mapCardIdToGridCell(image)
    const imagePosElem = document.querySelector(imagePositionClassName)
    addChildElement(imagePosElem, image)
}
function mapCardIdToGridCell(image){
    if(image.id == 1){
        return '.image-pos-a';
    } else if(image.id == 2){
        return '.image-pos-b';
    } else if(image.id == 3){
        return '.image-pos-c';
    } else if(image.id == 4){
        return '.image-pos-d';
    }
}