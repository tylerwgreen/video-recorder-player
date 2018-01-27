var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Audio		= {
	params:	{
		binDir:		null,
		audioDir:	null,
	},
	init:	function(params){
		console.log('Audio.init', params);
		this.params = Object.assign(this.params, params);
		this.files.init(Audio.playRandom);
		// this.testRandomization();
	},
	testRandomization: function(){
		this.files.init(function(){
			var its	= 25;
			for(var i = 0; i <= its; i++){
				console.log(i, Audio.files.random());
			}
		});
	},
	playRandom:	function(){
		console.log('Audio.playRandom');
		var file = Audio.files.random();
		console.log('Audio.playRandom | playing file: ' + file);
		child	= execFile(
			Audio.params.binDir + 'audio-play',
			[file],
			function(error, stdout, stderr){
				if(error){
					console.log('Audio.playRandom | error.error: ' + error);
					console.log('Audio.playRandom | error.stderr: ' + stderr);
					throw new Error('Audio.playRandom | ' + stderr);
				}else{
					console.log('Audio.playRandom | success.stdout: ' + stdout);
					console.log('Audio.playRandom | Playing another audio file');
					Audio.playRandom();
				}
			}
		);
	},
	files:	{
		file:	null,
		files:	{
			all:		[],
			available:	[],
		},
		init:	function(callback){
			console.log('Audio.files.init');
			fs.readdir(Audio.params.audioDir, (err, files) => {
				if(err){
					throw new Error('Audio.files.init | ' + err);
				}else if(files.length <= 0){
					throw new Error('Audio.files.init | No audio files in dir');
				}else{
					files.forEach(function(file){
						Audio.files.files.all.push(file);
						if(files.length === Audio.files.files.all.length){
							callback();
						}
					});
				}
			});
		},
		random:	function(){
			if(Audio.files.files.available.length <= 0){
				Audio.files.files.available = Audio.files.files.all.slice(0); // copy all array into available
			}
			var file		= Audio.files.files.available[Math.floor(Math.random() * Audio.files.files.available.length)];
			var fileIndex	= Audio.files.files.available.indexOf(file);
			if(file === Audio.files.file)
				return Audio.files.random();
			Audio.files.files.available.splice(fileIndex, 1);
			Audio.files.file	= file;
			return Audio.params.audioDir + file;
		}
	}
};
module.exports = Audio;