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
				require_once '../php/OoUiTheme.php';
				require_once '../php/themes/OoUiMediaWikiTheme.php';

				new OoUiMediaWikiTheme();
			?>

			<h1>Regular buttons</h1>
			<table>
				<tbody>
					<?php
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
						foreach ( $styles as $style ) {
							echo '<tr>';
							foreach ( $states as $state ) {
								echo '<td>';
								echo new OoUiButtonWidget(
									array_merge( $style, $state )
								);
								echo '</td>';
							}
							echo '</tr>';
						}
					?>
				</tbody>
			</table>

			<h1>Random stuff</h1>
			<?php
				class OoUiButtonWidgetTitled extends OoUiButtonWidget {
					public static $title = "Title from a static property";
				}

				echo new OoUiButtonWidgetTitled( array(
					'label' => 'Titled button',
				) );
				echo '<br>';

				echo new OoUiButtonGroupWidget( array(
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
				) );

			?>
		</div>
	</div>
</body>
</html>
