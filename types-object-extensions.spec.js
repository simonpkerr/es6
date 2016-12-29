const assert = chai.assert;

describe('Symbols', () => {
    it('have a type of symbol', () => {
        // when created, symbols provide a unique id
        let eventSymbol = Symbol('new symbol');

        assert.typeOf(eventSymbol, 'symbol');
    });

    it('can be used for constants to ensure a unique value', () => {
        const A_CONSTANT = Symbol('a constant');

        assert.equal(A_CONSTANT.toString(), 'Symbol(a constant)');
    });

    it('always create a unique id', () => {
        const A_CONSTANT = Symbol('a constant');
        const B_CONSTANT = Symbol('a constant');

        assert.notStrictEqual(A_CONSTANT, B_CONSTANT);
    });

    it('can be retrieved using the "for" keyword', () => {
        // if the symbol doesn't already exist, the 'for' keyword will create one
        const evtSymbol = Symbol.for('event');

        assert.equal(evtSymbol.toString(), 'Symbol(event)');
    });

    it('can be compared using the "for" keyword', () => {
        // if the symbol doesn't already exist, the 'for' keyword will create one
        const sym1 = Symbol.for('event');
        const sym2 = Symbol.for('event');

        assert.strictEqual(sym1.toString(), sym2.toString());
    });

    it('can have their readable strings retrieved using "keyFor"', () => {
        const sym1 = Symbol.for('event');
        const result = Symbol.keyFor(sym1);

        assert.equal(result, 'event');
    });

    it('can be used as object properties', () => {
        const article = {
            title: 'Some book',
            [Symbol.for('article')]: 'The Article'
        };

        const result = article[Symbol.for('article')];

        assert.equal(result, 'The Article');
    });

    it('can be retrieved from objects', () => {
        const article = {
            title: 'Some book',
            [Symbol.for('article')]: 'The Article'
        };

        const result = Object.getOwnPropertySymbols(article);

        assert.equal(result.pop().toString(), 'Symbol(article)');
    });


    describe('Well-known symbols', () => {

        it('allow toString functionality to be overridden', () => {
            let Blog = function() {};
            Blog.prototype[Symbol.toStringTag] = 'Blog Class';
            let blog = new Blog();

            const result = blog.toString();

            assert.equal(result, '[object Blog Class]');
        });

    });
});


describe('Object extensions', () => {
    it('allow one object to be set as the prototype of another', () => {
        let parent = { a: 1 };
        let child = { b: 2 };

        Object.setPrototypeOf(child, parent);

        assert.property(child, 'a');
        assert.notProperty(parent, 'b');
    });

    describe('assign', () => {

        it('allows multiple objects to be assigned to a new object', () => {
            let parent = {a: 1};
            let child = {b: 2};
            let target = {};

            Object.assign(target, child, parent);
            const keys = Object.keys(target).length;

            assert.equal(keys, 2);
            assert.property(target, 'a');
            assert.property(target, 'b');
        });

        it('allows object properties to be merged into a new object', () => {
            let obj1 = {a: 1, b: 2};
            let obj2 = {a: 999};
            let target = {};

            Object.assign(target, obj1, obj2);

            assert.deepEqual(target, {a: 999, b: 2});
        });

        it('only merges enumerable properties', () => {
            let obj1 = {a: 1, b: 2};
            let obj2 = {a: 999};

            // by default, all properties are enumerable
            Object.defineProperty(obj1, 'c', {
                value: 3,
                enumerable: false
            });
            let target = {};

            Object.assign(target, obj1, obj2);

            assert.deepEqual(target, {a: 999, b: 2});
        });

    });

    it('can be used to compare 2 objects for strict equality', () => {
        const amount = NaN;

        const result = Object.is(amount, amount);

        // in es5, if the value was NaN, strict equality would fail when doing a comparison
        const wrongResult = amount === amount;

        assert.equal(result, true);
        assert.notEqual(wrongResult, true);
    });
});

describe('String extensions', () => {
    it('contain a "startsWith" property', () => {
        const str = 'Hi there my friend';
        const result = str.startsWith('Hi');

        assert.equal(result, true);
    });

    it('contain an "endsWith" property', () => {
        const str = 'Hi there my friend';
        const result = str.endsWith('friend');

        assert.equal(result, true);
    });

    it('contain an "includes" property', () => {
        const str = 'my my my, Hi there my friend';
        const result = str.includes('my');

        assert.equal(result, true);
    });

    it('allow unicode symbols', () => {
        // this is the unicode sequence for the surfer emoji
        const s = 'Surfers \u{1f3c4} beach';

        assert.equal(s, 'Surfers \u{1f3c4} beach');

    });

    it('include a "repeat" function', () => {
        const s = 'a-';
        const repeatedS = s.repeat(3);

        assert.equal(repeatedS, 'a-a-a-');

    });
});

describe('Number extensions', () => {
    it('contain a parseInt function', () => {

        assert.strictEqual(Number.parseInt, parseInt);
    });

    it('properly evaluate isNaN', () => {

        const s = 'NaN';
        const result = Number.isNaN(s);
        const es5Result = isNaN(s);

        assert.equal(result, false);

        // es5 would convert the string to an actual NaN value
        assert.equal(es5Result, true);
    });

    it('contain an "isInteger" function', () => {

        const val = 9.5;
        const result = Number.isInteger(val);

        assert.equal(Number.isInteger(9.5), false);
        assert.equal(Number.isInteger(NaN), false);
        assert.equal(Number.isInteger(Infinity), false);
        assert.equal(Number.isInteger(undefined), false);
        assert.equal(Number.isInteger(3), true);

    });


});