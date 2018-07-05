<?php

namespace OOUI;

/**
 * Input widget with a number field.
 */
class NumberInputWidget extends TextInputWidget {

	protected $pageStep;
	protected $isInteger;
	protected $showButtons;

	/**
	 * @param array $config Configuration options
	 * @param int $config['placeholder'] Placeholder number
	 * @param bool $config['autofocus'] Ask the browser to focus this widget, using the 'autofocus'
	 *   HTML attribute (default: false)
	 * @param bool $config['readOnly'] Prevent changes (default: false)
	 * @param number $config['min'] Minimum input allowed
	 * @param number $config['max'] Maximum input allowed
	 * @param number $config['step'] Stepping delta (default: 1)
	 * @param number $config['pageStep'] Stepping delta (page-up and page-down)
	 * @param number $config['isInteger'] Only integers are allowed
	 * @param number $config['showButtons'] Show increment and decrement buttons (default: true)
	 * @param bool $config['required'] Mark the field as required.
	 *   Implies `indicator: 'required'`. Note that `false` & setting `indicator: 'required'
	 * @param-taint $config escapes_html
	 */
	public function __construct( array $config = [] ) {
		// Config initialization
		$config = array_merge( [
			'step' => 1
		], $config );

		$config['type'] = 'number';
		$config['multiline'] = false;

		// Parent constructor
		parent::__construct( $config );

		if ( isset( $config['min'] ) ) {
			$this->input->setAttributes( [ 'min' => $config['min'] ] );
		}

		if ( isset( $config['max'] ) ) {
			$this->input->setAttributes( [ 'max' => $config['max'] ] );
		}

		$this->input->setAttributes( [ 'step' => $config['step'] ] );

		if ( isset( $config['pageStep'] ) ) {
			$this->pageStep = $config['pageStep'];
		}

		if ( isset( $config['isInteger'] ) ) {
			$this->isInteger = $config['isInteger'];
		}

		if ( isset( $config['showButtons'] ) ) {
			$this->showButtons = $config['showButtons'];
		}

		$this->addClasses( [
			'oo-ui-numberInputWidget',
			'oo-ui-numberInputWidget-php',
		] );
	}

	public function getConfig( &$config ) {
		$min = $this->input->getAttribute( 'min' );
		if ( $min !== null ) {
			$config['min'] = $min;
		}
		$max = $this->input->getAttribute( 'max' );
		if ( $max !== null ) {
			$config['max'] = $max;
		}
		$config['step'] = $this->input->getAttribute( 'step' );
		if ( $this->pageStep !== null ) {
			$config['pageStep'] = $this->pageStep;
		}
		if ( $this->isInteger !== null ) {
			$config['isInteger'] = $this->isInteger;
		}
		if ( $this->showButtons !== null ) {
			$config['showButtons'] = $this->showButtons;
		}
		return parent::getConfig( $config );
	}
}
