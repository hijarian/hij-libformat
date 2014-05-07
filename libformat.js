/**
 * Rules for formatting stuff.
 */

String.prototype.titleCaseAll = function () {
    return this
        .replace(
                /[a-zA-Z\u0400-\u04FF]+/g,  // Cyrillic letters and Latin letters
            function(txt){
                return txt.titleCase();
            }
        );
}

String.prototype.titleCase = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

String.prototype.trim = function () {
    return this
        .replace(/^\s+/, '')
        .replace(/\s+$/, '');
}

String.prototype.collapseSpaces = function () {
    return this
        .replace(/ +/g, ' ');
}

String.prototype.correctSpacesAroundParentheses = function () {
    return this
        .replace(/\s*\(\s*/g, ' (')
        .replace(/\s*\)\s*/g, ') ');
};

String.prototype.correctSpacesAroundPunctuation = function () {
    return this
        .replace(/\s*([,.;:!?])\s*/g, '$1 ')
        .replace(/\. :/g, '.:');
}

//------------------------------------------------------------------------
// API
function trim(raw) {
    return raw.trim();
}

function clean(raw) {
    return raw.collapseSpaces();
}

function titlecase(raw) {
    return raw.titleCaseAll();
}

function punctuate(raw) {
    return raw
        .correctSpacesAroundPunctuation()
        .correctSpacesAroundParentheses()
        .trim();
}

function phoneformat(raw) {

    // If we have short number, there's nothing really what we can do.
    if (raw.length < 10)
        return raw;

    // Basic cleanup of the long number
    var base = raw
        .collapseSpaces()
        .correctSpacesAroundParentheses()
        .trim();

    // If we have parentheses, GREAT! Remove everything around them and put 8 at start.
    base = base.replace(/.*\((.*)\)[^0-9]+/, '8 ($1) ');
    
    // mobile phone without 8
    if (base.charAt(0) == '9' || base.substring(0, 2) == '(9') 
        return base.replace(/[^0-9]/g, '').replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)$/, '+7 ($1) $2-$3-$4');

    // mobile number without '+' and punctuation
    if (base.substring(0,2) == '79')
        return base.substring(1).replace(/[^0-9]/g, '').replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)$/, '8 ($1) $2-$3-$4').replace(/^8 \(9/, '+7 (9');

    // Replace zone code in dashes with zone code in parentheses
    base = base.replace(/^8-(\d+)-/, '8 ($1) ');

    // If zone code starts with 9, it's mobile number. Start it with international +7 
    // instead of Russia-specific 8
    base = base.replace(/^8 \(9/, '+7 (9');

    return base;
}


//------------------------------------------------------------------------
module.exports = {
    trim: trim,
    clean: clean,
    titlecase: titlecase,
    punctuate: punctuate,
    phoneformat: phoneformat
}
