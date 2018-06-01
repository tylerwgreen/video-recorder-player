/**
 * Include dependencies
 */
console.log('Include dependencies');
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs		= require('rotating-file-stream');
var timeout	= require('connect-timeout');

/**
 * Define App variables
 */
console.log('Define App variables');
var protocol = 'http://';
// var address = '192.168.0.10'; // PI A for testing on desktop
var address = '127.0.0.1'; // for production
// var address = 'abqjournal.com';
var port = 5000;
var timeoutMins	= 60;
var styling	= false;
// var styling	= true;
var stylingTimeout = 1000;
var paths	= {
	app:	path.join(__dirname, 'app/'),
	models:	path.join(__dirname, 'app/models/'),
	views:	path.join(__dirname, 'app/views/'),
	logs:	path.join(__dirname, 'logs/'),
	web:	path.join(__dirname, 'web/'),
	bin:	path.join(__dirname, 'bin/'),
	audio:	path.join(__dirname, 'assets/audio/music/'),
	video:	{
		recordings:	path.join(__dirname, 'assets/video/recordings/'),
		converted:	{
			new:	path.join(__dirname, 'assets/video/recordings/converted/new/'),
			old:	path.join(__dirname, 'assets/video/recordings/converted/old/'),
		}
		// consent:	path.join(__dirname, 'assets/video/recordings/consent/'),
		// deletable:	path.join(__dirname, 'assets/video/recordings/deletable/'),
		// noConsent:	path.join(__dirname, 'assets/video/recordings/no-consent/'),
	}
};
// console.log('paths', paths);
var durations = {
	preview: 3000,
	record: 9000
	// preview: 1000,
	// record: 1000
};
var logger = {
	debug: true,
	// debug: false,
	// format: 'combined',	// DEFAULT - Standard Apache combined log output.
	// format: 'tiny',		// The minimal output.
	format: 'dev',		// Concise output colored by response status for development use.
	options: {
		skip: function(req, res){
			// only log error responses
			if(!logger.debug)
				return res.statusCode < 400
		},
	},
	stream: {
		file: 'access.log',
		config: {
			interval: '1d', // rotate daily 
			path: paths.logs,
		}
	},
}

/**
 * Load and initialize models
 */
console.log('Load models');
var Projector		= require(path.join(paths.models, 'Projector'));
var Audio			= require(path.join(paths.models, 'Audio'));
var RecordParams	= require(path.join(paths.models, 'RecordParams'));
var Camera			= require(path.join(paths.models, 'Camera'));
var VideoConverter	= require(path.join(paths.models, 'VideoConverter'));
var VideoPlayer		= require(path.join(paths.models, 'VideoPlayer'));
var Quitter			= require(path.join(paths.models, 'Quitter'));

console.log('Initialize models');
Projector.init({
	binDir: paths.bin,
	videosDirs: paths.video.converted
});
// return;
Audio.init({
	binDir: paths.bin,
	audioDir: paths.audio
});
Camera.init({
	binDir: paths.bin,
	recordingsDir: paths.video.recordings,
	previewDuration: durations.preview,
	recordDuration: durations.record
});
VideoConverter.init({
	binDir: paths.bin,
	recordingsDir: paths.video.recordings,
	convertedDir: paths.video.converted.new
});
VideoPlayer.init({
	binDir:			paths.bin,
	convertedDir:	paths.video.converted.new
});
Quitter.init({
	binDir: paths.bin
});

/**
 * Start app
 */
console.log('Start app');
var app = express();

/**
 * Middleware
 */
console.log('Middleware');
// ensure log directory exists
fs.existsSync(logger.stream.config.path) || fs.mkdirSync(logger.stream.config.path)
// create a rotating write stream
var accessLogStream = rfs(logger.stream.file, logger.stream.config)
logger.options.stream = accessLogStream;
// setup the logger
app.use(morgan(logger.format, logger.options))
// timeout
app.use(timeout(getTimeoutSeconds()));
// !!! must be last middleware !!!
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next){
	// console.log('haltOnTimedout', req.timedout);
	if(!req.timedout)
		next();
}
function getTimeoutSeconds(){
	// console.log('getTimeoutSeconds');
	return timeoutMins * 60 * 1000;
}

/**
 * Routes
 */
console.log('Routes');
// static files
app.use(express.static(paths.web));
app.get('/', function(req, res, next){
	res.sendFile(path.join(paths.views, 'index.html'));
});
app.get('/js/inline.js', function(req, res, next){
	console.log(server.address());
	var params = {
		debug: false,
		ajaxBase: protocol + (server.address().address || 'localhost') + ':' + server.address().port + '/',
		timeoutMins: timeoutMins + 1, // +1 from server timeout
		preview: {
			duration: durations.preview / 1000,	// seconds
		},
		record: {
			duration: durations.record / 1000,	// seconds
		}
	};
	console.log('inline.js', params);
	res.send('var params = ' + JSON.stringify(params));
});
app.post('/camera/preview/:consent', function(req, res, next){
	console.log('ROUTE: /camera/preview');
	console.log(req.params);
	if(typeof req.params.consent === 'undefined')
		throw new Error('Missing required param: consent');
	RecordParams.setConsent(req.params.consent);
	if(styling){
		setTimeout(function(){
			console.log('/camera/preview - success');
			if(res.headersSent){
				res.end('{errors:"error"}');
			}else{
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		}, stylingTimeout);
	}else{
		Camera.preview({
			errorCB:	function(error){
				console.log('/camera/preview - errorCB');
				console.log(error);
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.status(500).json({
						errors: ['Preview failed']
					});
				}
			},
			successCB:	function(){
				console.log('/camera/preview - successCB');
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.json({
						data:	{
							success:	true,
						}
					});
				}
			}
		});
	}
});
app.post('/camera/record', function(req, res, next){
	console.log('ROUTE: /camera/record');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/camera/record - success');
			if(res.headersSent){
				res.end('{errors:"error"}');
			}else{
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		}, stylingTimeout);
	}else{
		Camera.record({
			errorCB:	function(error){
				console.log('/camera/record - errorCB');
				console.log(error);
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.status(500).json({
						errors: ['Record failed'],
					});
				}
			},
			successCB:	function(){
				console.log('/camera/record - successCB');
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.json({
						data:	{
							success:	true,
						}
					});
				}
			}
		});
	}
});
app.post('/video/convert', function(req, res, next){
	console.log('ROUTE: /video/convert');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/video/convert - success');
			if(res.headersSent){
				res.end('{errors:"error"}');
			}else{
				res.json({
					data:	{
						success:	true,
					}
				});
				}
		}, stylingTimeout);
	}else{
		VideoConverter.convert({
			fileName:	RecordParams.getVideo(),
			errorCB:	function(error){
				console.log('/video/convert - errorCB');
				console.log(error);
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.status(500).json({
						errors: ['convert failed'],
					});
				}
			},
			successCB:	function(){
				console.log('/video/convert - successCB');
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.json({
						data:	{
							success:	true,
						}
					});
				}
			}
		});
	}
});
app.post('/video/play', function(req, res, next){
	console.log('ROUTE: /video/play');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/video/play - success');
			if(res.headersSent){
				res.end('{errors:"error"}');
			}else{
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		}, stylingTimeout);
	}else{
		VideoPlayer.play({
			// suppress playback since it messes with projection
			fileName:	null,
			// fileName:	RecordParams.getVideo(),
			errorCB:	function(error){
				console.log('/video/play - errorCB');
				console.log(error);
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.status(500).json({
						errors: ['Play failed'],
					});
				}
			},
			successCB:	function(){
				console.log('/video/play - successCB');
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.json({
						data:	{
							success:	true,
						}
					});
				}
			}
		});
	}
});
app.post('/quit', function(req, res, next){
	console.log('ROUTE: /quit');
	// console.log(req.params);
	if(styling){
		console.log('/quit - success');
		if(res.headersSent){
			res.end('{errors:"error"}');
		}else{
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	}else{
		Quitter.quit({
			errorCB:	function(error){
				console.log('/quit - errorCB');
				console.log(error);
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.status(500).json({
						errors: ['Quit failed'],
					});
				}
			},
			successCB:	function(){
				console.log('/quit - successCB');
				if(res.headersSent){
					res.end('{errors:"error"}');
				}else{
					res.json({
						data:	{
							success:	true,
						}
					});
				}
			}
		});
	}
});

/**
 * 404's - forward to error handler
 */
app.use(function(req, res, next){
	console.log('ROUTE: 404', req.url);
	var err = new Error('Not Found:' + req.url);
	err.status = 404;
	next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next){
	console.log('ROUTE: Error: ' + err.message);
	res.status(err.status || 500);
	var msg = err.message || 'Unknown error';
	if(res.headersSent){
		console.log('headersSent');
		res.end('{errors:"' + err.message + '"}');
	}else{
		console.log('headersNotSent');
		// for json errors
		if(req.xhr) {
			console.log('sendJSON');
			res.json({
				errors: [msg]
			})
		}else{
			console.log('sendTEXT');
			res.send('Error: ' + msg);
		}
	}
});

/**
 * Server
 */
console.log('Server');
var server = app.listen(port, address, function(){
	var host = server.address().address || 'localhost'
	var port = server.address().port
	console.log('Server started: ' + host + ':' + port);
});
server.setTimeout(getTimeoutSeconds());
module.exports = app;