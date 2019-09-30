<?php

namespace OOUI;

class TabOptionWidget extends OptionWidget {

	/**
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Initialisation
		$this->addClasses( [ 'oo-ui-tabOptionWidget' ] );
		$this->setAttributes( [
			'role' => 'tab'
		] );
	}
}
