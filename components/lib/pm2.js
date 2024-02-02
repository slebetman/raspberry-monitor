const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const pm2 = require('pm2');

function connect () {
	return new Promise((ok,fail) => {
		pm2.connect((err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

function listProcesses () {
	return new Promise((ok,fail) => {
		pm2.list((err, list) => {
			if (err) return fail(err);
			ok(list);
		})
	})
}

function startProcess (proc) {
	return new Promise((ok,fail) => {
		pm2.restart(proc,(err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

function stopProcess (proc) {
	return new Promise((ok,fail) => {
		pm2.stop(proc,(err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

const stop = component.post('/pm2/stop/:procName', async ({ procName }) => {
	await connect();

	if (!procName) {
		throw new Error('Invalid process name!');
	}

	await stopProcess(procName);

	return get.html({});
});

const start = component.post('/pm2/restart/:procName', async ({ procName }) => {
	await connect();

	if (!procName) {
		throw new Error('Invalid process name!');
	}

	await startProcess(procName);

	return get.html({});
});

const get = component.get('/pm2', async ({}) => {
	await connect();

	const rawList = await listProcesses();
	const bytes = (await import('pretty-bytes')).default;

	const processes = rawList.reduce((a,v) => {
		if (a[v.name]) {
			a[v.name].count ++;
			a[v.name].pm_id = `${a[v.name].pm_id}, ${v.pm_id}`;
			a[v.name].monit.cpu += v.monit.cpu;
			a[v.name].monit.memory += v.monit.memory;
		}
		else {
			a[v.name] = {
				count: 1,
				pm_id: v.pm_id,
				name: v.name,
				mode: v.pm2_env.exec_mode.replace(/_mode$/,''),
				uptime: v.pm2_env.pm_uptime,
				monit: v.monit,
				status: v.pm2_env.status,
			}
		}
		return a;
	},{});

	return html`
	<style>${style}</style>
	<table class='pm2'>
		<tr>
			<th>Process</th>
			<th class="detail">Last startup time</th>
			<th class="detail">Mode</th>
			<th class="detail">Instances</th>
			<th>CPU</th>
			<th>RAM</th>
			<th>Status</th>
			<th>Action</th>
		</tr>
		$${Object.values(processes).map(ps => html`
			<tr>
				<td>${ps.name}</td>
				<td class="detail">${new Date(ps.uptime).toLocaleString()}</td>
				<td class="detail">${ps.mode}</td>
				<td class="detail">${ps.count}</td>
				<td>${ps.monit.cpu.toFixed(1)}%</td>
				<td>${bytes(ps.monit.memory)}</td>
				<td>
					<span class='status ${ps.status}'>
						${ps.status}
					</span>
				</td>
				<td>
					$${ps.status === 'online' ? html`
					<button
						hx-post="/pm2/stop/${ps.name}"
						hx-target="#pm2-container"
					>
						Stop
					</button>
					<button
						hx-post="/pm2/restart/${ps.name}"
						hx-target="#pm2-container"
					>
						Restart
					</button>
					<button
						hx-get="/pm2/logs/${ps.name}"
						hx-target="#content"
					>
						Logs
					</button>
					` : html`
					<button
						hx-post="/pm2/restart/${ps.name}"
						hx-target="#pm2-container"
					>
						Start
					</button>
					<button
						hx-get="/pm2/logs/${ps.name}"
						hx-target="#content"
					>
						Logs
					</button>
					`}
				</td>
			</tr>
			`
		).join('')}
	</table>
	`;
});

const style = css`
	h2 {
		text-transform: capitalize;
	}
	.pm2 {
		font-family:Arial, Helvetica, sans-serif;
	}
	.pm2 th, .pm2 td {
		padding: 10px 18px;
		min-width: 60px;
	}
	.pm2 span.status {
		font-weight: bolder;
		text-transform: uppercase;
	}
	.pm2 span.online, .pm2 span.launching {
		color: #0a3;
	}
	.pm2 span.stopping, .pm2 span.stopped {
		color: #666;
	}
	.pm2 span.errored {
		color: #a60;
	}
	.pm2 button {
		font-size: 16px;
	}

	@media (max-device-width: 1024px) {
		.pm2 th, .pm2 td {
			padding: 4px 6px;
			font-size: 14px;
		}

		.pm2 button {
			font-size: 14px;
			width: 100%;
			margin-bottom: 2px;
		}

		.pm2 button:last-child {
			margin-bottom: 0;
		}

		.pm2 .detail {
			display: none;
		}
	}
`;

module.exports = {
	get,
	stop,
	start,
}