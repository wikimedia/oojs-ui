( function () {
	QUnit.module( 'PopupToolGroup' );

	/**
	 * Build a toolbar with one popup toolgroup
	 *
	 * @param {Array} promoteToBar See OO.ui.PopupToolGroup's `promoteToBar` config option
	 * @param {number} count Number of tools to promote, see OO.ui.Toolbar#getPromotedToolCount
	 * @return {OO.ui.ListToolGroup} The toolgroup, with tools 'alpha', 'beta' and 'gamma'
	 */
	function createToolGroup( promoteToBar, count ) {
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
		toolbar.getPromotedToolCount = () => count;
		toolbar.setup( [ {
			name: 'test',
			type: 'list',
			include: [ 'alpha', 'beta', 'gamma' ],
			promoteToBar: promoteToBar
		} ] );
		toolbar.updatePromotedTools();

		return toolbar.getToolGroupByName( 'test' );
	}

	QUnit.test( 'updatePromotedTools', ( assert ) => {
		[
			{
				msg: 'Tools are promoted up to the count',
				promoteToBar: [ 'alpha', 'beta', 'gamma' ],
				count: 1,
				expected: [ 'alpha' ]
			},
			{
				msg: 'A single tool left in the popup is promoted too',
				promoteToBar: [ 'alpha', 'beta', 'gamma' ],
				count: 2,
				expected: [ 'alpha', 'beta', 'gamma' ]
			},
			{
				msg: 'Nothing is promoted if no room and several tools in the popup',
				promoteToBar: [ 'alpha', 'beta', 'gamma' ],
				count: 0,
				expected: []
			},
			{
				msg: 'A single tool left that cannot be promoted stays in the popup',
				promoteToBar: [ 'alpha', 'beta' ],
				count: 2,
				expected: [ 'alpha', 'beta' ]
			},
			{
				msg: 'Sets are still only promoted whole',
				promoteToBar: [ 'alpha', [ 'beta', 'gamma' ] ],
				count: 2,
				expected: [ 'alpha' ]
			}
		].forEach( ( { msg, promoteToBar, count, expected } ) => {
			const toolGroup = createToolGroup( promoteToBar, count );
			assert.deepEqual(
				toolGroup.getPromotedTools().map( ( tool ) => tool.getName() ),
				expected,
				msg
			);
			assert.strictEqual(
				toolGroup.$element.hasClass( 'oo-ui-popupToolGroup-allToolsPromoted' ),
				expected.length === 3,
				msg + ': toolgroup is hidden if all tools are promoted'
			);
		} );
	} );
}() );
