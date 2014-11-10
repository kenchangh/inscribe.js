/**
 * Convert an image to a base64 string.
 * Supported outputFormat: 'image/png', 'image/jpeg'
 *
 * @param {String} url         
 * @param {Function} callback    
 * @param {String} [outputFormat='image/png']
 */
function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat);
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

function convertAllImgToBase64(html) {
  var $html = $(html);
  var $images = $html.filter('img');
  $images.each(function() {
    var $image = $(this);
    var imageSource = $image.attr('src');
    convertImgToBase64(imageSource, function(dataURL) {
      $image.attr('src', dataURL);
    });
  });
  console.log($html.clone());
  var newHtml = $('<div>').append($html.clone()).html();
  return newHtml;
}

function internalizeScripts(html) {
  var $html = $(html);
  var scripts = $html.filter('scripts');
  scripts.each(function() {

  });
  function fetchScript(url) {
    $.ajax({
      url: url,
      success: 
    })
  }
}

