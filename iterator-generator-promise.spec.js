const assert = chai.assert;

describe('Iterators', () => {

    it('when called on an array, give a function', () => {

        const vals = [1,2,3,4];
        const it = vals[Symbol.iterator];

        assert.typeOf(it, 'function');
    });
    
    it('should allow "it" to be called', () => {
        const vals = [1,2,3,4];
        const it = vals[Symbol.iterator]();
        const result = it.next();
        assert.deepEqual(result, {
            done: false,
            value: 1
        });
    });
    
    it('should return undefined for the value when exhausted', () => {
        const vals = [1,2];
        const it = vals[Symbol.iterator]();
        it.next();
        it.next();
        const result = it.next();

        assert.deepEqual(result, {
            done: true,
            value: undefined
        });
    });

    it('should be created using a "Symbol.iterator" property', () => {
        const idMaker = {
            [Symbol.iterator]() {
                let nextId = 8000;
                return {
                    next() {
                        return {
                            value: nextId++,
                            done: false
                        };
                    }
                }
            }
        };

        const iter = idMaker[Symbol.iterator]();
        assert.equal(iter.next().value, 8000);
        assert.equal(iter.next().value, 8001);
    });

    it('should work with for...of loops', () => {
        const idMaker = {
            [Symbol.iterator]() {
                let nextId = 8000;
                return {
                    next() {
                        return {
                            value: nextId++,
                            done: false
                        };
                    }
                }
            }
        };
        let v;

        for (v of idMaker) {
            if (v > 8002) break;
        }

        assert.equal(v, 8003);
    });

});

describe('Generators', () => {
    it('can be used to return an iterator', () => {
        function *process() {
            yield 8000;
            yield 8001;
        }

        let it = process();
        assert.deepEqual(it.next(), {
            value: 8000,
            done: false
        });
    });

    it('can be used to define a custom iterator', () => {
        function *backwardsArray(array) {
            let i = array.length - 1;
            while(i >= 0) {
                yield array[i--];
            }
        }
        let v;
        for(v of backwardsArray([1,2,3,4,5])) {
            console.log(v);
        }

        assert.equal(v, 1);
    });
});

describe('Promises', () => {
    it('allow asynchronous operations to occur', (done) => {
        let data = null;
        const async = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ data: 'the data' });
            }, 100);
        });

        async.then(response => {
            data = response.data;
            assert.equal(data, 'the data');
            done();
        });
    });

    it('allow asynchronous operations to fail', (done) => {
        let data = null;
        const async = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('something went wrong');
            }, 100);
        });

        async.catch(err => {
            assert.equal(err, 'something went wrong');
            done();
        });
    });

    it('allow multiple thens', () => {
        let data = null;
        const p1 = new Promise((resolve, reject) => {
            resolve('its all good');
        });

        p1.then(response => {
            return response + ' man';
        }).then(response => {
            assert.equal(response, 'its all good man');
        });
    });

    xit('allows a resolution of a promise from the failure of another', () => {
        const p1 = Promise.reject('error');

        const p2 = new Promise((resolve, reject) => {
            p1.catch((err) => {
                resolve(err);
            });
        });

        const p3 = p2
            .then((response) => {
                console.log('in resolve', response);
            })
            .catch((err) => {
                console.log('in reject', err);
            });

    });

    it('allows chaining of promises', () => {
        const p1 = new Promise((resolve, reject) => {
            reject('its bad');
        });

        // even though p2 resolves the promise, p1 rejects it
        // so ultimately, the promise is rejected
        const p2 = new Promise((resolve, reject) => {
            resolve(p1);
        });

        p2.catch(err => {
            assert.equal(err, 'its bad');
        });

    });

    it('have static methods to resolve promises', () => {
        const async = () => Promise.resolve('all good');

        async().then(response => {
            assert.equal(response, 'all good');
        })
    });

    it('have static methods to reject promises', () => {
        const async = () => Promise.reject('baaad');

        async().catch(err => {
            assert.equal(err, 'baaad');
        });
    });

    it('have an "all" method allowing multiple promises to be passed in', (done) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done 1');
            }, 200);
        });

        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done 2');
            }, 100);
        });

        /**
         * even though p2 resolves before p1, the response
         * maintains the order of promises called using 'all'
         */
        Promise.all([p1,p2]).then(response => {
            assert.equal(response[0], 'done 1');
            assert.equal(response[1], 'done 2');
            done();
        })

    });

    it('"all" method handles resolutions and rejections', (done) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done 1');
            }, 200);
        });

        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('not good');
            }, 100);
        });

        Promise.all([p1,p2]).catch(err => {
            assert.equal(err, 'not good');
            done();
        })

    });

    it('have a "race" method that executes as soon as the first promise resolves/rejects', (done) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done 1');
            }, 200000);
        });

        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done 2');
            }, 100);
        });

        Promise.race([p1,p2]).then(response => {
            assert.equal(response, 'done 2');
            done();
        })

    });

});