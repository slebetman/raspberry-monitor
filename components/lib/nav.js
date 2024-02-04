const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');

function link (label, icon, url, checked) {
	const id = label.replace(/\s+/g,'-');

	return html`
		<span>
			<input id="nav-${id}" type="radio" name="nav" ${checked ? 'checked' : ''}
				hx-get="${url}"
				hx-target="#content"
			>
			<span class="material-icons-outlined">
				${icon}
			</span>
			<label for="nav-${id}">${label}</label>
		</span>
	`;
}

const get = component.get('/nav', ({}) => {
	return html`
	<style>$${style}</style>
	<nav>
		$${link('Stats', 'show_chart', '/stats', true)}
		$${link('Services', 'miscellaneous_services', '/services')}
		<a href="/logout" class="logout-btn">
			<span class="material-icons-outlined">
				logout
			</span>
			logout
		</a>
	</nav>
	`
});

const style = css`
	nav {
		display: flex;
		gap: 40px;
	}
	nav input[type="radio"] {
		display: none;
	}
	nav label {
		text-decoration: underline;
		cursor: pointer;
	}
	nav input[type="radio"]:checked + span {
		color: #33c;
	}
	nav input[type="radio"]:checked + span + label {
		text-decoration: none;
		color: #33c;
		cursor: default;
	}
	.logout-btn {
		text-decoration: underline;
		color: black;
	}
	nav .material-icons-outlined {
		vertical-align: middle;
		font-size: 18px;
	}

	@media (max-device-width: 920px) {
		nav {
			gap: 20px;
		}
		.logout-btn {
			flex-grow: 1;
			text-align: end;
		}
	}
`;

module.exports = {
	get,
}