var execFile	= require('child_process').execFile;

var Camera		= {
	params:	{
		binDir:			null,
		recordingsDir:	null,
	},
	init:	function(binDir, recordingsDir){
		console.log('Camera.init');
		this.params.binDir = binDir;
		this.params.recordingsDir = recordingsDir;
	},
	preview:	function(params){
		console.log('Camera.preview');
		child		= execFile(
			Camera.params.binDir + 'camera-preview',
			[Camera.params.recordingsDir],
			function(error, stdout, stderr){
				if(error){
					console.log('Camera.preview.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('Camera.preview.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	},
	record:		function(params){
		console.log('Camera.record');
		child		= execFile(
			Camera.params.binDir + 'camera-record',
			[Camera.params.recordingsDir],
			function(error, stdout, stderr){
				if(error){
					console.log('Camera.record.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('Camera.record.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = Camera;