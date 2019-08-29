/**
 * LabelElement is often mixed into other classes to generate a label, which
 * helps identify the function of an interface element.
 * See the [OOUI documentation on MediaWiki] [1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Icons,_Indicators,_and_Labels#Labels
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$label] The label element created by the class. If this
 *  configuration is omitted, the label element will use a generated `<span>`.
 * @cfg {jQuery|string|Function|OO.ui.HtmlSnippet} [label] The label text. The label can be
 *  specified as a plaintext string, a jQuery selection of elements, or a function that will
 *  produce a string in the future. See the [OOUI documentation on MediaWiki] [2] for examples.
 *  [2]: https://www.mediawiki.org/wiki/OOUI/Widgets/Icons,_Indicators,_and_Labels#Labels
 * @cfg {boolean} [invisibleLabel] Whether the label should be visually hidden (but still
 *  accessible to screen-readers).
 */
OO.ui.mixin.LabelElement = function OoUiMixinLabelElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$label = null;
	this.label = null;
	this.invisibleLabel = null;

	// Initialization
	this.setLabel( config.label || this.constructor.static.label );
	this.setLabelElement( config.$label || $( '<span>' ) );
	this.setInvisibleLabel( config.invisibleLabel );
};

/* Setup */

OO.initClass( OO.ui.mixin.LabelElement );

/* Events */

/**
 * @event labelChange
 * @param {string} value
 */

/* Static Properties */

/**
 * The label text. The label can be specified as a plaintext string, a function that will
 * produce a string in the future, or `null` for no label. The static value will
 * be overridden if a label is specified with the #label config option.
 *
 * @static
 * @inheritable
 * @property {string|Function|null}
 */
OO.ui.mixin.LabelElement.static.label = null;

/* Static methods */

/**
 * Highlight the first occurrence of the query in the given text
 *
 * @param {string} text Text
 * @param {string} query Query to find
 * @param {Function} [compare] Optional string comparator, e.g. Intl.Collator().compare
 * @param {boolean} [combineMarks=false] Pull combining marks into highlighted text
 * @return {jQuery} Text with the first match of the query
 *  sub-string wrapped in highlighted span
 */
OO.ui.mixin.LabelElement.static.highlightQuery = function ( text, query, compare, combineMarks ) {
	var i, tLen, qLen,
		offset = -1,
		$result = $( '<span>' ),
		comboLength = 0,
		comboMarks = '',
		comboRegex,
		comboMatch;

	if ( compare ) {
		tLen = text.length;
		qLen = query.length;
		for ( i = 0; offset === -1 && i <= tLen - qLen; i++ ) {
			if ( compare( query, text.slice( i, i + qLen ) ) === 0 ) {
				offset = i;
			}
		}
	} else {
		offset = text.toLowerCase().indexOf( query.toLowerCase() );
	}

	if ( !query.length || offset === -1 ) {
		$result.text( text );
	} else {
		// Look for combining characters after the match
		if ( combineMarks ) {
			// Equivalent to \p{Mark} (which is not currently available in JavaScript)
			comboMarks = '[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]';

			comboRegex = new RegExp( '(^)' + comboMarks + '*' );
			comboMatch = text.slice( offset + query.length ).match( comboRegex );

			if ( comboMatch && comboMatch.length ) {
				comboLength = comboMatch[ 0 ].length;
			}
		}

		$result.append(
			document.createTextNode( text.slice( 0, offset ) ),
			$( '<span>' )
				.addClass( 'oo-ui-labelElement-label-highlight' )
				.text( text.slice( offset, offset + query.length + comboLength ) ),
			document.createTextNode( text.slice( offset + query.length + comboLength ) )
		);
	}
	return $result.contents();
};

/* Methods */

/**
 * Set the label element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $label Element to use as label
 */
OO.ui.mixin.LabelElement.prototype.setLabelElement = function ( $label ) {
	if ( this.$label ) {
		this.$label.removeClass( 'oo-ui-labelElement-label' ).empty();
	}

	this.$label = $label.addClass( 'oo-ui-labelElement-label' );
	this.setLabelContent( this.label );
};

/**
 * Set the label.
 *
 * An empty string will result in the label being hidden. A string containing only whitespace will
 * be converted to a single `&nbsp;`.
 *
 * @param {jQuery|string|OO.ui.HtmlSnippet|Function|null} label Label nodes; text; a function that
 *  returns nodes or text; or null for no label
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LabelElement.prototype.setLabel = function ( label ) {
	label = typeof label === 'function' ? OO.ui.resolveMsg( label ) : label;
	label = ( ( typeof label === 'string' || label instanceof $ ) && label.length ) || ( label instanceof OO.ui.HtmlSnippet && label.toString().length ) ? label : null;

	if ( this.label !== label ) {
		if ( this.$label ) {
			this.setLabelContent( label );
		}
		this.label = label;
		this.emit( 'labelChange' );
	}

	this.$element.toggleClass( 'oo-ui-labelElement', !!this.label && !this.invisibleLabel );

	return this;
};

/**
 * Set whether the label should be visually hidden (but still accessible to screen-readers).
 *
 * @param {boolean} invisibleLabel
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LabelElement.prototype.setInvisibleLabel = function ( invisibleLabel ) {
	invisibleLabel = !!invisibleLabel;

	if ( this.invisibleLabel !== invisibleLabel ) {
		this.invisibleLabel = invisibleLabel;
		this.emit( 'labelChange' );
	}

	this.$label.toggleClass( 'oo-ui-labelElement-invisible', this.invisibleLabel );
	// Pretend that there is no label, a lot of CSS has been written with this assumption
	this.$element.toggleClass( 'oo-ui-labelElement', !!this.label && !this.invisibleLabel );

	return this;
};

/**
 * Set the label as plain text with a highlighted query
 *
 * @param {string} text Text label to set
 * @param {string} query Substring of text to highlight
 * @param {Function} [compare] Optional string comparator, e.g. Intl.Collator().compare
 * @param {boolean} [combineMarks=false] Pull combining marks into highlighted text
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LabelElement.prototype.setHighlightedQuery = function (
	text, query, compare, combineMarks
) {
	return this.setLabel(
		this.constructor.static.highlightQuery( text, query, compare, combineMarks )
	);
};

/**
 * Get the label.
 *
 * @return {jQuery|string|Function|null} Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 */
OO.ui.mixin.LabelElement.prototype.getLabel = function () {
	return this.label;
};

/**
 * Set the content of the label.
 *
 * Do not call this method until after the label element has been set by #setLabelElement.
 *
 * @private
 * @param {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 */
OO.ui.mixin.LabelElement.prototype.setLabelContent = function ( label ) {
	if ( typeof label === 'string' ) {
		if ( label.match( /^\s*$/ ) ) {
			// Convert whitespace only string to a single non-breaking space
			this.$label.html( '&nbsp;' );
		} else {
			this.$label.text( label );
		}
	} else if ( label instanceof OO.ui.HtmlSnippet ) {
		this.$label.html( label.toString() );
	} else if ( label instanceof $ ) {
		this.$label.empty().append( label );
	} else {
		this.$label.empty();
	}
};
