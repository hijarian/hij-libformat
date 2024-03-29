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

    if (raw.match(/[^0-9-+)( ]/))
        return raw;

    // Basic cleanup of the long number
    var base = raw
        .collapseSpaces()
        .correctSpacesAroundParentheses()
        .trim();

    // Trim prefix to go international 
    if (base.charAt(0) == '8' || base.substring(0, 2) == '79')
        base = base.substring(1);
    else if (base.substring(0, 2) == '+7')
        base = base.substring(2);

    // If only numbers then format it as nice as you can.
    if (base.match(/\d+/))
        base = base.replace(/(\d\d\d)(\d\d\d)(\d\d)(\d+)$/, '($1) $2-$3-$4');

    // Replace spaces with dashes
    base = base.replace(/ +/g, '-');

    // Replace zone code inside dashes or spaces with zone code in parentheses
    base = base.replace(/^[- ]*(\d+)[- ]+/, '($1) ');

    // If we have parentheses, GREAT! Remove everything around them and put 8 at start.
    base = base.replace(/.*\((.*)\)[^0-9]+/, '8 ($1) ');

    // If zone code starts with 9, it's mobile number. Start it with international +7 
    // instead of Russia-specific 8
    base = base.replace(/^8 \(9/, '+7 (9');

    return base;
}

function oneline(raw) {
    return raw
	.replace(/\r?\n|\r/g, ' '); 
}




//------------------------------------------------------------------------
module.exports = {
    trim: trim,
    clean: clean,
    titlecase: titlecase,
    punctuate: punctuate,
    phoneformat: phoneformat,
    oneline: oneline
}
