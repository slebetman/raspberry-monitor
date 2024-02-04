const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const stats = require('./stats');
const services = require('./services');
const nav = require('./lib/nav');

const main = component.get('/', async ({ session }, hx) => {
	const user = session.user;
	
	hx.set('HX-Refresh', 'true');

	return html`
	<style>${style}</style>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />

	<div id="header">
		<h1 id="title">
			<a href="/" style="text-decoration:none; color:black">
				<span class="material-icons-outlined" style="font-size: 1.4em; vertical-align:bottom">
					house
				</span>
				Home Server
			</a>
		</h1>
		$${user ? nav.get.html({}) : ''}
	</div>

	<div id="content">
		$${await stats.get.html({})}
	</div>
	`;
});

const style = css`
	#header {
		display: flex;
		justify-content: space-between;
	}
	#header h1#title {
		font-size: 36px;
		margin: 0;
	}

	@media (max-device-width: 920px) {
		#header {
			flex-direction: column;
		}
	}
`

module.exports = {
	main,
};
