<?php

/**
 * Layout with an HTML form.
 */
class OoUiFormLayout extends OoUiLayout {

	/* Static properties */

	public static $tagName = 'form';

	/**
	 * @param array $config Configuration options
	 * @param string $config['method'] HTML form `method` attribute
	 * @param string $config['action'] HTML form `action` attribute
	 * @param string $config['enctype'] HTML form `enctype` attribute
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$attributeWhitelist = array( 'method', 'action', 'enctype' );
		$this
			->addClasses( array( 'oo-ui-formLayout' ) )
			->setAttributes( array_intersect_key( $config, array_flip( $attributeWhitelist ) ) );
	}
}
