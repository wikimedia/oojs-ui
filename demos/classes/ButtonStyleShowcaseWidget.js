Demo.ButtonStyleShowcaseWidget = function DemoButtonStyleShowcaseWidget( config ) {
	var widget = this;

	Demo.ButtonStyleShowcaseWidget.parent.call( this, config );

	this.$element.addClass( 'demo-buttonStyleShowcaseWidget' );

	// eslint-disable-next-line no-jquery/no-each-util
	$.each( this.constructor.static.styles, function ( i, style ) {
		var $buttonRow = $( '<div>' );
		// eslint-disable-next-line no-jquery/no-each-util
		$.each( widget.constructor.static.states, function ( j, state ) {
			$buttonRow.append(
				new OO.ui.ButtonWidget( $.extend( {}, style, state ) ).$element
			);
		} );
		widget.$element.append( $buttonRow );
	} );
};

OO.inheritClass( Demo.ButtonStyleShowcaseWidget, OO.ui.Widget );

Demo.ButtonStyleShowcaseWidget.static.styles = [
	{},
	{
		flags: [ 'progressive' ]
	},
	{
		flags: [ 'destructive' ]
	},
	{
		flags: [ 'primary', 'progressive' ]
	},
	{
		flags: [ 'primary', 'destructive' ]
	}
];

Demo.ButtonStyleShowcaseWidget.static.states = [
	{
		label: 'Button'
	},
	{
		icon: 'tag',
		label: 'Button'
	},
	{
		icon: 'tag',
		label: 'Button',
		indicator: 'down'
	},
	{
		icon: 'tag',
		title: 'Title text'
	},
	{
		icon: 'tag',
		label: 'Tag',
		invisibleLabel: true,
		indicator: 'down'
	},
	{
		label: 'Button',
		disabled: true
	},
	{
		icon: 'tag',
		title: 'Title text',
		disabled: true
	},
	{
		icon: 'tag',
		label: 'Dropdown',
		invisibleLabel: true,
		indicator: 'down',
		disabled: true
	}
];
