const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const psLib = require('../../lib/ps');

let psFunc;

psLib.init().then(f => psFunc = f);

async function ps (all = false) {
	if (psFunc) return await psFunc(all);

	return [];
}

const get = component.get('/ps', async ({ all }) => html`
	<style>$${style}</style>
	<table id="process-list" class="ps">
		<tr>
			<th>User</th>
			<th class="pid">PID</th>
			<th class="cpu">CPU</th>
			<th>RAM</th>
			<th>Command</th>
		</tr>
		$${(await ps(all)).map(p => html`
			<tr>
				<td><span class="label">User: </span>${p.user}</td>
				<td class="pid"><span class="label">PID: </span>${p.pid}</td>
				<td class="cpu"><span class="label">CPU: </span>${p.cpu}</td>
				<td><span class="label">RAM: </span>${p.ram}</td>
				<td>${p.cmd}</td>
			</tr>
		`).join('')}
	</table>
	`
)

const style = css`
	.ps {
		font-family:Arial, Helvetica, sans-serif;
	}
	.ps th, .ps td {
		padding: 10px 18px;
		min-width: 80px;
		vertical-align: top;
		text-align: left;
	}
	.ps th.pid, .ps td.pid,
	.ps th.cpu, .ps td.cpu {
		min-width: 50px;
		width: 50px;
	}
	.ps td:last-child {
		max-width: 500px;
		text-indent: -20px;
		padding-left: 38px;
		word-break: break-all;
	}
	.ps .label {
		display: none;
	}
	@media (max-device-width: 920px) {
		.ps {
			width: 100%;
		}
		.ps .label {
			display: block;
		}
		.ps tr:first-child {
			display: none;
		}
		.ps tr {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap-reverse;
			gap: 10px;
			border-top: 1px solid #000;
			padding: 5px 0;
		}
		.ps td {
			vertical-align: top;
			padding: 1px;
			border: none;
		}
		.ps td:first-child {
			padding-left: 20px;
		}
		.ps td:last-child {
			width: 100%;
			padding-left: 20px;
		}
	}
`

module.exports = {
	get
}