const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const pm2 = require('./lib/pm2');

const get = component.get('/services', async ({}) => {
	return html`
	<style>${style}</style>
	<div class="full-spinner"></div>
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
	@media (max-device-width: 920px) {
		#pm2-container {
			height: calc(100vh - 230px);
			overflow: scroll;
		}
	}
`

module.exports = {
	get
}