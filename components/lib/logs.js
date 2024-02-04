const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const { exec } = require('child_process');

function getLogs (proc) {
	return new Promise((ok, fail) => {
		exec(`pm2 logs --nostream "${proc}"`, (err, stdout, stderr) => {
			if (err) return fail(err);
			ok(stdout + stderr);
		})
	})
}

const logs = component.get('/pm2/logs/:procName', async ({ procName }) => {
	if (!procName) {
		throw new Error('Invalid process name!');
	}

	return html`
	<style>${style}</style>
	<button
		hx-get="/services"
		hx-target="#content"
	>
		<span class="material-icons-outlined">
			arrow_back
		</span>
		Back
	</button>
	<h2>
		<span class="material-icons-outlined">
			notes
		</span>
		${procName} Logs
	</h2>
	<div class="logs">
		<pre>${await getLogs(procName)}</pre>
	</div>
	`
});

const style = css`
	h2 {
		text-transform: capitalize;
	}
	.logs {
		font-family:Arial, Helvetica, sans-serif;
	}
	.logs pre {
		width: 100%;
		padding: 5px 10px;
		text-wrap: wrap;
	}
`;

module.exports = {
	logs,
}