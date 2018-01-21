var execFile	= require('child_process').execFile;

var Quitter		= {
	params:	{
		binDir:		null,
	},
	init:	function(binDir){
		console.log('Quitter.init');
		this.params.binDir = binDir;
	},
	quit:		function(params){
		console.log('Quitter.quit');
		child = execFile(
			Quitter.params.binDir + 'quitter-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('Quitter.quit.error.stderr: ' + stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('Quitter.quit.success.stdout: ' + stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	}
};
module.exports = Quitter;