const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const ps = require('./lib/ps');

const get = component.get('/task-manager', async ({}) => {
	return html`
	<style>${style}</style>
	<h2>
		<span class="material-icons-outlined">
			poll
		</span>
		Task Manager
	</h2>
	<div class="section">
		<div id="ps-container"
			hx-get="/ps"
			hx-trigger="every 3637ms"
		>
			$${await ps.get.html({})}
		</div>
	</div>
	`;
})

const style = css`
	#ps-container {
		flex: 1;
	}
`

module.exports = {
	get
}