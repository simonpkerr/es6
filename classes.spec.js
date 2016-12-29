const assert = chai.assert;

describe('Classes', () => {

    it('can be created', () => {

        class Task {};
        assert.typeOf(Task, 'function');
    });

    it('can be instantiated', () => {
        class Task {};
        const task = new Task();
        assert.typeOf(task, 'object');

    });

    it('can be determined using "instanceOf"', () => {
        class Task {};
        const task = new Task();
        assert.instanceOf(task, Task);
    });

    it('can have methods', () => {
        class Task {
            method() {
                return 99;
            }
        };
        const task = new Task();
        const result = task.method();
        assert.equal(result, 99);
    });

    it('with methods are added to the prototype', () => {
        class Task {
            method() {
                return 99;
            }
        };
        const task = new Task();
        assert.strictEqual(task.method, Task.prototype.method);
    });

    it('call their default constructor when being instantiated', () => {
        class Task {
            constructor(val) {
                this.val1 = val;
            }
            method() {
                return this.val1;
            }
        };
        const task = new Task(10);
        assert.equal(task.method(), 10);
    });

    it('can be assigned to variables', () => {
        let t = class Task {
            constructor(val) {
                this.val1 = val;
            }
            method() {
                return this.val1;
            }
        };
        let result = new t(10);
        assert.equal(result.method(), 10);

    });

    it('are not assigned to the global namespace', () => {
        class Task1 { };
        assert.notProperty(window, 'Task1');

    });

    it('can be extended', () => {
        class Parent {
            constructor() {
                this.val = 99;
            }
            getVal() {
                return this.val;
            }
        };
        class Child extends Parent {
        };

        const c = new Child();
        const result = c.getVal();

        assert.equal(result, 99);
    });

    it('can have children that call parent constructors', () => {
        class Parent {
            constructor() {
                this.val = 100;
            }
            getVal() {
                return this.val;
            }
        };
        class Child extends Parent {
            constructor() {
                super();
                this.val *= 2;
            }
        };

        const c = new Child();
        const result = c.getVal();

        assert.equal(result, 200);
    });

    it('throw an error when child classes with a constructor don\'t call the parent constructor', () => {
        class Parent {
            constructor() {
                this.val = 100;
            }
            getVal() {
                return this.val;
            }
        };
        class Child extends Parent {
            constructor() {
                // super();
                this.val = 2;
            }
        };
        // can't think how to test this :)
        // assert.throws(new Child, ReferenceError);
    });

    it('allow super to look up the prototype chain on class methods', () => {
        class Parent {
            getVal() {
                return 50;
            }
        };
        class Child extends Parent {
            getVal() {
                return super.getVal() + 10;
            }
        };

        const c = new Child();
        const result = c.getVal();

        assert.equal(result, 60);
    });

    it('allow "super" to be used on object literals', () => {
        const parent = {
            getVal() {
                return 50;
            }
        };
        const child = {
            getVal() {
                return super.getVal() + 10;
            }
        };

        Object.setPrototypeOf(child, parent);

        const result = child.getVal();

        assert.equal(result, 60);
    });

    it('can have class variables', () => {
        class Parent {
            constructor() {
                this.val = 1;
            }
        };
        class Child extends Parent { };
        const c = new Child();

        assert.equal(c.val, 1);


    });

    describe('static variables', () => {
        it('can be defined as part of a class', () => {
            class Stuff {
                static getDefaultId() {
                    return 0;
                }
            };

            const result = Stuff.getDefaultId();

            assert.equal(result, 0);

        });

        it('can be defined as properties directly on the class', () => {
            class Stuff { };
            Stuff.defaultId = 1;

            const result = Stuff.defaultId;

            assert.equal(result, 1);
        });
    });


});
