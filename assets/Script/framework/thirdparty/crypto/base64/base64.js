/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/javascript-base64.html
*
**/

let CryptoJS = require("core");
let enc_base64 = require("enc-base64");

var Base64 = {
    encode: function(input){
        let output = input;
        try{
            let wordArray = CryptoJS.enc.Utf8.parse(input);
            output = enc_base64.stringify(wordArray);
        }
        catch(error){
            console.error("Base64", "encode error! value="+input);
            output = input;
        }
        return output
    },

    decode: function(input){
        if(!input) return input
        input = input.replace(/[\r\n]/g,"")
        let output = input
        try{
            var wordArray = enc_base64.parse(input);
            output = wordArray.toString(CryptoJS.enc.Utf8);
        }
        catch(error){
            console.error("Base64", "decode error! value="+input);
            output = input;
        }
        return output
    },
}

module.exports = Base64;