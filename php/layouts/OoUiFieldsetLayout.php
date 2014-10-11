<?php

class OoUiFieldsetLayout extends OoUiLayout {
	/**
	 * Alignment.
	 *
	 * @var string
	 */
	protected $align;

	/**
	 * Create fieldset layout.
	 *
	 * @param array $config Configuration options
	 * @param OoUiFieldLayout $config['items'] Items to add
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiIconElement( $this, $config ) );
		$this->mixin( new OoUiLabelElement( $this, $config ) );
		$this->mixin( new OoUiGroupElement( $this, $config ) );

		// Initialization
		$this
			->addClasses( array( 'oo-ui-fieldsetLayout' ) )
			->prependContent( $this->icon, $this->label, $this->group );
		if ( isset( $config['items'] ) ) {
			$this->addItems( $config['items'] );
		}
	}
}
