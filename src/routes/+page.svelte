<script>
    //import img_src from '$lib/assets/Hans_Holbein-The_Ambassadors.jpg'
    let name = $state('world');
    let submittedText = $state('');

    function oninputsubmit() {
        if(name === '') return;
        submittedText = name;
        name = '';
    }
</script>

<h1>Welcome to SvelteKit kiddo</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!--/> 
<img src={img_src} alt="Ambassadors">
<-->
<img src="/Hans_Holbein-The_Ambassadors.jpg" alt="Ambassadors" width="500" height="500">
<img src="/favicon.png" alt="favicon">
<input type="text" bind:value={name} 
    onkeydown={(event) => { if(event.key === 'Enter') oninputsubmit(); }}
>
<h1>{name}</h1>
{#if submittedText !== ''}
    <p>{submittedText}</p>
    <script>alert('hey')</script>
{/if}