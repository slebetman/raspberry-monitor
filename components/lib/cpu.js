const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const cpuInfo = require('../../lib/cpu');
const bar = require('./bar');

function cpuBar (val) {
	return bar.get.html({
		value: val
	})
}

const get = component.get('/cpu', async ({}) => {
	const cpu = await cpuInfo();

	const cpuPercent = cpu.percentUsed;

	return html`
	<style>${style}</style>
	<div class='cpu'>
		<div class='cpu-label'>
			CPU Usage: ${cpuPercent.toFixed(2)}%
		</div>
		$${cpuBar(cpuPercent)}
	</div>
	`;
})

const style = css`
	.cpu {
		padding: 5px;
	}
	.cpu-label {
		display: inline-block;
		width: 170px;
	}
	@media (max-device-width: 920px) {
		.cpu-label {
			width: 50vw;
		}
	}
`;

module.exports = {
	get
}