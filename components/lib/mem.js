const component = require('express-htmx-components');
const { html, css } = require('express-htmx-components/tags');
const raspInfo = require('raspberry-info');
const bar = require('./bar');

async function getMemUse () {
	const [free, available, total] = await Promise.all([
		raspInfo.getMemoryFree(),
		raspInfo.getMemoryAvailable(),
		raspInfo.getMemoryTotal(),
	]);

	return {
		free,
		available,
		total,
	}
}

function memBar (val) {
	return bar.get.html({
		value: val,
		max: 1,
	})
}

const get = component.get('/mem', async ({}) => {
	const bytes = (await import('pretty-bytes')).default;

	const mem = await getMemUse();

	var mA = parseFloat(mem.available)*1024;
	var mT = parseFloat(mem.total)*1024;
	var mU = (mT-mA)/mT;

	return html`
	<style>${style}</style>
	<div class='mem'>
		<div class='mem-label'>
			RAM Usage: ${(mU*100).toFixed(2)}%
		</div>
		$${memBar(mU)}
		<div class="mem-detail">
		(
			${bytes(mT-mA,{
				binary: true
			})} / ${bytes(mT,{
				binary: true
			})}
		)
		</div>
	</div>
	`;
})

const style = css`
	.mem {
		padding: 5px;
	}
	.mem-label {
		display: inline-block;
		width: 170px;
	}
	.mem-detail {
		font-size: 12px;
	}
	@media (max-device-width: 1024px) {
		.mem-label {
			width: 50vw;
		}
	}
`;

module.exports = {
	get
}