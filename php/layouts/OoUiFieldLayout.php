<?php

/**
 * Layout made of a field and optional label.
 *
 * Available label alignment modes include:
 *  - left: Label is before the field and aligned away from it, best for when the user will be
 *    scanning for a specific label in a form with many fields
 *  - right: Label is before the field and aligned toward it, best for forms the user is very
 *    familiar with and will tab through field checking quickly to verify which field they are in
 *  - top: Label is before the field and above it, best for when the user will need to fill out all
 *    fields from top to bottom in a form with few fields
 *  - inline: Label is after the field and aligned toward it, best for small boolean fields like
 *    checkboxes or radio buttons
 */
class OoUiFieldLayout extends OoUiLayout {
	/**
	 * Alignment.
	 *
	 * @var string
	 */
	protected $align;

	/**
	 * @param OoUiWidget $fieldWidget Field widget
	 * @param array $config Configuration options
	 * @param string $config['align'] Alignment mode, either 'left', 'right', 'top' or 'inline'
	 *   (default: 'left')
	 */
	public function __construct( OoUiWidget $fieldWidget, array $config = array() ) {
		// Config initialization
		$config = array_merge( array( 'align' => 'left' ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->field = new OoUiTag( 'div' );
		$this->fieldWidget = $fieldWidget;
		$this->help = ''; // TODO implement

		// Mixins
		$this->mixin( new OoUiLabelElement( $this, $config ) );

		// Initialization
		$this->addClasses( array( 'oo-ui-fieldLayout' ) );
		$this->field
			->addClasses( array( 'oo-ui-fieldLayout-field' ) )
			->toggleClasses( array( 'oo-ui-fieldLayout-disable' ), $fieldWidget->isDisabled() )
			->appendContent( $fieldWidget );

		$this->setAlignment( $config['align'] );
	}

	/**
	 * Get the field.
	 *
	 * @return OoUiWidget Field widget
	 */
	public function getField() {
		return $this->fieldWidget;
	}

	/**
	 * Set the field alignment mode.
	 *
	 * @param string $value Alignment mode, either 'left', 'right', 'top' or 'inline'
	 * @chainable
	 */
	protected function setAlignment( $value ) {
		if ( $value !== $this->align ) {
			// Default to 'left'
			if ( !in_array( $value, array( 'left', 'right', 'top', 'inline' ) ) ) {
				$value = 'left';
			}
			// Reorder elements
			$this->clearContent();
			if ( $value === 'inline' ) {
				$this->appendContent( $this->field, $this->label, $this->help );
			} else {
				$this->appendContent( $this->help, $this->label, $this->field );
			}
			// Set classes. The following classes can be used here:
			// * oo-ui-fieldLayout-align-left
			// * oo-ui-fieldLayout-align-right
			// * oo-ui-fieldLayout-align-top
			// * oo-ui-fieldLayout-align-inline
			if ( $this->align ) {
				$this->removeClasses( array( 'oo-ui-fieldLayout-align-' . $this->align ) );
			}
			$this->addClasses( array( 'oo-ui-fieldLayout-align-' . $value ) );
			$this->align = $value;
		}

		return $this;
	}
}
