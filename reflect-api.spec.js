const assert = chai.assert;

describe('Reflect API', () => {
    it('is an object that can be used like Math', () => {
        assert.typeOf(Reflect, 'object');
    });

    // can't get it to work
    xit('can be used to construct class instances', () => {
        class Thing {};
        let something = Reflect.construct(Thing, null);
        console.log(typeof something);
        // assert.instanceOf(something, Thing);
    });

    it('allows objects to be created with arguments', () => {
        class Book {
            constructor(colour, title) {
                this.toString = () => `My ${colour} book called ${title}`;
            }
        };

        let b = Reflect.construct(Book, ['red', 'Stuff']);
        assert.equal(b.toString(), 'My red book called Stuff');
    });

    it('allows a prototype to be set on a class', () => {
        class Book {};
        let setup = {
            getId() { return 1; }
        };
        let b = new Book();
        Reflect.setPrototypeOf(b, setup);

        const result = b.getId();
        assert.equal(result, 1);
    });

    it('has a "has" method to test for property existence', () => {
        class Book {
            constructor() {
                this.length = 1000;
            }
        }

        class ScifiBook extends Book {
            constructor() {
                super();
                this.weirdnessFactor = 6.5;
            }
        }

        let b = new ScifiBook();
        assert.equal(Reflect.has(b, 'weirdnessFactor'), true);
        assert.equal(Reflect.has(b, 'length'), true);
    });

    it('can be used to get an array of class properties', () => {
        class Book {
            constructor() {
                this.length = 1000;
            }
        }

        class ScifiBook extends Book {
            constructor() {
                super();
                this.weirdnessFactor = 6.5;
            }
        }

        let b = new ScifiBook();
        assert.deepEqual(Reflect.ownKeys(b), ['length', 'weirdnessFactor']);

    });

    it('allows properties to be defined', () => {
        class Book {}
        let b = new Book();
        Reflect.defineProperty(b, 'id', {
            value: 1,
            configurable: true,
            enumerable: true
        });

        assert.equal(b.id, 1);
    });

    it('allows properties to be deleted', () => {
        class Book {
            constructor() {
                this.id = 1;
            }
        }
        let b = new Book();
        Reflect.deleteProperty(b, 'id');

        assert.isUndefined(b.id);
    });

    it('allows property descriptions to be retrieved', () => {
        class Book {
            constructor() {
                this.id = 1;
            }
        }
        let b = new Book();
        const d = Reflect.getOwnPropertyDescriptor(b, 'id');

        assert.deepEqual(d, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: 1
        });
    });

    describe('get and set', () => {

        it('allows properties of classes to be retrieved', () => {
            class Book {
                constructor() {
                    this.id = 1000;
                }
            }

            let b = new Book();
            const result = Reflect.get(b, 'id');

            assert.equal(result, 1000);
        });

        it('allows properties to be got and "this" object specified', () => {
            class Book {
                constructor() {
                    this._id = 1000;
                }

                get id() {
                    return this._id;
                }
            }

            let b = new Book();

            // inside the id getter, "this" becomes the object with a property _id set to -1
            const result = Reflect.get(b, 'id', {_id: -1});

            assert.equal(result, -1);
        });

        it('allows properties to be set', () => {
            class Book {
                constructor() {
                    this.id = 1000;
                }
            }

            let b = new Book();
            Reflect.set(b, 'id', -1);

            assert.equal(b.id, -1);
        });
    });

    describe('Apply', () => {
        it('can be used to invoke class methods', () => {
            class Book {
                constructor(colour, title) {
                    this.page = 1;
                    this.toString = () => `My ${colour} book called ${title}`;
                }

                read() {
                    return `reading page ${this.page} of the book`;
                }
            }
            ;

            // the object passed in becomes the "this" object inside the method
            let b = Reflect.apply(Book.prototype.read, {page: 10}, []);
            assert.equal(b, 'reading page 10 of the book');
        });

        it('can be used with parameters', () => {
            class Book {
                constructor(colour, title) {
                    this.page = 1;
                    this.toString = () => `My ${colour} book called ${title}`;
                }

                read(part) {
                    return `reading page ${this.page}-${part} of the book`;
                }
            }
            ;

            // the object passed in becomes the "this" object inside the method
            let b = Reflect.apply(Book.prototype.read, {page: 10}, ['b']);
            assert.equal(b, 'reading page 10-b of the book');
        });
    });
    

    describe('Extensions', () => {
        it('preventExtensions stops additional properties being added to objects', () => {
            let obj = {
                id: 1
            };
            Reflect.preventExtensions(obj);
            obj.title = 'funk';

            assert.isUndefined(obj.title);
        });

        it('isExtensible returns true if an object can be extended', () => {
            let obj = {
                id: 1
            };
            assert.isTrue(Reflect.isExtensible(obj));
        });

        it('isExtensible returns false if an object cannot be extended', () => {
            let obj = {
                id: 1
            };
            Reflect.preventExtensions(obj)
            assert.isFalse(Reflect.isExtensible(obj));
        });
    });

});