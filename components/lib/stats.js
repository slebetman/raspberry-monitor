const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const temperature = require('./temperature');
const cpuUsage = require('./cpu');
const memUsage = require('./mem');
const diskUsage = require('./disk');
const pm2 = require('./pm2');

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
		<div class="stat" hx-get="/temperature" hx-trigger="every 1523ms">
			$${await temperature.get.html({})}
		</div>
		<div class="stat">
			<div hx-get="/cpu" hx-trigger="every 2111ms">
				$${await cpuUsage.get.html({})}
			</div>
			<div hx-get="/mem" hx-trigger="every 1999ms">
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
		<div id="disk-container" hx-get="/disk" hx-trigger="every 11939ms">
			$${await diskUsage.get.html({})}
		</div>
	</div>
	<h2>
		<span class="material-icons-outlined">
			miscellaneous_services
		</span>
		Services
	</h2>
	<div class="section">
		<div id="pm2-container" hx-get="/pm2" hx-trigger="every 3637ms">
			$${await pm2.get.html({})}
		</div>
	</div>
	`;
})

const style = css`
	.section {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.section div div {
		font-family:Arial, Helvetica, sans-serif;
	}

	#pm2-container {
		flex: 1;
	}

	#disk-container {
		width: 100%;
	}

	h2 {
		margin-bottom: 10px;
	}

	@media (max-device-width: 920px) {
		.section {
			flex-direction: column;
			gap: 0;
		}
	}
`

module.exports = {
	get
}