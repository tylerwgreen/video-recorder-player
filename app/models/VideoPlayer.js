var execFile	= require('child_process').execFile;

var VideoPlayer		= {
	params:	{
		binDir:			null,
		convertedDir:	null,
	},
	init:	function(params){
		console.log('VideoPlayer.init', params);
		this.params = Object.assign(this.params, params);
	},
	play:		function(params){
		console.log('VideoPlayer.play');
		console.log('params.fileName: ' + params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-play',
			[
				VideoPlayer.params.convertedDir + params.fileName
			],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoPlayer.play.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.play.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	},
	stop:		function(params){
		console.log('VideoPlayer.stop');
		console.log('params.fileName: ' + params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-stop',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoPlayer.stop.error.stderr: ' + stderr);
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.stop.success.stdout: ' + stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoPlayer;