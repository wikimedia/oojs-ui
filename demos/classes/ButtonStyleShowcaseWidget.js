Demo.ButtonStyleShowcaseWidget = function DemoButtonStyleShowcaseWidget( config ) {
	const widget = this;

	Demo.ButtonStyleShowcaseWidget.super.call( this, config );

	this.$element.addClass( 'demo-buttonStyleShowcaseWidget' );

	this.constructor.static.styles.forEach( ( style ) => {
		const $buttonRow = $( '<div>' );
		widget.constructor.static.states.forEach( ( state ) => {
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
