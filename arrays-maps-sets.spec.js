const assert = chai.assert;

describe('Arrays', () => {
    describe('from method', () => {
        it('allows arrays to be mapped', () => {
            const items = [1, 2, 3];
            const array1 = Array.from(items, i => i + 100);

            assert.deepEqual(array1, [101, 102, 103]);
        });

        it('allows an object to be passed that will become "this" inside the function', () => {
            const items = [1, 2, 3];
            const array1 = Array.from(items, function (i) {
                // must be an ordinary function, not arrow function
                return i + this.adjustment;
            }, {adjustment: 10});

            assert.deepEqual(array1, [11, 12, 13]);
        });
    });

    describe('fill method', () => {
        it('can be used to fill array indices', () => {
            const items = [1, 2, 3];
            const array1 = items.fill(-1);

            assert.deepEqual(array1, [-1, -1, -1]);
        });

        it('allows start and end indices to be defined', () => {
            const items = [1, 2, 3];
            const array1 = items.fill(-1, 1, 2);

            assert.deepEqual(array1, [1, -1, 3]);
        });

        it('allows assignment from the end of the array', () => {
            const items = [1, 2, 3];
            const array1 = items.fill(200, -1);

            assert.deepEqual(array1, [1, 2, 200]);
        });
    });


});

describe('Maps', () => {
    it('allow objects to be used as keys', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        assert.equal(employees.get(emp1), 'abc');
    });

    it('have a size attribute', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        assert.equal(employees.size, 2);
    });

    it('contains a delete method', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        employees.delete(emp1);

        assert.equal(employees.size, 1);
    });

    it('contains a clear method', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        employees.clear();

        assert.equal(employees.size, 0);
    });

    it('can be passed an iterable element in order to instantiate', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        const emps = [
            [ emp1, 'abc' ],
            [ emp2, 'def' ]
        ];

        let employees = new Map(emps);
        assert.equal(employees.size, 2);
        assert.equal(employees.get(emp1), 'abc');
    });

    it('contains a "has" method that allows boolean checks for existence of a map key', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        assert.equal(employees.has(emp1), true);
    });

    it('contains a "values" method that can be used to output values', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        const values = [...employees.values()];

        assert.deepEqual(values, ['abc', 'def']);
    });

    it('contains an "entries" method that contains all elements', () => {
        const emp1 = { name: 'Simon' };
        const emp2 = { name: 'John' };

        let employees = new Map();
        employees.set(emp1, 'abc');
        employees.set(emp2, 'def');

        const els = [...employees.entries()];

        assert.equal(els[0][1], 'abc');
    });

});

describe('Sets', () => {
    it('can have elements added using the "add" method', () => {
        let stuff = new Set();
        stuff.add('potatoes');
        stuff.add('blancmange');

        assert.equal(stuff.size, 2);
    });

    it('cannot have duplicate elements that are primitive types', () => {
        let stuff = new Set();
        stuff.add('potatoes');
        stuff.add('blancmange');
        stuff.add('blancmange');
        stuff.add('blancmange');

        assert.equal(stuff.size, 2);
    });

    it('can have duplicate elements that are objects', () => {
        let stuff = new Set();
        stuff.add({ id: 1 });
        stuff.add({ id: 1 });

        assert.equal(stuff.size, 2);
    });

    it('can be created from arrays', () => {
        let stuff = new Set([
            'thing1',
            'thing2',
            'thing3'
        ]);
        assert.equal(stuff.size, 3);
    });

    it('can be created from any iterable element', () => {
        let stuff = new Set([
            'thing1',
            'thing2',
            'thing3'
        ]);
        let moreStuff = new Set(stuff);
        assert.equal(moreStuff.size, 3);
    });

    it('have a "has" method to test for existence of an element', () => {
        let stuff = new Set([
            'thing1',
            'thing2',
            'thing3'
        ]);
        assert.equal(stuff.has('thing1'), true);
    });

    describe('Weak sets', () => {
        it('can be created with object literals', () => {
            let stuff = new WeakSet([
                { id: 1 },
                { id: 2 }
            ]);

            assert.equal(stuff instanceof WeakSet, true);
        });

        it('have a "has" method to test for existence of keys', () => {
            const objs = [
                { id: 1 },
                { id: 2 }
            ];
            let stuff = new WeakSet(objs);

            assert.equal(stuff.has(objs[0]), true);
        });
    });

});