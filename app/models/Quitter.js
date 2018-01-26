var execFile	= require('child_process').execFile;

var Quitter		= {
	params:	{
		binDir:		null,
	},
	init:	function(params){
		console.log('Quitter.init', params);
		this.params = Object.assign(this.params, params);
	},
	quit:		function(params){
		console.log('Quitter.quit');
		child = execFile(
			Quitter.params.binDir + 'quitter',
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