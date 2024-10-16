jQuery(document).ready(function ($) {
  var oaMedia;

  $("input[id^='upload-btn-']").click(function (e) {
    e.preventDefault();

    var id = e.target.id.split('upload-btn-').pop();

    oaMedia = wp.media.frames.file_frame = wp.media({
      title: 'Upload Image',
      button: {
        text: 'Use this image',
      },
      library: {
        type: 'image',
      },
      multiple: false,
    });

    oaMedia.on('select', function () {
      var selectedImage = oaMedia.state().get('selection').first().toJSON();
      console.log(id, selectedImage.url);
      $('input#' + id).val(selectedImage.url);
      $('img#preview-' + id).attr('src', selectedImage.url);
    });

    oaMedia.open();
  });
});
