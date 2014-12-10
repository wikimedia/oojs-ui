<?php
	$autoload = '../vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		trigger_error(
			'<h1>Did you forget to run <code>composer install</code>?</h1>'
		);
		exit();
	}
	require_once $autoload;

	OOUI\Theme::setSingleton( new OOUI\MediaWikiTheme() );

	$direction = ( isset( $_GET['dir'] ) && $_GET['dir'] === 'rtl' ) ? 'rtl' : 'ltr';
	$directionSuffix = $direction === 'rtl' ? '.rtl' : '';
	OOUI\Element::setDefaultDir( $direction );
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>OOjs UI Widget Demo</title>
	<link rel="stylesheet" href="../dist/oojs-ui-mediawiki.svg<?php echo $directionSuffix; ?>.css">
	<link rel="stylesheet" href="styles/demo<?php echo $directionSuffix; ?>.css">
</head>
<body class="oo-ui-<?php echo $direction; ?>">
	<div class="oo-ui-demo">
		<div class="oo-ui-demo-menu">
			<?php
				echo new OOUI\ButtonGroupWidget( array(
					'items' => array(
						new OOUI\ButtonWidget( array(
							'label' => 'LTR',
							'href' => '?dir=ltr',
						) ),
						new OOUI\ButtonWidget( array(
							'label' => 'RTL',
							'href' => '?dir=rtl',
						) ),
					)
				) );
			?>
		</div>
		<div class="oo-ui-demo-container">
			<?php

				function widgetWrap( $element ) {
					$widget = new OOUI\Widget();
					$widget->appendContent( $element );
					return $widget;
				}

				$styles = array(
					array(),
					array(
						'flags' => array( 'progressive' ),
					),
					array(
						'flags' => array( 'constructive' ),
					),
					array(
						'flags' => array( 'destructive' ),
					),
					array(
						'flags' => array( 'primary', 'progressive' ),
					),
					array(
						'flags' => array( 'primary', 'constructive' ),
					),
					array(
						'flags' => array( 'primary', 'destructive' ),
					),
				);
				$states = array(
					array(
						'label' => 'Button',
					),
					array(
						'label' => 'Button',
						'icon' => 'picture',
					),
					array(
						'label' => 'Button',
						'icon' => 'picture',
						'indicator' => 'down',
					),
					array(
						'icon' => 'picture',
						'title' => "Title text",
					),
					array(
						'indicator' => 'down',
					),
					array(
						'icon' => 'picture',
						'indicator' => 'down',
					),
					array(
						'label' => 'Button',
						'disabled' => true,
					),
					array(
						'icon' => 'picture',
						'title' => "Title text",
						'disabled' => true,
					),
					array(
						'indicator' => 'down',
						'disabled' => true,
					),
				);

				$panels = array();
				foreach ( $styles as $style ) {
					foreach ( $states as $state ) {
						$panel = new OOUI\PanelLayout();
						$panel->appendContent( new OOUI\ButtonWidget( array_merge( $style, $state ) ) );
						$panels[] = $panel;
					}
				}

				// Now that I think about it, using a grid layout wasn't the greatest idea.
				// But I need an example of it, so it stays for now.
				$grid = new OOUI\GridLayout(
					$panels,
					array(
						// Determined empirically
						'widths' => array( 83, 108, 127, 58, 52, 77, 83, 58, 42 ),
						'heights' => array( 1, 1, 1, 1, 1, 1, 1 ),
					)
				);
				$grid->setAttributes( array( 'style' => 'height: 24em; position: relative;' ) );

				echo new OOUI\FieldsetLayout( array(
					'label' => 'Regular buttons',
					'items' => array(
						widgetWrap( $grid ),
					),
				) );
			?>

			<?php
				class ButtonWidgetTitled extends OOUI\ButtonWidget {
					public static $title = "Title from a static property";
				}

				echo new OOUI\FieldsetLayout( array(
					'label' => 'Random stuff',
					'items' => array(
						new OOUI\FieldLayout(
							new ButtonWidgetTitled( array(
								'label' => "Hover me!\xE2\x80\x8E",
							) ),
							array(
								'label' => 'Titled button',
								'align' => 'top',
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => "Click me!\xE2\x80\x8E",
								'href' => 'http://example.com/',
							) ),
							array(
								'label' => 'Hyperlink button',
								'align' => 'top',
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonGroupWidget( array(
								'items' => array(
									new OOUI\ButtonWidget( array(
										'icon' => 'picture',
										'indicator' => 'down',
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'One',
										'flags' => array( 'progressive' ),
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Two',
										'flags' => array( 'constructive' ),
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Three',
										'flags' => array( 'destructive' ),
									) )
								)
							) ),
							array(
								'label' => 'Button group',
								'align' => 'top',
							)
						),
					)
				) );

			?>

			<?php
				$form = new OOUI\FormLayout( array(
					'method' => 'GET',
					'action' => 'widgets.php',
				) );

				$form->appendContent(
					new OOUI\FieldsetLayout( array(
						'label' => 'FormLayout that is a real HTML form',
						'items' => array(
							new OOUI\FieldLayout(
								new OOUI\TextInputWidget( array(
									'name' => 'username',
								) ),
								array(
									'label' => 'User name',
									'align' => 'top',
								)
							),
							new OOUI\FieldLayout(
								new OOUI\TextInputWidget( array(
									'name' => 'password',
									'type' => 'password',
								) ),
								array(
									'label' => 'Password',
									'align' => 'top',
								)
							),
							new OOUI\FieldLayout(
								new OOUI\CheckboxInputWidget( array(
									'name' => 'rememberme',
									'value' => true,
								) ),
								array(
									'label' => 'Remember me',
									'align' => 'inline',
								)
							),
							new OOUI\FieldLayout(
								new OOUI\ButtonInputWidget( array(
									'name' => 'login',
									'label' => 'Log in',
									'type' => 'submit',
									'flags' => array( 'primary', 'progressive' ),
									'icon' => 'check',
								) ),
								array(
									'label' => null,
									'align' => 'top',
								)
							),
						)
					) )
				);

				echo $form;

			?>

			<?php
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Super simple widgets',
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\IconWidget( array(
								'icon' => 'picture',
								'title' => 'Picture icon'
							) ),
							array(
								'label' => "IconWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\IconWidget( array(
								'icon' => 'picture',
								'title' => 'Picture icon',
								'disabled' => true
							) ),
							array(
								'label' => "IconWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\IndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required icon'
							) ),
							array(
								'label' => "IndicatorWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\IndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required icon',
								'disabled' => true
							) ),
							array(
								'label' => "IndicatorWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Button'
							) ),
							array(
								'label' => "FieldLayout with help",
								'help' => "I am an additional, helpful information.\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonInputWidget( array(
								'label' => 'Submit the form',
								'type' => 'submit'
							) ),
							array(
								'align' => 'top',
								'label' => "ButtonInputWidget (type: submit)\xE2\x80\x8E"
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonInputWidget( array(
								'label' => 'Submit the form',
								'type' => 'submit',
								'useInputTag' => true
							) ),
							array(
								'align' => 'top',
								'label' => "ButtonInputWidget (type: submit, using <input/>)\xE2\x80\x8E"
							)
						),
						new OOUI\FieldLayout(
							new OOUI\CheckboxInputWidget( array(
								'value' => true
							) ),
							array(
								'align' => 'inline',
								'label' => 'CheckboxInputWidget'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\CheckboxInputWidget( array(
								'value' => true,
								'disabled' => true
							) ),
							array(
								'align' => 'inline',
								'label' => "CheckboxInputWidget (disabled)\xE2\x80\x8E"
							)
						),
						new OOUI\FieldLayout(
							new OOUI\RadioInputWidget( array(
								'name' => 'oojs-ui-radio-demo',
							) ),
							array(
								'align' => 'inline',
								'label' => 'Connected RadioInputWidget #1'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\RadioInputWidget( array(
								'name' => 'oojs-ui-radio-demo',
								'selected' => true
							) ),
							array(
								'align' => 'inline',
								'label' => 'Connected RadioInputWidget #2'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array( 'value' => 'Text input' ) ),
							array(
								'label' => 'TextInputWidget',
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array( 'icon' => 'search' ) ),
							array(
								'label' => "TextInputWidget (icon)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array( 'indicator' => 'required' ) ),
							array(
								'label' => "TextInputWidget (indicator)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array( 'placeholder' => 'Placeholder' ) ),
							array(
								'label' => "TextInputWidget (placeholder)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array(
								'value' => 'Readonly',
								'readOnly' => true
							) ),
							array(
								'label' => "TextInputWidget (readonly)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array(
								'value' => 'Disabled',
								'disabled' => true
							) ),
							array(
								'label' => "TextInputWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array(
								'multiline' => true,
								'value' => 'Multiline'
							) ),
							array(
								'label' => "TextInputWidget (multiline)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
					)
				) );

			?>
		</div>
	</div>
</body>
</html>
