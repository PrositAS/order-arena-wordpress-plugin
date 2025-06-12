const { __ } = wp.i18n;

document.addEventListener('DOMContentLoaded', function () {
  const mediaButtons = document.querySelectorAll("input[id^='upload-btn-']");

  mediaButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const id = e.target.id.split('upload-btn-').pop();
      const oaMedia = (wp.media.frames.file_frame = wp.media({
        title: __('Upload Image', 'order-arena'),
        button: {
          text: __('Use this image', 'order-arena'),
        },
        library: {
          type: 'image',
        },
        multiple: false,
      }));

      oaMedia.on('select', function (e) {
        const attachment = oaMedia.state().get('selection').first().toJSON();

        if (attachment) {
          updateMediaInput(id, attachment.url);
        }
      });

      oaMedia.open();
    });
  });

  function updateMediaInput(id, value) {
    if (!id) {
      return;
    }

    const input = document.getElementById(id);
    const preview = document.getElementById(`preview-${id}`);

    if (input && preview && input.value !== value) {
      input.value = value;
      preview.src = value;
    }
  }

  const colorInputs = document.querySelectorAll("input[id^='color-input'], input[id^='text-color-input']");
  colorInputs.forEach((input) => {
    input.addEventListener('blur', function (e) {
      const sourceIdParts = e.target.id.split('-');

      if (sourceIdParts.length > 2) {
        const id = sourceIdParts.pop();
        const sourceType = sourceIdParts[0] ?? null;
        const value = e.target.value ?? null;

        updateColorInput(sourceType, id, value);
      }
    });
  });

  function updateColorInput(sourceType, id, value) {
    if (!sourceType || !id) {
      return;
    }

    const type = sourceType === 'text' ? 'color' : 'text-color';
    const input = document.getElementById(`${type}-input-${id}`);

    if (input && id && input.value !== value) {
      input.value = value;
    }
  }
});
