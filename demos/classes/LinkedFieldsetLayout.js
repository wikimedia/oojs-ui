Demo.LinkedFieldsetLayout = function LinkedFieldsetLayout( config ) {
	Demo.LinkedFieldsetLayout.parent.call( this, $.extend( {
		$label: $( '<a>' ).attr( 'href', '#' + config.id )
	}, config ) );

	this.$element.addClass( 'demo-linked-fieldset' );

	// Move anchor down below floating header.
	this.$element.removeAttr( 'id' );
	this.$header.append(
		$( '<span>' )
			.addClass( 'demo-linked-fieldset-anchor' )
			.attr( 'id', config.id )
	);
};
OO.inheritClass( Demo.LinkedFieldsetLayout, OO.ui.FieldsetLayout );
