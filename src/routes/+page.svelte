<script lang="ts">
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    import { onMount } from "svelte";
    import { frescoData } from "$lib/frescodata";
    import { createGrid, updateGridSections, receiveRandomSectionWord, clearPercentage } from "$lib/frescosections";
    
    //import type { PageProps } from "./$types";
    //let { data }: PageProps = $props();

    let name: string = $state('dagger');
    let submittedText: string = $state('');
    
    let completed =  $state(false);
    let percentageCleared: number = $state(0);
    let percentageClearedWithoutHints: number = $state(0);
    $inspect(percentageCleared);
    $inspect(percentageClearedWithoutHints);

    let timerIntervalId: number = 0;
    let elapsedSeconds = $state(0);
    let ss = $derived(elapsedSeconds % 60);
    let mm = $derived(Math.floor(elapsedSeconds / 60) % 60);
    let hh = $derived(Math.floor(elapsedSeconds / 3600));
    let gameTimer: string = $derived.by(() =>{
        let hours = hh < 10 ? '0' + hh : hh;
        let mins = mm < 10 ? '0' + mm : mm;
        let secs = ss < 10 ? '0' + ss : ss;

        return `${hours}:${mins}:${secs}`
    });

    let score = $derived.by(() => {
        // Score constants
        const maxScore = 500;
        const minScore = 100;
        const minTime = 60;
        const maxTime = 400 + minTime; // Interval is 5 minutes.

        // a is the percentage of distance between 2 points. (ie a = 0.3 means we are 30% away from x and 70% away from y)
        const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
        
        const a = (elapsedSeconds - minTime) / (maxTime - minTime);
        const base_score = elapsedSeconds <= minTime ? maxScore : lerp(maxScore, minScore, a); // The lerp values are switched bc we are losing points as time passes
        
        return Math.floor(base_score * percentageClearedWithoutHints);
    });

    let revealedHints: string[] = $state([]);
    $inspect(revealedHints);
    //let startTime: Date;
   // let time = $derived(Date.now() - startTime);

    function oninputsubmit() {
        if(name === '') return;
        submittedText = name;
        reveal(submittedText.toLowerCase())
        name = '';
    }

    let canvas = $state() as HTMLCanvasElement;
    let ctx = $state() as CanvasRenderingContext2D;
    
    let scale = 0.7;

    const ROW_COUNT = 64;
    const COL_COUNT = 64;

    function reveal(word: string, hint: boolean=false) {
        // Using "_start", "_artist" for special words. Don't accept them.
        if(word.startsWith("_")) return;
        
        // If the given word is a synonym, turn it into the corresponding keyword.
        word = frescoData.synonyms_to_keyword[word] ?? word;

        if(word == "_artist"){
            // Reveal all hints
            console.log(frescoData.hints[0]);
            console.log(frescoData.hints[1]);
            console.log(frescoData.hints[2]);
            console.log(frescoData.hints[3]);
            console.log(frescoData.hints[4]);
        }

        else if(frescoData.keywords[word]) {
            console.log("Found " + word)
            frescoData.keywords[word].forEach(([x, y, width, height]: [number, number, number, number]) => {
                x *= scale;
                y *= scale;
                width *= scale;
                height *= scale;
                ctx.clearRect(x, y, width, height);
            });
            updateGridSections(word);
            
            let oldPercentage = percentageCleared;
            percentageCleared = clearPercentage();
            percentageClearedWithoutHints += hint ? 0 : percentageCleared - oldPercentage;
            
            
            // If there are no valid grid sections left, reveal the entire image
            // (This is done to get rid of weird uncleared fog inbetween word areas)
            if(percentageCleared >= 0.995) {
                ctx.clearRect(0, 0, frescoData.width, frescoData.height);
                console.log("Fresc is revealed!");
                clearInterval(timerIntervalId); // Stop the timer
                console.log("Finished in " + gameTimer);
                completed = true;
            }
        } 
        
        else {
            console.log(word + " was not found.");
        }
    }

    function revealHint() {
        // There are no more than 5 hints.
        if(revealedHints.length >= 5) return;

        revealedHints = [...revealedHints, frescoData.hints[revealedHints.length]];
    }

    function grabFocus(node: HTMLInputElement) { node.focus(); }
    function showGridLines() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "green";
        
        for(let i = 0; i < ROW_COUNT; i++){
            let rowY = i * frescoData.height / ROW_COUNT;
            ctx.moveTo(0, rowY);
            ctx.lineTo(frescoData.width, rowY);
            ctx.stroke();
        }
        
        for(let i = 0; i < COL_COUNT; i++){
            let rowX = i * frescoData.width / COL_COUNT;
            ctx.moveTo(rowX, 0);
            ctx.lineTo(rowX, frescoData.height);
            ctx.stroke();
        }
    }
    function showRevealAreas() {
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(255, 0, 255, 0.15)`;
        for(let word in frescoData.keywords){
            console.log(word);
            frescoData.keywords[word].forEach(([x, y, width, height]: [number, number, number, number]) => {
                x *= scale;
                y *= scale;
                width *= scale;
                height *= scale;
                ctx.fillRect(x, y, width, height);
            });
        }
        
    }

    function showRevealBorders(filter: string="") {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgb(255, 0, 255)`;
        for(let word in frescoData.keywords){
            console.log(word);
            frescoData.keywords[word].forEach(([x, y, width, height]: [number, number, number, number]) => {
                if (filter !== "" && word !== filter) return;
                x *= scale;
                y *= scale;
                width *= scale;
                height *= scale;
                ctx.strokeRect(x, y, width, height);
            });
        }
        
    }

    onMount(() => {
        console.log("hello");
        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Full fog overlay
        
        //showGridLines();
        //showRevealAreas();
        //showRevealBorders("material");

        createGrid(frescoData, ROW_COUNT, COL_COUNT);
        reveal("_start");

        const gameTimerTick = setInterval(() => {
            elapsedSeconds += 1;
        }, 1000);
        
        timerIntervalId = gameTimerTick;

        return () => {
            clearInterval(gameTimerTick);
        };
    });
</script>

{#if completed}
    <h1>{frescoData.artist}, <i>{frescoData.name}</i>, {frescoData.year}<br/>Score: {score}</h1>
{/if}
<!--/> 
<img src={img_src} alt="Ambassadors">
<-->
<p>Timer: {gameTimer}</p>
<p>Cleared {Math.floor(percentageCleared * 100)}% of fresco and {Math.floor(percentageClearedWithoutHints * 100)}% without hints!</p>

<p>What's in the Fresco?</p>
<input type="text" bind:value={name} use:grabFocus
    onkeydown={(event) => { if(event.key === 'Enter') oninputsubmit(); }}
>
<button onclick={ () => reveal(receiveRandomSectionWord(), true) }>Reveal Random Area</button>
<button onclick={ () => revealHint() }>Reveal Hint</button>

<ol type="I">
    {#each revealedHints as hint}
        <li>
            <span>{hint}</span>
        </li>
    {/each}
</ol>


<h3>{name}</h3>
{#if submittedText !== ''}
    <p>{submittedText}</p>
    <script>alert('hey')</script>
{/if}

<div class="game-container">
    <img src={frescoData.filePath} alt="Hidden Painting" class="painting" width={frescoData.width * scale} height={frescoData.height * scale}>
    <canvas bind:this={canvas} width={frescoData.width * scale} height={frescoData.height * scale}></canvas>
</div>

<style>
    .game-container {
      position: relative;
    }
    .painting {
      position: absolute;
      top: 0;
      left: 0;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
</style>