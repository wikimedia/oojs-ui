<?php

namespace Demo;

use OOUI;

class ButtonStyleShowcaseWidget extends OOUI\Widget {

	protected static $styles = [
		[],
		[
			'flags' => [ 'progressive' ],
		],
		[
			'flags' => [ 'destructive' ],
		],
		[
			'flags' => [ 'primary', 'progressive' ],
		],
		[
			'flags' => [ 'primary', 'destructive' ],
		],
		[
			'size' => 'small',
		],
		[
			'size' => 'large',
		],
	];
	protected static $states = [
		[
			'label' => 'Text',
		],
		[
			'icon' => 'tag',
			'label' => 'Text',
		],
		[
			'icon' => 'tag',
			'label' => 'Text',
			'indicator' => 'down',
		],
		[
			'icon' => 'tag',
			'title' => 'Title text',
		],
		[
			'icon' => 'tag',
			'label' => 'Tag',
			'invisibleLabel' => true,
			'indicator' => 'down',
		],
		[
			'label' => 'Dropdown',
			'invisibleLabel' => true,
			'indicator' => 'down',
		]
	];

	public function __construct( array $config = [] ) {
		parent::__construct( $config );

		$this->addClasses( [ 'demo-buttonStyleShowcaseWidget' ] );

		foreach ( self::$styles as $style ) {
			$buttonRow = new OOUI\Tag( 'div' );
			$buttonRowFrameless = new OOUI\Tag( 'div' );
			foreach ( [ false, true ] as $disabled ) {
				foreach ( self::$states as $state ) {
					$buttonRow->appendContent(
						new OOUI\ButtonWidget(
							array_merge(
								$style, $state,
								[ 'disabled' => $disabled ]
							)
						)
					);
					$buttonRowFrameless->appendContent(
						new OOUI\ButtonWidget(
							array_merge(
								$style, $state,
								[ 'framed' => false, 'disabled' => $disabled ]
							)
						)
					);
				}
			}
			$this->appendContent( $buttonRow, $buttonRowFrameless );
		}
	}

	protected function getJavaScriptClassName() {
		return 'Demo.ButtonStyleShowcaseWidget';
	}
}
