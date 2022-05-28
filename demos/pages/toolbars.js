Demo.static.pages.toolbars = function ( demo ) {
	var i, toolGroups,
		setDisabled = function () {
			this.setDisabled( true );
		},
		setInactive = function () {
			this.setActive( false );
		},
		$demo = demo.$container,
		$containers = $(),
		toolFactories = [],
		toolGroupFactories = [],
		toolbars = [],
		configs = [
			{ $overlay: true },
			{},
			{ position: 'bottom' }
		];

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

	for ( i = 0; i <= configs.length; i++ ) {
		toolFactories.push( new OO.ui.ToolFactory() );
		toolGroupFactories.push( new OO.ui.ToolGroupFactory() );
		toolbars.push( new OO.ui.Toolbar(
			toolFactories[ i ],
			toolGroupFactories[ i ],
			configs[ i ]
		) );
		toolbars[ i ].getToolAccelerator = getToolAccelerator;
	}

	// eslint-disable-next-line max-len
	function createTool( toolbar, group, name, icon, title, flags, narrowConfig, init, onSelect, displayBothIconAndLabel ) {
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
		Tool.static.flags = flags;
		Tool.static.narrowConfig = narrowConfig;
		Tool.static.displayBothIconAndLabel = !!displayBothIconAndLabel;
		return Tool;
	}

	function createToolGroup( toolbar, group ) {
		toolGroups[ group ].forEach( function ( tool ) {
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

	var AlertTool = function ( toolGroup, config ) {
		// Parent constructor
		OO.ui.PopupTool.call( this, toolGroup, $.extend( { popup: {
			padded: true,
			label: 'Alert head',
			head: true
		} }, config ) );

		// eslint-disable-next-line no-jquery/no-parse-html-literal
		this.popup.$body.append( '<p>Alert contents</p>' );
	};

	OO.inheritClass( AlertTool, OO.ui.PopupTool );

	AlertTool.static.name = 'alertTool';
	AlertTool.static.title = 'Alerts';
	AlertTool.static.group = 'popupTools';
	AlertTool.static.icon = 'alert';

	toolFactories[ 1 ].register( AlertTool );
	toolFactories[ 2 ].register( AlertTool );

	var PopupTool = function ( toolGroup, config ) {
		// Parent constructor
		OO.ui.PopupTool.call( this, toolGroup, $.extend( { popup: {
			padded: true,
			label: 'Popup head',
			head: true
		} }, config ) );

		// eslint-disable-next-line no-jquery/no-parse-html-literal
		this.popup.$body.append( '<p>Popup contents</p>' );
	};

	OO.inheritClass( PopupTool, OO.ui.PopupTool );

	PopupTool.static.name = 'popupTool';
	PopupTool.static.title = 'Notices';
	PopupTool.static.group = 'popupTools';
	PopupTool.static.icon = 'help';

	toolFactories[ 1 ].register( PopupTool );
	toolFactories[ 2 ].register( PopupTool );

	var ToolGroupTool = function ( toolGroup, config ) {
		// Parent constructor
		OO.ui.ToolGroupTool.call( this, toolGroup, config );
	};

	OO.inheritClass( ToolGroupTool, OO.ui.ToolGroupTool );

	ToolGroupTool.static.name = 'toolGroupTool';
	ToolGroupTool.static.group = 'barTools';
	ToolGroupTool.static.groupConfig = {
		label: 'More',
		include: [ { group: 'moreListTools' } ]
	};

	toolFactories[ 0 ].register( ToolGroupTool );
	toolFactories[ 1 ].register( ToolGroupTool );
	toolFactories[ 2 ].register( ToolGroupTool );

	// Toolbars setup, in order of toolbar items appearance
	// Toolbar
	toolbars[ 0 ].setup( [
		{
			name: 'bar',
			type: 'bar',
			include: [ { group: 'barTools' } ],
			demote: [ 'toolGroupTool' ]
		},
		{
			name: 'disabledBar',
			type: 'disabledBar',
			include: [ { group: 'disabledBarTools' } ]
		},
		{
			name: 'list',
			type: 'list',
			label: 'List',
			icon: 'image',
			include: [ { group: 'listTools' } ],
			allowCollapse: [ 'listTool1', 'listTool6' ]
		},
		{
			name: 'disabledList',
			type: 'disabledList',
			label: 'List',
			icon: 'image',
			include: [ { group: 'disabledListTools' } ]
		},
		{
			name: 'autoDisabledList',
			type: 'list',
			label: 'Auto-disabling list',
			icon: 'image',
			include: [ { group: 'autoDisableListTools' } ]
		},
		{
			name: 'catchAll',
			label: 'Catch-all',
			include: '*'
		}
	] );
	// Word processor toolbar
	toolbars[ 1 ].setup( [
		{
			name: 'history',
			type: 'bar',
			include: [ { group: 'history' } ]
		},
		{
			name: 'format',
			type: 'menu',
			include: [ { group: 'formatTools' } ]
		},
		{
			name: 'textStyle',
			type: 'list',
			label: 'Style text',
			invisibleLabel: true,
			icon: 'textStyle',
			include: [ { group: 'styleTools' } ]
		},
		{
			name: 'link',
			type: 'bar',
			include: [ { group: 'link' } ]
		},
		{
			name: 'cite',
			type: 'bar',
			include: [ { group: 'cite' } ]
		},
		{
			name: 'citeDisabled',
			type: 'bar',
			include: [ { group: 'citeDisabled' } ]
		},
		{
			name: 'structure',
			type: 'list',
			label: 'Structure',
			invisibleLabel: true,
			icon: 'listBullet',
			include: [ { group: 'structureTools' } ]
		},
		{
			name: 'insert',
			type: 'list',
			label: 'Insert',
			narrowConfig: {
				invisibleLabel: true,
				icon: 'add'
			},
			include: [ { group: 'insertTools' }, { group: 'autoDisableListTools' }, { group: 'unusedStuff' } ],
			allowCollapse: [ 'comment', 'hieroglyphs', 'score', 'signature', 'gallery', 'chem', 'math', 'syntaxHighlightDialog', 'graph', 'referencesList' ]
		},
		{
			name: 'specialCharacters',
			type: 'bar',
			include: [ { group: 'specialCharacters' } ]
		},
		{
			name: 'popup',
			align: 'after',
			include: [ { group: 'popupTools' } ]
		},
		{
			name: 'overflow',
			align: 'after',
			type: 'list',
			label: 'Page options',
			invisibleLabel: true,
			icon: 'menu',
			indicator: '',
			include: [ { group: 'overflowTools' } ]
		},
		{
			name: 'editorSwitch',
			align: 'after',
			type: 'list',
			label: 'Switch editor',
			invisibleLabel: true,
			icon: 'edit',
			include: [ { group: 'editorSwitchTools' } ]
		},
		{
			name: 'publish',
			align: 'after',
			type: 'bar',
			include: [ { group: 'publish' } ]
		}
		// TODO: Show a flagged list tool in another demo,
		// or when VE adds one.
		// {
		// name: 'list',
		// type: 'list',
		// icon: 'ellipsis',
		// align: 'after',
		// flags: [ 'primary', 'progressive' ],
		// include: [ { group: 'listTools' } ]
		// }
	] );
	// Word processor toolbar set to `position: 'bottom'`
	toolbars[ 2 ].setup( [
		{
			name: 'history',
			type: 'bar',
			include: [ { group: 'history' } ]
		},
		{
			name: 'format',
			type: 'menu',
			include: [ { group: 'formatTools' } ]
		},
		{
			name: 'style',
			type: 'list',
			label: 'Style text',
			invisibleLabel: true,
			icon: 'textStyle',
			include: [ { group: 'styleTools' } ]
		},
		{
			name: 'link',
			type: 'bar',
			include: [ { group: 'link' } ]
		},
		{
			name: 'cite',
			type: 'bar',
			include: [ { group: 'cite' } ]
		},
		{
			name: 'citeDisabled',
			type: 'bar',
			include: [ { group: 'citeDisabled' } ]
		},
		{
			name: 'structure',
			type: 'list',
			label: 'Structure',
			invisibleLabel: true,
			icon: 'listBullet',
			include: [ { group: 'structureTools' } ]
		},
		{
			name: 'insert',
			type: 'list',
			label: 'Insert',
			narrowConfig: {
				invisibleLabel: true,
				icon: 'add'
			},
			include: [ { group: 'insertTools' }, { group: 'autoDisableListTools' }, { group: 'unusedStuff' } ]
		},
		{
			name: 'specialCharacters',
			type: 'bar',
			include: [ { group: 'specialCharacters' } ]
		},
		{
			name: 'popup',
			align: 'after',
			include: [ { group: 'popupTools' } ]
		},
		{
			name: 'alert',
			align: 'after',
			include: [ { group: 'alertTools' } ]
		},
		{
			name: 'overflow',
			align: 'after',
			type: 'list',
			label: 'Page options',
			invisibleLabel: true,
			icon: 'menu',
			indicator: '',
			include: [ { group: 'overflowTools' } ]
		},
		{
			name: 'editorSwitch',
			align: 'after',
			type: 'list',
			label: 'Switch editor',
			invisibleLabel: true,
			icon: 'edit',
			include: [ { group: 'editorSwitchTools' } ]
		}
	] );

	for ( i = 0; i < toolbars.length; i++ ) {
		toolbars[ i ].emit( 'updateState' );
	}

	// ToolGroups definition, in alphabetical/disabledAlphabetical order
	toolGroups = {
		// Parameters like in createTool() function above (starting with 'name')
		barTools: [
			[ 'barTool', 'image', 'Basic tool in bar' ],
			[ 'disabledBarTool', 'image', 'Basic tool in bar disabled', null, null, setDisabled ]
		],

		disabledBarTools: [
			[ 'barToolInDisabled', 'image', 'Basic tool in disabled bar' ]
		],

		cite: [
			[ 'citeTool', 'quotes', 'Cite', null, { displayBothIconAndLabel: false }, null, null, true ]
		],

		publish: [
			// TODO: Show a destructive tool in another demo
			// [ 'cancel', null, 'Cancel', [ 'destructive' ], null, setInactive, true ],
			[ 'publish', null, 'Publish changes…', [ 'primary', 'progressive' ], { title: 'Publish…' }, null, setInactive, true ]
		],

		citeDisabled: [
			[ 'citeToolDisabled', 'quotes', 'Cite', null, { displayBothIconAndLabel: false }, setDisabled, null, true ]
		],

		editorSwitchTools: [
			[ 'visualEditor', 'eye', 'Visual editing' ],
			[ 'wikitextEditor', 'wikiText', 'Source editing' ]
		],

		formatTools: [
			[ 'paragraph', null, 'Paragraph' ],
			[ 'heading2', null, 'Heading 2' ],
			[ 'heading3', null, 'Sub-heading 1' ],
			[ 'heading4', null, 'Sub-heading 2' ],
			[ 'heading5', null, 'Sub-heading 3' ],
			[ 'heading6', null, 'Sub-heading 4' ],
			[ 'preformatted', null, 'Preformatted' ],
			[ 'blockquote', null, 'Blockquote' ]
		],

		history: [
			[ 'undoTool', 'undo', 'Undo' ],
			[ 'redoTool', 'redo', 'Redo' ]
		],

		insertTools: [
			[ 'media', 'image', 'First basic tool in list' ],
			[ 'template', 'puzzle', 'Template' ],
			[ 'table', 'table', 'Table' ],
			[ 'comment', 'speechBubble', 'Comment' ],
			[ 'hieroglyphs', null, 'Hieroglyphs' ],
			[ 'score', null, 'Musical notation' ],
			[ 'signature', 'signature', 'Your signature' ],
			[ 'gallery', 'imageGallery', 'Gallery' ],
			[ 'chem', null, 'Chemical formula' ],
			[ 'math', null, 'Math formula' ],
			[ 'syntaxHighlightDialog', 'markup', 'Code block' ],
			[ 'graph', null, 'Graph' ],
			[ 'referencesList', null, 'References list' ]
		],

		link: [
			[ 'linkTool', 'link', 'Link' ]
		],

		listTools: [
			[ 'listTool', 'image', 'First basic tool in list' ],
			[ 'listTool1', 'image', 'Basic tool in list' ],
			[ 'listTool3', 'image', 'Basic disabled tool in list', null, null, setDisabled ],
			[ 'listTool6', 'image', 'A final tool' ]
		],

		moreListTools: [
			[ 'listTool2', 'code', 'Another basic tool' ],
			[ 'listTool4', 'image', 'More basic tools' ],
			[ 'listTool5', 'ellipsis', 'And even more' ]
		],

		disabledListTools: [
			[ 'listToolInDisabled', 'image', 'Basic tool in disabled list' ]
		],

		autoDisableListTools: [
			[ 'autoDisableListTool', 'image', 'Click to disable this tool', null, null, null, setDisabled ]
		],

		menuTools: [
			[ 'menuTool', 'image', 'Basic tool' ],
			[ 'iconlessMenuTool', null, 'Tool without an icon' ],
			[ 'disabledMenuTool', 'image', 'Basic tool disabled', null, null, setDisabled ]
		],

		disabledMenuTools: [
			[ 'menuToolInDisabled', 'image', 'Basic tool' ]
		],

		overflowTools: [
			[ 'meta', 'window', 'Options' ],
			[ 'categories', 'image', 'Categories' ],
			[ 'settings', 'pageSettings', 'Page settings' ],
			[ 'advanced', 'advanced', 'Advanced settings' ],
			[ 'textLanguage', 'language', 'Languages' ],
			[ 'templatesUsed', 'puzzle', 'Templates used' ],
			[ 'codeMirror', 'highlight', 'Syntax highlighting', null, null, setDisabled ],
			[ 'changeDirectionality', 'textDirRTL', 'View as right-to-left' ],
			[ 'find', 'articleSearch', 'Find and replace' ]
		],

		specialCharacters: [
			[ 'specialCharacter', 'specialCharacter', 'Special character' ]
		],

		popupTools: [
			[ 'popupTool', 'alertTool' ]
		],

		structureTools: [
			[ 'bullet', 'listBullet', 'Bullet list' ],
			[ 'number', 'listNumbered', 'Numbered list' ],
			[ 'outdent', 'outdent', 'Decrease indentation' ],
			[ 'indent', 'indent', 'Increase indentation' ]
		],

		styleTools: [
			[ 'bold', 'bold', 'Bold' ],
			[ 'italic', 'italic', 'Italic' ],
			[ 'italic', 'italic', 'Italic' ],
			[ 'superscript', 'superscript', 'Superscript' ],
			[ 'subscript', 'subscript', 'Subscript' ],
			[ 'strikethrough', 'strikethrough', 'Strikethrough' ],
			[ 'code', 'code', 'Computer Code' ],
			[ 'underline', 'underline', 'Underline' ],
			[ 'language', 'language', 'Language' ],
			[ 'big', 'bigger', 'Big' ],
			[ 'small', 'smaller', 'Small' ],
			[ 'clear', 'cancel', 'Clear Styling', null, null, setDisabled ]
		],

		unusedStuff: [
			[ 'unusedTool', 'help', 'This tool is not explicitly used anywhere' ],
			[ 'unusedTool1', 'help', 'And neither is this one' ]
		]
	};

	// ToolGroup creation, in Toolbar numeric and ToolGroup alphabetical order
	createToolGroup( 0, 'barTools' );
	createToolGroup( 0, 'disabledBarTools' );
	createToolGroup( 0, 'listTools' );
	createToolGroup( 0, 'moreListTools' );
	createToolGroup( 0, 'disabledListTools' );
	createToolGroup( 0, 'autoDisableListTools' );
	createToolGroup( 0, 'unusedStuff' );

	for ( i = 1; i <= 2; i++ ) {
		createToolGroup( i, 'cite' );
		createToolGroup( i, 'formatTools' );
		createToolGroup( i, 'insertTools' );
		createToolGroup( i, 'history' );
		createToolGroup( i, 'link' );
		createToolGroup( i, 'listTools' );
		createToolGroup( i, 'moreListTools' );
		createToolGroup( i, 'autoDisableListTools' );
		createToolGroup( i, 'menuTools' );
		createToolGroup( i, 'specialCharacters' );
		createToolGroup( i, 'structureTools' );
		createToolGroup( i, 'styleTools' );
		createToolGroup( i, 'unusedStuff' );
		createToolGroup( i, 'overflowTools' );
		createToolGroup( i, 'editorSwitchTools' );
		createToolGroup( i, 'publish' );
		createToolGroup( i, 'listTools' );
	}

	for ( i = 0; i < toolbars.length; i++ ) {
		$containers = $containers.add(
			new OO.ui.PanelLayout( {
				expanded: false,
				framed: true
			} ).$element
				.addClass( 'demo-toolbar' )
		);

		$containers.last().append( toolbars[ i ].$element );
	}

	$demo.append(
		new OO.ui.PanelLayout( {
			expanded: false,
			framed: false,
			classes: [ 'demo-toolbars' ]
		} ).$element
			/* eslint-disable no-jquery/no-parse-html-literal */
			.append(
				$containers.eq( 0 ).append( '<div class="demo-toolbars-contents">Toolbar</div>' ),
				$containers.eq( 1 ).append( '<div class="demo-toolbars-contents">Word processor toolbar</div>' ),
				$containers.eq( 2 ).prepend( '<div class="demo-toolbars-contents">Word processor toolbar set to <code>position: &#39;bottom&#39;</code></div>' )
			)
			/* eslint-enable no-jquery/no-parse-html-literal */
	);
	for ( i = 0; i < toolbars.length; i++ ) {
		toolbars[ i ].initialize();
	}
};
