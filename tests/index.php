<?php
	require_once './JSPHP-generator.php';

	$testSuiteJSON = json_encode( getJSPHPTestConfigs(), JSON_PRETTY_PRINT );
	$testSuiteOutputs = makeJSPHPTestOutputs();
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>OOUI Test Suite</title>
	<link rel="stylesheet" href="../node_modules/qunit/qunit/qunit.css">
	<script src="../node_modules/qunit/qunit/qunit.js"></script>
	<script src="./QUnit.assert.equalDomElement.js"></script>
	<script src="./JSPHP-generator.js"></script>
	<!-- Dependencies -->
	<script src="../node_modules/jquery/dist/jquery.js"></script>
	<script src="../node_modules/oojs/dist/oojs.js"></script>
	<!-- Source code -->
	<script src="../dist/oojs-ui-core.js"></script>
	<script src="../dist/oojs-ui-widgets.js"></script>
	<script src="../dist/oojs-ui-windows.js"></script>
	<script src="../dist/oojs-ui-toolbars.js"></script>
	<script src="../dist/oojs-ui-apex.js"></script>
	<script src="../dist/oojs-ui-wikimediaui.js"></script>
	<script src="./TestTimer.js"></script>
	<script src="./config.js"></script>
	<!-- Test suites -->
	<script src="./core.test.js"></script>
	<script src="./Element.test.js"></script>
	<script src="./Process.test.js"></script>
	<script src="./windows.test.js"></script>
	<script src="./layouts/StackLayout.test.js"></script>
	<script src="./mixins/FlaggedElement.test.js"></script>
	<script src="./mixins/LabelElement.test.js"></script>
	<script src="./widgets/ButtonWidget.test.js"></script>
	<script src="./widgets/MenuTagMultiselectWidget.test.js"></script>
	<script src="./widgets/NumberInputWidget.test.js"></script>
	<script src="./widgets/SelectWidget.test.js"></script>
	<script src="./widgets/TagMultiselectWidget.test.js"></script>
</head>
<body>
	<!-- JS/PHP comparison tests -->
	<div id="JSPHPTestSuite" style="display: none;">
		<?php
			foreach ( $testSuiteOutputs as $theme => $testSuite ) {
				foreach ( $testSuite as $className => $cases ) {
					foreach ( $cases as $index => $case ) {
						echo "<div id='JSPHPTestSuite_$theme$className$index'>$case</div>\n";
					}
				}
			}
		?>
	</div>
	<script>OO.ui.JSPHPTestSuite = <?php echo $testSuiteJSON; ?></script>
	<script src="./JSPHP.test.standalone.js"></script>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>
</body>
</html>
