/**
 * Rules for formatting stuff.
 */

String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.trim = function () {
    return this
        .replace(/^\s+/, '')
        .replace(/\s+$/, '');
}

exports.formatSurname = function (raw) {
    return raw.trim().ucfirst();
}

