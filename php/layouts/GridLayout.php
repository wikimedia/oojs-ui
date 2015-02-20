<?php

namespace OOUI;

/**
 * Layout made of proportionally sized columns and rows.
 *
 * @deprecated
 */
class GridLayout extends Layout {

	/* Properties */

	/**
	 * Panels in the grid.
	 *
	 * @var PanelLayout[]
	 */
	protected $panels = array();

	/**
	 * Widths of columns as ratios that sum to 1.0.
	 *
	 * @var number[]
	 */
	protected $widths = array();

	/**
	 * Heights of rows as ratios that sum to 1.0.
	 *
	 * @var number[]
	 */
	protected $heights = array();

	/**
	 * @param PanelLayout[] $panels Panels in the grid
	 * @param array $config Configuration options
	 * @param number[] $config['widths'] Widths of columns as ratios
	 * @param number[] $config['heights'] Heights of rows as ratios
	 */
	public function __construct( array $panels, array $config = array() ) {
		// Allow passing positional parameters inside the config array
		if ( is_array( $panels ) && isset( $panels['panels'] ) ) {
			$config = $panels;
			$panels = $config['panels'];
		}

		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$this->addClasses( array( 'oo-ui-gridLayout' ) );
		foreach ( $panels as $panel ) {
			$this->panels[] = $panel;
			$this->appendContent( $panel );
		}
		if ( isset( $config['widths'] ) || isset( $config['heights'] ) ) {
			$this->layout(
				isset( $config['widths'] ) ? $config['widths'] : array( 1 ),
				isset( $config['heights'] ) ? $config['heights'] : array( 1 )
			);
		} else {
			// Arrange in columns by default
			$widths = array_fill( 0, count( $this->panels ), 1 );
			$this->layout( $widths, array( 1 ) );
		}
	}

	/**
	 * Set grid dimensions.
	 *
	 * @param number[] $widths Widths of columns as ratios
	 * @param number[] $heights Heights of rows as ratios
	 * @throws Exception If grid is not large enough to fit all panels
	 */
	public function layout( $widths, $heights ) {
		// Verify grid is big enough to fit panels
		if ( count( $widths ) * count( $heights ) < count( $this->panels ) ) {
			throw new Exception( 'Grid is not large enough to fit ' . count( $this->panels ) . 'panels' );
		}

		// Sum up denominators
		$xd = 0;
		$yd = 0;
		foreach ( $widths as $width ) {
			$xd += $width;
		}
		foreach ( $heights as $height ) {
			$yd += $height;
		}
		// Store factors
		$this->widths = array();
		$this->heights = array();
		foreach ( $widths as $width ) {
			$this->widths[] = $width / $xd;
		}
		foreach ( $heights as $height ) {
			$this->heights[] = $height / $yd;
		}
		// Synchronize view
		$this->update();
	}

	/**
	 * Update panel positions and sizes.
	 */
	public function update() {
		$i = 0;
		$top = 0;
		$left = 0;
		foreach ( $this->heights as $height ) {
			foreach ( $this->widths as $width ) {
				$panel = $this->panels[$i];
				$cssWidth = ( $width * 100 ) . '%';
				$cssHeight = ( $height * 100 ) . '%';
				$cssTop = ( $top * 100 ) . '%';

				$direction = Element::getDir( $this ) === 'ltr' ? 'left' : 'right';
				$cssLeft = ( $left * 100 ) . '%';

				$css =
					"width: $cssWidth; height: $cssHeight; " .
					"top: $cssTop; $direction: $cssLeft; ";

				// HACK: Work around IE bug by setting visibility: hidden; if width or height is zero
				if ( $width === 0 || $height === 0 ) {
					$css .= "visibility: hidden; ";
				}

				$panel->setAttributes( array( 'style' => $css ) );
				$i++;
				$left += $width;
			}
			$top += $height;
			$left = 0;
		}
	}

	/**
	 * Get a panel at a given position.
	 *
	 * The x and y position is affected by the current grid layout.
	 *
	 * @param number $x Horizontal position
	 * @param number $y Vertical position
	 * @return PanelLayout The panel at the given position
	 */
	public function getPanel( $x, $y ) {
		return $this->panels[ ( $x * count( $this->widths ) ) + $y ];
	}
}
