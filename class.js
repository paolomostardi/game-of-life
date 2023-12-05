/*
    todo:
    -make the square size change with numbers first lower then higher  ->  done 
    -make the square size change with scrolling mouse                  ->  done 
    -make the square aline center up when you zoom out                 ->  done 
    -change the space between the squares based on their size          ->  done
    -make the speed change on a specific number                        ->  done
    -zoom in the right place                                           ->  some what done  
    -add mouse movement when pressed                                   ->  kinda done 
    -fix the mysterious bug                                            ->  done 
    -add colors and interactions                                       ->  done 
    -fix a much more mysterius bug                                     ->  done
    -create an alogorithm for mixing colors                            ->  rip me 
    -create lihgting effect                                            ->  done not 
    -add user interface                                                ->  done not
    -add prests and all kinds of stuff                                 ->  done not
    -optimize cleaning                                                 ->  done not 
    -optimize interaction                                              ->  done not
*/


//color is 3 variables that indicate r g b



class square{
    lineWidth = 0;

    constructor(size,x,y,color,lightColor){
        this.width = size;
        this.height = size;   
        this.x = x;
        this.y = y;
        this.color = color; 
        this.currentColor = grey;
        this.lightColor = lightColor;
        this.life = false;
        }

   

    changeColor(color){
        this.color = color;
    }
    setLightColor(){
        this.lightColor.h = this.color.h;
        
        this.lightColor.s = this.color.s - 30;
        
        this.lightColor.l = this.color.l + 15;
    }
    updateSize(size,x,y){  
        this.width = size;
        this.height = size;   
        this.x = x;
        this.y = y;
    }
    update(ctx){
        
        ctx.beginPath();
        this.lineWidth = this.width * 0.15; //15 percent of the square is outline

        //assing the color
        this.setLightColor();
        
        if(this.life)
            this.currentColor = this.lightColor;
        else 
            this.currentColor = grey;

        ctx.fillStyle = `hsl(${this.currentColor.h},${this.currentColor.s}%,${this.currentColor.l}%)`;
        ctx.fillRect(this.x + this.lineWidth/2,this.y + this.lineWidth/2,this.width-this.lineWidth,this.height-this.lineWidth);

        if(this.life)
            ctx.strokeStyle = `hsl(${this.color.h},${this.color.s}%,${this.color.l}%)`;
        else
            ctx.strokeStyle = `hsl(${this.currentColor.h},${this.currentColor.s}%,${this.currentColor.l}%)`; 

        ctx.lineJoin = 'round';
        ctx.lineWidth = this.lineWidth;
        //match the size properly
        ctx.strokeRect(this.x+this.lineWidth/2,this.y+this.lineWidth/2,this.width-this.lineWidth,this.height-this.lineWidth);      
    }



}

class board{
    space = 3;
    wiewX = 0;
    wiewY = 0;
    positionWiew = 0;
    matrix = [];
    n = 200;
    max = 200; 
    color = red;
     
    
    constructor(size,n){
            this.x = n;
            this.y = n;
            for(var i=0; i<this.n; i++) {
                    this.matrix[i] = [];
            for(var j=0; j<this.n; j++) {
                    this.matrix[i][j] = new square(size/this.n - this.space, (size/this.n) * i + 1, (size/this.n) * j + 1,blue,lightBlue);
                    }
            }
    }
    
    update(ctx){
        //draw the main board   
        for(let i = 0; i < this.max; i++)
            for(let j = 0; j< this.max ; j++)
                this.matrix[i][j].update(ctx);  

    }

    changeWiew(wiewX,wiewY){
        
        this.wiewY = wiewY;
        this.wiewX = wiewX;
        for(let i = 0; i < 200 ; i++)
            for(let j = 0; j<200 ; j++)
                this.matrix[i][j].updateSize(0,0,0);
  
        for(let i = 0; i < this.n ; i++)
            for(let j = 0; j < this.n ; j++)
                this.matrix[i + this.wiewX][j + this.wiewY].updateSize(this.size/this.n - this.space, (this.size/this.n) * i + 1, (this.size/this.n) * j + 1);

    }
                         
    changeSize(size,n){ // change how much zoomed the cells are
        this.size = size;
        this.n = n;
        
        this.space = (this.size/this.n) * 0.08;
        for(let i = 0; i < 200 ; i++) //clean any potential unwanted square
            for(let j = 0; j<200 ; j++)
                this.matrix[i][j].updateSize(0,0,0);
        
        
        for(let i = 0; i < this.n; i++)
            for(let j = 0; j < this.n; j++)
                this.matrix[i + this.wiewX][j + this.wiewY].updateSize(this.size/this.n - this.space, (this.size/this.n) * i + 1, (this.size/this.n) * j + 1);
    }



    changeColor(color){
       this.color = color; 
    }
    
    // method called when a square is clicked 
    drawPiece(x,y){ 
        if (this.matrix[x][y].life){  // if the cell is alive and is clicked is killed
            this.matrix[x][y].life = false;     
            return; 
            }
        this.matrix[x][y].color = this.color;
        this.matrix[x][y].life = true; 
              
    }

    

    checkNeighbors(x,y){ //return how many neighbors there are
        if (x == 0 || x >= (this.x - 1) || y == 0 || y >= (this.y - 1))
            return 0;
        let counter = 0;

        // first row
        if (this.matrix[x+1][y+1].currentColor != grey){
            counter++;
        }

        if (this.matrix[x][y+1].currentColor != grey){
            counter++;
        }
        if (this.matrix[x-1][y+1].currentColor != grey){
            counter++;
            
        }

        // second row
        if (this.matrix[x+1][y].currentColor != grey)
            counter++;
        if (this.matrix[x-1][y].currentColor != grey)
            counter++;

        // third row
        if (this.matrix[x+1][y-1].currentColor != grey)
            counter++;
        if (this.matrix[x][y-1].currentColor != grey)
            counter++;
        if (this.matrix[x-1][y-1].currentColor != grey)
            counter++;
        return counter;

    }


    calculateColor(x,y){ //  x = x - 1 
        let counter = 0;
        let arrayColors = [];
          // first row
        if (this.matrix[x+1][y+1].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x+1][y+1];
            counter++;
        }

        if (this.matrix[x][y+1].currentColor != grey){
           
            arrayColors[counter] = this.matrix[x][y+1];
            counter++;
        }
        if (this.matrix[x-1][y+1].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x-1][y+1];
            counter++;
        }

        // second row
        if (this.matrix[x+1][y].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x+1][y];
            counter++;
        }
        if (this.matrix[x-1][y].currentColor != grey){
           
            arrayColors[counter] = this.matrix[x-1][y]; 
            counter++;  
        }

        // third row
        if (this.matrix[x+1][y-1].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x+1][y-1];
            counter++;
            
        }
        if (this.matrix[x][y-1].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x][y-1];
            counter++;
            
        }
        if (this.matrix[x-1][y-1].currentColor != grey){
            
            arrayColors[counter] = this.matrix[x-1][y-1];
            counter++;
        }


        let color = avarageColor3(arrayColors[0].color,arrayColors[1].color,arrayColors[2].color);


        return color;
        
    }

    
    updateGame(){
        let neighbors;
        for (let i = 0; i < this.max; i++){ // x = i   y = j
            for (let j = 0; j < this.max; j++){ 
                

                neighbors = this.checkNeighbors(i,j); 
                if ((this.matrix[i][j].currentColor != grey && neighbors == 2 ) || neighbors == 3)
                    this.matrix[i][j].life = true;
                else 
                    this.matrix[i][j].life = false; 
                if (this.matrix[i][j].currentColor == grey && neighbors == 3){
                    this.matrix[i][j].color = this.calculateColor(i,j);                    
                }
            }
        }
    }
}

function avarageColor3(color1,color2,color3){
    let finalColor = new color (color1.h,color1.s,color1.l);
    finalColor.h = Math.floor((color1.h + color2.h + color3.h) / 3 );
  
    return finalColor;
}




function clear(ctx){
    ctx.clearRect(0,0,1000,1000);
}

class color{    
    constructor(h,s,l){
        this.h = h;
        this.s = s;
        this.l = l;
    }

}
// define all different colors

var lightRed = new color(8,80,73);
var red = new color(309, 100, 75);
var lightGreen = new color(180,220,185);
var green = new color( 115, 86, 58);
var purple = new color(220,10,50);
var yellow = new color(255,255,10);
var black = new color(0,0,0);
var orange = new color(39,93,54.7)
var lightBlue = new color(180, 200, 236);
var blue = new color(180, 95, 65);
var grey = new color(0,0,80);
var colorToPut = red;
var canvasSize = 950;
var squareSize = 200; // define how many square there are
var x = 0;
var y = 0;

// declare al the variables that need to be declared only once 

    
var gameStop = false;
var notGameStarted = true;
var currentSpeed = 400;

var gameTimeID;
var intervalID = window.setInterval(game,100);
var gameBoard = new board(canvasSize,squareSize); // declare main board  and set the matrix on a size of 200x200 elements

var wiewX = 100;
var wiewY = 100;

squareSize = 30;
gameBoard.changeSize(canvasSize,squareSize);

gameBoard.changeWiew(wiewX,wiewY);



// used to trow all the function of the game, called in loop by setInterval

function game(){
    var gameCanvas = document.getElementById('canvas');
    var ctx = gameCanvas.getContext('2d');
    
    clear(ctx);            
    gameBoard.update(ctx);    
}




function logMovement(event){
  x = event.offsetX;
  y = event.offsetY;
}
    
function holdUp(event){
    x -= event.offsetX;
    y -= event.offsetY;
    x = Math.floor(x/(canvasSize/gameBoard.n)) ;
    y = Math.floor(y/(canvasSize/gameBoard.n)) ;
    wiewX += x;
    wiewY += y;

    if (wiewX < 0)
        wiewX = 0;
    if (wiewY < 0)
        wiewY = 0;

    gameBoard.changeWiew(wiewX,wiewY);
}


function checkClickBoard(event){

    // obtaining the coordinate of the click
    // math floor bring the variable to an integer

    let x =  Math.floor(event.offsetX/(canvasSize/gameBoard.n)); // gameboard.n is the amount of visible squares
    let y =  Math.floor(event.offsetY/(canvasSize/gameBoard.n)); // canvasSize is the size of the canvas

    return [x,y]; 
}

function clickedBoard(event){
   
    let coordinate = checkClickBoard(event);
   
    gameBoard.drawPiece(coordinate[0] + wiewX,coordinate[1] + wiewY);  
    
}

function tryGame(){
    //alert(blue.h);
    gameBoard.updateGame();            
}

function debug(){
    gameBoard.debug = true;
}

function changeSize(){
    squareSize = 6;
    gameBoard.changeSize(canvasSize,squareSize);
   
}

function zoomSize(size){        
    squareSize = size;
    gameBoard.changeSize(canvasSize,squareSize);
}


function startGame(){
    if(notGameStarted){
        gameTimeID = window.setInterval(tryGame, currentSpeed);
        notGameStarted = false;
    }
}

function stopGame(){
    window.clearInterval(gameTimeID);
    notGameStarted = true;
}

function leftMove(){
    if (wiewX <= 0)
        return; 
    wiewX--;
    gameBoard.changeWiew(wiewX,wiewY);
}
Kali_x64
function rightMove(){
    wiewX++;
    gameBoard.changeWiew(wiewX,wiewY);
}



function upMove(){
    wiewY++;
    gameBoard.changeWiew(wiewX,wiewY);
}

function downMove(){
    if (wiewY <= 0)
        return; 
    wiewY--;
    gameBoard.changeWiew(wiewX,wiewY);

}

function zoom(event){
  
    event.preventDefault();

    gameBoard.changeWiew(wiewX,wiewY);
    if (event.deltaY < 0){

        if(squareSize > 5)
            zoomSize(squareSize - 4);

        if (event.offsetX > canvasSize/2){
            rightMove();
            rightMove();
        }
        else{
            leftMove();
            leftMove();
        }                    
        if (event.offsetY > canvasSize/2)
            upMove();
        else
            downMove();
        if (wiewX < 0)
            wiewX = 0;
        if (wiewY < 0)
            wiewY = 0;
        
        }
        else{
            if (event.offsetX > canvasSize/2){
            leftMove();
            leftMove();
        }
        else{
            rightMove();
            rightMove();
        }                    
        if (event.offsetY > canvasSize/2){
            downMove();
            downMove();
           }
        else{
            upMove();
            upMove();
        }
        if (wiewX < 0)
            wiewX = 0;
        if (wiewY < 0)
            wiewY = 0;
            zoomSize(squareSize + 4);
        }
            
}

function changeOrange() {
    
    colorToPut = blue;
    gameBoard.changeColor(orange);
}

function changeRed(){
  
    colorToPut = red;
    gameBoard.changeColor(red);
}

function changeBlue(){
   
    colorToPut = blue;
    
    gameBoard.changeColor(blue);

}

function changeGreen(){
    colorToPut = green;
    
    gameBoard.changeColor(green);
}

function changeSpeed(){
    let slider = document.getElementById("myRange");
    currentSpeed = (100 - slider.value) * 8;
    stopGame();
    startGame();    
}
