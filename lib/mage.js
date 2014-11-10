var mage = {
  loadImage: loadImage,
  teleport: teleport
};

    
var ParameterError = {
  name: 'Parameter Error',
  message: 'You have set an unavailable id',
  toString: function() {return this.name + ': ' + this.message;}
}


/**
 * Set the images into localStorage and load them to the page.
 * @param {Object} {domID: imageURL, ...}     
 */
function teleport(idToImages) {
  // Don't do anything if mage has already saved base64
  if (localStorage['mage_sent'] === undefined) {
    console.log('reloaded function');
    /**
     * Convert an image 
     * to a base64 string
     * @param  {String}   url         
     * @param  {Function} callback    
     * @param  {String}   [outputFormat=image/png]
     *
     * Supported input formats:
     * image/png
     * image/jpeg
     * image/jpg
     * image/gif
     * image/bmp
     * image/tiff
     * image/x-icon
     * image/svg+xml
     * image/webp
     * image/xxx
     *
     * Supported output formats:
     * image/png
     * image/jpeg
     * image/webp (chrome)       
     */
    function convertImgToBase64(id, url, callback) {
      // .jpg, .png...
      var imageType = url.split('.')[1];
      var outputFormat;
      imageType === 'jpg' || imageType === 'jpeg'
        ? outputFormat = 'image/jpeg'
        : outputFormat = 'image/png'
      
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image;
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat);
        callback.call(this, id, url, dataURL);
        canvas = null;
      };
      img.src = url;
    }
   
    idToImages = registerBaseUrl(idToImages);    
    var img;
    for (var id in idToImages) {
      img = idToImages[id];
      convertImgToBase64(id, img, function(id, url, base64) {
        localStorage[url] = base64;
        var dom = document.getElementById(id)
        console.log(id)
        if (dom !== null) {
          dom.setAttribute('src', base64);
        }
        else {
          throw ParameterError;
        }        
      });
    }
    localStorage['mage_sent'] = '';
  }
  else {
    loadImage(idToImages);
  }
}


function registerBaseUrl(idToImages) {
  // If baseUrl present, concatenate all URLs with it
  if (idToImages.baseUrl !== undefined) {
    var baseUrl = idToImages.baseUrl;
    delete idToImages.baseUrl;
    for (var id in idToImages) {
      // Allow slash to be absent
      var img = idToImages[id];
      img.substr(img.length - 1) !== '/'
        ? img + '/'
        : null;
      idToImages[id] = baseUrl + img;
    }
  }
  return idToImages
}


/**
 * Setting the Base64 for images
 * @param {Object} {domID: imageURL, ...}     
 */
function loadImage(idToImages) {
  console.log('lazy load');
  idToImages = registerBaseUrl(idToImages);
  
  var base64;
  var img;
  for (var id in idToImages) {
    if (idToImages.hasOwnProperty(id)) {
      img = document.getElementById(id);
      console.log(id)
      console.log(img)
      if (img !== null) {
        base64 = localStorage[idToImages[id]];
        img.setAttribute('src', base64);
      }
      else {
        throw ParameterError;
      }
    }
  }
}

