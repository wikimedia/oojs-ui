<?php

class OoUiButtonElement extends OoUiElementMixin {
	/**
	 * Button is framed.
	 *
	 * @var boolean
	 */
	protected $framed = false;

	public static $targetPropertyName = 'button';

	/**
	 * Mixin button element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param {boolean} $config['framed'] Render button with a frame
	 * @param {number} $config['tabIndex'] Button's tab index, use -1 to prevent tab focusing
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		$target = isset( $config['button'] ) ? $config['button'] : new OoUiTag( 'a' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->element->addClasses( array( 'oo-ui-buttonElement' ) );
		$this->target->addClasses( array( 'oo-ui-buttonElement-button' ) );
		$this->toggleFramed( isset( $config['framed'] ) ? $config['framed'] : true );
		$this->target->setAttributes( array(
			'role' => 'button',
			'tabIndex' => isset( $config['tabIndex'] ) &&
				is_numeric( $config['tabIndex'] ) ? $config['tabIndex'] : 0
		) );
	}

	/**
	 * Toggle frame.
	 *
	 * @param boolean [framed] Make button framed, omit to toggle
	 * @chainable
	 */
	public function toggleFramed( $framed = null ) {
		$this->framed = $framed !== null ? !!$framed : !$this->framed;
		$this->element->toggleClasses( array( 'oo-ui-buttonElement-framed' ), $this->framed );
		$this->element->toggleClasses( array( 'oo-ui-buttonElement-frameless' ), !$this->framed );
	}

	/**
	 * Check if button is framed.
	 *
	 * @return boolean Button is framed
	 */
	public function isFramed() {
		return $this->framed;
	}

	/**
	 * Set tab index.
	 *
	 * @param number|null $tabIndex Button's tab index, use null to remove
	 * @chainable
	 */
	public function setTabIndex( $tabIndex ) {
		$tabIndex = is_numeric( $tabIndex ) && $tabIndex >= 0 ? $tabIndex : null;

		if ( $this->tabIndex !== $tabIndex ) {
			if ( $tabIndex !== null ) {
				$this->target->setAttributes( array( 'tabindex' => $tabIndex ) );
			} else {
				$this->target->removeAttributes( array( 'tabindex' ) );
			}
			$this->tabIndex = $tabIndex;
		}

		return $this;
	}

	/**
	 * Set access key.
	 *
	 * @param string $accessKey Button's access key, use empty string to remove
	 * @chainable
	 */
	public function setAccessKey( $accessKey ) {
		$accessKey = is_string( $accessKey ) && strlen( $accessKey ) ? $accessKey : null;

		if ( $this->accessKey !== $accessKey ) {
			if ( $accessKey !== null ) {
				$this->target->setAttributes( array( 'accesskey' => $accessKey ) );
			} else {
				$this->target->removeAttributes( array( 'accesskey' ) );
			}
			$this->accessKey = $accessKey;
		}

		return $this;
	}
}
