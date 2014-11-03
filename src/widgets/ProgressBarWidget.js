/**
 * Progress bar widget.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number} [progress=0] Initial progress
 */
OO.ui.ProgressBarWidget = function OoUiProgressBarWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ProgressBarWidget.super.call( this, config );

	// Properties
	this.$bar = this.$( '<div>' );
	this.progress = null;

	// Initialization
	this.setProgress( config.progress || 0 );
	this.$bar.addClass( 'oo-ui-progressBarWidget-bar');
	this.$element
		.attr( {
			role: 'progressbar',
			'aria-valuemin': 0,
			'aria-valuemax': 100
		} )
		.addClass( 'oo-ui-progressBarWidget' )
		.append( this.$bar );
};

/* Setup */

OO.inheritClass( OO.ui.ProgressBarWidget, OO.ui.Widget );

/* Static Properties */

OO.ui.ProgressBarWidget.static.tagName = 'div';

/* Methods */

/**
 * Get progress percent
 *
 * @return {number} Progress percent
 */
OO.ui.ProgressBarWidget.prototype.getProgress = function () {
	return this.progress;
};

/**
 * Set progress percent
 *
 * @param {number} progress Progress percent
 */
OO.ui.ProgressBarWidget.prototype.setProgress = function ( progress ) {
	this.progress = progress;

	this.$bar.css( 'width', this.progress + '%' );
	this.$element.attr( 'aria-valuenow', this.progress );
};
