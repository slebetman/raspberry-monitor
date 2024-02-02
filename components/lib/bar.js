const component = require('express-htmx-components');
const { html } = require('express-htmx-components/tags');

function barWidth (value, offset, max, fullWidth) {
	let fraction = (value-offset)/(max-offset);

	if (fraction > 1) fraction = 1;

	return fullWidth * fraction;
}

const get = component.get('/bar', ({ value, offset, max, color }) => {
	const width = 200;

	if (!offset) offset = 0;

	if (!color) color = '#33a';

	return html`
		<div class='bar-container' style='
			width:${width}px;
			display: inline-block;
			height: 18px;
			vertical-align: top;
			padding: 1px;
			border: 1px solid #999;
			background: #fff;
		'>
			<div class='bar' style='
				width:${barWidth(value, offset, max, width)}px;
				height: 100%;
				background:${color};
			'></div>
		</div>
	`;
})

module.exports = {
	get
}