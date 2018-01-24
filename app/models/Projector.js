var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Projector		= {
	params:	{
		binDir:		null,
		videosDirs:	null,
		initWait:	5000,	// time to wait for files to arrive in videos.dirs.old during init
	},
	init:		function(binDir, videosDirs){
		console.log('Projector.init');
// console.log('binDir', binDir);
// console.log('videosDirs', videosDirs);
		this.params.binDir		= binDir;
		this.params.videosDirs	= videosDirs;
		// this.testRandomization();
		this.files.init(Projector.projectRandom);
	},
	testRandomization: function(){
		console.log('Projector.testRandomization');
		this.files.init(function(){
			console.log('Projector.testRandomization init callback');
			var its	= 25;
			for(var i = 0; i <= its; i++){
				console.log(i, Projector.files.random());
			}
		});
	},
	projectRandom:	function(){
		console.log('Projector.project');
		if(true === Projector.files.hasNew()){
			var file = Projector.files.getNew();
console.log('Projecting new file: ' + file);
		}else{
			var file = Projector.files.random();
console.log('Projecting random file: ' + file);
		}
setTimeout(
	Projector.projectRandom,
	Projector.params.initWait
);
		/* child		= execFile(
			Projector.params.binDir + 'projector-project',
			[file],
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
		); */
	},
	files:	{
		file:	null,
		files:	{
			all:		[],
			new:		[],
			available:	[],
		},
		init:	function(callback){
			console.log('Projector.files.init');
			// search for existing files in old dir
			fs.readdir(Projector.params.videosDirs.old, (err, files) => {
				if(err){
					throw new Error(err);
				}else if(files.length <= 0){
					console.log('No video files in old dir, check for files in new dir and re-init');
					Projector.files.addNew();
					setTimeout(function(){
						Projector.files.init(callback);
					}, Projector.params.initWait);
				}else{
					console.log('generate list of files from old dir', files);
					var its = 0;
					files.forEach(function(file, err){
						console.log(file);
						Projector.files.files.all.push(file);
						if(files.length >= its){
							console.log('starting projection', Projector.files.files.all);
							callback();
						}else{
							its++;
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
						console.log('moving file ' + file + ' to old dir');
						fs.rename(Projector.params.videosDirs.new + file, Projector.params.videosDirs.old + file, function(){
							console.log('adding file ' + file + ' to end of all arr');
							Projector.files.files.all.push(file);
							console.log('adding file ' + file + ' to end of new arr');
							Projector.files.files.new.push(file);
						});
					});
				}
			});
		},
		hasNew:	function(){
			console.log('Projector.files.hasNew');
			return Projector.files.files.new.length > 0 ? true : false;
		},
		getNew:	function(){
			console.log('Projector.files.getNew');
			if(false === Projector.files.hasNew())
				throw new Error('No new files available');
			var file = Projector.files.files.new[0];
			Projector.files.file	= file;
			console.log('Removing file ' + file + ' from new arr');
			Projector.files.files.new.splice(0, 1);
			return Projector.params.videosDirs.old + file;
		},
		random:	function(){
			console.log('Projector.files.random');
			if(Projector.files.files.available.length <= 0){
				console.log('all available files have been played, copy all into available');
				Projector.files.files.available = Projector.files.files.all.slice(0);
			}
			var file		= Projector.files.files.available[Math.floor(Math.random() * Projector.files.files.available.length)];
			if(typeof file === 'undefined')
				throw new Error('No files available in all arr, app was not properly initialized');
			var fileIndex	= Projector.files.files.available.indexOf(file);
			if(
					file === Projector.files.file
				&&	Projector.files.files.available.length > 1
			){
				console.log('files.available.length: ' + Projector.files.files.available.length);
				console.log('file ' + file + ' was the previously played file, find another random file');
				return Projector.files.random();
			}
			console.log('removing file ' + file + ' from available arr');
			Projector.files.files.available.splice(fileIndex, 1);
			Projector.files.file	= file;
			Projector.files.addNew();
			return Projector.params.videosDirs.old + file;
		}
	}
};
module.exports = Projector;