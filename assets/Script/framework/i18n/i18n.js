const Polyglot = require('polyglot');


let lang = "";
let data = {
    COMMON: {
        JIA_ZAI_ZHONG: "Loading…",
    }
};

function loadLanguage(lang) {
    let data = {}
    let configs = [];
    let array = ["common", "hall", "upgrade", "login", "club_hall", "chat"];
    for (let index = 0; index < array.length; index++) {
        let key = array[index];
        let file = lang + "_" + key;
        let config = require(file);
        configs.push(config);
    }
    data = Object.assign.apply(Object, configs);
    return data;
}


// data = loadLanguage(lang);
//  //console.log("data", data)

let polyglot = new Polyglot({ phrases: data, allowMissing: true });


let dirty = false;
module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init(language, subData) {
        if (!language) {
            language = 'zh';
        }
        dirty = false;
        if (lang != language) {
            data = loadLanguage(language);
            dirty = true;
        }
        lang = language;
        if (subData) {
            data = Object.assign(data, subData);
            dirty = true;
        }
        // data = language === 'zh' ? require('zh') : require('en');
        //  //console.warn("i18n", "init=", data);

        if (dirty) {
            polyglot.replace(data);
        }
    },
    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     *
     * var myText = i18n.t('MY_TEXT_KEY');
     *
     * // if your data source is defined as
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t(key, opt) {
        return polyglot.t(key, opt);
    }
};