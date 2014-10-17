<?php

class OoUiFlaggedElement extends OoUiElementMixin {
	/**
	 * Flags.
	 *
	 * @var string
	 */
	protected $flags = array();

	public static $targetPropertyName = 'flagged';

	/**
	 * Mixin flagged element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string|string[] $config['flags'] Flags
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		$target = isset( $config['flagged'] ) ? $config['flagged'] : $element;
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->setFlags( isset( $config['flags'] ) ? $config['flags'] : null );
	}

	/**
	 * Check if a flag is set.
	 *
	 * @param string $flag Name of flag
	 * @return boolean Has flag
	 */
	public function hasFlag( $flag ) {
		return isset( $this->flags[$flag] );
	}

	/**
	 * Get the names of all flags set.
	 *
	 * @return array Flag names
	 */
	public function getFlags() {
		return array_keys( $this->flags );
	}

	/**
	 * Clear all flags.
	 *
	 * @chainable
	 */
	public function clearFlags() {
		$remove = array();
		$classPrefix = 'oo-ui-flaggedElement-';

		foreach ( $this->flags as $flag ) {
			$remove[] = $classPrefix . $flag;
		}

		$this->target->removeClasses( $remove );
		$this->flags = array();

		return $this;
	}

	/**
	 * Add one or more flags.
	 *
	 * @param string|array One or more flags to add, or an array keyed by flag name
	 *   containing boolean set/remove instructions.
	 * @chainable
	 */
	public function setFlags( $flags ) {
		$add = array();
		$remove = array();
		$classPrefix = 'oo-ui-flaggedElement-';

		if ( is_string( $flags ) ) {
			// Set
			if ( !isset( $this->flags[$flags] ) ) {
				$this->flags[$flags] = true;
				$add[] = $classPrefix . $flags;
			}
		} elseif ( is_array( $flags ) ) {
			foreach ( $flags as $key => $value ) {
				if ( is_numeric( $key ) ) {
					// Set
					if ( !isset( $this->flags[$value] ) ) {
						$this->flags[$value] = true;
						$add[] = $classPrefix . $value;
					}
				} else {
					if ( $value ) {
						// Set
						if ( !isset( $this->flags[$key] ) ) {
							$this->flags[$key] = true;
							$add[] = $classPrefix . $key;
						}
					} else {
						// Remove
						if ( isset( $this->flags[$key] ) ) {
							unset( $this->flags[$key] );
							$remove[] = $classPrefix . $key;
						}
					}
				}
			}
		}

		$this->target
			->addClasses( $add )
			->removeClasses( $remove );

		return $this;
	}
}
