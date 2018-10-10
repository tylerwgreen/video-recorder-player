var pigpio = require('pigpio');

var Lights = {
	relay: null,
	params:	{
		socketPort: null,
		gpioPin: null,
		lightsOffWaitDuration: null,
	},
	init: function(params){
		console.log('Lights.init', params);
		this.params = Object.assign(this.params, params);
		this._relayInit();
		this._shutdownInit();
	},
	_relayInit: function(){
		console.log('Lights._relayInit');
		// Configures pigpio to use the specified socket port.
		// The default setting is to use port 8888.
		pigpio.configureSocketPort(this._getRandomSocketPort());
		this.relay = new pigpio.Gpio(this.params.gpioPin, {mode: pigpio.Gpio.OUTPUT});
	},
	on: function(){
		console.log('Lights.on()');
		this.relay.digitalWrite(true);
	},
	off: function(){
		console.log('Lights.off()');
		setTimeout(function(){
			Lights.relay.digitalWrite(false);
		}, Lights.params.lightsOffWaitDuration);
	},
	_shutdownInit: function(){
		// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
		console.log('Lights._shutdownInit');
		// so the program will not close instantly
		process.stdin.resume();
		// do something when app is closing
		process.on('exit', this._shutdownCB.bind(null,{cleanup:true}));
		// catches ctrl+c event
		process.on('SIGINT', this._shutdownCB.bind(null, {exit:true}));
		// catches "kill pid" (for example: nodemon restart)
		process.on('SIGUSR1', this._shutdownCB.bind(null, {exit:true}));
		process.on('SIGUSR2', this._shutdownCB.bind(null, {exit:true}));
		// catches uncaught exceptions
		process.on('uncaughtException', this._shutdownCB.bind(null, {exit:true}));
	},
	_shutdownCB: function(options, err){
		console.log('Lights._shutdownCB');
		Lights.off();
		if(options.cleanup)
			console.log('clean');
		if(err)
			console.log(err.stack);
		if(options.exit)
			process.exit();
	},
	_getRandomSocketPort: function(){
		// port - an unsigned integer specifying the pigpio socket port number.
		// twg - I randomized this so if I have to restart the app, it will use another port
		// there was an issue that the port would not be release if the app quit and I was too lazy to fix it
		var min = 1000;
		var max = 9999;
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
};
module.exports = Lights;