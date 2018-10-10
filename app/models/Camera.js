var execFile	= require('child_process').execFile;

var Camera = {
	params:	{
		binDir: null,
		recordingsDir: null,
		previewDuration: null,
		recordDuration: null,
		lightsOnWaitDuration: null
	},
	init: function(params){
		console.log('Camera.init', params);
		this.params = Object.assign(this.params, params);
	},
	preview: function(params){
		console.log('Camera.preview');
		setTimeout(function(){
			child		= execFile(
				Camera.params.binDir + 'camera-preview',
				[Camera.params.recordingsDir, Camera.params.previewDuration],
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
		}, Camera.params.lightsOnWaitDuration);
	},
	record: function(params){
		console.log('Camera.record');
		setTimeout(function(){
			child		= execFile(
				Camera.params.binDir + 'camera-record',
				[Camera.params.recordingsDir, Camera.params.recordDuration],
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
		}, Camera.params.lightsOnWaitDuration);
	}
};
module.exports = Camera;