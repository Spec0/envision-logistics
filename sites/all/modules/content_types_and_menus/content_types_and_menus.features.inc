<?php
/**
 * @file
 * content_types_and_menus.features.inc
 */

/**
 * Implements hook_node_info().
 */
function content_types_and_menus_node_info() {
  $items = array(
    'documents' => array(
      'name' => t('Documents'),
      'base' => 'node_content',
      'description' => t('Documents node.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'freights' => array(
      'name' => t('Freights'),
      'base' => 'node_content',
      'description' => t('Probably we won\'t use this, we\'ll keep it anyway.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'location' => array(
      'name' => t('Location'),
      'base' => 'node_content',
      'description' => t('Drivers location.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
