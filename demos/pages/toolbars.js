OO.ui.Demo.static.pages.toolbars = function ( demo ) {
	var i, toolGroups, actionButton, actionButtonDisabled, PopupTool, ToolGroupTool,
		$demo = demo.$element,
		$containers = $(),
		toolFactories = [],
		toolGroupFactories = [],
		toolbars = [];

	// Show some random accelerator keys that don't actually work
	function getToolAccelerator( name ) {
		return {
			listTool1: 'Ctrl+Shift+1',
			listTool2: 'Ctrl+Alt+2',
			listTool3: 'Cmd+Enter',
			listTool5: 'Shift+Down',
			menuTool: 'Ctrl+M'
		}[ name ];
	}

	for ( i = 0; i < 3; i++ ) {
		toolFactories.push( new OO.ui.ToolFactory() );
		toolGroupFactories.push( new OO.ui.ToolGroupFactory() );
		toolbars.push( new OO.ui.Toolbar( toolFactories[ i ], toolGroupFactories[ i ], { actions: true } ) );
		toolbars[ i ].getToolAccelerator = getToolAccelerator;
	}

	function createTool( toolbar, group, name, icon, title, init, onSelect ) {
		var Tool = function () {
			Tool.super.apply( this, arguments );
			this.toggled = false;
			if ( init ) {
				init.call( this );
			}
		};

		OO.inheritClass( Tool, OO.ui.Tool );

		Tool.prototype.onSelect = function () {
			if ( onSelect ) {
				onSelect.call( this );
			} else {
				this.toggled = !this.toggled;
				this.setActive( this.toggled );
			}
			toolbars[ toolbar ].emit( 'updateState' );
		};
		Tool.prototype.onUpdateState = function () {};

		Tool.static.name = name;
		Tool.static.group = group;
		Tool.static.icon = icon;
		Tool.static.title = title;
		return Tool;
	}

	function createToolGroup( toolbar, group ) {
		$.each( toolGroups[ group ], function ( i, tool ) {
			var args = tool.slice();
			args.splice( 0, 0, toolbar, group );
			toolFactories[ toolbar ].register( createTool.apply( null, args ) );
		} );
	}

	function createDisabledToolGroup( parent, name ) {
		var DisabledToolGroup = function () {
			DisabledToolGroup.super.apply( this, arguments );
			this.setDisabled( true );
		};

		OO.inheritClass( DisabledToolGroup, parent );

		DisabledToolGroup.static.name = name;

		DisabledToolGroup.prototype.onUpdateState = function () {
			this.setLabel( 'Disabled' );
		};

		return DisabledToolGroup;
	}

	toolGroupFactories[ 0 ].register( createDisabledToolGroup( OO.ui.BarToolGroup, 'disabledBar' ) );
	toolGroupFactories[ 0 ].register( createDisabledToolGroup( OO.ui.ListToolGroup, 'disabledList' ) );
	toolGroupFactories[ 1 ].register( createDisabledToolGroup( OO.ui.MenuToolGroup, 'disabledMenu' ) );

	PopupTool = function ( toolGroup, config ) {
		// Parent constructor
		OO.ui.PopupTool.call( this, toolGroup, $.extend( { popup: { padded: true } }, config ) );

		this.popup.$body.append( '<p>Popup tool</p>' );
	};

	OO.inheritClass( PopupTool, OO.ui.PopupTool );

	PopupTool.static.name = 'popupTool';
	PopupTool.static.group = 'popupTools';
	PopupTool.static.icon = 'help';

	toolFactories[ 2 ].register( PopupTool );

	ToolGroupTool = function ( toolbar, group, config ) {
		// Parent constructor
		OO.ui.ToolGroupTool.call( this, toolbar, group, config );
	};

	OO.inheritClass( ToolGroupTool, OO.ui.ToolGroupTool );

	ToolGroupTool.static.name = 'toolGroupTool';
	ToolGroupTool.static.group = 'barTools';
	ToolGroupTool.static.groupConfig = {
		indicator: 'down',
		include: [ { group: 'moreListTools' } ]
	};

	toolFactories[ 0 ].register( ToolGroupTool );

	// Toolbar
	toolbars[ 0 ].setup( [
		{
			type: 'bar',
			include: [ { group: 'barTools' } ],
			demote: [ 'toolGroupTool' ]
		},
		{
			type: 'disabledBar',
			include: [ { group: 'disabledBarTools' } ]
		},
		{
			type: 'list',
			indicator: 'down',
			label: 'List',
			icon: 'picture',
			include: [ { group: 'listTools' } ],
			allowCollapse: [ 'listTool1', 'listTool6' ]
		},
		{
			type: 'disabledList',
			indicator: 'down',
			label: 'List',
			icon: 'picture',
			include: [ { group: 'disabledListTools' } ]
		},
		{
			type: 'list',
			indicator: 'down',
			label: 'Auto-disabling list',
			icon: 'picture',
			include: [ { group: 'autoDisableListTools' } ]
		},
		{
			label: 'Catch-all',
			include: '*'
		}
	] );
	// Toolbar with action buttons
	toolbars[ 1 ].setup( [
		{
			type: 'menu',
			indicator: 'down',
			icon: 'picture',
			include: [ { group: 'menuTools' } ]
		},
		{
			type: 'disabledMenu',
			indicator: 'down',
			icon: 'picture',
			include: [ { group: 'disabledMenuTools' } ]
		}
	] );
	// Fake toolbar to be injected into the first toolbar
	// demonstrating right-aligned menus
	toolbars[ 2 ].setup( [
		{
			type: 'list',
			icon: 'picture',
			include: [ { group: 'listTools' } ]
		},
		{
			include: [ { group: 'popupTools' } ]
		}
	] );
	toolbars[ 0 ].$actions.append(
		$( '<div>' )
			.addClass( 'oo-ui-demo-toolbar-utilities' )
			.append( toolbars[ 2 ].$element )
	);

	actionButton = new OO.ui.ButtonWidget( { label: 'Action' } );
	actionButtonDisabled = new OO.ui.ButtonWidget( { label: 'Disabled', disabled: true } );
	toolbars[ 1 ].$actions
		.addClass( 'oo-ui-demo-toolbar-actionButtons' )
		.append( actionButton.$element, actionButtonDisabled.$element );

	for ( i = 0; i < toolbars.length; i++ ) {
		toolbars[ i ].emit( 'updateState' );
	}

	toolGroups = {
		barTools: [
			[ 'barTool', 'picture', 'Basic tool in bar' ],
			[ 'disabledBarTool', 'picture', 'Basic tool in bar disabled', function () { this.setDisabled( true ); } ]
		],

		disabledBarTools: [
			[ 'barToolInDisabled', 'picture', 'Basic tool in disabled bar' ]
		],

		listTools: [
			[ 'listTool', 'picture', 'First basic tool in list' ],
			[ 'listTool1', 'picture', 'Basic tool in list' ],
			[ 'listTool3', 'picture', 'Basic disabled tool in list', function () { this.setDisabled( true ); } ],
			[ 'listTool6', 'picture', 'A final tool' ]
		],

		moreListTools: [
			[ 'listTool2', 'picture', 'Another basic tool' ],
			[ 'listTool4', 'picture', 'More basic tools' ],
			[ 'listTool5', 'picture', 'And even more' ]
		],

		popupTools: [
			[ 'popupTool' ]
		],

		disabledListTools: [
			[ 'listToolInDisabled', 'picture', 'Basic tool in disabled list' ]
		],

		autoDisableListTools: [
			[ 'autoDisableListTool', 'picture', 'Click to disable this tool', null, function () { this.setDisabled( true ); } ]
		],

		menuTools: [
			[ 'menuTool', 'picture', 'Basic tool' ],
			[ 'disabledMenuTool', 'picture', 'Basic tool disabled', function () { this.setDisabled( true ); } ]
		],

		disabledMenuTools: [
			[ 'menuToolInDisabled', 'picture', 'Basic tool' ]
		],

		unusedStuff: [
			[ 'unusedTool', 'help', 'This tool is not explicitly used anywhere' ],
			[ 'unusedTool1', 'help', 'And neither is this one' ]
		]
	};

	createToolGroup( 0, 'unusedStuff' );
	createToolGroup( 0, 'barTools' );
	createToolGroup( 0, 'disabledBarTools' );
	createToolGroup( 0, 'listTools' );
	createToolGroup( 0, 'moreListTools' );
	createToolGroup( 0, 'disabledListTools' );
	createToolGroup( 0, 'autoDisableListTools' );
	createToolGroup( 1, 'menuTools' );
	createToolGroup( 1, 'disabledMenuTools' );
	createToolGroup( 2, 'listTools' );

	for ( i = 0; i < toolbars.length; i++ ) {
		$containers = $containers.add(
			new OO.ui.PanelLayout( {
				expanded: false,
				framed: true
			} ).$element
				.addClass( 'oo-ui-demo-container oo-ui-demo-toolbars' )
		);
		$containers.eq( i ).append( toolbars[ i ].$element );
		toolbars[ i ].initialize();
	}
	$containers.append( '' );
	$demo.append(
		$containers.eq( 0 ).append( '<div class="oo-ui-demo-toolbars-contents">Toolbar</div>' ),
		$containers.eq( 1 ).append( '<div class="oo-ui-demo-toolbars-contents">Toolbar with action buttons</div>' )
	);
};
