const component = require('express-htmx-components');
const asyncq = require('async-q');
const { html, css } = require('express-htmx-components/tags');
const { measureCPU, measureGPU } = require('rpi_measure_temp');
const bar = require('./bar');

const OFFSET_TEMP = 20; // use approx room temp as baseline instead of zero
const MAX_TEMP = 100;

async function getCPUTemperature () {
	return (await measureCPU()).celsius;
}

async function getGPUTemperature () {
	return (await measureGPU()).celsius;
}

function tempBar (temp) {
	let color = '#0c6';
	if (temp >= 65) color = '#ca0';
	if (temp >= 85) color = '#c30';

	return bar.get.html({
		value: temp,
		color,
		offset: OFFSET_TEMP,
		max: MAX_TEMP,
	})
}

const get = component.get('/temperature', async ({}) => {
	const temp = await asyncq.parallel({
		cpu: getCPUTemperature,
		gpu: getGPUTemperature,
	})

	return html`
	<style>${style}</style>
	<div class='temperature'>
		<div class='temp-label'>
			CPU Temperature: ${temp.cpu}°
		</div>
		$${tempBar(temp.cpu)}
	</div>
	<div class='temperature'>
		<div class='temp-label'>
			GPU Temperature: ${temp.gpu}°
		</div>
		$${tempBar(temp.gpu)}
	</div>
	`;
})

const style = css`
	.temperature {
		padding: 5px;
	}
	.temp-label {
		display: inline-block;
		width: 200px;
	}

	@media (max-device-width: 920px) {
		.temp-label {
			width: 50vw;
		}
	}
`;

module.exports = {
	get
}