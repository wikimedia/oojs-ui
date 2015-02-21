<?php
	$autoload = '../vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		echo '<h1>Did you forget to run <code>composer install</code>?</h1>';
		exit();
	}
	require_once $autoload;

	$theme = ( isset( $_GET['theme'] ) && $_GET['theme'] === 'apex' ) ? 'apex' : 'mediawiki';
	$themeClass = 'OOUI\\' . ( $theme === 'apex' ? 'Apex' : 'MediaWiki' ) . 'Theme';
	OOUI\Theme::setSingleton( new $themeClass() );

	$graphicSuffixMap = array(
		'mixed' => '',
		'vector' => '.vector',
		'raster' => '.raster',
	);
	$graphic = ( isset( $_GET['graphic'] ) && isset( $graphicSuffixMap[ $_GET['graphic'] ] ) )
		? $_GET['graphic'] : 'vector';
	$graphicSuffix = $graphicSuffixMap[ $graphic ];

	$direction = ( isset( $_GET['direction'] ) && $_GET['direction'] === 'rtl' ) ? 'rtl' : 'ltr';
	$directionSuffix = $direction === 'rtl' ? '.rtl' : '';
	OOUI\Element::setDefaultDir( $direction );

	$query = array(
		'theme' => $theme,
		'graphic' => $graphic,
		'direction' => $direction,
	);
	$styleFileName = "oojs-ui-$theme$graphicSuffix$directionSuffix.css";
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>OOjs UI Widget Demo</title>
	<link rel="stylesheet" href="../dist/<?php echo $styleFileName; ?>">
	<link rel="stylesheet" href="styles/demo<?php echo $directionSuffix; ?>.css">
</head>
<body class="oo-ui-<?php echo $direction; ?>">
	<div class="oo-ui-demo">
		<div class="oo-ui-demo-menu">
			<?php
				echo new OOUI\ButtonGroupWidget( array(
					'items' => array(
						new OOUI\ButtonWidget( array(
							'label' => 'MediaWiki',
							'href' => '?' . http_build_query( array_merge( $query, array( 'theme' => 'mediawiki' ) ) ),
						) ),
						new OOUI\ButtonWidget( array(
							'label' => 'Apex',
							'href' => '?' . http_build_query( array_merge( $query, array( 'theme' => 'apex' ) ) ),
						) ),
					)
				) );
				echo new OOUI\ButtonGroupWidget( array(
					'items' => array(
						new OOUI\ButtonWidget( array(
							'label' => 'Mixed',
							'href' => '?' . http_build_query( array_merge( $query, array( 'graphic' => 'mixed' ) ) ),
						) ),
						new OOUI\ButtonWidget( array(
							'label' => 'Vector',
							'href' => '?' . http_build_query( array_merge( $query, array( 'graphic' => 'vector' ) ) ),
						) ),
						new OOUI\ButtonWidget( array(
							'label' => 'Raster',
							'href' => '?' . http_build_query( array_merge( $query, array( 'graphic' => 'raster' ) ) ),
						) ),
					)
				) );
				echo new OOUI\ButtonGroupWidget( array(
					'items' => array(
						new OOUI\ButtonWidget( array(
							'label' => 'LTR',
							'href' => '?' . http_build_query( array_merge( $query, array( 'direction' => 'ltr' ) ) ),
						) ),
						new OOUI\ButtonWidget( array(
							'label' => 'RTL',
							'href' => '?' . http_build_query( array_merge( $query, array( 'direction' => 'rtl' ) ) ),
						) ),
					)
				) );
			?>
		</div>
		<div class="oo-ui-demo-container">
			<?php

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
				$buttonStyleShowcaseWidget = new OOUI\Widget();
				foreach ( $styles as $style ) {
					foreach ( $states as $state ) {
						$buttonStyleShowcaseWidget->appendContent(
							new OOUI\ButtonWidget( array_merge( $style, $state ) )
						);
					}
					$buttonStyleShowcaseWidget->appendContent( new OOUI\HtmlSnippet( '<br />' ) );
				}

				$horizontalAlignmentWidget = new OOUI\Widget( array(
					'classes' => array( 'oo-ui-demo-horizontal-alignment' )
				) );
				$horizontalAlignmentWidget->appendContent(
					new OOUI\ButtonWidget( array( 'label' => 'Button' ) ),
					new OOUI\ButtonGroupWidget( array( 'items' => array(
						new OOUI\ButtonWidget( array( 'label' => 'A' ) ),
						new OOUI\ButtonWidget( array( 'label' => 'B' ) )
					) ) ),
					new OOUI\ButtonInputWidget( array( 'label' => 'ButtonInput' ) ),
					new OOUI\TextInputWidget( array( 'value' => 'TextInput' ) ),
					new OOUI\DropdownInputWidget( array( 'options' => array(
						array(
							'label' => 'DropdownInput',
							'data' => null
						)
					) ) ),
					new OOUI\CheckboxInputWidget( array( 'selected' => true ) ),
					new OOUI\RadioInputWidget( array( 'selected' => true ) ),
					new OOUI\LabelWidget( array( 'label' => 'Label' ) )
				);

				echo new OOUI\FieldsetLayout( array(
					'label' => 'Simple buttons',
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array( 'label' => 'Normal' ) ),
							array(
								'label' => "ButtonWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Progressive',
								'flags' => array( 'progressive' )
							) ),
							array(
								'label' => "ButtonWidget (progressive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Constructive',
								'flags' => array( 'constructive' )
							) ),
							array(
								'label' => "ButtonWidget (constructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Destructive',
								'flags' => array( 'destructive' )
							) ),
							array(
								'label' => "ButtonWidget (destructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Primary progressive',
								'flags' => array( 'primary', 'progressive' )
							) ),
							array(
								'label' => "ButtonWidget (primary, progressive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Primary constructive',
								'flags' => array( 'primary', 'constructive' )
							) ),
							array(
								'label' => "ButtonWidget (primary, constructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Primary destructive',
								'flags' => array( 'primary', 'destructive' )
							) ),
							array(
								'label' => "ButtonWidget (primary, destructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Disabled',
								'disabled' => true
							) ),
							array(
								'label' => "ButtonWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Constructive',
								'flags' => array( 'constructive' ),
								'disabled' => true
							) ),
							array(
								'label' => "ButtonWidget (constructive, disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Constructive',
								'icon' => 'picture',
								'flags' => array( 'constructive' ),
								'disabled' => true
							) ),
							array(
								'label' => "ButtonWidget (constructive, icon, disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Icon',
								'icon' => 'picture'
							) ),
							array(
								'label' => "ButtonWidget (icon)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Icon',
								'icon' => 'picture',
								'flags' => array( 'progressive' )
							) ),
							array(
								'label' => "ButtonWidget (icon, progressive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Indicator',
								'indicator' => 'down'
							) ),
							array(
								'label' => "ButtonWidget (indicator)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Indicator',
								'indicator' => 'down',
								'flags' => array( 'constructive' )
							) ),
							array(
								'label' => "ButtonWidget (indicator, constructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'icon' => 'help',
								'title' => 'Icon only'
							) ),
							array(
								'label' => "ButtonWidget (icon only)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'icon' => 'picture',
								'label' => 'Labeled'
							) ),
							array(
								'label' => "ButtonWidget (frameless)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'flags' => array( 'progressive' ),
								'icon' => 'check',
								'label' => 'Progressive'
							) ),
							array(
								'label' => "ButtonWidget (frameless, progressive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'flags' => array( 'destructive' ),
								'icon' => 'remove',
								'label' => 'Destructive'
							) ),
							array(
								'label' => "ButtonWidget (frameless, destructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'flags' => array( 'constructive' ),
								'icon' => 'add',
								'label' => 'Constructive'
							) ),
							array(
								'label' => "ButtonWidget (frameless, constructive)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'icon' => 'picture',
								'label' => 'Disabled',
								'disabled' => true
							) ),
							array(
								'label' => "ButtonWidget (frameless, disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'framed' => false,
								'flags' => array( 'constructive' ),
								'icon' => 'picture',
								'label' => 'Constructive',
								'disabled' => true
							) ),
							array(
								'label' => "ButtonWidget (frameless, constructive, disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Button sets',
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\ButtonGroupWidget( array(
								'items' => array(
									new OOUI\ButtonWidget( array(
										'icon' => 'picture',
										'indicator' => 'down'
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'One',
										'flags' => array( 'progressive' )
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Two',
										'flags' => array( 'constructive' )
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Three',
										'flags' => array( 'destructive' )
									) )
								)
							) ),
							array(
								'label' => "ButtonGroupWidget (colors)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\ButtonGroupWidget( array(
								'items' => array(
									new OOUI\ButtonWidget( array(
										'label' => 'One'
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Two'
									) ),
									new OOUI\ButtonWidget( array(
										'label' => 'Three'
									) )
								)
							) ),
							array(
								'label' => 'ButtonGroupWidget',
								'align' => 'top'
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Button style showcase',
					'items' => array(
						new OOUI\FieldLayout(
							$buttonStyleShowcaseWidget,
							array(
								'align' => 'top'
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Form widgets',
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\CheckboxInputWidget( array(
								'selected' => true
							) ),
							array(
								'align' => 'inline',
								'label' => 'CheckboxInputWidget'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\CheckboxInputWidget( array(
								'selected' => true,
								'disabled' => true
							) ),
							array(
								'align' => 'inline',
								'label' => "CheckboxInputWidget (disabled)\xE2\x80\x8E"
							)
						),
						new OOUI\FieldLayout(
							new OOUI\RadioInputWidget( array(
								'name' => 'oojs-ui-radio-demo'
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
							new OOUI\RadioInputWidget( array(
								'selected' => true,
								'disabled' => true
							) ),
							array(
								'align' => 'inline',
								'label' => "RadioInputWidget (disabled)\xE2\x80\x8E"
							)
						),
						new OOUI\FieldLayout(
							new OOUI\TextInputWidget( array( 'value' => 'Text input' ) ),
							array(
								'label' => "TextInputWidget\xE2\x80\x8E",
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
							new OOUI\TextInputWidget( array(
								'indicator' => 'required',
								'required' => true
							) ),
							array(
								'label' => "TextInputWidget (indicator, required)\xE2\x80\x8E",
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
								'value' => "Multiline\nMultiline"
							) ),
							array(
								'label' => "TextInputWidget (multiline)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\DropdownInputWidget( array(
								'options' => array(
									array(
										'data' => 'a',
										'label' => 'First'
									),
									array(
										'data' => 'b',
										'label' => 'Second'
									),
									array(
										'data' => 'c',
										'label' => 'Third'
									)
								),
								'value' => 'b'
							) ),
							array(
								'label' => 'DropdownInputWidget',
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
								'label' => "ButtonInputWidget\xE2\x80\x8E"
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
								'label' => "ButtonInputWidget (using <input/>)\xE2\x80\x8E"
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Horizontal alignment',
					'items' => array(
						new OOUI\FieldLayout(
							$horizontalAlignmentWidget,
							array(
								'label' => 'Multiple widgets shown as a single line, ' .
									'as used in compact forms or in parts of a bigger widget.',
								'align' => 'top'
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Other widgets',
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
								'title' => 'Required indicator'
							) ),
							array(
								'label' => "IndicatorWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\IndicatorWidget( array(
								'indicator' => 'required',
								'title' => 'Required indicator',
								'disabled' => true
							) ),
							array(
								'label' => "IndicatorWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\LabelWidget( array(
								'label' => 'Label'
							) ),
							array(
								'label' => "LabelWidget (normal)\xE2\x80\x8E",
								'align' => 'top'
							)
						),
						new OOUI\FieldLayout(
							new OOUI\LabelWidget( array(
								'label' => 'Label',
								'disabled' => true,
							) ),
							array(
								'label' => "LabelWidget (disabled)\xE2\x80\x8E",
								'align' => 'top'
							)
						)
					)
				) );
				echo new OOUI\FieldsetLayout( array(
					'label' => 'Field layouts',
					'help' => 'I am an additional, helpful information. Lorem ipsum dolor sit amet, cibo pri ' .
						"in, duo ex inimicus perpetua complectitur, mel periculis similique at.\xE2\x80\x8E",
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\ButtonWidget( array(
								'label' => 'Button'
							) ),
							array(
								'label' => 'FieldLayout with help',
								'help' => 'I am an additional, helpful information. Lorem ipsum dolor sit amet, cibo pri ' .
									"in, duo ex inimicus perpetua complectitur, mel periculis similique at.\xE2\x80\x8E",
								'align' => 'top'
							)
						)
					)
				) );

				$form = new OOUI\FormLayout( array(
					'method' => 'GET',
					'action' => 'widgets.php',
				) );

				$form->appendContent(
					new OOUI\FieldsetLayout( array(
						'label' => 'Form layout',
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
									'selected' => true,
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

				echo new OOUI\FieldsetLayout( array(
					'label' => 'PHP-specific',
					'items' => array(
						new OOUI\FieldLayout(
							new OOUI\LabelWidget( array(
								'label' => new OOUI\HtmlSnippet( '<b>Fancy</b> <i>text</i> <u>formatting</u>!' ),
							) ),
							array(
								'label' => 'LabelWidget with HtmlSnippet',
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
