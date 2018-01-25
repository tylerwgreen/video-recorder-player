var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Projector		= {
	params:	{
		binDir:		null,
		videosDirs:	null,
		initWait:	5000,	// time to wait for files to arrive in videos.dirs.old during init
		newWait:	10000,	// time to wait to check for new files in videos.dirs.new
		// initWait:	1000,	// time to wait for files to arrive in videos.dirs.old during init
		// newWait:	1000,	// time to wait to check for new files in videos.dirs.new
	},
	init:		function(binDir, videosDirs){
		console.log('Projector.init');
		console.log('Projector.init | binDir', binDir);
		console.log('Projector.init | videosDirs', videosDirs);
		this.params.binDir		= binDir;
		this.params.videosDirs	= videosDirs;
		this.files.init(Projector.projectRandom);
		// this.testRandomization();
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
			console.log('Projector.project | Projecting new file: ' + file);
		}else{
			var file = Projector.files.random();
			console.log('Projector.project | Projecting random file: ' + file);
		}
		console.log('Projector.project | executing file: ' + Projector.params.binDir + 'projector-project');
		child		= execFile(
			Projector.params.binDir + 'projector-project',
			[file],
			function(error, stdout, stderr){
// console.log('Projector.project | error: ' + error);
// console.log('Projector.project | stderr: ' + stderr);
// console.log('Projector.project | stdout: ' + stdout);
				if(error){
					console.log('Projector.project | Projector.project.error.stderr: ' + stderr);
					throw new Error(error);
				// }else if(null !== stderr){
					// console.log('Projector.project | Projector.project.stderr: ' + stderr);
					// throw new Error(stderr);
				}else{
					console.log('Projector.project | Projector.project.success.stdout: ' + stdout);
					Projector.projectRandom();
				}
			}
		);
	},
	files:	{
		file:	null,
		files:	{
			all:		[],
			new:		[],
			available:	[],
		},
		initialized: false,
		init:	function(callback){
			console.log('Projector.files.init');
			if(true === Projector.files.initialized)
				return;
			Projector.files.checkNewTimerInit();
			// search for existing files in old dir
			fs.readdir(Projector.params.videosDirs.old, (err, files) => {
				console.log('Projector.files.init | Read files: ', files);
				if(err){
					throw new Error('Projector.files.init | ' + err);
				}else if(files.length <= 0){
					console.log('Projector.files.init | No video files in old dir, wait for files in new dir and re-init');
					setTimeout(function(){
						Projector.files.init(callback);
					}, Projector.params.initWait);
				}else{
					console.log('Projector.files.init | generate list of files from old dir: ', files);
					var its = 1;
					console.log('Projector.files.init | files.length: ' + files.length);
					files.forEach(function(file, err){
						console.log('Projector.files.init | its: ' + its);
						Projector.files.files.all.push(file);
						if(its >= files.length){
							console.log('Projector.files.init | starting projection', Projector.files.files.all);
							Projector.files.initialized = true;
							callback();
						}else{
							its++;
						}
					});
				}
			});
		},
		checkNewTimerInit:	function(){
			console.log('Projector.files.checkNewTimerInit');
			Projector.files.addNew();
			setInterval(Projector.files.addNew, Projector.params.newWait);
		},
		addNew:		function(){
			console.log('Projector.files.addNew');
			fs.readdir(Projector.params.videosDirs.new, (err, files) => {
				if(err){
					throw new Error('Projector.files.addNew | ' + err);
				}else if(files.length <= 0){
					console.log('Projector.files.addNew | No new files to add');
				}else{
					files.forEach(function(file){
						console.log('Projector.files.addNew | moving file ' + file + ' to old dir');
						fs.rename(Projector.params.videosDirs.new + file, Projector.params.videosDirs.old + file, function(){
							console.log('Projector.files.addNew | adding file ' + file + ' to end of all arr');
							Projector.files.files.all.push(file);
							console.log('Projector.files.addNew | adding file ' + file + ' to end of new arr');
							Projector.files.files.new.push(file);
						});
					});
				}
			});
		},
		hasNew:	function(){
			// console.log('Projector.files.hasNew');
			return Projector.files.files.new.length > 0 ? true : false;
		},
		getNew:	function(){
			// console.log('Projector.files.getNew');
			if(false === Projector.files.hasNew())
				throw new Error('Projector.files.getNew | No new files available');
			var file = Projector.files.files.new[0];
			Projector.files.file	= file;
			console.log('Projector.files.getNew | Removing file ' + file + ' from new arr');
			Projector.files.files.new.splice(0, 1);
			return Projector.params.videosDirs.old + file;
		},
		random:	function(){
			console.log('Projector.files.random');
			if(Projector.files.files.available.length <= 0){
				console.log('Projector.files.random | all available files have been played, copy all into available');
				Projector.files.files.available = Projector.files.files.all.slice(0);
			}
			var file		= Projector.files.files.available[Math.floor(Math.random() * Projector.files.files.available.length)];
			if(typeof file === 'undefined')
				throw new Error('Projector.files.random | No files available in all arr, app was not properly initialized');
			var fileIndex	= Projector.files.files.available.indexOf(file);
			if(
					file === Projector.files.file
				// &&	Projector.files.files.available.length > 1
			){
				console.log('Projector.files.random | files.available.length: ' + Projector.files.files.available.length);
				console.log('Projector.files.random | file ' + file + ' was the previously played file, find another random file');
				return Projector.files.random();
			}
			console.log('Projector.files.random | removing file ' + file + ' from available arr');
			Projector.files.files.available.splice(fileIndex, 1);
			Projector.files.file	= file;
			return Projector.params.videosDirs.old + file;
		}
	}
};
module.exports = Projector;