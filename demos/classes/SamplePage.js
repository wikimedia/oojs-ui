Demo.SamplePage = function DemoSamplePage( name, config ) {
	config = $.extend( { label: 'Sample page' }, config );
	Demo.SamplePage.super.apply( this, arguments );
	this.label = config.label;
	this.level = config.level;
	this.icon = config.icon;
	if ( this.$element.is( ':empty' ) ) {
		this.$element.text( this.label );
	}
};
OO.inheritClass( Demo.SamplePage, OO.ui.PageLayout );
Demo.SamplePage.prototype.setupOutlineItem = function () {
	Demo.SamplePage.super.prototype.setupOutlineItem.call( this );
	this.outlineItem
		.setMovable( true )
		.setRemovable( true )
		.setIcon( this.icon )
		.setLevel( this.level )
		.setLabel( this.label );
};
