const fs = require('fs/promises');

async function getUsers () {
	const txt = await fs.readFile('/etc/passwd','utf8');
	return txt.split('\n')
		.filter(x=>x)
		.map(x=>x.split(':'))
		.reduce((a,v) => {
			a[v[2]] = v[0];
			return a;
		},{});		
}

module.exports = getUsers;