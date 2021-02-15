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

// todo 
// change the life to the board from the square 

/*



Rules according to wikipedia:


The universe of the Game of Life is an infinite,
two-dimensional orthogonal grid of square cells,
each of which is in one of two possible states,
live or dead, (or populated and unpopulated, respectively).
Every cell interacts with its eight neighbours,
which are the cells that are horizontally, vertically,
or diagonally adjacent. At each step in time, the following transitions occur:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

Any live cell with two or three live neighbours survives.
Any dead cell with three live neighbours becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.
The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.

*/





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

    drawPiece(x,y){ // called when click on a square
        if (this.matrix[x][y].life){  // if the cell is alive and is clicked is killed
            this.matrix[x][y].life = false;     
            return; 
            }
        this.matrix[x][y].color = this.color;
        this.matrix[x][y].life = true; //true gamer moment 
              
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
