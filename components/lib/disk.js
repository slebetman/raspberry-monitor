const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const disk = require('../../lib/disk');
const bar = require('./bar');

function diskBar (val) {
	let color = '#0c6';
	if (val > 33) color = '#ca0';
	if (val > 66) color = '#c30';

	return bar.get.html({
		value: val,
		color
	})
}

const get = component.get('/disk', async ({}) => {
	const usage = (await disk.usage())
		.filter(x => x.mount !== '/boot/firmware');

	return html`
	<style>${style}</style>
	$${usage.map(drive => html`
		<div class='disk'>
			<div class='disk-label'>
				<span class="material-icons-outlined">
					folder
				</span>
				${drive.mount}
			</div>
			<div class='disk-stat'>
				${drive.available} Free
			</div>
			<div class='disk-percent'>
				(${drive.percent * 100}%)
			</div>
			$${diskBar(drive.percent * 100)}
		</div>
	`).join('')}
	`;
})

const style = css`
	.disk {
		padding: 5px;
	}
	.disk-label {
		display: inline-block;
		width: 200px;
	}
	.disk-stat {
		display: inline-block;
		width: 100px;
	}
	.disk-percent {
		display: inline-block;
	}
	#content .disk .material-icons-outlined {
		vertical-align: -5px;
	}
	.disk .bar-container {
		margin-left: 16px;
	}
	@media (max-device-width: 920px) {
		.disk {
			padding: 0;
		}
		.disk-label {
			width: 100%;
		}
		.disk-stat {
			margin-left: 35px;
		}
	}
`;

module.exports = {
	get
}