$( function () {
	var i, tools,
		$demo = $( '.oo-ui-demo' ),
		toolFactory = new OO.ui.ToolFactory(),
		toolGroupFactory = new OO.ui.ToolGroupFactory(),
		toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );

	function createTool( name, group, icon, title, init ) {
		var Tool = function () {
			Tool.super.apply( this, arguments );
			this.toggled = false;
			if ( init ) {
				init.call( this );
			}
		};

		OO.inheritClass( Tool, OO.ui.Tool );

		Tool.prototype.onSelect = function () {
			this.toggled = !this.toggled;
			this.setActive( this.toggled );
			toolbar.emit( 'updateState' );
		};
		Tool.prototype.onUpdateState = function () {};

		Tool.static.name = name;
		Tool.static.group = group;
		Tool.static.icon = icon;
		Tool.static.title = title;
		return Tool;
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

	toolGroupFactory.register( createDisabledToolGroup( OO.ui.BarToolGroup, 'disabledBar' ) );
	toolGroupFactory.register( createDisabledToolGroup( OO.ui.ListToolGroup, 'disabledList' ) );
	toolGroupFactory.register( createDisabledToolGroup( OO.ui.MenuToolGroup, 'disabledMenu' ) );

	toolbar.setup( [
			{
				'type': 'bar',
				'include': [ { 'group': 'barTools' } ]
			},
			{
				'type': 'disabledBar',
				'include': [ { 'group': 'disabledBarTools' } ]
			},
			{
				'type': 'list',
				'indicator': 'down',
				'icon': 'picture',
				'include': [ { 'group': 'listTools' } ]
			},
			{
				'type': 'disabledList',
				'indicator': 'down',
				'icon': 'picture',
				'include': [ { 'group': 'disabledListTools' } ]
			},
			{
				'type': 'menu',
				'indicator': 'down',
				'icon': 'picture',
				'include': [ { 'group': 'menuTools' } ]
			},
			{
				'type': 'disabledMenu',
				'indicator': 'down',
				'icon': 'picture',
				'include': [ { 'group': 'disabledMenuTools' } ]
			}
	] );

	toolbar.emit( 'updateState' );

	tools = [
		[ 'barTool', 'barTools', 'picture', 'Basic tool in bar' ],
		[ 'disabledBarTool', 'barTools', 'picture', 'Basic tool in bar disabled', function () { this.setDisabled( true ); } ],

		[ 'barToolInDisabled', 'disabledBarTools', 'picture', 'Basic tool in disabled bar' ],

		[ 'listTool', 'listTools', 'picture', 'Basic tool in list' ],
		[ 'disabledListTool', 'listTools', 'picture', 'Basic tool in list disabled', function () { this.setDisabled( true ); } ],

		[ 'listToolInDisabled', 'disabledListTools', 'picture', 'Basic tool in disabled list' ],

		[ 'menuTool', 'menuTools', 'picture', 'Basic tool' ],
		[ 'disabledMenuTool', 'menuTools', 'picture', 'Basic tool disabled', function () { this.setDisabled( true ); } ],

		[ 'menuToolInDisabled', 'disabledMenuTools', 'picture', 'Basic tool' ]
	];

	for ( i = 0; i < tools.length; i++ ) {
		toolFactory.register( createTool.apply( this, tools[i] ) );
	}

	$demo.append( toolbar.$element, '<div class="oo-ui-demo-toolbar-contents">Toolbar demo</div>' );
} );
