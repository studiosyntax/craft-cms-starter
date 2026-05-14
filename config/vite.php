<?php

use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
$isProd = App::env('CRAFT_ENVIRONMENT') === 'production';

return [
	'checkDevServer' => true,
	'useDevServer' => $isDev,
	'devServerInternal' => 'http://localhost:3000',
	'devServerPublic' => Craft::getAlias('@web') . ':3000',
	// 'errorEntry' => 'source/js/landing.js',
    'manifestPath' => '@webroot/dist/.vite/manifest.json',
	'serverPublic' => Craft::getAlias('@web') . '/dist/',
    'criticalPath' => '@webroot/criticalcss',
    'criticalSuffix' =>'_critical.min.css',
];
