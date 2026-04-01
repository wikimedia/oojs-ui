Demo.ButtonStyleShowcaseWidget = function DemoButtonStyleShowcaseWidget( config ) {
	Demo.ButtonStyleShowcaseWidget.super.call( this, config );

	this.$element.addClass( 'demo-buttonStyleShowcaseWidget' );

	this.constructor.static.styles.forEach( ( style ) => {
		const $buttonRow = $( '<div>' );
		const $buttonRowFrameless = $( '<div>' );
		[ false, true ].forEach( ( disabled ) => {
			this.constructor.static.states.forEach( ( state ) => {
				$buttonRow.append(
					new OO.ui.ButtonWidget(
						Object.assign( {}, style, state, { disabled: disabled } )
					).$element
				);
				if ( !style.size || style.size === 'medium' ) {
					$buttonRowFrameless.append(
						new OO.ui.ButtonWidget(
							Object.assign( {}, style, state, { framed: false, disabled: disabled } )
						).$element
					);
				}
			} );
		} );
		this.$element.append( $buttonRow, $buttonRowFrameless );
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
	},
	{
		size: 'small'
	},
	{
		size: 'large'
	}
];

Demo.ButtonStyleShowcaseWidget.static.states = [
	{
		label: 'Text'
	},
	{
		icon: 'tag',
		label: 'Text'
	},
	{
		icon: 'tag',
		label: 'Text',
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
		label: 'Dropdown',
		invisibleLabel: true,
		indicator: 'down'
	}
];
