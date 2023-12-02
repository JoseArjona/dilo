<script>
	import '../styles/cactus3.css';
	import { Toasts } from 'svoast';
</script>

<head>
	<title>dilo - Traductor con IA</title>
</head>

<Toasts />
<main class="background--custom">
	<slot />
</main>

<style>
	.background--custom {
		background: linear-gradient(90deg, rgb(18, 30, 34), #011620);
		background-size: 300% 300%;
		animation: gradient 4s alternate infinite;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	@keyframes gradient {
		0% {
			background-position: 0%;
		}
		100% {
			background-position: 100%;
		}
	}
</style>
