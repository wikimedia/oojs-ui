<?php

class OoUiFieldLayout extends OoUiLayout {
	/**
	 * Alignment.
	 *
	 * @var string
	 */
	protected $align;

	/**
	 * Create field layout.
	 *
	 * @param OoUiWidget $fieldWidget Field widget
	 * @param array $config Configuration options
	 * @param string $config['align'] Alignment mode, either 'left', 'right', 'top' or 'inline'
	 * @param string $config['help'] Explanatory text shown as a '?' icon (not implemented).
	 */
	public function __construct( OoUiWidget $fieldWidget, array $config = array() ) {
		// Config initialization
		$config = array_merge( array( 'align' => 'left' ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->field = new OoUiTag( 'div' );
		$this->fieldWidget = $fieldWidget;
		$this->help = ""; // TODO implement

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
