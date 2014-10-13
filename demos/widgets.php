<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>OOjs UI Widget Demo</title>
	<link rel="stylesheet" href="../dist/oojs-ui-mediawiki.svg.css">
	<link rel="stylesheet" href="styles/demo.css">
</head>
<body>
	<div class="oo-ui-demo">
		<div class="oo-ui-demo-container">
			<?php
				require_once '../php/OoUiTag.php';
				require_once '../php/OoUiElement.php';
				require_once '../php/OoUiElementMixin.php';
				require_once '../php/OoUiLayout.php';
				require_once '../php/OoUiWidget.php';
				require_once '../php/elements/OoUiButtonElement.php';
				require_once '../php/elements/OoUiLabelElement.php';
				require_once '../php/elements/OoUiIconElement.php';
				require_once '../php/elements/OoUiIndicatorElement.php';
				require_once '../php/elements/OoUiTitledElement.php';
				require_once '../php/elements/OoUiFlaggedElement.php';
				require_once '../php/elements/OoUiGroupElement.php';
				require_once '../php/widgets/OoUiButtonWidget.php';
				require_once '../php/widgets/OoUiButtonGroupWidget.php';
				require_once '../php/widgets/OoUiIconWidget.php';
				require_once '../php/widgets/OoUiIndicatorWidget.php';
				require_once '../php/widgets/OoUiLabelWidget.php';
				require_once '../php/widgets/OoUiInputWidget.php';
				require_once '../php/widgets/OoUiCheckboxInputWidget.php';
				require_once '../php/widgets/OoUiTextInputWidget.php';
				require_once '../php/OoUiTheme.php';
				require_once '../php/layouts/OoUiFieldLayout.php';
				require_once '../php/layouts/OoUiFieldsetLayout.php';
				require_once '../php/layouts/OoUiFormLayout.php';
				require_once '../php/layouts/OoUiPanelLayout.php';
				require_once '../php/layouts/OoUiGridLayout.php';
				require_once '../php/themes/OoUiMediaWikiTheme.php';

				new OoUiMediaWikiTheme();
			?>

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
								'label' => 'Hover me!',
							) ),
							array(
								'label' => 'Titled button',
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
						new OoUiFieldLayout(
							widgetWrap(
								call_user_func(
									function () {
										return new OoUiFormLayout();
									}
								)->appendContent(
									"I am actually a form, but there's no way to submit me yet :("
								)
							),
							array(
								'label' => 'Form layout',
								'align' => 'top',
							)
						),
					)
				) );

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
								'label' => 'IconWidget (normal)',
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
								'label' => 'IconWidget (disabled)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiIndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required icon'
							) ),
							array(
								'label' => 'IndicatorWidget (normal)',
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
								'label' => 'IndicatorWidget (disabled)',
								'align' => 'top'
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
								'label' => 'CheckboxInputWidget (disabled)'
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
								'label' => 'TextInputWidget (icon)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'indicator' => 'required' ) ),
							array(
								'label' => 'TextInputWidget (indicator)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array( 'placeholder' => 'Placeholder' ) ),
							array(
								'label' => 'TextInputWidget (placeholder)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
								'value' => 'Readonly',
								'readOnly' => true
							) ),
							array(
								'label' => 'TextInputWidget (readonly)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
								'value' => 'Disabled',
								'disabled' => true
							) ),
							array(
								'label' => 'TextInputWidget (disabled)',
								'align' => 'top'
							)
						),
						new OoUiFieldLayout(
							new OoUiTextInputWidget( array(
								'multiline' => true,
								'value' => 'Multiline'
							) ),
							array(
								'label' => 'TextInputWidget (multiline)',
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
