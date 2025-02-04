<script>
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    import { onMount } from "svelte";
    import { frescoData } from "./frescodata";
    import { createGrid } from "./revealsectionhint";

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
    
    let scale = 0.5

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
        }
    }
    
    /**
     * @param {HTMLInputElement} node
     */
    function grabFocus(node) { node.focus(); }

    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Full fog overlay
        console.log("hello")
        createGrid(frescoData)
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