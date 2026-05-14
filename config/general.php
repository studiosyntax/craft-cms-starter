<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 * @link https://craftcms.com/docs/5.x/reference/config/general.html
 */

use craft\config\GeneralConfig;
use craft\helpers\App;

$environment = strtolower(App::env('CRAFT_ENVIRONMENT'));
$isDev = $environment === 'dev';
$isStaging = $environment === 'staging';
$isProduction = $environment === 'production';

return GeneralConfig::create()
    ->accessibilityDefaults([
        'useShapes' => true,
        'notificationPosition' => 'start-end'
    ])
    ->aliases([
        '@webroot' => dirname(__DIR__) . '/web',
    ])
    ->allowAdminChanges($isDev)
    ->allowUpdates($isDev)
    ->brokenImagePath('@webroot/dist/images/fallback.png')
    ->convertFilenamesToAscii(1)
    ->cpTrigger(App::env('CP_TRIGGER') ?? 'cms')
    ->defaultCountryCode('NL')
    ->defaultCpLanguage('en')
    ->defaultImageQuality(85)
    ->defaultSearchTermOptions([
        'subLeft' => true,
        'subRight' => true,
    ])
    ->defaultTokenDuration('P10D')
    ->defaultWeekStartDay(1)
    ->disallowRobots(!$isProduction)
    ->enableGql(0)
    ->elevatedSessionDuration('PT15M')
    ->errorTemplatePrefix('_errors/')
    ->generateTransformsBeforePageLoad(true)
    ->maxCachedCloudImageSize(3000)
    ->maxInvalidLogins(3)
    ->maxUploadFileSize('25M')
    ->limitAutoSlugsToAscii()
    ->omitScriptNameInUrls()
    ->preloadSingles()
    ->preventUserEnumeration()
    ->previewTokenDuration('P5D')
    ->sendPoweredByHeader(0)
    ->timezone('Europe/Amsterdam')
    ->transformGifs(0)
    ->useEmailAsUsername(1)
    ->usePathInfo()
    ->userSessionDuration('P1M')
;
