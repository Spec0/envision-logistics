<?php
/**
 * @file
 * feature_user.pages_default.inc
 */

/**
 * Implements hook_default_page_manager_handlers().
 */
function feature_user_default_page_manager_handlers() {
  $export = array();

  $handler = new stdClass();
  $handler->disabled = FALSE; /* Edit this to true to make a default handler disabled initially */
  $handler->api_version = 1;
  $handler->name = 'user_view__panel_context_2eb1cd4a-8336-4c16-aebd-7e51107e6720';
  $handler->task = 'user_view';
  $handler->subtask = '';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Panel',
    'no_blocks' => 0,
    'pipeline' => 'standard',
    'body_classes_to_remove' => '',
    'body_classes_to_add' => '',
    'css_id' => '',
    'css' => '',
    'contexts' => array(),
    'relationships' => array(),
    'name' => '',
  );
  $display = new panels_display();
  $display->layout = 'bootstrap_threecol_stacked';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'top' => NULL,
      'left' => NULL,
      'middle' => NULL,
      'right' => NULL,
      'bottom' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = '';
  $display->uuid = 'f8c6a2d0-db2d-4e74-b41b-fb3bc13b5e9f';
  $display->storage_type = 'page_manager';
  $display->storage_id = 'user_view__panel_context_2eb1cd4a-8336-4c16-aebd-7e51107e6720';
  $display->content = array();
  $display->panels = array();
  $pane = new stdClass();
  $pane->pid = 'new-5eb3c55a-96ba-406c-ba67-3479130e3735';
  $pane->panel = 'top';
  $pane->type = 'user_profile';
  $pane->subtype = 'user_profile';
  $pane->shown = TRUE;
  $pane->access = array();
  $pane->configuration = array(
    'view_mode' => 'full',
    'context' => 'argument_entity_id:user_1',
    'override_title' => 0,
    'override_title_text' => '',
    'override_title_heading' => 'h2',
  );
  $pane->cache = array();
  $pane->style = array(
    'settings' => NULL,
  );
  $pane->css = array();
  $pane->extras = array();
  $pane->position = 0;
  $pane->locks = array();
  $pane->uuid = '5eb3c55a-96ba-406c-ba67-3479130e3735';
  $display->content['new-5eb3c55a-96ba-406c-ba67-3479130e3735'] = $pane;
  $display->panels['top'][0] = 'new-5eb3c55a-96ba-406c-ba67-3479130e3735';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $export['user_view__panel_context_2eb1cd4a-8336-4c16-aebd-7e51107e6720'] = $handler;

  return $export;
}
