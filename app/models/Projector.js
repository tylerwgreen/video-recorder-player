var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Projector		= {
	params:	{
		binDir:			null,
		convertedDir:	null,
	},
	init:		function(binDir, convertedDir){
		console.log('Projector.init');
		this.params.binDir			= binDir;
		this.params.convertedDir	= convertedDir;
	},
	/* quit:		function(params){
		console.log('Projector.quit');
		child = execFile(
			Projector.params.binDir + 'quit-playback',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('Projector.quit.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('Projector.quit.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	}, */
	project:	function(params){
		console.log('Projector.project');
		child		= execFile(
			Projector.params.binDir + 'projector-project',
			[Projector.params.convertedDir, params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.log('Projector.project.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('Projector.project.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = Projector;