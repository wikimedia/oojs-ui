Demo.MenuDialog = function DemoMenuDialog( config ) {
	Demo.MenuDialog.super.call( this, config );
};
OO.inheritClass( Demo.MenuDialog, OO.ui.ProcessDialog );
Demo.MenuDialog.static.title = 'Menu dialog';
Demo.MenuDialog.static.actions = [
	{ action: 'save', label: 'Done', flags: [ 'primary', 'progressive' ] },
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] }
];
Demo.MenuDialog.prototype.getBodyHeight = function () {
	return 350;
};
Demo.MenuDialog.prototype.initialize = function () {
	// eslint-disable-next-line prefer-const
	let menuLayout, menuPanel, contentPanel;

	Demo.MenuDialog.super.prototype.initialize.apply( this, arguments );

	const positionField = new OO.ui.FieldLayout(
		new OO.ui.ButtonSelectWidget( {
			items: [
				new OO.ui.ButtonOptionWidget( {
					data: 'before',
					label: 'Before'
				} ),
				new OO.ui.ButtonOptionWidget( {
					data: 'after',
					label: 'After'
				} ),
				new OO.ui.ButtonOptionWidget( {
					data: 'top',
					label: 'Top'
				} ),
				new OO.ui.ButtonOptionWidget( {
					data: 'bottom',
					label: 'Bottom'
				} )
			]
		} ).on( 'select', ( item ) => {
			menuLayout.setMenuPosition( item.getData() );
		} ),
		{
			label: 'Menu position',
			align: 'top'
		}
	);
	const showField = new OO.ui.FieldLayout(
		new OO.ui.ToggleSwitchWidget( { value: true } ).on( 'change', ( value ) => {
			menuLayout.toggleMenu( value );
		} ),
		{
			label: 'Show menu',
			align: 'top'
		}
	);
	const expandField = new OO.ui.FieldLayout(
		new OO.ui.ToggleSwitchWidget( { value: true } ).on( 'change', ( value ) => {
			menuLayout.$element.toggleClass( 'oo-ui-menuLayout-expanded', value );
			menuLayout.$element.toggleClass( 'oo-ui-menuLayout-static', !value );
			menuPanel.$element.toggleClass( 'oo-ui-panelLayout-expanded', value );
			contentPanel.$element.toggleClass( 'oo-ui-panelLayout-expanded', value );
		} ),
		{
			label: 'Expand layout',
			align: 'top'
		}
	);
	menuPanel = new OO.ui.PanelLayout( { padded: true, expanded: true, scrollable: true } );
	menuPanel.$element.append( 'Menu panel' );
	contentPanel = new OO.ui.PanelLayout( { padded: true, expanded: true, scrollable: true } );
	contentPanel.$element.append(
		positionField.$element,
		expandField.$element,
		showField.$element
	);
	menuLayout = new OO.ui.MenuLayout( {
		menuPanel: menuPanel,
		contentPanel: contentPanel
	} );

	this.$body.append( menuLayout.$element );
};
Demo.MenuDialog.prototype.getActionProcess = function ( action ) {
	if ( action ) {
		return new OO.ui.Process( () => {
			this.close( { action: action } );
		} );
	}
	return Demo.MenuDialog.super.prototype.getActionProcess.call( this, action );
};
