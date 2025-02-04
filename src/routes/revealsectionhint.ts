import type { FrescoData } from "./frescodata";

//const ROW_COUNT : number = 64;
//const COL_COUNT : number = 64;
let gridSections : string[][] = [];
let wordToGridIndices: {[key : string]: number[]} = {};

export function createGrid(frescoData : FrescoData, ROW_COUNT: number, COL_COUNT: number){
    const GRID_SIZE : number = ROW_COUNT * COL_COUNT;
    for(let i: number = 0; i < GRID_SIZE; i++){
        gridSections.push([]);
    }

    let row_size: number = frescoData.height / ROW_COUNT;
    let col_size : number = frescoData.width / COL_COUNT;
    for(const key in frescoData.words){
        //let wordAreas : Area[] = frescoData.words[key];
        console.log(key)
        wordToGridIndices[key] = []
        frescoData.words[key].forEach(([x, y, width, height]) => {
            // For full sized areas like answers, don't add them to the grid sections
            if(x === 0 && y === 0 && width === frescoData.width && height === frescoData.height)
                return;

            // we check against the min bc the data might go over the boundaries
            for(let i : number = y; Math.floor(i / row_size) * row_size < Math.min(height + y, frescoData.height); i += row_size){
                let rowIdx : number = Math.floor(i / row_size);

                for(let j: number = x; Math.floor(j / col_size) * col_size < Math.min(width + x, frescoData.width); j += col_size){                    
                    let colIdx : number = Math.floor(j / col_size);
                    let gridIndex = rowIdx * COL_COUNT + colIdx;
                    
                    //console.log("Index: " + gridIndex)
                    gridSections[gridIndex].push(key);
                    wordToGridIndices[key].push(gridIndex);
                }
            }
        });
    }
    for(let i: number = 0; i < GRID_SIZE; i++){
        console.log(i, gridSections[i]);
    }
    for(const key in wordToGridIndices){
        console.log(key + " " + wordToGridIndices[key]);
    }
};

function coordinatesToGridIndex(point : {x: number, y: number}) : number{

    return 0;
};