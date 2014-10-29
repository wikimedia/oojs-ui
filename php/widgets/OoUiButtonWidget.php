<?php

/**
 * Generic widget for buttons.
 */
class OoUiButtonWidget extends OoUiWidget {

	/**
	 * Hyperlink to visit when clicked.
	 *
	 * @var string
	 */
	protected $href = null;

	/**
	 * Target to open hyperlink in.
	 *
	 * @var string
	 */
	protected $target = null;

	/**
	 * @param array $config Configuration options
	 * @param string $config['href'] Hyperlink to visit when clicked
	 * @param string $config['target'] Target to open hyperlink in
	 */
	public function __construct( array $config = array() ) {
		// Configuration initialization
		$config = array_merge( array( 'target' => '_blank' ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiButtonElement( $this, $config ) );
		$this->mixin( new OoUiIconElement( $this, $config ) );
		$this->mixin( new OoUiIndicatorElement( $this, $config ) );
		$this->mixin( new OoUiLabelElement( $this, $config ) );
		$this->mixin( new OoUiTitledElement( $this,
			array_merge( $config, array( 'titled' => $this->button ) ) ) );
		$this->mixin( new OoUiFlaggedElement( $this, $config ) );

		// Initialization
		$this->button->appendContent( $this->icon, $this->label, $this->indicator );
		$this
			->addClasses( array( 'oo-ui-buttonWidget' ) )
			->appendContent( $this->button );

		$this->setHref( isset( $config['href'] ) ? $config['href'] : null );
		$this->setTarget( $config['target'] );
	}

	/**
	 * Get hyperlink location.
	 *
	 * @return string Hyperlink location
	 */
	public function getHref() {
		return $this->href;
	}

	/**
	 * Get hyperlink target.
	 *
	 * @return string Hyperlink target
	 */
	public function getTarget() {
		return $this->target;
	}

	/**
	 * Set hyperlink location.
	 *
	 * @param string|null $href Hyperlink location, null to remove
	 */
	public function setHref( $href ) {
		$this->href = is_string( $href ) ? $href : null;

		if ( $href !== null ) {
			$this->button->setAttributes( array( 'href' => $href ) );
		} else {
			$this->button->removeAttributes( array( 'href' ) );
		}

		return $this;
	}

	/**
	 * Set hyperlink target.
	 *
	 * @param string|null $target Hyperlink target, null to remove
	 */
	public function setTarget( $target ) {
		$this->target = is_string( $target ) ? $target : null;

		if ( $target !== null ) {
			$this->button->setAttributes( array( 'target' => $target ) );
		} else {
			$this->button->removeAttributes( array( 'target' ) );
		}

		return $this;
	}
}
