<?php

namespace OOUI;

/**
 * Generic widget for buttons.
 */
class SelectFileInputWidget extends InputWidget {
	use IconElement;
	use IndicatorElement;
	use LabelElement;

	/* Static Properties */

	protected $accept, $placeholder;

	/**
	 * @param array $config Configuration options
	 *      - string[]|null $config['accept'] MIME types to accept. null accepts all types.
	 *  (default: null)
	 *      - string $config['placeholder'] Text to display when no file is selected.
	 *  and show a preview (for performance).
	 */
	public function __construct( array $config = [] ) {
		// Config initialization
		$config = array_merge( [
			'accept' => null,
			'placeholder' => null,
		], $config );

		// Parent constructor
		parent::__construct( $config );

		// Traits
		$this->initializeIconElement( $config );
		$this->initializeIndicatorElement( $config );
		$this->initializeLabelElement( $config );
		$this->initializeTitledElement( $config );

		// Properties
		$this->accept = $config['accept'];
		$this->placeholder = $config['placeholder'];

		$this->addClasses( [ 'oo-ui-selectFileWidget' ] );

		// Initialization
		$this->input->setAttributes( [
			'type' => 'file'
		] );
		if ( $this->accept ) {
			$this->input->setAttributes( [
				'accept' => implode( ',', $this->accept )
			] );
		}
	}

	public function getConfig( &$config ) {
		if ( $this->accept !== null ) {
			$config['accept'] = $this->accept;
		}
		if ( $this->placeholder !== null ) {
			$config['placeholder'] = $this->placeholder;
		}
		return parent::getConfig( $config );
	}
}
