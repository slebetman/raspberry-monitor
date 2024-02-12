const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const ps = require('./lib/ps');

const get = component.get('/task-manager', async ({ all }) => {
	return html`
	<style>${style}</style>
	<h2>
		<span class="material-icons-outlined">
			poll
		</span>
		Task Manager
	</h2>
	<form>
		<label for="select-all">Show all processes:</label>
		$${ all ? html`
			<input type="checkbox"
				id="select-all"
				hx-get="/task-manager"
				hx-target="#content"
				checked
			>`
			:
			html`
			<input type="checkbox"
				id="select-all"
				hx-get="/task-manager?all=true"
				hx-target="#content"
			>`
		}
	</form>
	<div class="section">
		<div id="ps-container"
			hx-get="/ps${ all ? '?all=true' : '' }"
			hx-trigger="every 3637ms"
		>
			$${await ps.get.html({ all })}
		</div>
	</div>
	`;
})

const style = css`
	@media (max-device-width: 920px) {
		#ps-container {
			height: calc(100vh - 265px);
			overflow: scroll;
		}
	}
`

module.exports = {
	get
}