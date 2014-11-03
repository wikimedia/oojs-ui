<?php

namespace OOUI;

/**
 * Element containing a label.
 */
class LabelElement extends ElementMixin {
	/**
	 * Label value.
	 *
	 * @var string|null
	 */
	protected $label = null;

	public static $targetPropertyName = 'label';

	/**
	 * @param Element $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['label'] Label text
	 */
	public function __construct( Element $element, array $config = array() ) {
		// Parent constructor
		// FIXME 'labelElement' is a very stupid way to call '$label'
		$target = isset( $config['labelElement'] ) ? $config['labelElement'] : new Tag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( array( 'oo-ui-labelElement-label' ) );
		$this->setLabel( isset( $config['label'] ) ? $config['label'] : null );
	}

	/**
	 * Set the label.
	 *
	 * An empty string will result in the label being hidden. A string containing only whitespace will
	 * be converted to a single `&nbsp;`.
	 *
	 * @param string|null $label Label text
	 * @chainable
	 */
	public function setLabel( $label ) {
		$this->label = is_string( $label ) ? $label : null;

		$this->target->clearContent();
		if ( $this->label !== null ) {
			if ( $this->label !== '' && trim( $this->label ) === '' ) {
				$this->target->appendContent( new HtmlSnippet( '&nbsp;' ) );
			} else {
				$this->target->appendContent( $label );
			}
		}

		$this->target->setAttributes( !$label ? array( 'style' => 'display: none;' ) : array() );
		$this->element->toggleClasses( array( 'oo-ui-labelElement' ), !!$this->label );

		return $this;
	}

	/**
	 * Get the label.
	 *
	 * @return string Label text
	 */
	public function getLabel() {
		return $this->label;
	}
}
