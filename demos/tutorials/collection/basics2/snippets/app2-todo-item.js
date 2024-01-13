Widgets.ToDoItemWidget2 = function ( config ) {
	config = config || {};
	Widgets.ToDoItemWidget2.super.call( this, config );

	this.creationTime = config.creationTime;
};

OO.inheritClass( Widgets.ToDoItemWidget2, OO.ui.OptionWidget );

Widgets.ToDoItemWidget2.prototype.getCreationTime = function () {
	return this.creationTime;
};

Widgets.ToDoItemWidget2.prototype.getPrettyCreationTime = function () {
	const time = new Date( this.creationTime ),
		hour = time.getHours(),
		minute = time.getMinutes(),
		second = time.getSeconds(),
		monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

	let temp = String( ( hour > 12 ) ? hour - 12 : hour );

	if ( hour === 0 ) {
		temp = '12';
	}
	temp += ( ( minute < 10 ) ? ':0' : ':' ) + minute;
	temp += ( ( second < 10 ) ? ':0' : ':' ) + second;
	temp += ( hour >= 12 ) ? ' P.M.' : ' A.M.';
	return [
		time.getDate(),
		monthNames[ time.getMonth() ],
		time.getFullYear() + ', ',
		temp
	].join( ' ' );
};
