var fs = require('fs');

var lastCPUInfo = {total:0, active:0, idle:0};

function calculateCPUPercentage (oldVals, newVals) {
	var totalDiff = newVals.total - oldVals.total;
	var activeDiff = newVals.active - oldVals.active;
	return (activeDiff / totalDiff) * 100;
};

function getCPUInfo () {
	var currentCPUInfo = {};
	
	return new Promise((ok,fail) => {
		fs.readFile('/proc/stat', 'utf8', function(err, data){
			if(err){
				fail(err);
				return;
			}
			var lines = data.split('\n');
			var cpuTimes = lines[0].match(/[0-9]+/gi);
			currentCPUInfo.total = 0;
			// We'll count both idle and iowait as idle time
			currentCPUInfo.idle = parseInt(cpuTimes[3]) + parseInt(cpuTimes[4]);
			for (var i = 0; i < cpuTimes.length; i++){
				currentCPUInfo.total += parseInt(cpuTimes[i]);
			}
			currentCPUInfo.active = currentCPUInfo.total - currentCPUInfo.idle
			currentCPUInfo.percentUsed = calculateCPUPercentage(lastCPUInfo, currentCPUInfo);
			
			lastCPUInfo.active = currentCPUInfo.active;
			lastCPUInfo.idle = currentCPUInfo.idle;
			lastCPUInfo.total = currentCPUInfo.total;
			
			ok(currentCPUInfo);
		});
	});
};

module.exports = getCPUInfo;
