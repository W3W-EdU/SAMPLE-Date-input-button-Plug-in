/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-Date-input-button-Plug-in/blob/master/LICENSE
*/

jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  // Get configuration settings
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $cancelButton = $('#js-cancel-button');
  var $date = $('select[name="js-select-date-field"]');
  var $space = $('select[name="js-select-space-field"]');

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDownForSpace(rows) {
    // Use the row information obtained from getLayout() and extract all Blank space fields.
    // Create a dropdown menu containing a list of Space fields in the config.
    return KintoneConfigHelper.getFields('SPACER').then(function(resp) {
      resp.forEach(function(field) {
        var $option = $('<option>');
        $option.attr('value', field.elementId);
        $option.text(escapeHtml(field.elementId));
        $space.append($option.clone());
      });
      // Set default value
      $space.val(CONF.space);
    }).catch(function(err) {
      return alert('Failed to retrieve field information of the Kintone App.');
    });
  }

  function setDropDownForDate() {
    // Retrieve all fields from the form and extract all Date fields.
    // Create a dropdown menu containing a list of Date fields in the config.
    return KintoneConfigHelper.getFields('DATE').then(function(resp) {
      resp.forEach(function(field) {
        var $option = $('<option>');
        $option.attr('value', field.code);
        $option.text(escapeHtml(field.label));
        $date.append($option.clone());
      });
      // Set default value
      $date.val(CONF.date);
    }).catch(function(err) {
      return alert('Failed to retrieve field information of the Kintone App.');
    });
  }

  // Set dropdown list
  setDropDownForDate()
    .then(setDropDownForDate)
    .then(setDropDownForSpace);
  // Set input values when 'Save' button is clicked
  $form.on('submit', function(e) {
    e.preventDefault();
    var config = [];
    var date = $date.val();
    var space = $space.val();

    // Check required fields
    if (date === '' || space === '') {
      alert('Please set required field(s)');
      return;
    }
    config.date = date;
    config.space = space;

    kintone.plugin.app.setConfig(config);
  });
  // Process when 'Cancel' is clicked
  $cancelButton.click(function() {
    history.back();
  });
})(jQuery, kintone.$PLUGIN_ID);
