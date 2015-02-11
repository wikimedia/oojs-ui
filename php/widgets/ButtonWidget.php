<?php

namespace OOUI;

/**
 * Generic widget for buttons.
 */
class ButtonWidget extends Widget {

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
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new ButtonElement( $this, $config ) );
		$this->mixin( new IconElement( $this, $config ) );
		$this->mixin( new IndicatorElement( $this, $config ) );
		$this->mixin( new LabelElement( $this, $config ) );
		$this->mixin( new TitledElement( $this,
			array_merge( $config, array( 'titled' => $this->button ) ) ) );
		$this->mixin( new FlaggedElement( $this, $config ) );
		$this->mixin( new TabIndexedElement( $this,
			array_merge( $config, array( 'tabIndexed' => $this->button ) ) ) );

		// Initialization
		$this->button->appendContent( $this->icon, $this->label, $this->indicator );
		$this
			->addClasses( array( 'oo-ui-buttonWidget' ) )
			->appendContent( $this->button );

		$this->setHref( isset( $config['href'] ) ? $config['href'] : null );
		$this->setTarget( isset( $config['target'] ) ? $config['target'] : null );
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

		if ( $this->href !== null ) {
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

		if ( $this->target !== null ) {
			$this->button->setAttributes( array( 'target' => $target ) );
		} else {
			$this->button->removeAttributes( array( 'target' ) );
		}

		return $this;
	}
}
