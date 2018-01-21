var RecordParams	= {
	consent:		null,
	video:			null,
	dateTime:		null,
	reset:			function(){
		console.log('RecordParams.reset');
		this.consent	= null;
		this.video		= null;
		this.dateTime	= null;
	},
	setConsent:		function(consent){
		console.log('RecordParams.setConsent');
		console.log('consent: ' + consent);
		this.reset();
		this.consent	= consent;
		this.setVideo();
	},
	setVideo:		function(){
		console.log('RecordParams.setVideo');
		// change extension to .mp4 (MP4Box had trouble converting files with .mp4 extension) .mp4 is better compatible with windows video player
		this.video		= this.getDateTime()
			+ (this.consent == 'true' ? '-consent' : '-no-consent')
			+ '.mp4';
		console.log('video: ' + this.video);
	},
	getVideo:		function(){
		console.log('RecordParams.getVideo');
		console.log('Video: ' + this.video);
		return this.video;
	},
	getDateTime:	function(){
		console.log('RecordParams.getDateTime');
		console.log('dateTime: ' + (null === this.dateTime ? 'Not set' : this.dateTime));
		if(null !== this.dateTime)
			return this.dateTime;
		var date		= new Date();
		var hour		= date.getHours();
			hour		= (hour		< 10 ? '0' : '') + hour;
		var min			= date.getMinutes();
			min			= (min		< 10 ? '0' : '') + min;
		var sec			= date.getSeconds();
			sec			= (sec		< 10 ? '0' : '') + sec;
		var year		= date.getFullYear();
		var month		= date.getMonth() + 1;
			month		= (month	< 10 ? '0' : '') + month;
		var day			= date.getDate();
			day			= (day		< 10 ? '0' : '') + day;
		this.dateTime	= year + month + day + '-' + hour + min + sec;
		return this.dateTime;
	}
};
module.exports = RecordParams;