var lib = require('./libformat.js');

var surname = function (input, expected) {
   lib.formatSurname(input).should.equal(expected); 
};

describe('lib', function () {
    describe('convertSurname()', function () {
        it('should return empty string for empty input', function () {
            surname("", "");
        });
        it('should trim spaces and newlines from string', function () {
            surname("Surname", "Surname");
            surname(" Surname", "Surname");
            surname("  Surname", "Surname");
            surname("Surname ", "Surname");
            surname("Surname  ", "Surname");
            // Now with Cyrillic
            surname("Фамилия", "Фамилия");
            surname(" Фамилия", "Фамилия");
            surname("  Фамилия", "Фамилия");
            surname("Фамилия ", "Фамилия");
            surname("Фамилия  ", "Фамилия")
            surname("\nФамилия  ", "Фамилия")
            surname("\r\nФамилия \r ", "Фамилия")
        });
        it('should uppercase a first letter', function () {
            surname("фамилия", "Фамилия");
        });
        it('should downcase all letters except first', function () {
            surname("ФАМИЛИЯ", "Фамилия");
            surname("фАМИЛИЯ", "Фамилия");
        })
    })
});
             
