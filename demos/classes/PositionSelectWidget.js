Demo.PositionSelectWidget = function DemoPositionSelectWidget( config ) {
	var widget = this;

	Demo.PositionSelectWidget.super.call( this, config );

	var verticalPositions = [ 'above', 'top', 'center', 'bottom', 'below' ];
	var horizontalPositions = [ 'before', 'start', 'center', 'end', 'after' ];

	verticalPositions.forEach( function ( v ) {
		var $row = $( '<div>' );
		horizontalPositions.forEach( function ( h ) {
			var option = widget.getOption( h, v );
			option.$element.attr( 'title', v + '/' + h );
			$row.append( option.$element );
		} );
		widget.$element.append( $row );
	} );

	this.$element.addClass( 'demo-positionSelectWidget' );
};
OO.inheritClass( Demo.PositionSelectWidget, OO.ui.RadioSelectWidget );
Demo.PositionSelectWidget.prototype.getOption = function ( h, v ) {
	var option = new OO.ui.RadioOptionWidget( {
		data: {
			horizontalPosition: h,
			verticalPosition: v
		}
	} );
	this.addItems( [ option ] );
	return option;
};
