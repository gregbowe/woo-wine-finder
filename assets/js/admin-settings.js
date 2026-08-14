(function ($) {
  'use strict';

  $(function () {
    var frame;
    var $id = $('#mnw-launcher-image-id');
    var $preview = $('#mnw-launcher-image-preview');
    var $remove = $('#mnw-remove-launcher-image');
    var $categoryInputs = $('input[name="wine_categories[]"]');

    $categoryInputs.on('change', function () {
      if ($categoryInputs.filter(':checked').length >= 2) return;
      this.checked = true;
      window.alert(
        window.MyNextWineWooAdmin && window.MyNextWineWooAdmin.minimumCategories
          ? window.MyNextWineWooAdmin.minimumCategories
          : 'Choose at least two bottle selection categories.'
      );
    });

    $('#mnw-select-launcher-image').on('click', function () {
      if (frame) {
        frame.open();
        return;
      }

      frame = wp.media({
        title: window.MyNextWineWooAdmin && window.MyNextWineWooAdmin.chooseLauncherImage ? window.MyNextWineWooAdmin.chooseLauncherImage : 'Choose launcher image',
        button: { text: window.MyNextWineWooAdmin && window.MyNextWineWooAdmin.useThisImage ? window.MyNextWineWooAdmin.useThisImage : 'Use this image' },
        library: { type: 'image' },
        multiple: false
      });

      frame.on('select', function () {
        var attachment = frame.state().get('selection').first().toJSON();
        var url = attachment.sizes && attachment.sizes.thumbnail
          ? attachment.sizes.thumbnail.url
          : attachment.url;
        $id.val(attachment.id);
        $preview.attr('src', url).show();
        $remove.prop('disabled', false);
      });

      frame.open();
    });

    $remove.on('click', function () {
      $id.val('0');
      $preview.attr('src', '').hide();
      $remove.prop('disabled', true);
    });
  });
})(jQuery);
