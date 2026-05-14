<?php

/**
 * Runs once, via the `post-create-project-cmd` Composer hook.
 *
 * Turns the starter into a clean project: strips the starter's own metadata
 * from composer.json, removes starter-only docs, then deletes itself.
 */

$root = dirname(__DIR__);

// Strip `name` and the bootstrap `scripts` block from composer.json.
$file = $root . '/composer.json';
$json = json_decode(file_get_contents($file), true);
unset($json['name'], $json['scripts']);
file_put_contents(
    $file,
    json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL
);

// Remove starter-only files.
foreach (['CHANGELOG.md', 'LICENSE.md', 'README.md'] as $name) {
    @unlink($root . '/' . $name);
}

// Self-destruct.
@unlink(__FILE__);
@rmdir(__DIR__);
