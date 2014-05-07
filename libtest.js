var lib = require('./libformat.js');

describe('lib', function () {

    describe('trim()', function () {
        var trim = function (input, expected) {
            lib.trim(input).should.equal(expected);
        };

        it('should return empty string for empty input', function () {
            trim("", "");
        });
        it("should return same string if it's all alphanumeric", function () {
            trim("Иванов", "Иванов");
        });
        it('should trim spaces and newlines from string', function () {
            trim("Фамилия", "Фамилия");
            trim(" Фамилия", "Фамилия");
            trim("  Фамилия", "Фамилия");
            trim("Фамилия ", "Фамилия");
            trim("Фамилия  ", "Фамилия")
            trim("\nФамилия  ", "Фамилия")
            trim("\r\nФамилия \r ", "Фамилия")
            trim("\r Иван \r\n \n   ", "Иван");
            trim(" ", "");
            trim("  ", "");
        });
    });

    describe('oneline()', function () {
        var oneline = function (input, expected) {
            lib.oneline(input).should.equal(expected);
        };

        it('should handle trivial case', function () {
            oneline("", "");
        });

        it('should remove newlines from inside the line and replace it with spaces', function () {
            oneline("abc\r\ndef", "abc def");
            oneline("abc\ndef", "abc def");
            oneline("abc\rdef", "abc def");
            oneline("abc\r\n\r\r\r\ndef", "abc    def");
            oneline("ABC\r\nDEF\r\GHI", "ABC DEF GHI");
        });
        
        it('should leave lines without line breaks as is', function () {
            oneline("abc def", "abc def");
            oneline("abcdef", "abcdef");
        });
    });

    describe('clean()', function () {
        var clean = function (input, expected) {
            lib.clean(input).should.equal(expected);
        };

        it('should handle trivial case', function () {
            clean("", "");
        });
        it('should collapse repeating spaces inside strings', function () {
            clean("Иван     Иванович", "Иван Иванович");
            clean("Иванов   Иван     Иванович", "Иванов Иван Иванович");
        });
    });

    describe('titlecase()', function () {
        var titlecase = function (input, expected) {
            lib.titlecase(input).should.equal(expected);
        };
        
        it('should handle trivial case', function () {
            titlecase("", "");
        });
        it('should uppercase a first letter in each word', function () {
            titlecase("фамилия", "Фамилия");
            titlecase("иван иванович", "Иван Иванович");
            titlecase("surname name family-name", "Surname Name Family-Name");
        });
        it('should downcase all letters except first', function () {
            titlecase("ФАМИЛИЯ", "Фамилия");
            titlecase("фАМИЛИЯ", "Фамилия");
        });
    });

    describe('punctuate()', function () {
        var punctuate = function (input, expected) {
            lib.punctuate(input).should.equal(expected);
        };

        it('should ensure one space after punctuation and no spaces before punctuation', function () {
            punctuate("ул .Городская", "ул. Городская");
            punctuate("ул. Городская  , д . 4", "ул. Городская, д. 4");
            punctuate(",.;:?!a", ", . ; : ? ! a");
        });

        it('should put no spaces at end of string', function () {
            punctuate("ул.", "ул.");
            punctuate("ул . Овчинникова !", "ул. Овчинникова!");
            punctuate(" ! ", "!");
        });
        it('should tolerate multiple spaces', function () {
            punctuate("ул. Железнодорожников     ,    д   . 88,кв.183", "ул. Железнодорожников, д. 88, кв. 183");
        });
        
        it('should not put a space between a point and a colon', function () {
            punctuate("моб.:", "моб.:");
            punctuate("тел . :", "тел.:");
            punctuate('доб.:41-16', "доб.: 41-16");
        });

        it('should ensure that there is a space before an opening brackets', function () {
            punctuate("Один(другой", "Один (другой");
            punctuate("Один (другой", "Один (другой");
        });
        it('should ensure that there is no spaces after an opening brackets', function () {
            punctuate("Один (другой", "Один (другой");
            punctuate("Один ( другой", "Один (другой");
        });
        it('should ensure that there is no spaces before closing brackets', function () {
            punctuate("другой)", "другой)");
            punctuate("другой  )", "другой)");
        });
        it('should handle several problems with brackets normally', function () {
            punctuate("Один ( другой ) сделал ( не сделал )", "Один (другой) сделал (не сделал)");
        });
    });

    describe('phoneformat()', function () {
        var phoneformat = function (input, expected) {
            return lib.phoneformat(input).should.equal(expected);
        };

        it('should handle trivial cases', function () {
            phoneformat("", "");
        });

        it('should accept correctly-written full numbers as is', function () {
            phoneformat('8 (495) 333-45-23', '8 (495) 333-45-23');
            phoneformat('8 (8555) 33-45-23', '8 (8555) 33-45-23');
            phoneformat('+7 (950) 333-45-23', '+7 (950) 333-45-23');
            phoneformat('333-45-23', '333-45-23');
            phoneformat('33-45-23', '33-45-23');
        });

        it('should put missing 8 before the number', function () {
            phoneformat('(495) 967-968-9', '8 (495) 967-968-9');
            phoneformat('(4812) - 350-973', '8 (4812) 350-973');
            phoneformat('(4922) 53-15-81', '8 (4922) 53-15-81');
            phoneformat('(495) 941-93-20', '8 (495) 941-93-20');
        });
        
        it('should put missing +7 before the mobile number', function () {
            phoneformat('915-295-62-86', '+7 (915) 295-62-86');
            phoneformat('(915)-295-62-86', '+7 (915) 295-62-86');
        });

        it('should replace 8 with +7 in mobile numbers', function () {
            phoneformat('8(981)440-32-01', '+7 (981) 440-32-01');
            phoneformat('8 (909)662-43-68', '+7 (909) 662-43-68');
        });

        it('should correct improper spaces placement around the zone code and clean up unnecessary symbols', function () {
            phoneformat('8(495) 685-95-95', '8 (495) 685-95-95');
            phoneformat('+7(916) 885-11-58', '+7 (916) 885-11-58');
            phoneformat('+7(953) 60-39-094', '+7 (953) 60-39-094');
            phoneformat('8 (4812) - 350-973', '8 (4812) 350-973');
            phoneformat('8(4742)22-61-15', '8 (4742) 22-61-15');
        });

        it('should leave numbers with less than 10 symbols in them as is', function () {
            phoneformat('27-97-27', '27-97-27');
            phoneformat('41-16', "41-16");
            phoneformat('4120', "4120");
        });

        it('should correct most usual mistakes in writing numbers', function () {
            phoneformat('8-905-696-55-91', '+7 (905) 696-55-91');
            phoneformat('8-8552-96-55-91', '8 (8552) 96-55-91');
            phoneformat('8 495 941 93 20', '8 (495) 941-93-20');
            phoneformat('8-910-866-0002', '+7 (910) 866-0002');
            phoneformat('+7(904)-955-17-17', '+7 (904) 955-17-17');
            phoneformat('8-916-007-07-40', '+7 (916) 007-07-40');
        });

        it('should format digit-only numbers as nice as it can', function () {
            phoneformat('89042351638', '+7 (904) 235-16-38');
            phoneformat('88552346588', '8 (855) 234-65-88');
        });

        it('should be able to correct missing + in the international mobile number for Russia.', function () {
            phoneformat('79160070695', '+7 (916) 007-06-95');
        });

        it('should return anything which has symbols other than digits, dashes, closed parentheses and spaces unmodified', function () {
            phoneformat('1343-34234-40abdcd', '1343-34234-40abdcd');
            phoneformat('8-91adafsd6-0\n07-07-40', '8-91adafsd6-0\n07-07-40');
            phoneformat('891343-34234-40abdcd', '891343-34234-40abdcd');
            phoneformat('89.13.43-34.23', '89.13.43-34.23');
        });
        
    });
});
             
