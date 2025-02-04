<script>
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    import { onMount } from "svelte";
    import { frescoData } from "./frescodata";
    import { createGrid, updateGridSections, receiveRandomSectionWord } from "./revealsectionhint";

    let name = $state('dagger');
    let submittedText = $state('');

    function oninputsubmit() {
        if(name === '') return;
        submittedText = name;
        reveal(submittedText)
        name = '';
    }

    let canvas = $state();
    let ctx = $state();
    
    let scale = 0.75;

    const ROW_COUNT = 64;
    const COL_COUNT = 64;
    /**
     * @param {string} word
     */
    function reveal(word) {
        if (frescoData.words[word]) {
            console.log("Found " + word)
            frescoData.words[word].forEach(([x, y, width, height]) => {
                x *= scale;
                y *= scale;
                width *= scale;
                height *= scale;
                ctx.clearRect(x, y, width, height);
            });
            updateGridSections(word);
        }
    }
    
    /**
     * @param {HTMLInputElement} node
     */
    function grabFocus(node) { node.focus(); }
    function showGridLines() {
        for(let i = 0; i < ROW_COUNT; i++){
            let rowY = i * frescoData.height / ROW_COUNT;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.moveTo(0, rowY);
            ctx.lineTo(frescoData.width, rowY);
            ctx.stroke();
        }
        
        for(let i = 0; i < COL_COUNT; i++){
            let rowX = i * frescoData.width / COL_COUNT;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.moveTo(rowX, 0);
            ctx.lineTo(rowX, frescoData.height);
            ctx.stroke();
        }
    }
    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Full fog overlay
        
        //showGridLines();

        console.log("hello")
        createGrid(frescoData, ROW_COUNT, COL_COUNT)
    });
</script>

<h1>Welcome to SvelteKit kiddo</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!--/> 
<img src={img_src} alt="Ambassadors">
<-->
<input type="text" bind:value={name} use:grabFocus
    onkeydown={(/** @type {{ key: string; }} */ event) => { if(event.key === 'Enter') oninputsubmit(); }}
>
<button onclick={ () => reveal(receiveRandomSectionWord()) }>Reveal Random Area</button>

<h1>{name}</h1>
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