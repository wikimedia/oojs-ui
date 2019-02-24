<?php

namespace OOUI;

/**
 * Input widget with a number field.
 */
class NumberInputWidget extends TextInputWidget {

	protected $buttonStep;
	protected $pageStep;
	protected $showButtons;

	/**
	 * @param array $config Configuration options
	 * @param int $config['placeholder'] Placeholder number
	 * @param bool $config['autofocus'] Ask the browser to focus this widget, using the 'autofocus'
	 *   HTML attribute (default: false)
	 * @param bool $config['readOnly'] Prevent changes (default: false)
	 * @param float $config['min'] Minimum input allowed
	 * @param float $config['max'] Maximum input allowed
	 * @param float|null $config['step'] If specified, the field only accepts values that are
	 *   multiples of this. (default: null)
	 * @param float $config['buttonStep'] Delta when using the buttons or Up/Down arrow keys.
	 *   Defaults to `step` if specified, otherwise `1`.
	 * @param float $config['pageStep'] Delta when using the Page-up/Page-down keys.
	 *   Defaults to 10 times `buttonStep`.
	 * @param bool $config['showButtons'] Show increment and decrement buttons (default: true)
	 * @param bool $config['required'] Mark the field as required.
	 *   Implies `indicator: 'required'`. Note that `false` & setting `indicator: 'required'
	 * @param-taint $config escapes_html
	 */
	public function __construct( array $config = [] ) {
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

		$this->input->setAttributes( [ 'step' => $config['step'] ?? 'any' ] );

		if ( isset( $config['buttonStep'] ) ) {
			$this->buttonStep = $config['buttonStep'];
		}
		if ( isset( $config['pageStep'] ) ) {
			$this->pageStep = $config['pageStep'];
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
		$step = $this->input->getAttribute( 'step' );
		if ( $step !== 'any' ) {
			$config['step'] = $step;
		}
		if ( $this->pageStep !== null ) {
			$config['pageStep'] = $this->pageStep;
		}
		if ( $this->buttonStep !== null ) {
			$config['buttonStep'] = $this->buttonStep;
		}
		if ( $this->showButtons !== null ) {
			$config['showButtons'] = $this->showButtons;
		}
		return parent::getConfig( $config );
	}
}
