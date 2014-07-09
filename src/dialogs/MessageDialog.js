/**
 * Dialog for showing a message.
 *
 * User interface:
 * - Registers two actions by default (safe and primary).
 * - Renders action widgets in the footer.
 *
 * @class
 * @extends OO.ui.Dialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.MessageDialog = function OoUiMessageDialog( manager, config ) {
	// Parent constructor
	OO.ui.MessageDialog.super.call( this, manager, config );

	// Properties
	this.verticalActionLayout = null;

	// Initialization
	this.$element.addClass( 'oo-ui-messageDialog' );
};

/* Inheritance */

OO.inheritClass( OO.ui.MessageDialog, OO.ui.Dialog );

/* Static Properties */

OO.ui.MessageDialog.static.name = 'message';

OO.ui.MessageDialog.static.size = 'small';

OO.ui.MessageDialog.static.verbose = false;

/**
 * Dialog title.
 *
 * A confirmation dialog's title should describe what the progressive action will do. An alert
 * dialog's title should describe what event occured.
 *
 * @static
 * inheritable
 * @property {jQuery|string|Function|null}
 */
OO.ui.MessageDialog.static.title = null;

/**
 * A confirmation dialog's message should describe the consequences of the progressive action. An
 * alert dialog's message should describe why the event occured.
 *
 * @static
 * inheritable
 * @property {jQuery|string|Function|null}
 */
OO.ui.MessageDialog.static.message = null;

OO.ui.MessageDialog.static.actions = [
	{ 'label': OO.ui.deferMsg( 'ooui-dialog-message-accept' ), 'flags': 'primary' },
	{ 'label': OO.ui.deferMsg( 'ooui-dialog-message-reject' ), 'flags': 'safe' }
];

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.onActionResize = function ( action ) {
	this.fitActions();
	return OO.ui.ProcessDialog.super.prototype.onActionResize.call( this, action );
};

/**
 * Toggle action layout between vertical and horizontal.
 *
 * @param {boolean} [value] Layout actions vertically, omit to toggle
 * @chainable
 */
OO.ui.MessageDialog.prototype.toggleVerticalActionLayout = function ( value ) {
	value = value === undefined ? !this.verticalActionLayout : !!value;

	if ( value !== this.verticalActionLayout ) {
		this.verticalActionLayout = value;
		this.$actions
			.toggleClass( 'oo-ui-messageDialog-actions-vertical', value )
			.toggleClass( 'oo-ui-messageDialog-actions-horizontal', !value );
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getActionProcess = function ( action ) {
	if ( action ) {
		return new OO.ui.Process( function () {
			this.close( { 'action': action } );
		}, this );
	}
	return OO.ui.MessageDialog.super.prototype.getActionProcess.call( this, action );
};

/**
 * @inheritdoc
 *
 * @param {Object} [data] Dialog opening data
 * @param {jQuery|string|Function|null} [data.title] Description of the action being confirmed
 * @param {jQuery|string|Function|null} [data.message] Description of the action's consequence
 * @param {boolean} [data.verbose] Message is verbose and should be styled as a long message
 * @param {Object[]} [data.actions] List of OO.ui.ActionOptionWidget configuration options for each
 *   action item
 */
OO.ui.MessageDialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};

	// Parent method
	return OO.ui.MessageDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			this.title.setLabel(
				data.title !== undefined ? data.title : this.constructor.static.title
			);
			this.message.setLabel(
				data.message !== undefined ? data.message : this.constructor.static.message
			);
			this.message.$element.toggleClass(
				'oo-ui-messageDialog-message-verbose',
				data.verbose !== undefined ? data.verbose : this.constructor.static.verbose
			);
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getBodyHeight = function () {
	return Math.round( this.text.$element.outerHeight( true ) );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.initialize = function () {
	// Parent method
	OO.ui.MessageDialog.super.prototype.initialize.call( this );

	// Properties
	this.$actions = this.$( '<div>' );
	this.container = new OO.ui.PanelLayout( {
		'$': this.$, 'scrollable': true, 'classes': [ 'oo-ui-messageDialog-container' ]
	} );
	this.text = new OO.ui.PanelLayout( {
		'$': this.$, 'padded': true, 'classes': [ 'oo-ui-messageDialog-text' ]
	} );
	this.message = new OO.ui.LabelWidget( {
		'$': this.$, 'classes': [ 'oo-ui-messageDialog-message' ]
	} );

	// Initialization
	this.title.$element.addClass( 'oo-ui-messageDialog-title' );
	this.frame.$content.addClass( 'oo-ui-messageDialog-content' );
	this.container.$element.append( this.text.$element );
	this.text.$element.append( this.title.$element, this.message.$element );
	this.$body.append( this.container.$element );
	this.$actions.addClass( 'oo-ui-messageDialog-actions' );
	this.$foot.append( this.$actions );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.attachActions = function () {
	var i, len, other, special, others;

	// Parent method
	OO.ui.MessageDialog.super.prototype.attachActions.call( this );

	special = this.actions.getSpecial();
	others = this.actions.getOthers();
	if ( special.safe ) {
		this.$actions.append( special.safe.$element );
		special.safe.toggleFramed( false );
	}
	if ( others.length ) {
		for ( i = 0, len = others.length; i < len; i++ ) {
			other = others[i];
			this.$actions.append( other.$element );
			other.toggleFramed( false );
		}
	}
	if ( special.primary ) {
		this.$actions.append( special.primary.$element );
		special.primary.toggleFramed( false );
	}

	this.fitActions();
	if ( !this.isOpening() ) {
		this.manager.updateWindowSize( this );
	}
	this.$body.css( 'bottom', this.$foot.outerHeight( true ) );
};

/**
 * Fit action actions into columns or rows.
 *
 * Columns will be used if all labels can fit without overflow, otherwise rows will be used.
 */
OO.ui.MessageDialog.prototype.fitActions = function () {
	var i, len, action,
		actions = this.actions.get();

	// Detect clipping
	this.toggleVerticalActionLayout( false );
	for ( i = 0, len = actions.length; i < len; i++ ) {
		action = actions[i];
		if ( action.$element.innerWidth() < action.$label.outerWidth( true ) ) {
			this.toggleVerticalActionLayout( true );
			break;
		}
	}
};
