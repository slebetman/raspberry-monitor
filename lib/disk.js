const { exec } = require('child_process');

function df_h () {
	return new Promise((ok, fail) => {
		exec('df -h', (err, stdout, stderr) => {
			if (err) return fail(err);
			ok(stdout);
		})
	})
}

/**
 * @typedef {Object} DiskUsage
 * @property {string} device
 * @property {string} size
 * @property {string} used
 * @property {string} available
 * @property {number} percent
 * @property {string} mount
 */

/**
 * @returns {Promise<DiskUsage[]>}
 */
async function usage () {
	const data = await df_h();

	return data
		.split('\n')
		.filter(x => x)
		.map(x => x.match(/\S+/g))
		.slice(1)
		.map(x => ({
			device: x[0],
			size: x[1],
			used: x[2],
			available: x[3],
			percent: parseFloat(x[4])/100,
			mount: x[5],
		}))
		.filter(
			x => x.device !== 'tmpfs' &&
			x.device !== 'udev'
		);

}

module.exports = {
	usage
}
