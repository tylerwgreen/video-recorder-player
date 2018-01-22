var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Projector		= {
	params:	{
		binDir:		null,
		videosDirs:	null,
	},
	init:		function(binDir, videosDirs){
		console.log('Projector.init');
console.log('binDir', binDir);
console.log('videosDirs', videosDirs);
		this.params.binDir		= binDir;
		this.params.videosDirs	= videosDirs;
		// this.testRandomization();
		this.files.init(Projector.projectRandom);
	},
	testRandomization: function(){
		this.files.init(function(){
			var its	= 25;
			for(var i = 0; i <= its; i++){
				console.log(i, Projector.files.random());
			}
		});
	},
	projectRandom:	function(file){
		console.log('Projector.project');
		child		= execFile(
			Projector.params.binDir + 'projector-project',
			[Projector.files.random()],
			// [],
			function(error, stdout, stderr){
				if(error){
					console.log('Projector.project.error.stderr: ' + stderr);
					throw new Error(error);
				}else{
					console.log('Projector.project.success.stdout: ' + stdout);
					Projector.projectRandom();
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
			console.log('Projector.files.init');
			fs.readdir(Projector.params.videosDirs.old, (err, files) => {
				if(err){
					throw new Error(err);
				}else if(files.length <= 0){
					throw new Error('No video files in old dir');
				}else{
					files.forEach(function(file){
						Projector.files.files.all.push(file);
						if(files.length === Projector.files.files.all.length){
							callback();
						}
					});
				}
			});
		},
		addNew:		function(){
			console.log('Projector.files.addNew');
			fs.readdir(Projector.params.videosDirs.new, (err, files) => {
				if(err){
					throw new Error(err);
				}else if(files.length <= 0){
					console.log('No new files to add');
				}else{
					files.forEach(function(file){
						console.log('adding file: ' + file);
						// move file to old dir and add file to front of available files list
						fs.rename(Projector.params.videosDirs.new + file, Projector.params.videosDirs.old + file, function(){
							Projector.files.files.available.unshift(file);
						});
					});
				}
			});
		},
		random:	function(){
			console.log('Projector.files.random');
			Projector.files.addNew();
			if(Projector.files.files.available.length <= 0){
				Projector.files.files.available = Projector.files.files.all.slice(0); // copy all array into available
			}
			var file		= Projector.files.files.available[Math.floor(Math.random() * Projector.files.files.available.length)];
			var fileIndex	= Projector.files.files.available.indexOf(file);
			if(file === Projector.files.file)
				return Projector.files.random();
			Projector.files.files.available.splice(fileIndex, 1);
			Projector.files.file	= file;
			return Projector.params.videosDirs.old + file;
		}
	}
};
module.exports = Projector;