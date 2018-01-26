var execFile	= require('child_process').execFile;

var VideoConverter		= {
	params:	{
		binDir:			null,
		recordingsDir:	null,
		convertedDir:	null,
	},
	init:	function(params){
		console.log('VideoConverter.init', params);
		this.params = Object.assign(this.params, params);
	},
	convert:	function(params){
		console.log('VideoConverter.convert');
		console.log('params.fileName: ' + params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-convert',
			[
				VideoConverter.params.recordingsDir,
				VideoConverter.params.convertedDir,
				params.fileName
			],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoConverter.convert.error.stderr: ' +  stderr);
					params.errorCB(error);
				}else{
					console.log('VideoConverter.convert.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	},
	delete:	function(params){
		console.log('VideoConverter.delete');
		console.log('params.fileName: ' + params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-delete',
			[
				VideoConverter.params.recordingsDir,
				params.fileName
			],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoConverter.delete.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('VideoConverter.delete.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoConverter;