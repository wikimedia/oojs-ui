Demo.PositionSelectWidget = function DemoPositionSelectWidget( config ) {
	Demo.PositionSelectWidget.super.call( this, config );

	const verticalPositions = [ 'above', 'top', 'center', 'bottom', 'below' ];
	const horizontalPositions = [ 'before', 'start', 'center', 'end', 'after' ];

	verticalPositions.forEach( ( v ) => {
		const $row = $( '<div>' );
		horizontalPositions.forEach( ( h ) => {
			const option = this.getOption( h, v );
			option.$element.attr( 'title', v + '/' + h );
			$row.append( option.$element );
		} );
		this.$element.append( $row );
	} );

	this.$element.addClass( 'demo-positionSelectWidget' );
};
OO.inheritClass( Demo.PositionSelectWidget, OO.ui.RadioSelectWidget );
Demo.PositionSelectWidget.prototype.getOption = function ( h, v ) {
	const option = new OO.ui.RadioOptionWidget( {
		data: {
			horizontalPosition: h,
			verticalPosition: v
		}
	} );
	this.addItems( [ option ] );
	return option;
};
