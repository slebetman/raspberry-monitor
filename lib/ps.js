const getUsers = require('./users');

const _4GB = 4 * 1024 * 1024 * 1024;

async function init() {
	const { default: pretty } = await import('pretty-bytes');
	const { default: ps } = await import('ps-list');
	const users = await getUsers();

	return async (all = false) => {
		const psList = await ps({all});

		let processes = psList.map(x => {
			x.user = users[x.uid];
			return x;
		});
		
		const uniq = processes.reduce((a,v) => {
			const key = [v.user,v.cmd].join(':');
			
			if (a[key]) {
				a[key].cpu += parseFloat(v.cpu);
				a[key].memory += parseFloat(v.memory);
				a[key].pid += `, ${v.pid}`;
			}
			else {
				v.cpu = parseFloat(v.cpu);
				v.memory = parseFloat(v.memory);
				a[key] = v;
			}
			return a;
		},{});

		return Object.values(uniq).map(x=>{
			return {
				user: x.user,
				pid: x.pid,
				cpu: `${x.cpu} %`,
				ram: pretty(x.memory*_4GB/100,{binary: true}).replace('i',''),
				cmd: x.cmd,
			}
		});
	}
}

module.exports = {
	init
};