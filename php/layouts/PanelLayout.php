<?php

namespace OOUI;

/**
 * Layout that expands to cover the entire area of its parent, with optional scrolling and padding.
 */
class PanelLayout extends Layout {
	/**
	 * @param array $config Configuration options
	 * @param boolean $config['scrollable'] Allow vertical scrolling (default: false)
	 * @param boolean $config['padded'] Pad the content from the edges (default: false)
	 * @param boolean $config['expanded'] Expand size to fill the entire parent element
	 *   (default: true)
	 */
	public function __construct( array $config = array() ) {
		// Config initialization
		$config = array_merge( array(
			'scrollable' => false,
			'padded' => false,
			'expanded' => true,
		), $config );

		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$this->addClasses( array( 'oo-ui-panelLayout' ) );
		if ( $config['scrollable'] ) {
			$this->addClasses( array( 'oo-ui-panelLayout-scrollable' ) );
		}
		if ( $config['padded'] ) {
			$this->addClasses( array( 'oo-ui-panelLayout-padded' ) );
		}
		if ( $config['expanded'] ) {
			$this->addClasses( array( 'oo-ui-panelLayout-expanded' ) );
		}
	}
}
