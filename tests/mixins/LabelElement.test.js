( function () {
	QUnit.module( 'LabelElement' );

	function TestElement( config ) {
		TestElement.parent.call( this, config );
		OO.ui.mixin.LabelElement.call( this, config );
	}
	OO.inheritClass( TestElement, OO.ui.Widget );
	OO.mixinClass( TestElement, OO.ui.mixin.LabelElement );

	QUnit.test( 'setHighlightedQuery', function ( assert ) {
		var i,
			element = new TestElement(),
			diacriticCompare = new Intl.Collator( 'en', { sensitivity: 'base' } ).compare,
			cases = [
				{
					msg: 'Simple substring',
					label: 'Foo',
					query: 'fo',
					expected: '<span class="oo-ui-labelElement-label-highlight">Fo</span>o'
				},
				{
					msg: 'No match',
					label: 'Foo',
					query: 'bar',
					expected: 'Foo'
				},
				{
					msg: 'Diacritic compare',
					label: 'Liberté, égalité, fraternité',
					query: 'Egalite',
					compare: diacriticCompare,
					expected: 'Liberté, <span class="oo-ui-labelElement-label-highlight">égalité</span>, fraternité'
				},
				{
					msg: 'Diacritic compare failure',
					label: 'Liberté, égalité, fraternité',
					query: 'Egalite',
					compare: null,
					expected: 'Liberté, égalité, fraternité'
				}
			];

		for ( i = 0; i < cases.length; i++ ) {
			element.setHighlightedQuery( cases[ i ].label, cases[ i ].query, cases[ i ].compare );
			assert.deepEqual( element.$label.html(), cases[ i ].expected, cases[ i ].msg );
		}
	} );
}() );
