const component = require('express-htmx-components');
const { html } = require('express-htmx-components/tags');

function barWidth (value, offset, max) {
	let fraction = (value-offset)/(max-offset);

	if (fraction > 1) fraction = 1;

	return `${100 * fraction}%`;
}

const get = component.get('/bar', ({ value, offset, max, color }) => {
	if (!offset) offset = 0;
	if (!max) max = 100;
	if (!color) color = '#33a';

	return html`
		<div class='bar-container' style='
			display: inline-block;
			height: 18px;
			vertical-align: middle;
			padding: 1px;
			border: 1px solid #999;
			background: #fff;
		'>
			<div class='bar' style='
				width:${barWidth(value, offset, max)};
				height: 100%;
				background:${color};
			'></div>
		</div>
	`;
})

module.exports = {
	get
}