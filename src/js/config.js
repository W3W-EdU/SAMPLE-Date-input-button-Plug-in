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
  var $cancelButton = $('.js-cancel-button');
  var $date = $('select[name="js-select-date-field"]');
  var $space = $('select[name="js-select-space-field"]');

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDownForSpace() {
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
    .then(setDropDownForSpace);
  // Set input values when 'Save' button is clicked
  $form.on('submit', function(e) {
    e.preventDefault();
    var config = [];
    var date = $date.val();
    var space = $space.val();

    config.date = date;
    config.space = space;

    kintone.plugin.app.setConfig(config, function() {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
    });
  });
  // Process when 'Cancel' is clicked
  $cancelButton.click(function() {
    window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
