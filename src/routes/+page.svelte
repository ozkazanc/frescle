<script>
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    import { onMount } from "svelte";
    import { frescoData } from "./frescodata";

    let name = $state('world');
    let submittedText = $state('');

    function oninputsubmit() {
        if(name === '') return;
        submittedText = name;
        reveal(submittedText)
        name = '';
    }

    let canvas = $state();
    let ctx = $state();
    
    let wordToCoordinates = {
        hand: [{ x: 100, y: 200, width: 80, height: 50 }],
        face: [{ x: 0, y: 0, width: 250, height: 250 }, { x: 250, y: 250, width: 250, height: 250 }]
    };

    /**
     * @param {string} word
     */
    function reveal(word) {
        if (frescoData.words[word]) {
            frescoData.words[word].forEach(({ x, y, width, height }) => {
                ctx.clearRect(x, y, width, height);
            });
        }
    }
    
    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Full fog overlay
    });
</script>

<h1>Welcome to SvelteKit kiddo</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!--/> 
<img src={img_src} alt="Ambassadors">
<-->
<img src={frescoData.filePath} alt="Ambassadors" width="500" height="500">
<img src="/favicon.png" alt="favicon">
<input type="text" bind:value={name} 
    onkeydown={(event) => { if(event.key === 'Enter') oninputsubmit(); }}
>
<h1>{name}</h1>
{#if submittedText !== ''}
    <p>{submittedText}</p>
    <script>alert('hey')</script>
{/if}

<div class="game-container">
    <img src={frescoData.filePath} alt="Hidden Painting" class="painting" />
    <canvas bind:this={canvas} width="500" height="500"></canvas>
</div>

<style>
    .game-container {
      position: relative;
      width: 500px; /* Adjust as needed */
      height: 500px;
    }
    .painting {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
</style>