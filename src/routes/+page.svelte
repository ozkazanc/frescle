<script>
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    import { onMount } from "svelte";
    //import { frescoData } from "$lib/frescodata";
    import { createGrid, updateGridSections, receiveRandomSectionWord, clearPercentage } from "$lib/frescosections";
    //import type { FrescoData } from "$lib/frescodata.js";

    let { data } = $props();
    let fresco = $state(JSON.parse(data.fresco));

    let name = $state('dagger');
    let submittedText = $state('');
    
    let percentageCleared = $state(0);
    let percentageClearedWithoutHints = $state(0);
    $inspect(percentageCleared);
    $inspect(percentageClearedWithoutHints);

    function oninputsubmit() {
        if(name === '') return;
        submittedText = name;
        reveal(submittedText.toLowerCase())
        name = '';
    }

    let canvas = $state();
    let ctx = $state();
    
    let scale = 0.7;

    const ROW_COUNT = 64;
    const COL_COUNT = 64;
    /**
     * @param {string} word
     */
    function reveal(word, hint=false) {
        if (fresco.words[word]) {
            console.log("Found " + word)
            // @ts-ignore
            fresco.words[word].forEach(([x, y, width, height]) => {
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
            if(percentageCleared === 1) {
                ctx.clearRect(0, 0, fresco.width, fresco.height);
                console.log("Fresc is revealed!");
            }
        }
    }
    
    /**
     * @param {HTMLInputElement} node
     */
    function grabFocus(node) { node.focus(); }
    function showGridLines() {
        for(let i = 0; i < ROW_COUNT; i++){
            let rowY = i * fresco.height / ROW_COUNT;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.moveTo(0, rowY);
            ctx.lineTo(fresco.width, rowY);
            ctx.stroke();
        }
        
        for(let i = 0; i < COL_COUNT; i++){
            let rowX = i * fresco.width / COL_COUNT;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.moveTo(rowX, 0);
            ctx.lineTo(rowX, fresco.height);
            ctx.stroke();
        }
    }
    onMount(() => {
        console.log("hello");
        console.log(data.fresco);

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Full fog overlay
        
        //showGridLines();

        createGrid(fresco, ROW_COUNT, COL_COUNT);
        reveal("_start");
    });
</script>

<h1>Welcome to SvelteKit kiddo</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!--/> 
<img src={img_src} alt="Ambassadors">
<-->
<p>What's in the Fresco?</p>
<p>Cleared {Math.floor(percentageCleared * 100)}% of fresco and {Math.floor(percentageClearedWithoutHints * 100)}% without hints!</p>
<input type="text" bind:value={name} use:grabFocus
    onkeydown={(/** @type {{ key: string; }} */ event) => { if(event.key === 'Enter') oninputsubmit(); }}
>
<button onclick={ () => reveal(receiveRandomSectionWord(), true) }>Reveal Random Area</button>

<h1>{name}</h1>
{#if submittedText !== ''}
    <p>{submittedText}</p>
    <script>alert('hey')</script>
{/if}

<div class="game-container">
    <img src={fresco.filePath} alt="Hidden Painting" class="painting" width={fresco.width * scale} height={fresco.height * scale}>
    <canvas bind:this={canvas} width={fresco.width * scale} height={fresco.height * scale}></canvas>
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