<script>
	import { onMount } from 'svelte';
	import Loader from './Components/Loader.svelte';
	import { toast } from 'svoast';

	let context = '';
	let loading = false;
	let error = false;
	let output = '';
	let language = 'default';
	let languageTo = 'default';
	let copied = false;
	let selected = false;

	const copy = () => {
		navigator.clipboard.writeText(output);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	};

	const handleLanguageSelection = (e) => {
		language = e.target.value;
		console.log(language);
		checkSelections();
	};

	const handleLanguageToSelection = (e) => {
		languageTo = e.target.value;
		console.log(languageTo);
		checkSelections();
	};

	function checkSelections() {
		if (language === 'default' || languageTo === 'default') {
			selected = false;
		} else {
			selected = true;
		}
	}

	onMount(() => {
		const lang = navigator.language;
		if (lang === 'en') {
			language = 'eng_Latn';
			languageTo = 'spa_Latn';
			checkSelections();
			context = 'Just say it with DILO';
			toast.promise(fetchTranslate(), {
				loading: 'Traduciendo',
				success: 'Traducido!',
				error: 'error'
			});
		} else {
			language = 'spa_Latn';
			languageTo = 'eng_Latn';
			checkSelections();
			context = 'Solo dilo con DILO';
			toast.promise(fetchTranslate(), {
				loading: 'Traduciendo',
				success: 'Traducido!',
				error: 'error'
			});
		}
	});

	const fetchTranslate = async () => {
		const response = await fetch('/translate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: context,
				language: language,
				languageTo: languageTo
			})
		});

		if (!response.ok) {
			error = true;
			loading = false;
			throw error;
		}

		if (response.status === 201) {
			const data = await response.json();
			error = false;
			loading = false;

			output = data.output;
		}
	};

	const handleSubmit = async () => {
		loading = true;
		error = false;
		toast.promise(fetchTranslate(), {
			loading: 'Traduciendo',
			success: 'Traducido!',
			error: 'error'
		});
		/* fetchTranslate(); */
	};

	const change = () => {
		const prev = [language, languageTo];
		const prevContext = context;
		language = prev[1];
		languageTo = prev[0];
		context = output;
		output = prevContext;
	};
</script>

<header class="container header flex center" style="align-content: center">
	<h1 style="z-index: 1">dilo</h1>
	<img class="o" src="./chip.svg" alt="cartel dilo" />
</header>
<form on:submit|preventDefault>
	<div class="container grid col-2 sm-col-1 br-none" style="gap: 1rem;">
		<div class="flex f-col" style="gap: .6rem;">
			<div>
				<select
					class="br-secondary"
					id="idiomas"
					bind:value={language}
					on:change={handleLanguageSelection}
				>
					<option value="default" selected>Selecciona un idioma</option>
					<option value="spa_Latn">Español</option>
					<option value="eng_Latn">Inglés</option>
					<option value="fra_Latn">Francés</option>
					<option value="deu_Latn">Alemán</option>
					<option value="por_Latn">Portuguese</option>
				</select>
			</div>
			<div>
				<textarea
					name="Escribe el texto"
					id=""
					cols="30"
					rows="10"
					placeholder="Escribe el texto"
					class="br-secondary"
					bind:value={context}
				/>
			</div>
		</div>
		<div class="flex f-col" style="gap: .6rem;">
			<div class="flex center" style="gap: 0.2rem;">
				<select class="br-secondary" bind:value={languageTo} on:change={handleLanguageToSelection}>
					<option value="default" selected>Selecciona un idioma</option>
					<option value="spa_Latn">Español</option>
					<option value="eng_Latn">Inglés</option>
					<option value="fra_Latn">Francés</option>
					<option value="deu_Latn">Alemán</option>
					<option value="por_Latn">Portuguese</option>
				</select>
				<div>
					<button class="btn accent" id="change" on:click={change}
						><i class="bx bx-shuffle bx-rotate-180"></i></button
					>
				</div>
			</div>
			<div class="output-container">
				{#if loading}
					<div class="card center" style="margin-top: 2rem;"><Loader /></div>
				{:else if error}
					<p>Hubo un error. Intente de Nuevo</p>
				{:else}
					<textarea
						class="br-secondary"
						name="Traducción"
						placeholder="Traducción"
						id="out"
						cols="30"
						rows="10"
						value={output}
						readonly
					/>
				{/if}

				<button class="btn outline" id="copy" on:click={copy}>
					{#if copied}
						<i class="bx bx-check" />
					{:else}
						<i class="bx bx-copy" />
					{/if}
				</button>
			</div>
		</div>
		<div class="span-2 sm-span-1 right flex" style="justify-items: end">
			{#if selected}
				<button class="btn primary txt-black" type="submit" on:click={handleSubmit}
					>Traducir <i class="bx bx-message-alt-check" /></button
				>
			{/if}
		</div>
	</div>
</form>

<style>
	.o {
		width: 40px;
		padding-bottom: 40px;
	}

	.header {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	textarea {
		width: 100%;
		height: auto;
		min-height: 200px;
		padding: 10px;
		border-radius: 8px;
		resize: none;
		color: var(--font-color);
		background-color: #08202c;
		box-shadow:
			rgba(0, 0, 0, 0.16) 0px 3px 6px,
			rgba(0, 0, 0, 0.23) 0px 3px 6px;
	}

	textarea:focus {
		outline: none;
		border: 1px solid var(--primary);
	}
	select {
		width: 100%;
		height: 40px;
		border-radius: 8px;
		padding: 6px;
		color: var(--font-color);
		background-color: #08202c;
		box-shadow:
			rgba(0, 0, 0, 0.16) 0px 3px 6px,
			rgba(0, 0, 0, 0.23) 0px 3px 6px;
	}

	.output-container {
		position: relative;
		display: inline-block;
		width: 100%;
	}
	.output-container:hover .btn {
		display: block;
	}
	.output-container .btn {
		display: none;
		position: absolute;
		bottom: 10px;
		right: 10px;
		animation: 5s ease-in-out;
	}

	#copy {
		padding: 0.4rem;
	}

	#change {
		padding: 0.4rem;
		margin: 0;
	}
</style>
