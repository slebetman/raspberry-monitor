const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const pm2 = require('./lib/pm2');

const get = component.get('/services', async ({}) => {
	return html`
	<style>${style}</style>
	<h2>
		<span class="material-icons-outlined">
			miscellaneous_services
		</span>
		Services
	</h2>
	<div class="section">
		<div id="pm2-container"
			hx-get="/pm2"
			hx-trigger="every 3637ms"
		>
			$${await pm2.get.html({})}
		</div>
	</div>
	`;
})

const style = css`
	#pm2-container {
		flex: 1;
	}
`

module.exports = {
	get
}