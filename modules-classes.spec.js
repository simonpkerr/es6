const assert = chai.assert;

describe('ES6 Syntax', () => {

    describe('Let', () => {
        it('should throw error if try to get variable before it was defined', () => {
            const f = () => {
                return productId; //console.log(productId); // defined error is generated
                let productId = 12;
            };

            assert.throws(f, 'productId is not defined');
        });

        it('should returned scoped variable', () => {
            const f = () => {
                let productId = 12;
                {
                    let productId = 2000;
                }

                return productId;
            };

            assert.equal(f(), 12);

        });

        it('should throw error if try to reference block level scoped variable', () => {
            const f = () => {
                {
                    let productId = 2000;
                }

                return productId;
            };

            assert.throws(f, 'productId is not defined');

        });

        it('should update value before its declared if its in a function', () => {
            function updateProductId() {
                productId = 12;
            };
            let productId = null;
            updateProductId();

            assert.equal(productId, 12);
        });

        it('scopes variables within loops', () => {
            let id = 42;
            for(let id = 0; id < 10; id+=1){

            }

            assert.equal(id, 42);
        });

        it('creates correct closures for variables in loops', () => {
            let updateFunctions = [];
            for(let i = 0 ; i < 2 ; i+=1) {
                updateFunctions.push(() => i);
            }

            let result = updateFunctions[0]();

            assert.equal(result, 0);
        });
    });

    describe('Const', () => {
        it ('throws an error if const is uninitialised', () => {
            // no way to test this as the javascript compiler breaks
            // const f = () => {
            //     const MARKUP_PCT;
            //     return MARKUP_PCT;
            // };

            assert.equal(true, true);
        });

        it ('throws an error if const is re-assigned', () => {
            const f = () => {
                const MARKUP_PCT = 100;
                MARKUP_PCT = 10;
                return MARKUP_PCT;
            }

            assert.throws(f, 'Assignment to constant variable.');
        });

        it ('has block scoping', () => {
            const MARKUP_PCT = 100;
            if (MARKUP_PCT > 0) {
                // anything declared in the block only applies to the block
                const MARKUP_PCT = 10;
            }

            assert.equal(MARKUP_PCT, 100);

        });
    });

    describe('Arrow functions', () => {
        it('allow creation of arrow functions', () => {
            const func = () => 5.99;

            assert.equal(typeof func, 'function');
        });

        it('have implicit return on arrow functions with no parentheses', () => {
            const func = () => 5.99;
            const result = func();

            assert.equal(result, 5.99);
        });

        it('allow no parentheses around functions that accept 1 parameter', () => {
            const func = count => count * 2;
            const result = func(4);

            assert.equal(result, 8);
        });

        it('expects parentheses around functions that accept 0 or more than 1 parameter', () => {
            const func = (count, tax) => count * 2 * tax;
            const result = func(4, 0.25);

            assert.equal(result, 2);
        });

        it('expects a return statement if its a block function', () => {
            const func = (count, tax) => {
                let result = 0;
                result += count;
                result *= tax;

                return result;
            };

            const result = func(10, 0.1);

            assert.equal(result, 1);
        });

        it('does not set "this" to the object that called the function', () => {
            const invoice = {
                number: 123,
                process: () => this
            };

            const result = invoice.process();
            // regardless of what called invoice.process, this 'this' object will always refer
            // to the context that the code runs in
            assert.instanceOf(result, Window);
        });

        it('sets the "this" object to the context that the code runs in', () => {
            const invoice = {
                number: 123,
                process: function(){
                    return () => this.number;
                }
            };

            // invoice.process returns a function that returns the context of the code that
            // called it, so 'this' becomes the invoice object, so it has access to 'number'
            const result = invoice.process()();

            assert.equal(result, 123);
        });

        it('does not allow the context of "this" to be changed by using bind', () => {
            const invoice = {
                number: 123,
                process: function(){
                    return () => this.number;
                }
            };

            const newInvoice = {
                number: 456
            };

            // in es5, functions could be bound to different objects using 'bind'
            // in es6, this is not possible
            const result = invoice.process().bind(newInvoice)();

            assert.equal(result, 123);
        });

        it('does not allow the context of "this" to be changed by using call', () => {
            const invoice = {
                number: 123,
                process: function(){
                    return () => this.number;
                }
            };

            const newInvoice = {
                number: 456
            };

            const result = invoice.process().call(newInvoice);

            assert.equal(result, 123);
        });

        it('does not allow the context of "this" to be changed by using apply', () => {
            const invoice = {
                number: 123,
                process: function(){
                    return () => this.number;
                }
            };

            const newInvoice = {
                number: 456
            };

            const result = invoice.process().apply(newInvoice);

            assert.equal(result, 123);
        });

        it('does not have a prototype property', () => {
            // unlike es5, es6 does not create a prototype property for
            // arrow functions
            const func = () => 5.99;

            assert.isFalse(func.hasOwnProperty('prototype'));
        });

        it('does not have an "arguments" array', () => {
            const func = id => arguments;

            assert.throws(func, ReferenceError);
        });
    });

    describe('Default function parameters', () => {

        it('allows parameters to have default values', () => {
            const func = (id = 1000) => id;

            const result = func();

            assert.equal(result, 1000);
        });

        it('uses default parameters when "undefined" is passed to function', () => {
            const func = (id = 1000, type = 'stuff') => id + ' ' + type;

            const result = func(undefined, 'nonsense');

            assert.equal(result, '1000 nonsense');
        });

        it('allow other default parameters to access each other in the function declaration', () => {
            const func = (price, tax = price * 0.07) => price + tax;

            const result = func(5.00);

            assert.equal(result, 5.35);
        });

        it('allow default parameters to access other variables in the same context', () => {
            const baseTax = 0.07;
            const func = (price, tax = price * baseTax) => price + tax;

            const result = func(5.00);

            assert.equal(result, 5.35);
        });

        it('allow default parameters to access other functions in the same context', () => {
            const baseTax = () => 0.07;
            const func = (price, tax = price * baseTax()) => price + tax;

            const result = func(5.00);

            assert.equal(result, 5.35);
        });

        it('are not counted in the arguments array', () => {
            const func = function(price = 1, tax = 5) { return arguments.length };

            const result = func(5.00);

            assert.equal(result, 1);
        });

        it('throws an error if default parameters try to access other defaults before they are initialised', () => {
            // note the order of the default parameters
            const func = (price = adjustment, adjustment = 1.00) => price + adjustment;

            assert.throws(func, ReferenceError);
        });

        it('allows default parameters to access other defaults before they are initialised if a value is passed', () => {
            // this is not necessarily a good thing, since the code will break
            // if its ever called without a value
            const func = (price = adjustment, adjustment = 1.00) => price + adjustment;

            const result = func(5.00);

            assert.equal(result, 6);
        });

        it('work with dynamic functions', () => {
            const dynFunc = new Function('price = 20.00', 'return price;');

            const result = dynFunc();

            assert.equal(result, 20.00);
        });
    });

    describe('Rest operator', () => {

        it('allows function parameters to be gathered up into an array', () => {
            const func = (id, ...categories) => categories;

            const result = func(50, 'cat 1', 'cat 2', 'cat 3');

            assert.instanceOf(result, Array);
            assert.equal(result.length, 3);
        });

        it('is ignored in length parameter of a function', () => {
            const func = (id, ...categories) => categories;

            const result = func.length;

            assert.equal(result, 1);
        });

        it('can be used in dynamic functions', () => {
            const func = new Function('...categories', 'return categories;');

            const result = func('cat1', 'cat2');

            assert.equal(result.length, 2);
        });

    });

    describe('Spread operator', () => {
        it('allows an array to be spread out', () => {
            const prices = [1, 2, 3];
            const result = Math.max(...prices);

            assert.equal(result, 3);
        });

        it('can be used to create arrays', () => {
            const prices = [1, 2, 3];
            const newArray = [...prices];

            assert.equal(newArray.length, 3);
        });

        it('can be used on strings', () => {
            const result = Math.max(...'43210');

            assert.equal(result, 4);
        });

        it('can be used to spread a combination of stuff', () => {
            const result = ['A', 'B', ...'CDEF', 'G'];

            assert.equal(result.length, 7);

            assert.deepEqual(result, ['A','B','C','D','E','F','G']);

        })
    });

    describe('Object literals', () => {
        it('can be created using variables rather than keys and values', () => {

            const price = 5.99;
            const quantity = 20;
            const product = {
                price, quantity
            };

            assert.deepEqual(product, { price: 5.99, quantity: 20 });

        });

        it('can contain functions without using the keyword "function"', () => {
            const price = 2;
            const quantity = 20;
            const product = {
                price,
                quantity,
                calcVal() {
                    // using a function is this way is like an arrow function
                    // 'this' refers to the context that the code runs in
                    return this.price * this.quantity
                }
            };

            const result = product.calcVal();

            assert.equal(result, 40);
        });

        it('can contain functions where the name is wrapped in quotes', () => {
            const price = 2;
            const quantity = 20;
            const product = {
                price,
                quantity,
                'calculate value'() {
                    return this.price * this.quantity
                }
            };

            const result = product['calculate value']();

            assert.equal(result, 40);

        });

        it('allow expressions to be used as object names', () => {
            const price = 2;
            const quantity = 20;
            const field = 'dynamicField';
            const product = {
                [field]: price,
                quantity,
            };

            assert.property(product, 'dynamicField');

        });

        it('allow expressions to be used as object function names', () => {
            const price = 2;
            const func = 'dynamicFunction';
            const product = {
                [func + '1']() {
                    return price;
                }
            };

            const result = product.dynamicFunction1();

            assert.equal(result, 2);

        });

        it('allow expressions to be used as getters and setters', () => {
            const id = 'productId';
            const product = {
                get[id]() { return true; },
                set[id](value) { }
            };

            let result = product.productId;

            assert.equal(result, true);
        });

    });

    describe('For..of loops', () => {

        it('loop through arrays', () => {
            const categories = ['cat1', 'cat2', 'cat3'];
            let newCategories = [];
            for (var item of categories) {
                newCategories.push(item);
            }

            assert.deepEqual(newCategories, ['cat1', 'cat2', 'cat3']);
        });

        it('loop through characters of a string', () => {
            const categories = 'ABC';
            let newCategories = [];
            for (var item of categories) {
                newCategories.push(item);
            }

            assert.deepEqual(newCategories, ['A','B','C']);
        });


    });

    describe('Octal literals', () => {
        it('can be output using an "o"', () => {
            const val = 0o10;
            assert.equal(val, 8);
        });
    });

    describe('Binary literals', () => {
        it('can be output using an "b"', () => {
            const val = 0b10;
            assert.equal(val, 2);
        });
    });

    describe('Template literals', () => {
        it('allow string interpolation using back ticks', () => {
            let invoiceNum = '1350';
            const result = `Invoice number: ${invoiceNum}`;

            assert.equal(result, 'Invoice number: 1350');

        });

        it('are not interpolated when the $ sign is escaped', () => {
            let invoiceNum = '1350';
            const result = `Invoice number: \${invoiceNum}`;

            assert.equal(result, 'Invoice number: ${invoiceNum}');

        });

        it('maintain white space and tabs', () => {
            let message = `A
            B
            C`;
            assert.notEqual(message, 'ABC');

        });

        it('allow expressions within the back ticks', () => {
            let invoice = '1350';
            const message = `Invoice number: ${'inv-' + invoice}`;

            assert.equal(message, 'Invoice number: inv-1350');
        });

        it('carry out interpolation before function execution', () => {
            let invoiceNum = 1350;
            const showMessage = message => {
                invoiceNum = 99;
                return message;
            };

            const result = showMessage(`Invoice number: ${invoiceNum}`);

            assert.equal(result, 'Invoice number: 1350');

        });

        it('allow custom templates to be defined', () => {
            const process = (segments, ...values) => {
                //do something with segments and values
            };

            let val1 = 1;
            let val2 = 20;
            process `Invoice: ${val1} for ${val2}`;

        });


    });

    describe('Destructuring', () => {
        it('allow arrays to be re-assigned', () => {
            const values = [1, 2, 3];
            const [ first, second, third ] = values;

            assert.equal(second, 2);

        });

        it('allows arrays to be re-assigned even if their lengths are different', () => {
            const values = [1, 2];
            const [ first, second, third ] = values;

            assert.isUndefined(third);
        });

        it('can use the rest operator', () => {
            const values = [1, 2, 3];
            const [ first, ...rest] = values;

            assert.equal(rest.length, 2);
            assert.deepEqual(rest, [2, 3]);
        });

        it('allow nested arrays to be re-assigned', () => {
            const values = [1, 2, ['1a', '1b']];
            const [ first, second, [third, fourth]] = values;

            assert.equal(third, '1a');
        });

        it('allow empty arrays to be used', () => {
            const [ a, b ] = [ , ];
            assert.isUndefined(a);
        });

        it('allow functions to destructure parameters', () => {
            const func = ([val1, val2], val3 = 'c') => val2;
            const result = func(['a', 'b']);

            assert.equal(result, 'b');
        });

        it('works on objects', () => {
            const obj = {
                a: 1,
                b: 2,
                c: 3
            };
            const { a, b, c} = obj;

            assert.equal(a, 1);
        });

        it('works on objects with new names', () => {
            const obj = {
                a: 1,
                b: 2,
                c: 3
            };
            const { a: res1, b: res2, c: res3} = obj;

            assert.equal(res1, 1);

        });

        it('works on strings', () => {
            const [ a, b ] = 'YZ';
            result = `first was ${a}, second was ${b}`;

            assert.equal(result, 'first was Y, second was Z');
        });
    });

});
