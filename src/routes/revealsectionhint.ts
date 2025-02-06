import type { FrescoData } from "./frescodata";

let answerKey: string[] = []; // All the words that reveal the entire fresc.
let gridSections : string[][] = [];
let validGridSections : boolean[] = [];
let wordToGridIndices : {[key : string]: number[]} = {};

export function resetGrid(){
    answerKey = [];
    gridSections = [];
    validGridSections = [];
    wordToGridIndices = {};
}

export function createGrid(frescoData : FrescoData, ROW_COUNT: number, COL_COUNT: number){
    const GRID_SIZE : number = ROW_COUNT * COL_COUNT;
    for(let i: number = 0; i < GRID_SIZE; i++){
        gridSections.push([]);
        validGridSections.push(false); // Every sections starts as invalid because there might not be any words for that section
    }

    let row_size: number = frescoData.height / ROW_COUNT;
    let col_size : number = frescoData.width / COL_COUNT;
    for(const key in frescoData.words){
        //console.log(key)
        wordToGridIndices[key] = []
        frescoData.words[key].forEach(([x, y, width, height]) => {
            // For full sized areas like answers, don't add them to the grid sections
            // but add them to the answerKey 
            if(x === 0 && y === 0 && width === frescoData.width && height === frescoData.height){
                answerKey.push(key);
                delete wordToGridIndices[key] // Remove the key from the dictionary
                return;
            }

            // we check against the min bc the data might go over the boundaries of the fresc
            for(let i : number = y; Math.floor(i / row_size) * row_size < Math.min(height + y, frescoData.height); i += row_size){
                let rowIdx : number = Math.floor(i / row_size);

                for(let j: number = x; Math.floor(j / col_size) * col_size < Math.min(width + x, frescoData.width); j += col_size){                    
                    let colIdx : number = Math.floor(j / col_size);
                    let gridIndex = rowIdx * COL_COUNT + colIdx;
                    
                    //console.log("Index: " + gridIndex)
                    gridSections[gridIndex].push(key);
                    validGridSections[gridIndex] =  true; // validate the grid index, mark it as something to be found
                    wordToGridIndices[key].push(gridIndex);
                }
            }
        });
    }
}

// Called when a word is revealed
export function updateGridSections(word : string){
    // The word is either an answer or belongs to some grids.
    if(wordToGridIndices[word]){
        let wordIndices : number[] = wordToGridIndices[word];
        for(const idx of wordIndices){
            validGridSections[idx] = false; // Make all the word's grid indices invalid, so that they cannot be chosen at random anymore.
        }
    }
    else if(answerKey.includes(word)) {
        validGridSections.forEach((_, index) => validGridSections[index] = false);
    }
    else {
        console.error("[updateGridSections]: Received a non-existant word!"); // This should not be possible
    }
}

// Called to receive a random word (hopefully still not revealed)
export function receiveRandomSectionWord() : string {
    // Create an array of all the valid indices
    let validIndexArray : number[] = [];
    for(let i : number = 0; i < validGridSections.length; i++){
        if(validGridSections[i]){
            validIndexArray.push(i);
        }
    }
    
    // If there is none, we must have cleared all the sections already.
    if (validIndexArray.length == 0) return "Found it all!";
    
    // Pick one at random
    let randomIndexChoice : number = validIndexArray[Math.floor(Math.random() * validIndexArray.length)];
    
    // This word array should contain all the words that will reveal some part of the image, pick one at random.
    let randomWordArray : string[] = gridSections[randomIndexChoice];
    return randomWordArray[Math.floor(Math.random() * randomWordArray.length)];
}

export function clearPercentage(): number {
    let gridSectionCount: number = validGridSections.length;
    let validSectionCount: number = validGridSections.reduce((acc, cur) => acc += cur ? 1 : 0, 0);
    
    //console.log(1 - validSectionCount / gridSectionCount);
    return 1 - validSectionCount / gridSectionCount;
}