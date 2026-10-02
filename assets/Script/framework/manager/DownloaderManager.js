// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 资源下载管理
// ]]

const REGEX = /^\w+:\/\/.*/;

let ResourceManager = require("ResourceManager");

let DownloaderManager = function (params) {
    this.name = "DownloaderManager";
    this._downloader = cc.assetManager.downloader;
    this._parser = cc.assetManager.parser;
    this._isIOS10 = (cc.sys.os==cc.sys.OS_IOS&&cc.sys.osVersion==10) ? true : false;
}

let proto = DownloaderManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}
proto.downloadJson = function (url, options, onComplete) {
    let callback = function (err, data) {
        if (!err && typeof data === 'string') {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                err = e;
            }
        }
        onComplete && onComplete(err, data);
    }
    let data = ResourceManager.default.getJsonAsset(url);
    if(data){
        callback(null, data);
        return;
    }

    options = options || {};
    options.responseType = "json";
    this._downloader.downloadFile(url, options, options.onFileProgress, function (err, data) {
        callback(err, data);
    });
}

proto.downloadImage = function (url, options, onComplete) {
    url = ResourceManager.default.getSpriteLangUrl(url);
    options = options || {};
    let callback = function (error, result) {
        onComplete&&onComplete(error, result);
    }
    if(!this._isIOS10){
        let data = ResourceManager.default.getImageAsset(url);
        if(data){
            this._loadImage(data, options, callback);
            return;
        }    
    }
    
    let callbackBlob = function (error, response) {
        callback(error, response);
    }
    let callbackImage = function (error, image) {
        callback(error, image);
    }
    var downloadBlob = function (url, options, onComplete) {
        options.responseType = "blob";
        this._downloader.downloadFile(url, options, options.onFileProgress, onComplete);
    }.bind(this);

    // // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
    // var func = cc.capabilities && cc.capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP ? downloadBlob : this._downloader.downloadDomImage;
    if(cc.capabilities && cc.capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP){
        downloadBlob.call(this, url, options, callbackBlob);
    }
    else{
        this._downloader.downloadDomImage.call(this._downloader, url, options, callbackImage);
    }
}

proto.downloadZbin = function (url, options, onComplete) {
    options = options || {};
    options.responseType = "arraybuffer";
    this._downloader.downloadFile(url, options, options.onFileProgress, onComplete);
}

proto.downloadBundle = function (nameOrUrl, options, onComplete) {
    let downloader = this._downloader;
    let bundleName = cc.path.basename(nameOrUrl);
    let url = nameOrUrl;

    let folder = options.folder ? `${options.folder}/` : "";
    if(!CC_BUILD){
        folder = "";
    }
    if (!REGEX.test(url)) url = 'assets/' + folder + bundleName;

    var version = options.version || downloader.bundleVers[bundleName];
    var count = 0;
    var config = `${url}/config.${version ? version + '.' : ''}json`;
    let out = null, error = null;
    this.downloadJson(config, options, function (err, response) {
        if (err) {
            error = err;
        }
        out = response;
        out && (out.base = url + '/');
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });

    var js = `${url}/index.${version ? version + '.' : ''}js`;
    downloader.downloadScript(js, options, function (err) {
        if (err) {
            error = err;
        }
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });
}
proto._parseParameters = function (options, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isCallback = typeof options === 'function';
        if (onProgress) {
            onComplete = onProgress;
            if (!isCallback) {
                onProgress = null;
            }
        }
        else if (onProgress === undefined && isCallback) {
            onComplete = options;
            options = null;
            onProgress = null;
        }
        if (onProgress !== undefined && isCallback) {
            onProgress = options;
            options = null;
        }
    }
    options = options || Object.create(null);
    return { options, onProgress, onComplete };
}

proto._loadImage = function (url, options, onComplete) {
    var { options, onComplete } = this._parseParameters(options, undefined, onComplete);

    var img = new Image();

    if (window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }

    function loadCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(null, img);
    }
    
    function errorCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
    return img;
}

DownloaderManager.default = new DownloaderManager(null);
module.exports = DownloaderManager;