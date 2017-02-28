const assert = chai.assert;

describe('Proxy API', () => {

    it('can be used to access object property names using Reflect', () => {
        function Book() {
            this.id = 1;
            this.name = 'The Thing';
        }
        const b = new Book();

        const p = new Proxy(b, {
            get: (target, prop, receiver) => {
                return `accessing: ${prop}`
            }
        });

        const result = p.name;

        assert.equal('accessing: name', result);

    });

    it('can be used to access object property values using Reflect', () => {
        function Book() {
            this.id = 1;
            this.name = 'The Thing';
        }
        const b = new Book();

        const p = new Proxy(b, {
            get: (target, prop, receiver) => `value: ${Reflect.get(target, prop, receiver)}`
        });

        const result = p.name;

        assert.equal('value: The Thing', result);
    });

    it('can be used to add logic to object getters/setters', () => {
        function Employee() {
            this.id = 1;
            this.name = 'Sam McMan';
            this.salary = 5000;
        }
        const e = new Employee();

        const p = new Proxy(e, {
            get: (target, prop, receiver) => {
                if (prop !== 'salary') {
                    return Reflect.get(target, prop, receiver);
                }

                return 'access denied';
            }
        });

        assert.equal(p.name, 'Sam McMan');
        assert.equal(p.salary, 'access denied');
    });

    it('can be used to call function', () => {
        const getId = () => 101;

        const p = new Proxy(getId, {
            apply: (target, thisArg, argumentsList) => Reflect.apply(target, thisArg, argumentsList)
        });

        assert.equal(p(), 101);
    });

    it('can be used as a prototype for an object', () => {
        const b = {
            id: 1
        };

        /**
         * by setting up a proxy on an empty object, this then allows assignment
         * of this as the prototype of another object. This then gives full control
         * over the prototype of that object.
         */
        const p = new Proxy({}, {
            get: (target, prop, receiver) => `Property ${prop} doesn't exist`
        });

        Object.setPrototypeOf(b, p);

        assert.equal(b.id, 1);
        assert.equal(b.size, 'Property size doesn\'t exist');

    });

    it('can be used as revocable objects', () => {
        const b = {
            id: 1
        };

        const { proxy, revoke } = Proxy.revocable(b, {
            get: (target, prop, receiver) => Reflect.get(target, prop, receiver)
        });

        assert.equal(proxy.id, 1);
        revoke();

        // now the object properties cannot be accessed using the proxy

    });

});