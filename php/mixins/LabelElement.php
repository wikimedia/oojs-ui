<?php

namespace OOUI;

/**
 * Element containing a label.
 *
 * @abstract
 */
class LabelElement extends ElementMixin {
	/**
	 * Label value.
	 *
	 * @var string|HtmlSnippet|null
	 */
	protected $labelValue = null;

	public static $targetPropertyName = 'label';

	/**
	 * @param Element $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string|HtmlSnippet $config['label'] Label text
	 */
	public function __construct( Element $element, array $config = [] ) {
		// Parent constructor
		// FIXME 'labelElement' is a very stupid way to call '$label'
		$target = isset( $config['labelElement'] ) ? $config['labelElement'] : new Tag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( [ 'oo-ui-labelElement-label' ] );
		$this->setLabel( isset( $config['label'] ) ? $config['label'] : null );
	}

	/**
	 * Set the label.
	 *
	 * An empty string will result in the label being hidden. A string containing only whitespace will
	 * be converted to a single `&nbsp;`.
	 *
	 * @param string|HtmlSnippet|null $label Label text
	 * @return $this
	 */
	public function setLabel( $label ) {
		$this->labelValue = (string)$label ? $label : null;

		$this->target->clearContent();
		if ( $this->labelValue !== null ) {
			if ( is_string( $this->labelValue ) && $this->labelValue !== ''
				&& trim( $this->labelValue ) === ''
			) {
				$this->target->appendContent( new HtmlSnippet( '&nbsp;' ) );
			} else {
				$this->target->appendContent( $label );
			}
		}

		$this->element->toggleClasses( [ 'oo-ui-labelElement' ], !!$this->labelValue );

		return $this;
	}

	/**
	 * Get the label.
	 *
	 * @return string|HtmlSnippet|null Label text
	 */
	public function getLabel() {
		return $this->labelValue;
	}

	public function getConfig( &$config ) {
		if ( $this->labelValue !== null ) {
			$config['label'] = $this->labelValue;
		}
		return parent::getConfig( $config );
	}
}
