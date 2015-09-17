$(function() {
  $.getJSON('config.json', function(data) {
    // update headline
    $('#title').html(data['title']);

    // populate left select
    populateSide('left', data['leftSelector']);

    // populate right select
    populateSide('right', data['rightSelector']);

    // bind select events
    $('select.image-selector').on('change', function(a, b) {
      if ($(this).attr('id') === 'right-selector') {
        $('img#image-right').attr('src', $(this).val());
      } else {
        $('img#image-left').attr('src', $(this).val());
      }
    });

    // fire select to set the images
    $('select.image-selector').trigger('change');

    // init image box
    setTimeout(function() {
      $('#image-slider').twentytwenty({
        default_offset_pct: data['defaultSlidePosition']
      });
    }, 300);

    // ready, so show
    $('#main-container').show();
  });
});

function populateSide(side, sideData) {
  $('#' + side + '-label').html(sideData['name']);

  var $selector = $('#' + side + '-selector');
  $.each(sideData['images'], function() {
    $selector.append($('<option />').val(this['source']).text(this['name']));
    if (this['default']) {
      $selector.val(this['source']);
    }
  });
}
