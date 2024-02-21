const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');

function link (label, icon, url, checked) {
	const id = label.replace(/\s+/g,'-');

	return html`
		<span>
			<input id="nav-${id}" type="radio" name="nav" ${checked ? 'checked' : ''}
				hx-get="${url}"
				hx-target="#content"
				hx-indicator="body"
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
	<input type="checkbox" id="nav-toggle">
	<label for="nav-toggle" id="nav-burger">
		<span class="material-icons-outlined">
			menu
		</span>
	</label>
	<nav  onclick="document.querySelector('#nav-toggle').checked = false">
		$${link('Stats', 'show_chart', '/stats', true)}
		$${link('Services', 'miscellaneous_services', '/services')}
		$${link('Task Manager', 'poll', '/task-manager')}
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
	#nav-toggle,
	#nav-burger {
		display: none;
	}
	#nav-burger span.material-icons-outlined {
		font-size: 32px;
	}
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
		#nav-burger {
			display: block;
			position: absolute;
			top: 20px;
			right: 15px;
			justify-self: end;
		}
		#nav-toggle + label + nav {
			display: none;
		}
		#nav-toggle:checked + label + nav {
			display: flex;
			position: absolute;
			top: 0;
			right: 0;
			width: fit-content;
			flex-direction: column;
			background: #fff;
			border: 1px solid #ccc;
			padding: 20px;
			box-shadow: #999 0 0 15px;
		}
		nav {
			gap: 20px;
		}
		.logout-btn {
			border-top: 1px solid #ccc;
			padding-top: 20px;
		}
	}
`;

module.exports = {
	get,
}