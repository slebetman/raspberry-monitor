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
				<td>${p.user}</td>
				<td class="pid">${p.pid}</td>
				<td class="cpu">${p.cpu}</td>
				<td>${p.ram}</td>
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
`

module.exports = {
	get
}