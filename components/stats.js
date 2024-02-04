const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const temperature = require('./lib/temperature');
const cpuUsage = require('./lib/cpu');
const memUsage = require('./lib/mem');
const diskUsage = require('./lib/disk');

const get = component.get('/stats', async ({}) => {
	return html`
	<style>${style}</style>
	<h2>
		<span class="material-icons-outlined">
			show_chart
		</span>
		Stats
	</h2>
	<div class="section">
		<div class="stat"
			hx-get="/temperature"
			hx-trigger="every 1523ms"
		>
			$${await temperature.get.html({})}
		</div>
		<div class="stat">
			<div
				hx-get="/cpu"
				hx-trigger="every 2111ms"
			>
				$${await cpuUsage.get.html({})}
			</div>
			<div
				hx-get="/mem"
				hx-trigger="every 1999ms"
			>
				$${await memUsage.get.html({})}
			</div>
		</div>
	</div>
	<h2>
		<span class="material-icons-outlined">
			dns
		</span>
		Disks
	</h2>
	<div class="section">
		<div id="disk-container"
			hx-get="/disk"
			hx-trigger="every 11939ms"
		>
			$${await diskUsage.get.html({})}
		</div>
	</div>
	`;
})

const style = css`
	#disk-container {
		width: 100%;
	}
`

module.exports = {
	get
}