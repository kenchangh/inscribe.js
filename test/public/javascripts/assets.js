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
      html.replace(/<img src="(.*)">/gim, '<img src="' + dataURL + '">');
    });
  });
  return html;
}

// Implementation
function internalizeTextFiles(type, html, callback) {
  var tagNames = {
    js: 'script',
    css: 'style'
  };
  var tagName = tagNames[type];
  var $html = $(html);
  var $assets = $html.filter(tagName);
  var fetchedCounter = 0;
  $assets.each(function() {
    var $asset = $(this);
    var assetSource = $asset.attr('src');
    fetchAsset(assetSource);
  });
  function fetchAsset(url) {
    $.ajax({
      url: url,
      success: injectAsset
    }).done(function() {
      fetchedCounter++;
      if (fetchedCounter === $assets.length) callback(html);
    });
    function injectAsset(assetContent) {
      var assetPattern = '<\\s*' + tagName + '\\s*src\\s*=\\s*"'
                       + url  + '"\\s*\\/?>';
      html = html.replace(
        new RegExp(assetPattern, 'gim'),
        '<script>' + assetContent + '</script>'
      );
    }
  }
}

// Syntactic sugar
function internalizeJS(html, callback) {
  internalizeTextFiles('js', html, callback);
}

function internalizeCSS(html, callback) {
  internalizeTextFiles('css', html, callback);
}

