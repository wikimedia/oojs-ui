( function () {
	QUnit.module( 'ListToolGroup' );

	/**
	 * Build a toolbar with one collapsible list toolgroup
	 *
	 * @return {OO.ui.ListToolGroup} The toolgroup, with 'alpha' always shown and
	 *  'beta' and 'gamma' collapsible
	 */
	function createToolGroup() {
		const toolFactory = new OO.ui.ToolFactory();
		const toolGroupFactory = new OO.ui.ToolGroupFactory();

		[ 'alpha', 'beta', 'gamma' ].forEach( ( name ) => {
			function TestTool() {
				TestTool.super.apply( this, arguments );
			}
			OO.inheritClass( TestTool, OO.ui.Tool );
			TestTool.static.name = name;
			TestTool.static.title = name;
			TestTool.prototype.onSelect = function () {};
			TestTool.prototype.onUpdateState = function () {};
			toolFactory.register( TestTool );
		} );

		const toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
		toolbar.setup( [ {
			name: 'test',
			type: 'list',
			include: [ 'alpha', 'beta', 'gamma' ],
			forceExpand: [ 'alpha' ]
		} ] );
		toolbar.initialize();

		return toolbar.getToolGroupByName( 'test' );
	}

	QUnit.test( 'setExpanded', ( assert ) => {
		const toolGroup = createToolGroup();
		const events = [];
		toolGroup.on( 'expand', ( expanded ) => events.push( expanded ) );

		assert.strictEqual( toolGroup.expanded, false, 'Collapsed by default' );
		assert.deepEqual(
			toolGroup.collapsibleTools.map( ( tool ) => tool.isVisible() ),
			[ false, false ],
			'Collapsible tools are hidden'
		);

		toolGroup.setExpanded( true );

		assert.strictEqual( toolGroup.expanded, true, 'Expanded' );
		assert.deepEqual(
			toolGroup.collapsibleTools.map( ( tool ) => tool.isVisible() ),
			[ true, true ],
			'Collapsible tools are shown'
		);
		assert.deepEqual( events, [ true ], 'Event emitted' );

		toolGroup.setExpanded( true );

		assert.deepEqual( events, [ true ], 'No event when the state is unchanged' );

		toolGroup.setExpanded( false );

		assert.deepEqual( events, [ true, false ], 'Event emitted when collapsed again' );
	} );

	QUnit.test( 'more/fewer tool', ( assert ) => {
		const toolGroup = createToolGroup();
		const events = [];
		toolGroup.on( 'expand', ( expanded ) => events.push( expanded ) );

		toolGroup.getExpandCollapseTool().onSelect();

		assert.strictEqual( toolGroup.expanded, true, 'Expanded by the tool' );
		assert.deepEqual( events, [ true ], 'Event emitted for the user action' );

		toolGroup.getExpandCollapseTool().onSelect();

		assert.strictEqual( toolGroup.expanded, false, 'Collapsed by the tool' );
		assert.deepEqual( events, [ true, false ], 'Event emitted again' );
	} );
}() );
