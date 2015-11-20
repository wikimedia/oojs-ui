<?php

namespace OOUI;

/**
 * Combo box input widget, wrapping a text input with `<datalist>`. Intended to be used within a
 * OO.ui.FormLayout.
 */
class ComboBoxInputWidget extends TextInputWidget {

	/**
	 * HTML `<option>` tags for this widget.
	 * @var Tag[]
	 */
	protected $options = array();

	/**
	 * @param array $config Configuration options
	 * @param array[] $config['options'] Array of menu options in the format
	 *   `array( 'data' => …, 'label' => … )`
	 */
	public function __construct( array $config = array() ) {
		// Config initialization
		$config = array_merge( array(
			'indicator' => 'down',
		), $config );

		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new TitledElement( $this,
			array_merge( $config, array( 'titled' => $this->input ) ) ) );

		// Initialization
		$this->datalist = new Tag( 'datalist' );
		$this->datalist->ensureInfusableId();
		$this->input->setAttributes( array( 'list' => $this->datalist->getAttribute( 'id' ) ) );

		$this->setOptions( isset( $config['options'] ) ? $config['options'] : array() );
		$this->addClasses( array( 'oo-ui-comboBoxInputWidget', 'oo-ui-comboBoxInputWidget-php' ) );
		$this->appendContent( $this->datalist );
	}

	/**
	 * Set the options available for this input.
	 *
	 * @param array[] $options Array of menu options in the format
	 *   `array( 'data' => …, 'label' => … )`
	 * @return $this
	 */
	public function setOptions( $options ) {
		$this->options = array();

		$this->datalist->clearContent();
		foreach ( $options as $opt ) {
			$option = new Tag( 'option' );
			$option->setAttributes( array( 'value' => $opt['data'] ) );
			$option->appendContent( isset( $opt['label'] ) ? $opt['label'] : $opt['data'] );

			$this->options[] = $option;
			$this->datalist->appendContent( $option );
		}

		return $this;
	}

	public function getConfig( &$config ) {
		$o = array();
		foreach ( $this->options as $option ) {
			$label = $option->content[0];
			$data = $option->getAttribute( 'value' );
			$o[] = array( 'data' => $data, 'label' => $label );
		}
		$config['options'] = $o;
		return parent::getConfig( $config );
	}
}
