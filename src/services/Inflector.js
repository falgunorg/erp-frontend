'use strict';
class Inflector {

    constructor() {
        this.replaceArr = {
            'À|Á|Â|Ã|Å|Ǻ|Ā|Ă|Ą|Ǎ': 'A',
            'Æ|Ǽ': 'AE',
            'Ä': 'Ae',
            'Ç|Ć|Ĉ|Ċ|Č': 'C',
            'Ð|Ď|Đ': 'D',
            'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě': 'E',
            'Ĝ|Ğ|Ġ|Ģ|Ґ': 'G',
            'Ĥ|Ħ': 'H',
            'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ|І': 'I',
            'Ĳ': 'IJ',
            'Ĵ': 'J',
            'Ķ': 'K',
            'Ĺ|Ļ|Ľ|Ŀ|Ł': 'L',
            'Ñ|Ń|Ņ|Ň': 'N',
            'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ': 'O',
            'Œ': 'OE',
            'Ö': 'Oe',
            'Ŕ|Ŗ|Ř': 'R',
            'Ś|Ŝ|Ş|Ș|Š': 'S',
            'ẞ': 'SS',
            'Ţ|Ț|Ť|Ŧ': 'T',
            'Þ': 'TH',
            'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ': 'U',
            'Ü': 'Ue',
            'Ŵ': 'W',
            'Ý|Ÿ|Ŷ': 'Y',
            'Є': 'Ye',
            'Ї': 'Yi',
            'Ź|Ż|Ž': 'Z',
            'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª': 'a',
            'ä|æ|ǽ': 'ae',
            'ç|ć|ĉ|ċ|č': 'c',
            'ð|ď|đ': 'd',
            'è|é|ê|ë|ē|ĕ|ė|ę|ě': 'e',
            'ƒ': 'f',
            'ĝ|ğ|ġ|ģ|ґ': 'g',
            'ĥ|ħ': 'h',
            'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı|і': 'i',
            'ĳ': 'ij',
            'ĵ': 'j',
            'ķ': 'k',
            'ĺ|ļ|ľ|ŀ|ł': 'l',
            'ñ|ń|ņ|ň|ŉ': 'n',
            'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º': 'o',
            'ö|œ': 'oe',
            'ŕ|ŗ|ř': 'r',
            'ś|ŝ|ş|ș|š|ſ': 's',
            'ß': 'ss',
            'ţ|ț|ť|ŧ': 't',
            'þ': 'th',
            'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ': 'u',
            'ü': 'ue',
            'ŵ': 'w',
            'ý|ÿ|ŷ': 'y',
            'є': 'ye',
            'ї': 'yi',
            'ź|ż|ž': 'z',
        };
    }

    slug(str, replacement) {
        if (replacement === undefined) {
            replacement = '-';
        }
        str = str.toLowerCase();
        var quotedReplacement = this.pregQuote(replacement, '/');
        this.replaceArr['[^A-Za-z0-9_]'] = replacement;
        this.replaceArr['[' + quotedReplacement + ']{2,}'] = replacement;
        this.replaceArr['^[' + quotedReplacement + ']+|[' + quotedReplacement + ']+$'] = '';

        for (var [srch, replc] of Object.entries(this.replaceArr)) {
//            console.log(str);
            str = str.replace(new RegExp(srch, 'gi'), replc);
        }

        return str.toLowerCase();
    }

    pregQuote(str, delimiter) { // eslint-disable-line camelcase
        //  discuss at: https://locutus.io/php/preg_quote/
        // original by: booeyOH
        // improved by: Ates Goral (https://magnetiq.com)
        // improved by: Kevin van Zonneveld (https://kvz.io)
        // improved by: Brett Zamir (https://brett-zamir.me)
        // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        //   example 1: preg_quote("$40")
        //   returns 1: '\\$40'
        //   example 2: preg_quote("*RRRING* Hello?")
        //   returns 2: '\\*RRRING\\* Hello\\?'
        //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
        //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

        return (str + '')
                .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&')
    }
}

export default new Inflector;
