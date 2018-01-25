var execFile	= require('child_process').execFile;

var VideoQuitter		= {
	params:	{
		binDir:		null,
	},
	init:	function(binDir){
		console.log('VideoQuitter.init');
		this.params.binDir = binDir;
	},
	quit:		function(params){
		console.log('VideoQuitter.quit');
		child = execFile(
			VideoQuitter.params.binDir + 'video-quitter',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoQuitter.quit.error.stderr: ' + stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('VideoQuitter.quit.success.stdout: ' + stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	}
};
module.exports = VideoQuitter;