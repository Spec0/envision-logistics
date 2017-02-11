<?php
/**
 * @file
 * feature_user.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function feature_user_user_default_roles() {
  $roles = array();

  // Exported role: Dispatcher.
  $roles['Dispatcher'] = array(
    'name' => 'Dispatcher',
    'weight' => 4,
  );

  // Exported role: Driver.
  $roles['Driver'] = array(
    'name' => 'Driver',
    'weight' => 3,
  );

  // Exported role: administrator.
  $roles['administrator'] = array(
    'name' => 'administrator',
    'weight' => 2,
  );

  return $roles;
}
