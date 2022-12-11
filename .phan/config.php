<?php

// Always use repo's own vendor folder
putenv( 'MW_VENDOR_PATH=.' );

$cfg = require __DIR__ . '/../vendor/mediawiki/mediawiki-phan-config/src/config.php';

$cfg['directory_list'][] = 'php';

return $cfg;
