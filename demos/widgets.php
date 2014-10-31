<?php
	$autoload = '../vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		trigger_error(
			'<h1>Did you forget to run <code>composer install</code>?</h1>'
		);
		exit();
	}
	require_once $autoload;

	OoUiTheme::setSingleton( new OoUiMediaWikiTheme() );

	$direction = ( isset( $_GET['dir'] ) && $_GET['dir'] === 'rtl' ) ? 'rtl' : 'ltr';
	$directionSuffix = $direction === 'rtl' ? '.rtl' : '';
	OoUiElement::setDefaultDir( $direction );
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
				echo new OoUiButtonGroupWidget( array(
					'items' => array(
						new OoUiButtonWidget( array(
							'label' => 'LTR',
							'href' => '?dir=ltr',
							'target' => null,
						) ),
						new OoUiButtonWidget( array(
							'label' => 'RTL',
							'href' => '?dir=rtl',
							'target' => null,
						) ),
					)
				) );
			?>
		</div>
		<div class="oo-ui-demo-container">
			<?php

				function widgetWrap( $element ) {
					$widget = new OoUiWidget();
					$widget->appendContent( $element );
					return $widget;
				}

				$styles = array(
					array(),
					array(
						'flags' => array( 'primary' ),
					),
					array(
						'flags' => array( 'constructive' ),
					),
					array(
						'flags' => array( 'destructive' ),
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
						$panel = new OoUiPanelLayout();
						$panel->appendContent( new OoUiButtonWidget( array_merge( $style, $state ) ) );
						$panels[] = $panel;
					}
				}

				// Now that I think about it, using a grid layout wasn't the greatest idea.
				// But I need an example of it, so it stays for now.
				$grid = new OoUiGridLayout(
					$panels,
					array(
						// Determined empirically
						'widths' => array( 83, 108, 127, 58, 52, 77, 83, 58, 42 ),
						'heights' => array( 1, 1, 1, 1 ),
					)
				);
				$grid->setAttributes( array( 'style' => 'height: 12em; position: relative;' ) );

				echo new OoUiFieldsetLayout( array(
					'label' => 'Regular buttons',
					'items' => array(
						widgetWrap( $grid ),
					),
				) );
			?>

			<?php
				class ButtonWidgetTitled extends OoUiButtonWidget {
					public static $title = "Title from a static property";
				}

				echo new OoUiFieldsetLayout( array(
					'label' => 'Random stuff',
					'items' => array(
						new OoUiFieldLayout(
							new ButtonWidgetTitled( array(
								'label' => "Hover me!\xE2\x80\x8E",
							) ),
							array(
								'label' => 'Titled button',
								'align' => 'top',
							)
						),
						new OoUiFieldLayout(
							new OoUiButtonWidget( array(
								'label' => "Click me!\xE2\x80\x8E",
								'href' => 'http://example.com/',
							) ),
							array(
								'label' => 'Hyperlink button',
								'align' => 'top',
							)
						),
						new OoUiFieldLayout(
							new OoUiButtonGroupWidget( array(
								'items' => array(
									new OoUiButtonWidget( array(
										'icon' => 'picture',
										'indicator' => 'down',
									) ),
									new OoUiButtonWidget( array(
										'label' => 'One',
										'flags' => array( 'primary' ),
									) ),
									new OoUiButtonWidget( array(
										'label' => 'Two',
										'flags' => array( 'constructive' ),
									) ),
									new OoUiButtonWidget( array(
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
				$form = new OoUiFormLayout( array(
					'method' => 'GET',
					'action' => 'widgets.php',
				) );

				$form->appendContent(
					new OoUiFieldsetLayout( array(
						'label' => 'FormLayout that is a real HTML form',
						'items' => array(
							new OoUiFieldLayout(
								new OoUiTextInputWidget( array(
									'name' => 'username',
								) ),
								array(
									'label' => 'User name',
									'align' => 'top',
								)
							),
							new OoUiFieldLayout(
								new OoUiTextInputWidget( array(
									'name' => 'password',
									'type' => 'password',
								) ),
								array(
									'label' => 'Password',
									'align' => 'top',
								)
							),
							new OoUiFieldLayout(
								new OoUiCheckboxInputWidget( array(
									'name' => 'rememberme',
									'value' => true,
								) ),
								array(
									'label' => 'Remember me',
									'align' => 'inline',
								)
							),
							new OoUiFieldLayout(
								new OoUiButtonInputWidget( array(
									'name' => 'login',
									'label' => 'Log in',
									'type' => 'submit',
									'flags' => 'primary',
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
				echo new OoUiFieldsetLayout( array(
					'label' => 'Super simple widgets',
					'items' => array(
						new OoUiFieldLayout(
							new OoUiIconWidget( array(
								'icon' => 'picture',
								'title' => 'Picture icon'
							) ),
							array(
								'label' => "IconWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiIconWidget( array(
								'icon' => 'picture',
								'title' => 'Picture icon',
								'disabled' => true
							) ),
							array(
								'label' => "IconWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiIndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required icon'
							) ),
							array(
								'label' => "IndicatorWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiIndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required icon',
								'disabled' => true
							) ),
							array(
								'label' => "IndicatorWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiButtonWidget( array(
								'label' => 'Button'
							) ),
							array(
								'label' => "FieldLayout with help",
								'help' => "I am an additional, helpful information.\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiButtonInputWidget( array(
								'label' => 'Submit the form',
								'type' => 'submit'
							) ),
							array(
								'align' => 'top',
								'label' => "ButtonInputWidget (type: submit)\xE2\x80\x8E"
							)
						),
						new OoUiFieldLayout(
							new OoUiButtonInputWidget( array(
								'label' => 'Submit the form',
								'type' => 'submit',
								'useInputTag' => true
							) ),
							array(
								'align' => 'top',
								'label' => "ButtonInputWidget (type: submit, using <input/>)\xE2\x80\x8E"
							)
						),
						new OoUiFieldLayout(
							new OoUiCheckboxInputWidget( array(
								'value' => true
							) ),
							array(
								'align' => 'inline',
								'label' => 'CheckboxInputWidget'
							)
						),
						new OoUiFieldLayout(
							new OoUiCheckboxInputWidget( array(
								'value' => true,
								'disabled' => true
							) ),
							array(
								'align' => 'inline',
								'label' => "CheckboxInputWidget (disabled)\xE2\x80\x8E"
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'value' => 'Text input' ) ),
							array(
								'label' => 'TextInputWidget',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'icon' => 'search' ) ),
							array(
								'label' => "TextInputWidget (icon)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'indicator' => 'required' ) ),
							array(
								'label' => "TextInputWidget (indicator)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'placeholder' => 'Placeholder' ) ),
							array(
								'label' => "TextInputWidget (placeholder)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
								'value' => 'Readonly',
								'readOnly' => true
							) ),
							array(
								'label' => "TextInputWidget (readonly)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
								'value' => 'Disabled',
								'disabled' => true
							) ),
							array(
								'label' => "TextInputWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
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
