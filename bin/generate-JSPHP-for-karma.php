<?php

require_once __DIR__ . '/../tests/JSPHP-generator.php';

$testSuiteJSON = json_encode( getJSPHPTestConfigs(), JSON_PRETTY_PRINT );
$testSuiteOutputJSON = json_encode( makeJSPHPTestOutputs(), JSON_PRETTY_PRINT );

echo "const testSuiteConfigs = $testSuiteJSON;\n\n";
echo "const testSuitePHPOutput = $testSuiteOutputJSON;\n\n";
echo file_get_contents( __DIR__ . '/../tests/JSPHP.test.karma.js' );
