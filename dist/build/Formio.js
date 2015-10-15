(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.formiojs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = name.toString();
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url

    this.credentials = options.credentials || 'omit'
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    // TODO: Request constructor should accept input, init
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();

},{}],4:[function(require,module,exports){
'use strict'

module.exports = function(_baseUrl, _noalias, _domain) {
  require('whatwg-fetch');
  var Q = require('Q');

// The default base url.
  var baseUrl = _baseUrl || '';
  var noalias = _noalias || false;
  var cache = {};

  /**
   * Returns parts of the URL that are important.
   * Indexex
   *  - 0: The full url
   *  - 1: The protocol
   *  - 2: The hostname
   *  - 3: The rest
   *
   * @param url
   * @returns {*}
   */
  var getUrlParts = function(url) {
    return url.match(/^(http[s]?:\/\/)([^/]+)($|\/.*)/);
  };

  var serialize = function(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  // The formio class.
  var Formio = function(path) {

    // Ensure we have an instance of Formio.
    if (!(this instanceof Formio)) { return new Formio(path); }
    if (!path) {
      // Allow user to create new projects if this was instantiated without
      // a url
      this.projectUrl = baseUrl + '/project';
      this.projectsUrl = baseUrl + '/project';
      this.projectId = false;
      this.query = '';
      return;
    }

    // Initialize our variables.
    this.projectsUrl = '';
    this.projectUrl = '';
    this.projectId = '';
    this.formUrl = '';
    this.formsUrl = '';
    this.formId = '';
    this.submissionsUrl = '';
    this.submissionUrl = '';
    this.submissionId = '';
    this.actionsUrl = '';
    this.actionId = '';
    this.actionUrl = '';
    this.query = '';

    // Normalize to an absolute path.
    if ((path.indexOf('http') !== 0) && (path.indexOf('//') !== 0)) {
      baseUrl = baseUrl ? baseUrl : window.location.href.match(/http[s]?:\/\/api./)[0];
      path = baseUrl + path;
    }

    var hostparts = getUrlParts(path);
    var parts = [];
    var hostName = hostparts[1] + hostparts[2];
    path = hostparts.length > 3 ? hostparts[3] : '';
    var queryparts = path.split('?');
    if (queryparts.length > 1) {
      path = queryparts[0];
      this.query = '?' + queryparts[1];
    }

    // See if this is a form path.
    if ((path.search(/(^|\/)(form|project)($|\/)/) !== -1)) {

      // Register a specific path.
      var registerPath = function(name, base) {
        this[name + 'sUrl'] = base + '/' + name;
        var regex = new RegExp('\/' + name + '\/([^/]+)');
        if (path.search(regex) !== -1) {
          parts = path.match(regex);
          this[name + 'Url'] = parts ? (base + parts[0]) : '';
          this[name + 'Id'] = (parts.length > 1) ? parts[1] : '';
          base += parts[0];
        }
        return base;
      }.bind(this);

      // Register an array of items.
      var registerItems = function(items, base, staticBase) {
        for (var i in items) {
          var item = items[i];
          if (item instanceof Array) {
            registerItems(item, base, true);
          }
          else {
            var newBase = registerPath(item, base);
            base = staticBase ? base : newBase;
          }
        }
      };

      registerItems(['project', 'form', ['submission', 'action']], hostName);
    }
    else {

      // This is an aliased url.
      this.projectUrl = hostName;
      this.projectId = (hostparts.length > 2) ? hostparts[2].split('.')[0] : '';
      var subRegEx = new RegExp('\/(submission|action)($|\/.*)');
      var subs = path.match(subRegEx);
      this.pathType = (subs && (subs.length > 1)) ? subs[1] : '';
      path = path.replace(subRegEx, '');
      path = path.replace(/\/$/, '');
      this.formsUrl = hostName + '/form';
      this.formUrl = hostName + path;
      this.formId = path.replace(/^\/+|\/+$/g, '');
      var items = ['submission', 'action'];
      for (var i in items) {
        var item = items[i];
        this[item + 'sUrl'] = hostName + path + '/' + item;
        if ((this.pathType === item) && (subs.length > 2) && subs[2]) {
          this[item + 'Id'] = subs[2].replace(/^\/+|\/+$/g, '');
          this[item + 'Url'] = hostName + path + subs[0];
        }
      }
    }
  };

  /**
   * Load a resource.
   *
   * @param type
   * @returns {Function}
   * @private
   */
  var _load = function(type) {
    var _id = type + 'Id';
    var _url = type + 'Url';
    return function(query) {
      if (typeof query === 'object') {
        query = '?' + serialize(query.params);
      }
      if (!this[_id]) { return Q.reject('Missing ' + _id); }
      return Formio.request(this[_url] + this.query);
    };
  };

  /**
   * Save a resource.
   *
   * @param type
   * @returns {Function}
   * @private
   */
  var _save = function(type) {
    var _id = type + 'Id';
    var _url = type + 'Url';
    return function(data) {
      var method = this[_id] ? 'put' : 'post';
      var reqUrl = this[_id] ? this[_url] : this[type + 'sUrl'];
      cache = {};
      return Formio.request(reqUrl + this.query, method, data);
    };
  };

  /**
   * Delete a resource.
   *
   * @param type
   * @returns {Function}
   * @private
   */
  var _delete = function(type) {
    var _id = type + 'Id';
    var _url = type + 'Url';
    return function() {
      if (!this[_id]) { Q.reject('Nothing to delete'); }
      cache = {};
      return Formio.request(this[_url], 'delete');
    };
  };

  /**
   * Resource index method.
   *
   * @param type
   * @returns {Function}
   * @private
   */
  var _index = function(type) {
    var _url = type + 'sUrl';
    return function(query) {
      query = query || '';
      if (typeof query === 'object') {
        query = '?' + serialize(query.params);
      }
      return Formio.request(this[_url] + query);
    };
  };

  // Define specific CRUD methods.
  Formio.prototype.loadProject = _load('project');
  Formio.prototype.saveProject = _save('project');
  Formio.prototype.deleteProject = _delete('project');
  Formio.prototype.loadForm = _load('form');
  Formio.prototype.saveForm = _save('form');
  Formio.prototype.deleteForm = _delete('form');
  Formio.prototype.loadForms = _index('form');
  Formio.prototype.loadSubmission = _load('submission');
  Formio.prototype.saveSubmission = _save('submission');
  Formio.prototype.deleteSubmission = _delete('submission');
  Formio.prototype.loadSubmissions = _index('submission');
  Formio.prototype.loadAction = _load('action');
  Formio.prototype.saveAction = _save('action');
  Formio.prototype.deleteAction = _delete('action');
  Formio.prototype.loadActions = _index('action');
  Formio.prototype.availableActions = function() { return Formio.request(this.formUrl + '/actions'); };
  Formio.prototype.actionInfo = function(name) { return Formio.request(this.formUrl + '/actions/' + name); };

  // Static methods.
  Formio.loadProjects = function() { return this.request(baseUrl + '/project'); };
  Formio.request = function(url, method, data) {
    if (!url) { return Q.reject('No url provided'); }
    method = (method || 'GET').toUpperCase();

    // Get the cached promise to save multiple loads.
    var cacheKey = btoa(url);
    if (method === 'GET' && cache.hasOwnProperty(cacheKey)) {
      cache[cacheKey].finally(function() {
        Formio.onRequestDone();
      });
      return cache[cacheKey];
    }
    else {
      var promise = Q()
      .then(function() {
        // Set up and fetch request
        var headers = new Headers({
          'Accept': 'application/json',
          'Content-type': 'application/json; charset=UTF-8'
        });
        var token = Formio.getToken();
        if (token) {
          headers.append('x-jwt-token', token);
        }

        var options = {
          method: method,
          headers: headers,
          mode: 'cors'
        };
        if (data) {
          options.body = JSON.stringify(data);
        }

        return fetch(url, options);
      })
      .then(function(response) {
        // Handle fetch results
        if (response.ok) {
          var token = response.headers.get('x-jwt-token');
          if (response.status >= 200 && response.status < 300 && token && token !== '') {
            Formio.setToken(token);
          }
          // 204 is no content. Don't try to .json() it.
          if (response.status === 204) {
            return {};
          }
          return response.json();
        }
        else {
          if (response.status === 440) {
            Formio.setToken(null);
          }
          // Parse and return the error as a rejected promise to reject this promise
          return (response.headers.get('content-type').indexOf('application/json') !== -1 ?
            response.json() : response.text())
            .then(function(error){
              throw error;
            });
        }
      })
      .catch(function(err) {
        // Remove failed promises from cache
        delete cache[cacheKey];
        // Propagate error so client can handle accordingly
        throw err;
      });

      // Save the cache
      if (method === 'GET') {
        cache[cacheKey] = promise;
      }

      return promise;
    }
  };

  Formio.setToken = function(token) {
    token = token || '';
    if (token === this.token) { return; }
    this.token = token;
    if (!token) {
      Formio.setUser(null);
      return localStorage.removeItem('formioToken');
    }
    localStorage.setItem('formioToken', token);
  };
  Formio.getToken = function() {
    if (this.token) { return this.token; }
    var token = localStorage.getItem('formioToken') || '';
    this.token = token;
    return token;
  };
  Formio.setUser = function(user) {
    if (!user) {
      this.setToken(null);
      return localStorage.removeItem('formioUser');
    }
    localStorage.setItem('formioUser', user);
  };
  Formio.getUser = function() {
    return localStorage.getItem('formioUser');
  };

  Formio.setBaseUrl = function(url, _noalias) {
    baseUrl = url;
    noalias = _noalias;
    Formio.baseUrl = baseUrl;
  }
  Formio.clearCache = function() { cache = {}; };

  Formio.currentUser = function() {
    var user = this.getUser();
    if (user) { return Q().thenResolve(user) }
    var token = this.getToken();
    if (!token) { return Q().thenResolve(null) }
    return this.request(baseUrl + '/current')
      .then(function(response) {
        if (response.ok) {
          Formio.setUser(response);
        }
        return response;
      });
  };

// Keep track of their logout callback.
  Formio.logout = function() {
    return this.request(baseUrl + '/logout').finally(function() {
      this.setToken(null);
      this.setUser(null);
    }.bind(this));
  };
  Formio.fieldData = function(data, component) {
    if (!data) { return ''; }
    if (component.key.indexOf('.') !== -1) {
      var value = data;
      var parts = component.key.split('.');
      var key = '';
      for (var i = 0; i < parts.length; i++) {
        key = parts[i];

        // Handle nested resources
        if (value.hasOwnProperty('_id')) {
          value = value.data;
        }

        // Return if the key is not found on the value.
        if (!value.hasOwnProperty(key)) {
          return;
        }

        // Convert old single field data in submissions to multiple
        if(key === parts[parts.length - 1] && component.multiple && !Array.isArray(value[key])) {
          value[key] = [value[key]];
        }

        // Set the value of this key.
        value = value[key];
      }
      return value;
    }
    else {
      // Convert old single field data in submissions to multiple
      if(component.multiple && !Array.isArray(data[component.key])) {
        data[component.key] = [data[component.key]];
      }
      return data[component.key];
    }
  };
  return Formio;
}

},{"Q":1,"whatwg-fetch":3}]},{},[4])(4)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"Q":3,"_process":1,"whatwg-fetch":4}],3:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = name.toString();
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url

    this.credentials = options.credentials || 'omit'
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    // TODO: Request constructor should accept input, init
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();

},{}],5:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// https://github.com/sanniassin/react-input-mask

var React = require("react");

var InputElement = React.createClass({
    displayName: "InputElement",

    charsRules: {
        "9": "[0-9]",
        a: "[A-Za-z]",
        "*": "[A-Za-z0-9]"
    },
    defaultMaskChar: "_",
    lastCaretPos: null,
    isDOMElement: function isDOMElement(element) {
        return typeof HTMLElement === "object" ? element instanceof HTMLElement // DOM2
        : element.nodeType === 1 && typeof element.nodeName === "string";
    },
    // getDOMNode is deprecated but we need it to stay compatible with React 0.12
    getInputDOMNode: function getInputDOMNode() {
        var input = this.refs.input;

        // React 0.14
        if (this.isDOMElement(input)) {
            return input;
        }

        return input.getDOMNode();
    },
    getPrefix: function getPrefix(newState) {
        var prefix = "";

        var _ref = newState || this.state;

        var mask = _ref.mask;

        for (var i = 0; i < mask.length && this.isPermanentChar(i, newState); ++i) {
            prefix += mask[i];
        }
        return prefix;
    },
    getFilledLength: function getFilledLength() {
        var value = arguments[0] === undefined ? this.state.value : arguments[0];

        var i;
        var maskChar = this.state.maskChar;

        if (!maskChar) {
            return value.length;
        }

        for (i = value.length - 1; i >= 0; --i) {
            var char = value[i];
            if (!this.isPermanentChar(i) && this.isAllowedChar(char, i)) {
                break;
            }
        }

        return ++i || this.getPrefix().length;
    },
    getLeftEditablePos: function getLeftEditablePos(pos) {
        for (var i = pos; i >= 0; --i) {
            if (!this.isPermanentChar(i)) {
                return i;
            }
        }
        return null;
    },
    getRightEditablePos: function getRightEditablePos(pos) {
        var mask = this.state.mask;
        for (var i = pos; i < mask.length; ++i) {
            if (!this.isPermanentChar(i)) {
                return i;
            }
        }
        return null;
    },
    isEmpty: function isEmpty() {
        var _this = this;

        var value = arguments[0] === undefined ? this.state.value : arguments[0];

        return !value.split("").some(function (char, i) {
            return !_this.isPermanentChar(i) && _this.isAllowedChar(char, i);
        });
    },
    isFilled: function isFilled() {
        var value = arguments[0] === undefined ? this.state.value : arguments[0];

        return this.getFilledLength(value) === this.state.mask.length;
    },
    createFilledArray: function createFilledArray(length, val) {
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = val;
        }
        return array;
    },
    formatValue: function formatValue(value, newState) {
        var _this2 = this;

        var _ref2 = newState || this.state;

        var maskChar = _ref2.maskChar;
        var mask = _ref2.mask;

        if (!maskChar) {
            var prefixLen = this.getPrefix(newState).length;
            value = this.insertRawSubstr("", value, 0, newState);
            while (value.length > prefixLen && this.isPermanentChar(value.length - 1, newState)) {
                value = value.slice(0, value.length - 1);
            }
            return value;
        }
        return value.split("").concat(this.createFilledArray(mask.length - value.length, null)).map(function (char, pos) {
            if (_this2.isAllowedChar(char, pos, newState)) {
                return char;
            } else if (_this2.isPermanentChar(pos, newState)) {
                return mask[pos];
            }
            return maskChar;
        }).join("");
    },
    clearRange: function clearRange(value, start, len) {
        var _this3 = this;

        var end = start + len;
        var maskChar = this.state.maskChar;
        if (!maskChar) {
            var prefixLen = this.getPrefix().length;
            value = value.split("").filter(function (char, i) {
                return i < prefixLen || i < start || i >= end;
            }).join("");
            return this.formatValue(value);
        }
        var mask = this.state.mask;
        return value.split("").map(function (char, i) {
            if (i < start || i >= end) {
                return char;
            }
            if (_this3.isPermanentChar(i)) {
                return mask[i];
            }
            return maskChar;
        }).join("");
    },
    replaceSubstr: function replaceSubstr(value, newSubstr, pos) {
        return value.slice(0, pos) + newSubstr + value.slice(pos + newSubstr.length);
    },
    insertRawSubstr: function insertRawSubstr(value, substr, pos, newState) {
        var _ref3 = newState || this.state;

        var mask = _ref3.mask;
        var maskChar = _ref3.maskChar;

        var isFilled = this.isFilled(value);
        substr = substr.split("");
        for (var i = pos; i < mask.length && substr.length;) {
            if (!this.isPermanentChar(i, newState) || mask[i] === substr[0]) {
                var char = substr.shift();
                if (this.isAllowedChar(char, i, newState)) {
                    if (i < value.length) {
                        if (maskChar || isFilled) {
                            value = this.replaceSubstr(value, char, i);
                        } else {
                            value = this.formatValue(value.substr(0, i) + char + value.substr(i), newState);
                        }
                    } else if (!maskChar) {
                        value += char;
                    }
                    ++i;
                }
            } else {
                if (!maskChar && i >= value.length) {
                    value += mask[i];
                }
                ++i;
            }
        }
        return value;
    },
    getRawSubstrLength: function getRawSubstrLength(value, substr, pos, newState) {
        var _ref4 = newState || this.state;

        var mask = _ref4.mask;
        var maskChar = _ref4.maskChar;

        substr = substr.split("");
        for (var i = pos; i < mask.length && substr.length;) {
            if (!this.isPermanentChar(i, newState) || mask[i] === substr[0]) {
                var char = substr.shift();
                if (this.isAllowedChar(char, i, newState)) {
                    ++i;
                }
            } else {
                ++i;
            }
        }
        return i - pos;
    },
    isAllowedChar: function isAllowedChar(char, pos, newState) {
        var mask = newState ? newState.mask : this.state.mask;
        if (this.isPermanentChar(pos, newState)) {
            return mask[pos] === char;
        }
        var ruleChar = mask[pos];
        var charRule = this.charsRules[ruleChar];
        return new RegExp(charRule).test(char || "");
    },
    isPermanentChar: function isPermanentChar(pos, newState) {
        var permanents = newState ? newState.permanents : this.state.permanents;
        return permanents.indexOf(pos) !== -1;
    },
    setCaretToEnd: function setCaretToEnd() {
        var filledLen = this.getFilledLength();
        var pos = this.getRightEditablePos(filledLen);
        if (pos !== null) {
            this.setCaretPos(pos);
        }
    },
    getSelection: function getSelection() {
        var input = this.getInputDOMNode();
        var start = 0;
        var end = 0;

        if ("selectionStart" in input && "selectionEnd" in input) {
            start = input.selectionStart;
            end = input.selectionEnd;
        } else {
            var range = document.selection.createRange();
            var len = input.value.length;

            var inputRange = input.createTextRange();
            inputRange.moveToBookmark(range.getBookmark());

            start = -inputRange.moveStart("character", -len);
            end = -inputRange.moveEnd("character", -len);
        }

        return {
            start: start,
            end: end,
            length: end - start
        };
    },
    getCaretPos: function getCaretPos() {
        var input = this.getInputDOMNode();
        var pos = 0;

        if ("selectionStart" in input) {
            pos = input.selectionStart;
        } else {
            var range = document.selection.createRange();
            var len = range.text.length;
            range.moveStart("character", -input.value.length);
            pos = range.text.length - len;
        }

        return pos;
    },
    setCaretPos: function setCaretPos(pos) {
        var input;
        var setPos = function setPos() {
            if ("selectionStart" in input && "selectionEnd" in input) {
                input.selectionStart = input.selectionEnd = pos;
            } else if ("setSelectionRange" in input) {
                input.setSelectionRange(pos, pos);
            } else {
                var inputRange = input.createTextRange();
                inputRange.collapse(true);
                inputRange.moveStart("character", pos);
                inputRange.moveEnd("character", 0);
                inputRange.select();
            }
        };

        if (this.isMounted()) {
            input = this.getInputDOMNode();
            setPos();
            setTimeout(setPos, 0);
        }

        this.lastCaretPos = pos;
    },
    isFocused: function isFocused() {
        return document.activeElement === this.getInputDOMNode();
    },
    parseMask: function parseMask(mask) {
        var _this4 = this;

        if (typeof mask !== "string") {
            return {
                mask: null,
                permanents: []
            };
        }
        var str = "";
        var permanents = [];
        var isPermanent = false;

        mask.split("").forEach(function (char) {
            if (!isPermanent && char === "\\") {
                isPermanent = true;
            } else {
                if (isPermanent || !_this4.charsRules[char]) {
                    permanents.push(str.length);
                }
                str += char;
                isPermanent = false;
            }
        });

        return {
            mask: str,
            permanents: permanents
        };
    },
    getStringValue: function getStringValue(value) {
        return !value && value !== 0 ? "" : value + "";
    },
    getInitialState: function getInitialState() {
        var mask = this.parseMask(this.props.mask);
        var defaultValue = this.props.defaultValue != null ? this.props.defaultValue : null;
        var value = this.props.value != null ? this.props.value : defaultValue;

        return {
            mask: mask.mask,
            permanents: mask.permanents,
            value: this.getStringValue(value),
            maskChar: "maskChar" in this.props ? this.props.maskChar : this.defaultMaskChar
        };
    },
    componentWillMount: function componentWillMount() {
        if (this.state.mask && this.state.value) {
            this.setState({
                value: this.formatValue(this.state.value)
            });
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var mask = this.parseMask(nextProps.mask);
        var maskChar = "maskChar" in nextProps ? nextProps.maskChar : this.defaultMaskChar;
        var state = {
            mask: mask.mask,
            permanents: mask.permanents,
            maskChar: maskChar
        };

        var newValue = nextProps.value !== undefined ? this.getStringValue(nextProps.value) : this.state.value;

        var isMaskChanged = mask.mask && mask.mask !== this.state.mask;
        if (isMaskChanged) {
            var emptyValue = this.formatValue("", state);
            newValue = this.insertRawSubstr(emptyValue, newValue, 0, state);
        }
        if (mask.mask && (newValue || this.isFocused())) {
            newValue = this.formatValue(newValue, state);
        }
        if (this.state.value !== newValue) {
            state.value = newValue;
        }
        this.setState(state);
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        var mask = this.state.mask;
        var isMaskChanged = mask && mask !== prevState.mask;
        var pos = this.lastCaretPos;
        var filledLen = this.getFilledLength();
        if (isMaskChanged && filledLen < pos) {
            this.setCaretPos(this.getRightEditablePos(filledLen));
        }
    },
    onKeyDown: function onKeyDown(event) {
        var hasHandler = typeof this.props.onKeyDown === "function";
        if (event.ctrlKey || event.metaKey) {
            if (hasHandler) {
                this.props.onKeyDown(event);
            }
            return;
        }

        var caretPos = this.getCaretPos();
        var value = this.state.value;
        var key = event.key;
        var preventDefault = false;
        switch (key) {
            case "Backspace":
            case "Delete":
                var prefixLen = this.getPrefix().length;
                var deleteFromRight = key === "Delete";
                var selectionRange = this.getSelection();
                if (selectionRange.length) {
                    value = this.clearRange(value, selectionRange.start, selectionRange.length);
                } else if (caretPos < prefixLen || !deleteFromRight && caretPos === prefixLen) {
                    caretPos = prefixLen;
                } else {
                    var editablePos = deleteFromRight ? this.getRightEditablePos(caretPos) : this.getLeftEditablePos(caretPos - 1);
                    if (editablePos !== null) {
                        value = this.clearRange(value, editablePos, 1);
                        caretPos = editablePos;
                    }
                }
                preventDefault = true;
                break;
            default:
                break;
        }

        if (hasHandler) {
            this.props.onKeyDown(event);
        }

        if (value !== this.state.value) {
            event.target.value = value;
            this.setState({
                value: value
            });
            preventDefault = true;
            if (typeof this.props.onChange === "function") {
                this.props.onChange(event);
            }
        }
        if (preventDefault) {
            event.preventDefault();
            this.setCaretPos(caretPos);
        }
    },
    onKeyPress: function onKeyPress(event) {
        var key = event.key;
        var hasHandler = typeof this.props.onKeyPress === "function";
        if (key === "Enter" || event.ctrlKey || event.metaKey) {
            if (hasHandler) {
                this.props.onKeyPress(event);
            }
            return;
        }

        var caretPos = this.getCaretPos();
        var _state = this.state;
        var value = _state.value;
        var mask = _state.mask;
        var maskChar = _state.maskChar;

        var maskLen = mask.length;
        var prefixLen = this.getPrefix().length;

        if (this.isPermanentChar(caretPos) && mask[caretPos] === key) {
            value = this.insertRawSubstr(value, key, caretPos);
            ++caretPos;
        } else {
            var editablePos = this.getRightEditablePos(caretPos);
            if (editablePos !== null && this.isAllowedChar(key, editablePos)) {
                value = this.insertRawSubstr(value, key, caretPos);
                caretPos = editablePos + 1;
            }
        }

        if (value !== this.state.value) {
            event.target.value = value;
            this.setState({
                value: value
            });
            if (typeof this.props.onChange === "function") {
                this.props.onChange(event);
            }
        }
        event.preventDefault();
        while (caretPos > prefixLen && this.isPermanentChar(caretPos)) {
            ++caretPos;
        }
        this.setCaretPos(caretPos);
    },
    onChange: function onChange(event) {
        var maskLen = this.state.mask.length;
        var target = event.target;
        var value = target.value;
        if (value.length > maskLen) {
            value = value.substr(0, maskLen);
        }
        target.value = this.formatValue(value);
        this.setState({
            value: target.value
        });

        if (typeof this.props.onChange === "function") {
            this.props.onChange(event);
        }
    },
    onFocus: function onFocus(event) {
        if (!this.state.value) {
            var prefix = this.getPrefix();
            var value = this.formatValue(prefix);
            event.target.value = this.formatValue(value);
            this.setState({
                value: value
            }, this.setCaretToEnd);

            if (typeof this.props.onChange === "function") {
                this.props.onChange(event);
            }
        } else if (this.getFilledLength() < this.state.mask.length) {
            this.setCaretToEnd();
        }

        if (typeof this.props.onFocus === "function") {
            this.props.onFocus(event);
        }
    },
    onBlur: function onBlur(event) {
        if (this.isEmpty(this.state.value)) {
            event.target.value = "";
            this.setState({
                value: ""
            });
            if (typeof this.props.onChange === "function") {
                this.props.onChange(event);
            }
        }

        if (typeof this.props.onBlur === "function") {
            this.props.onBlur(event);
        }
    },
    onPaste: function onPaste(event) {
        var text;
        if (window.clipboardData && window.clipboardData.getData) {
            // IE
            text = window.clipboardData.getData("Text");
        } else if (event.clipboardData && event.clipboardData.getData) {
            text = event.clipboardData.getData("text/plain");
        }
        if (text) {
            var value = this.state.value;
            var selection = this.getSelection();
            var caretPos = selection.start;
            if (selection.length) {
                value = this.clearRange(value, caretPos, selection.length);
            }
            var textLen = this.getRawSubstrLength(value, text, caretPos);
            var value = this.insertRawSubstr(value, text, caretPos);
            caretPos += textLen;
            caretPos = this.getRightEditablePos(caretPos) || caretPos;
            if (value !== this.state.value) {
                event.target.value = value;
                this.setState({
                    value: value
                });
                if (typeof this.props.onChange === "function") {
                    this.props.onChange(event);
                }
            }
            this.setCaretPos(caretPos);
        }
        event.preventDefault();
    },
    render: function render() {
        var _this5 = this;

        var ourProps = {};
        if (this.state.mask) {
            var handlersKeys = ["onFocus", "onBlur", "onChange", "onKeyDown", "onKeyPress", "onPaste"];
            handlersKeys.forEach(function (key) {
                ourProps[key] = _this5[key];
            });
            ourProps.value = this.state.value;
        }
        return React.createElement("input", _extends({ ref: "input" }, this.props, ourProps));
    }
});

module.exports = InputElement;
},{"react":"react"}],6:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("react")):"function"==typeof define&&define.amd?define(["react"],e):"object"==typeof exports?exports.SignaturePad=e(require("react")):t.SignaturePad=e(t.react)}(this,function(t){return function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(2)},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=function(){function t(e,i,o,s){n(this,t),this.startPoint=e,this.control1=i,this.control2=o,this.endPoint=s}return i(t,[{key:"length",value:function e(){var t,n,i,o,s,a,r,u,h=10,e=0;for(t=0;h>=t;t++)n=t/h,i=this._point(n,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),o=this._point(n,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y),t>0&&(r=i-s,u=o-a,e+=Math.sqrt(r*r+u*u)),s=i,a=o;return e}},{key:"_point",value:function(t,e,n,i,o){return e*(1-t)*(1-t)*(1-t)+3*n*(1-t)*(1-t)*t+3*i*(1-t)*t*t+o*t*t*t}}]),t}();e["default"]=o,t.exports=e["default"]},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(t,e,n){for(var i=!0;i;){var o=t,s=e,a=n;r=h=u=void 0,i=!1,null===o&&(o=Function.prototype);var r=Object.getOwnPropertyDescriptor(o,s);if(void 0!==r){if("value"in r)return r.value;var u=r.get;return void 0===u?void 0:u.call(a)}var h=Object.getPrototypeOf(o);if(null===h)return void 0;t=h,e=s,n=a,i=!0}},u=n(4),h=i(u),c=n(1),l=i(c),d=n(3),v=i(d),f=function(t){function e(t){o(this,e),r(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t),this.velocityFilterWeight=this.props.velocityFilterWeight||.7,this.minWidth=this.props.minWidth||.5,this.maxWidth=this.props.maxWidth||2.5,this.dotSize=this.props.dotSize||function(){return(this.minWidth+this.maxWidth)/2},this.penColor=this.props.penColor||"black",this.backgroundColor=this.props.backgroundColor||"rgba(0,0,0,0)",this.onEnd=this.props.onEnd,this.onBegin=this.props.onBegin}return s(e,t),a(e,[{key:"componentDidMount",value:function(){this._canvas=h["default"].findDOMNode(this.refs.cv),this._ctx=this._canvas.getContext("2d"),this.clear(),this._handleMouseEvents(),this._handleTouchEvents(),this._resizeCanvas()}},{key:"componentWillUnmount",value:function(){this.off()}},{key:"clear",value:function(t){t&&t.preventDefault();var e=this._ctx,n=this._canvas;e.fillStyle=this.backgroundColor,e.clearRect(0,0,n.width,n.height),e.fillRect(0,0,n.width,n.height),this._reset()}},{key:"toDataURL",value:function(t,e){var n=this._canvas;return n.toDataURL.apply(n,arguments)}},{key:"fromDataURL",value:function(t){var e=this,n=new Image,i=window.devicePixelRatio||1,o=this._canvas.width/i,s=this._canvas.height/i;this._reset(),n.src=t,n.onload=function(){e._ctx.drawImage(n,0,0,o,s)},this._isEmpty=!1}},{key:"isEmpty",value:function(){return this._isEmpty}},{key:"_resizeCanvas",value:function(){var t=this._ctx,e=this._canvas,n=Math.max(window.devicePixelRatio||1,1);e.width=e.offsetWidth*n,e.height=e.offsetHeight*n,t.scale(n,n)}},{key:"_reset",value:function(){this.points=[],this._lastVelocity=0,this._lastWidth=(this.minWidth+this.maxWidth)/2,this._isEmpty=!0,this._ctx.fillStyle=this.penColor}},{key:"_handleMouseEvents",value:function(){this._mouseButtonDown=!1,this._canvas.addEventListener("mousedown",this._handleMouseDown.bind(this)),this._canvas.addEventListener("mousemove",this._handleMouseMove.bind(this)),document.addEventListener("mouseup",this._handleMouseUp.bind(this)),window.addEventListener("resize",this._resizeCanvas.bind(this))}},{key:"_handleTouchEvents",value:function(){this._canvas.style.msTouchAction="none",this._canvas.addEventListener("touchstart",this._handleTouchStart.bind(this)),this._canvas.addEventListener("touchmove",this._handleTouchMove.bind(this)),document.addEventListener("touchend",this._handleTouchEnd.bind(this))}},{key:"off",value:function(){this._canvas.removeEventListener("mousedown",this._handleMouseDown),this._canvas.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),this._canvas.removeEventListener("touchstart",this._handleTouchStart),this._canvas.removeEventListener("touchmove",this._handleTouchMove),document.removeEventListener("touchend",this._handleTouchEnd),window.removeEventListener("resize",this._resizeCanvas)}},{key:"_handleMouseDown",value:function(t){1===t.which&&(this._mouseButtonDown=!0,this._strokeBegin(t))}},{key:"_handleMouseMove",value:function(t){this._mouseButtonDown&&this._strokeUpdate(t)}},{key:"_handleMouseUp",value:function(t){1===t.which&&this._mouseButtonDown&&(this._mouseButtonDown=!1,this._strokeEnd(t))}},{key:"_handleTouchStart",value:function(t){var e=t.changedTouches[0];this._strokeBegin(e)}},{key:"_handleTouchMove",value:function(t){t.preventDefault();var e=t.changedTouches[0];this._strokeUpdate(e)}},{key:"_handleTouchEnd",value:function(t){var e=t.target===this._canvas;e&&this._strokeEnd(t)}},{key:"_strokeUpdate",value:function(t){var e=this._createPoint(t);this._addPoint(e)}},{key:"_strokeBegin",value:function(t){this._reset(),this._strokeUpdate(t),"function"==typeof this.onBegin&&this.onBegin(t)}},{key:"_strokeDraw",value:function(t){var e=this._ctx,n="function"==typeof this.dotSize?this.dotSize():this.dotSize;e.beginPath(),this._drawPoint(t.x,t.y,n),e.closePath(),e.fill()}},{key:"_strokeEnd",value:function(t){var e=this.points.length>2,n=this.points[0];!e&&n&&this._strokeDraw(n),"function"==typeof this.onEnd&&this.onEnd(t)}},{key:"_createPoint",value:function(t){var e=this._canvas.getBoundingClientRect();return new v["default"](t.clientX-e.left,t.clientY-e.top)}},{key:"_addPoint",value:function(t){var e,n,i,o,s=this.points;s.push(t),s.length>2&&(3===s.length&&s.unshift(s[0]),o=this._calculateCurveControlPoints(s[0],s[1],s[2]),e=o.c2,o=this._calculateCurveControlPoints(s[1],s[2],s[3]),n=o.c1,i=new l["default"](s[1],e,n,s[2]),this._addCurve(i),s.shift())}},{key:"_calculateCurveControlPoints",value:function(t,e,n){var i=t.x-e.x,o=t.y-e.y,s=e.x-n.x,a=e.y-n.y,r={x:(t.x+e.x)/2,y:(t.y+e.y)/2},u={x:(e.x+n.x)/2,y:(e.y+n.y)/2},h=Math.sqrt(i*i+o*o),c=Math.sqrt(s*s+a*a),l=r.x-u.x,d=r.y-u.y,f=c/(h+c),y={x:u.x+l*f,y:u.y+d*f},_=e.x-y.x,p=e.y-y.y;return{c1:new v["default"](r.x+_,r.y+p),c2:new v["default"](u.x+_,u.y+p)}}},{key:"_addCurve",value:function(t){var e,n,i=t.startPoint,o=t.endPoint;e=o.velocityFrom(i),e=this.velocityFilterWeight*e+(1-this.velocityFilterWeight)*this._lastVelocity,n=this._strokeWidth(e),this._drawCurve(t,this._lastWidth,n),this._lastVelocity=e,this._lastWidth=n}},{key:"_drawPoint",value:function(t,e,n){var i=this._ctx;i.moveTo(t,e),i.arc(t,e,n,0,2*Math.PI,!1),this._isEmpty=!1}},{key:"_drawCurve",value:function(t,e,n){var i,o,s,a,r,u,h,c,l,d,v,f=this._ctx,y=n-e;for(i=Math.floor(t.length()),f.beginPath(),s=0;i>s;s++)a=s/i,r=a*a,u=r*a,h=1-a,c=h*h,l=c*h,d=l*t.startPoint.x,d+=3*c*a*t.control1.x,d+=3*h*r*t.control2.x,d+=u*t.endPoint.x,v=l*t.startPoint.y,v+=3*c*a*t.control1.y,v+=3*h*r*t.control2.y,v+=u*t.endPoint.y,o=e+u*y,this._drawPoint(d,v,o);f.closePath(),f.fill()}},{key:"_strokeWidth",value:function(t){return Math.max(this.maxWidth/(t+1),this.minWidth)}},{key:"render",value:function(){return h["default"].createElement("div",{id:"signature-pad",className:"m-signature-pad"},h["default"].createElement("div",{className:"m-signature-pad--body"},h["default"].createElement("canvas",{ref:"cv"})),this.props.clearButton&&h["default"].createElement("div",{className:"m-signature-pad--footer"},h["default"].createElement("button",{className:"btn btn-default button clear",onClick:this.clear.bind(this)},"Clear")))}}]),e}(h["default"].Component);e["default"]=f,t.exports=e["default"]},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=function(){function t(e,i,o){n(this,t),this.x=e,this.y=i,this.time=o||(new Date).getTime()}return i(t,[{key:"velocityFrom",value:function(t){return this.time!==t.time?this.distanceTo(t)/(this.time-t.time):1}},{key:"distanceTo",value:function(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))}}]),t}();e["default"]=o,t.exports=e["default"]},function(e,n){e.exports=t}])});
},{"react":"react"}],7:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _VIEW, _OPPOSITE_DIRECTION, _MULTIPLIER;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _Header = require('./Header');

var _Header2 = babelHelpers.interopRequireDefault(_Header);

var _Footer = require('./Footer');

var _Footer2 = babelHelpers.interopRequireDefault(_Footer);

var _Month = require('./Month');

var _Month2 = babelHelpers.interopRequireDefault(_Month);

var _Year = require('./Year');

var _Year2 = babelHelpers.interopRequireDefault(_Year);

var _Decade = require('./Decade');

var _Decade2 = babelHelpers.interopRequireDefault(_Decade);

var _Century = require('./Century');

var _Century2 = babelHelpers.interopRequireDefault(_Century);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = babelHelpers.interopRequireDefault(_uncontrollable);

var _SlideTransition = require('./SlideTransition');

var _SlideTransition2 = babelHelpers.interopRequireDefault(_SlideTransition);

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConstants = require('./util/constants');

var _utilConstants2 = babelHelpers.interopRequireDefault(_utilConstants);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

//values, omit

var _utilWidgetHelpers = require('./util/widgetHelpers');

var _utilInteraction = require('./util/interaction');

var dir = _utilConstants2['default'].directions,
    values = function values(obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
},
    invert = function invert(obj) {
  return _util_2['default'].transform(obj, function (o, val, key) {
    o[val] = key;
  }, {});
};

var localizers = _utilConfiguration2['default'].locale,
    views = _utilConstants2['default'].calendarViews,
    VIEW_OPTIONS = values(views),
    ALT_VIEW = invert(_utilConstants2['default'].calendarViewHierarchy),
    NEXT_VIEW = _utilConstants2['default'].calendarViewHierarchy,
    VIEW_UNIT = _utilConstants2['default'].calendarViewUnits,
    VIEW = (_VIEW = {}, _VIEW[views.MONTH] = _Month2['default'], _VIEW[views.YEAR] = _Year2['default'], _VIEW[views.DECADE] = _Decade2['default'], _VIEW[views.CENTURY] = _Century2['default'], _VIEW);

var ARROWS_TO_DIRECTION = {
  ArrowDown: dir.DOWN,
  ArrowUp: dir.UP,
  ArrowRight: dir.RIGHT,
  ArrowLeft: dir.LEFT
};

var OPPOSITE_DIRECTION = (_OPPOSITE_DIRECTION = {}, _OPPOSITE_DIRECTION[dir.LEFT] = dir.RIGHT, _OPPOSITE_DIRECTION[dir.RIGHT] = dir.LEFT, _OPPOSITE_DIRECTION);

var MULTIPLIER = (_MULTIPLIER = {}, _MULTIPLIER[views.YEAR] = 1, _MULTIPLIER[views.DECADE] = 10, _MULTIPLIER[views.CENTURY] = 100, _MULTIPLIER);

var format = function format(props, f) {
  return props[f + 'Format'] || localizers.date.formats[f];
};

var propTypes = {

  disabled: _utilPropTypes2['default'].disabled,
  readOnly: _utilPropTypes2['default'].readOnly,

  onChange: _react2['default'].PropTypes.func,
  value: _react2['default'].PropTypes.instanceOf(Date),

  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),

  initialView: _react2['default'].PropTypes.oneOf(VIEW_OPTIONS),

  finalView: function finalView(props, propname, componentName) {
    var err = _react2['default'].PropTypes.oneOf(VIEW_OPTIONS)(props, propname, componentName);

    if (err) return err;
    if (VIEW_OPTIONS.indexOf(props[propname]) < VIEW_OPTIONS.indexOf(props.initialView)) return new Error(('The `' + propname + '` prop: `' + props[propname] + '` cannot be \'lower\' than the `initialView`\n        prop. This creates a range that cannot be rendered.').replace(/\n\t/g, ''));
  },

  culture: _react2['default'].PropTypes.string,

  footer: _react2['default'].PropTypes.bool,

  dayComponent: _utilPropTypes2['default'].elementType,
  headerFormat: _utilPropTypes2['default'].dateFormat,
  footerFormat: _utilPropTypes2['default'].dateFormat,

  dayFormat: _utilPropTypes2['default'].dateFormat,
  dateFormat: _utilPropTypes2['default'].dateFormat,
  monthFormat: _utilPropTypes2['default'].dateFormat,
  yearFormat: _utilPropTypes2['default'].dateFormat,
  decadeFormat: _utilPropTypes2['default'].dateFormat,
  centuryFormat: _utilPropTypes2['default'].dateFormat,

  messages: _react2['default'].PropTypes.shape({
    moveBack: _react2['default'].PropTypes.string,
    moveForward: _react2['default'].PropTypes.string
  })
};

var Calendar = _react2['default'].createClass(babelHelpers.createDecoratedObject([{
  key: 'displayName',
  initializer: function initializer() {
    return 'Calendar';
  }
}, {
  key: 'mixins',
  initializer: function initializer() {
    return [require('./mixins/TimeoutMixin'), require('./mixins/PureRenderMixin'), require('./mixins/RtlParentContextMixin'), require('./mixins/AriaDescendantMixin')()];
  }
}, {
  key: 'propTypes',
  initializer: function initializer() {
    return propTypes;
  }
}, {
  key: 'getInitialState',
  value: function getInitialState() {
    var value = this.inRangeValue(this.props.value);

    return {
      selectedIndex: 0,
      view: this.props.initialView || 'month',
      currentDate: value ? new Date(value) : this.inRangeValue(new Date())
    };
  }
}, {
  key: 'getDefaultProps',
  value: function getDefaultProps() {
    return {

      value: null,
      min: new Date(1900, 0, 1),
      max: new Date(2099, 11, 31),

      initialView: 'month',
      finalView: 'century',

      tabIndex: '0',
      footer: false,

      ariaActiveDescendantKey: 'calendar',
      messages: msgs({})
    };
  }
}, {
  key: 'componentWillReceiveProps',
  value: function componentWillReceiveProps(nextProps) {
    var bottom = VIEW_OPTIONS.indexOf(nextProps.initialView),
        top = VIEW_OPTIONS.indexOf(nextProps.finalView),
        current = VIEW_OPTIONS.indexOf(this.state.view),
        view = this.state.view,
        val = this.inRangeValue(nextProps.value);

    if (current < bottom) this.setState({ view: view = nextProps.initialView });else if (current > top) this.setState({ view: view = nextProps.finalView });

    //if the value changes reset views to the new one
    if (!_utilDates2['default'].eq(val, dateOrNull(this.props.value), VIEW_UNIT[view])) this.setState({
      currentDate: val ? new Date(val) : new Date()
    });
  }
}, {
  key: 'render',
  value: function render() {
    var _this = this;

    var _props = this.props;
    var className = _props.className;
    var value = _props.value;
    var footerFormat = _props.footerFormat;
    var disabled = _props.disabled;
    var readOnly = _props.readOnly;
    var finalView = _props.finalView;
    var footer = _props.footer;
    var messages = _props.messages;
    var min = _props.min;
    var max = _props.max;
    var culture = _props.culture;
    var duration = _props.duration;
    var _state = this.state;
    var view = _state.view;
    var currentDate = _state.currentDate;
    var slideDirection = _state.slideDirection;
    var focused = _state.focused;

    var View = VIEW[view],
        unit = VIEW_UNIT[view],
        todaysDate = new Date(),
        todayNotInRange = !_utilDates2['default'].inRange(todaysDate, min, max, view);

    unit = unit === 'day' ? 'date' : unit;

    var viewID = _utilWidgetHelpers.instanceId(this, '_calendar'),
        labelID = _utilWidgetHelpers.instanceId(this, '_calendar_label'),
        key = view + '_' + _utilDates2['default'][view](currentDate);

    var elementProps = _util_2['default'].omit(this.props, Object.keys(propTypes)),
        viewProps = _util_2['default'].pick(this.props, Object.keys(_utilCompat2['default'].type(View).propTypes));

    var isDisabled = disabled || readOnly;

    messages = msgs(this.props.messages);

    return _react2['default'].createElement(
      'div',
      babelHelpers._extends({}, elementProps, {
        role: 'group',
        onKeyDown: this._keyDown,
        onFocus: this._focus.bind(null, true),
        onBlur: this._focus.bind(null, false),
        className: _classnames2['default'](className, 'rw-calendar', 'rw-widget', {
          'rw-state-focus': focused,
          'rw-state-disabled': disabled,
          'rw-state-readonly': readOnly,
          'rw-rtl': this.isRtl()
        })
      }),
      _react2['default'].createElement(_Header2['default'], {
        label: this._label(),
        labelId: labelID,
        messages: messages,
        upDisabled: isDisabled || view === finalView,
        prevDisabled: isDisabled || !_utilDates2['default'].inRange(this.nextDate(dir.LEFT), min, max, view),
        nextDisabled: isDisabled || !_utilDates2['default'].inRange(this.nextDate(dir.RIGHT), min, max, view),
        onViewChange: this.navigate.bind(null, dir.UP, null),
        onMoveLeft: this.navigate.bind(null, dir.LEFT, null),
        onMoveRight: this.navigate.bind(null, dir.RIGHT, null)
      }),
      _react2['default'].createElement(
        _SlideTransition2['default'],
        {
          ref: 'animation',
          duration: duration,
          direction: slideDirection,
          onAnimate: function () {
            return _this.focus(true);
          }
        },
        _react2['default'].createElement(View, babelHelpers._extends({}, viewProps, {
          tabIndex: '-1',
          key: key,
          id: viewID,
          className: 'rw-calendar-grid',
          'aria-labelledby': labelID,
          today: todaysDate,
          value: value,
          focused: currentDate,
          onChange: this.change,
          onKeyDown: this._keyDown,
          ariaActiveDescendantKey: 'calendarView'
        }))
      ),
      footer && _react2['default'].createElement(_Footer2['default'], {
        value: todaysDate,
        format: footerFormat,
        culture: culture,
        disabled: disabled || todayNotInRange,
        readOnly: readOnly,
        onClick: this.select
      })
    );
  }
}, {
  key: 'navigate',
  decorators: [_utilInteraction.widgetEditable],
  value: function navigate(direction, date) {
    var view = this.state.view,
        slideDir = direction === dir.LEFT || direction === dir.UP ? 'right' : 'left';

    if (!date) date = [dir.LEFT, dir.RIGHT].indexOf(direction) !== -1 ? this.nextDate(direction) : this.state.currentDate;

    if (direction === dir.DOWN) view = ALT_VIEW[view] || view;

    if (direction === dir.UP) view = NEXT_VIEW[view] || view;

    if (this.isValidView(view) && _utilDates2['default'].inRange(date, this.props.min, this.props.max, view)) {
      _utilWidgetHelpers.notify(this.props.onNavigate, [date, slideDir, view]);
      this.focus(true);

      this.setState({
        currentDate: date,
        slideDirection: slideDir,
        view: view
      });
    }
  }
}, {
  key: 'focus',
  value: function focus() {
    if (+this.props.tabIndex > -1) _utilCompat2['default'].findDOMNode(this).focus();

    //console.log(document.activeElement)
  }
}, {
  key: '_focus',
  decorators: [_utilInteraction.widgetEnabled],
  value: function _focus(focused, e) {
    var _this2 = this;

    if (+this.props.tabIndex === -1) return;

    this.setTimeout('focus', function () {
      if (focused !== _this2.state.focused) {
        _utilWidgetHelpers.notify(_this2.props[focused ? 'onFocus' : 'onBlur'], e);
        _this2.setState({ focused: focused });
      }
    });
  }
}, {
  key: 'change',
  decorators: [_utilInteraction.widgetEditable],
  value: function change(date) {
    if (this.state.view === this.props.initialView) {
      _utilWidgetHelpers.notify(this.props.onChange, date);
      this.focus();
      return;
    }

    this.navigate(dir.DOWN, date);
  }
}, {
  key: 'select',
  decorators: [_utilInteraction.widgetEditable],
  value: function select(date) {
    var view = this.props.initialView,
        slideDir = view !== this.state.view || _utilDates2['default'].gt(date, this.state.currentDate) ? 'left' // move down to a the view
    : 'right';

    _utilWidgetHelpers.notify(this.props.onChange, date);

    if (this.isValidView(view) && _utilDates2['default'].inRange(date, this.props.min, this.props.max, view)) {
      this.focus();

      this.setState({
        currentDate: date,
        slideDirection: slideDir,
        view: view
      });
    }
  }
}, {
  key: 'nextDate',
  value: function nextDate(direction) {
    var method = direction === dir.LEFT ? 'subtract' : 'add',
        view = this.state.view,
        unit = view === views.MONTH ? view : views.YEAR,
        multi = MULTIPLIER[view] || 1;

    return _utilDates2['default'][method](this.state.currentDate, 1 * multi, unit);
  }
}, {
  key: '_keyDown',
  decorators: [_utilInteraction.widgetEditable],
  value: function _keyDown(e) {
    var ctrl = e.ctrlKey,
        key = e.key,
        direction = ARROWS_TO_DIRECTION[key],
        current = this.state.currentDate,
        view = this.state.view,
        unit = VIEW_UNIT[view],
        currentDate = current;

    if (key === 'Enter') {
      e.preventDefault();
      return this.change(current);
    }

    if (direction) {
      if (ctrl) {
        e.preventDefault();
        this.navigate(direction);
      } else {
        if (this.isRtl() && OPPOSITE_DIRECTION[direction]) direction = OPPOSITE_DIRECTION[direction];

        currentDate = _utilDates2['default'].move(currentDate, this.props.min, this.props.max, view, direction);

        if (!_utilDates2['default'].eq(current, currentDate, unit)) {
          e.preventDefault();

          if (_utilDates2['default'].gt(currentDate, current, view)) this.navigate(dir.RIGHT, currentDate);else if (_utilDates2['default'].lt(currentDate, current, view)) this.navigate(dir.LEFT, currentDate);else this.setState({ currentDate: currentDate });
        }
      }
    }

    _utilWidgetHelpers.notify(this.props.onKeyDown, [e]);
  }
}, {
  key: '_label',
  value: function _label() {
    var _props2 = this.props;
    var culture = _props2.culture;
    var props = babelHelpers.objectWithoutProperties(_props2, ['culture']);
    var view = this.state.view;
    var dt = this.state.currentDate;

    if (view === 'month') return localizers.date.format(dt, format(props, 'header'), culture);else if (view === 'year') return localizers.date.format(dt, format(props, 'year'), culture);else if (view === 'decade') return localizers.date.format(_utilDates2['default'].startOf(dt, 'decade'), format(props, 'decade'), culture);else if (view === 'century') return localizers.date.format(_utilDates2['default'].startOf(dt, 'century'), format(props, 'century'), culture);
  }
}, {
  key: 'inRangeValue',
  value: function inRangeValue(_value) {
    var value = dateOrNull(_value);

    if (value === null) return value;

    return _utilDates2['default'].max(_utilDates2['default'].min(value, this.props.max), this.props.min);
  }
}, {
  key: 'isValidView',
  value: function isValidView(next) {
    var bottom = VIEW_OPTIONS.indexOf(this.props.initialView),
        top = VIEW_OPTIONS.indexOf(this.props.finalView),
        current = VIEW_OPTIONS.indexOf(next);

    return current >= bottom && current <= top;
  }
}]));

function dateOrNull(dt) {
  if (dt && !isNaN(dt.getTime())) return dt;
  return null;
}

function msgs(msgs) {
  return babelHelpers._extends({
    moveBack: 'navigate back',
    moveForward: 'navigate forward'
  }, msgs);
}

var UncontrolledCalendar = _uncontrollable2['default'](Calendar, { value: 'onChange' });

UncontrolledCalendar.BaseCalendar = Calendar;

exports['default'] = UncontrolledCalendar;
module.exports = exports['default'];
},{"./Century":8,"./Decade":11,"./Footer":13,"./Header":14,"./Month":18,"./SlideTransition":24,"./Year":27,"./mixins/AriaDescendantMixin":29,"./mixins/PureRenderMixin":33,"./mixins/RtlParentContextMixin":35,"./mixins/TimeoutMixin":36,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/configuration":40,"./util/constants":41,"./util/dates":43,"./util/interaction":47,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react","uncontrollable":75}],8:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilWidgetHelpers = require('./util/widgetHelpers');

var localizers = _utilConfiguration2['default'].locale;
var format = function format(props) {
  return props.decadeFormat || localizers.date.formats.decade;
};

var isEqual = function isEqual(dateA, dateB) {
  return _utilDates2['default'].eq(dateA, dateB, 'decade');
};
var optionId = function optionId(id, date) {
  return id + '__century_' + _utilDates2['default'].year(date);
};

var propTypes = {
  optionID: _react2['default'].PropTypes.func,
  culture: _react2['default'].PropTypes.string,
  value: _react2['default'].PropTypes.instanceOf(Date),
  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),

  onChange: _react2['default'].PropTypes.func.isRequired,
  decadeFormat: _utilPropTypes2['default'].dateFormat
};

exports['default'] = _react2['default'].createClass({

  displayName: 'CenturyView',

  mixins: [require('./mixins/PureRenderMixin'), require('./mixins/RtlChildContextMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: propTypes,

  componentDidUpdate: function componentDidUpdate() {
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), this.props.focused);
    this.ariaActiveDescendant(activeId);
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var focused = _props.focused;
    var years = getCenturyDecades(focused);
    var rows = _util_2['default'].chunk(years, 4);

    var elementProps = _util_2['default'].omit(this.props, Object.keys(propTypes));

    return _react2['default'].createElement(
      'table',
      babelHelpers._extends({}, elementProps, {
        role: 'grid',
        className: _classnames2['default'](className, 'rw-nav-view')
      }),
      _react2['default'].createElement(
        'tbody',
        null,
        rows.map(this._row)
      )
    );
  },

  _row: function _row(row, rowIdx) {
    var _this = this;

    var _props2 = this.props;
    var focused = _props2.focused;
    var disabled = _props2.disabled;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var today = _props2.today;
    var culture = _props2.culture;
    var min = _props2.min;
    var max = _props2.max;
    var id = _utilWidgetHelpers.instanceId(this, '_century');

    return _react2['default'].createElement(
      'tr',
      { key: 'row_' + rowIdx, role: 'row' },
      row.map(function (date, colIdx) {
        var isFocused = isEqual(date, focused),
            isSelected = isEqual(date, value),
            currentDecade = isEqual(date, today),
            label = localizers.date.format(_utilDates2['default'].startOf(date, 'decade'), format(_this.props), culture);

        var currentID = optionId(id, date);

        return !inRange(date, min, max) ? _react2['default'].createElement(
          'td',
          { key: colIdx, role: 'gridcell', className: 'rw-empty-cell' },
          ' '
        ) : _react2['default'].createElement(
          'td',
          {
            key: colIdx,
            role: 'gridcell',
            id: currentID,
            title: label,
            'aria-selected': isSelected,
            'aria-label': label,
            'aria-readonly': disabled
          },
          _react2['default'].createElement(
            'span',
            {
              'aria-labelledby': currentID,
              onClick: onChange.bind(null, inRangeDate(date, min, max)),
              className: _classnames2['default']('rw-btn', {
                'rw-off-range': !inCentury(date, focused),
                'rw-state-focus': isFocused,
                'rw-state-selected': isSelected,
                'rw-now': currentDecade
              })
            },
            label
          )
        );
      })
    );
  }

});

function inRangeDate(decade, min, max) {
  return _utilDates2['default'].max(_utilDates2['default'].min(decade, max), min);
}

function inRange(decade, min, max) {
  return _utilDates2['default'].gte(decade, _utilDates2['default'].startOf(min, 'decade'), 'year') && _utilDates2['default'].lte(decade, _utilDates2['default'].endOf(max, 'decade'), 'year');
}

function inCentury(date, start) {
  return _utilDates2['default'].gte(date, _utilDates2['default'].startOf(start, 'century'), 'year') && _utilDates2['default'].lte(date, _utilDates2['default'].endOf(start, 'century'), 'year');
}

function getCenturyDecades(_date) {
  var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      date = _utilDates2['default'].add(_utilDates2['default'].startOf(_date, 'century'), -20, 'year');

  return days.map(function () {
    return date = _utilDates2['default'].add(date, 10, 'year');
  });
}
module.exports = exports['default'];
},{"./mixins/AriaDescendantMixin":29,"./mixins/PureRenderMixin":33,"./mixins/RtlChildContextMixin":34,"./util/_":37,"./util/babelHelpers.js":38,"./util/configuration":40,"./util/dates":43,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],9:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    cx = require('classnames'),
    compat = require('./util/compat'),
    localizers = require('./util/configuration').locale,
    CustomPropTypes = require('./util/propTypes');

module.exports = React.createClass({

  displayName: 'DatePickerInput',

  propTypes: {
    format: CustomPropTypes.dateFormat.isRequired,
    editFormat: CustomPropTypes.dateFormat,
    parse: React.PropTypes.func.isRequired,

    value: React.PropTypes.instanceOf(Date),
    onChange: React.PropTypes.func.isRequired,
    culture: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      textValue: ''
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var text = formatDate(nextProps.value, nextProps.editing && nextProps.editFormat ? nextProps.editFormat : nextProps.format, nextProps.culture);

    this.startValue = text;

    this.setState({
      textValue: text
    });
  },

  getInitialState: function getInitialState() {
    var text = formatDate(this.props.value, this.props.editing && this.props.editFormat ? this.props.editFormat : this.props.format, this.props.culture);

    this.startValue = text;

    return {
      textValue: text
    };
  },

  render: function render() {
    var value = this.state.textValue;

    return React.createElement('input', babelHelpers._extends({}, this.props, {
      type: 'text',
      className: cx({ 'rw-input': true }),
      value: value,
      'aria-disabled': this.props.disabled,
      'aria-readonly': this.props.readOnly,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this._change,
      onBlur: chain(this.props.blur, this._blur, this) }));
  },

  _change: function _change(e) {
    this.setState({ textValue: e.target.value });
    this._needsFlush = true;
  },

  _blur: function _blur(e) {
    var val = e.target.value,
        date;

    if (this._needsFlush) {
      this._needsFlush = false;
      date = this.props.parse(val);

      this.props.onChange(date, formatDate(date, this.props.format, this.props.culture));
    }
  },

  focus: function focus() {
    compat.findDOMNode(this).focus();
  }

});

function isValid(d) {
  return !isNaN(d.getTime());
}

function formatDate(date, format, culture) {
  var val = '';

  if (date instanceof Date && isValid(date)) val = localizers.date.format(date, format, culture);

  return val;
}

function chain(a, b, thisArg) {
  return function () {
    a && a.apply(thisArg, arguments);
    b && b.apply(thisArg, arguments);
  };
}
},{"./util/babelHelpers.js":38,"./util/compat":39,"./util/configuration":40,"./util/propTypes":49,"classnames":52,"react":"react"}],10:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactLibInvariant = require('react/lib/invariant');

var _reactLibInvariant2 = babelHelpers.interopRequireDefault(_reactLibInvariant);

var _reactLibGetActiveElement = require('react/lib/getActiveElement');

var _reactLibGetActiveElement2 = babelHelpers.interopRequireDefault(_reactLibGetActiveElement);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

//pick, omit, has

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _utilConstants = require('./util/constants');

var _utilConstants2 = babelHelpers.interopRequireDefault(_utilConstants);

var _Popup = require('./Popup');

var _Popup2 = babelHelpers.interopRequireDefault(_Popup);

var _Calendar2 = require('./Calendar');

var _Calendar3 = babelHelpers.interopRequireDefault(_Calendar2);

var _TimeList = require('./TimeList');

var _TimeList2 = babelHelpers.interopRequireDefault(_TimeList);

var _DateInput = require('./DateInput');

var _DateInput2 = babelHelpers.interopRequireDefault(_DateInput);

var _WidgetButton = require('./WidgetButton');

var _WidgetButton2 = babelHelpers.interopRequireDefault(_WidgetButton);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = babelHelpers.interopRequireDefault(_uncontrollable);

var _utilInteraction = require('./util/interaction');

var _utilWidgetHelpers = require('./util/widgetHelpers');

var views = _utilConstants2['default'].calendarViews;
var popups = _utilConstants2['default'].datePopups;

var Calendar = _Calendar3['default'].BaseCalendar;
var localizers = _utilConfiguration2['default'].locale;
var viewEnum = Object.keys(views).map(function (k) {
  return views[k];
});

var omit = _util_2['default'].omit;
var pick = _util_2['default'].pick;

var propTypes = babelHelpers._extends({}, _utilCompat2['default'].type(Calendar).propTypes, {

  //-- controlled props -----------
  value: _react2['default'].PropTypes.instanceOf(Date),
  onChange: _react2['default'].PropTypes.func,
  open: _react2['default'].PropTypes.oneOf([false, popups.TIME, popups.CALENDAR]),
  onToggle: _react2['default'].PropTypes.func,
  //------------------------------------

  onSelect: _react2['default'].PropTypes.func,

  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),

  culture: _react2['default'].PropTypes.string,

  format: _utilPropTypes2['default'].dateFormat,
  timeFormat: _utilPropTypes2['default'].dateFormat,
  editFormat: _utilPropTypes2['default'].dateFormat,

  calendar: _react2['default'].PropTypes.bool,
  time: _react2['default'].PropTypes.bool,

  timeComponent: _utilPropTypes2['default'].elementType,

  //popup
  dropUp: _react2['default'].PropTypes.bool,
  duration: _react2['default'].PropTypes.number,

  placeholder: _react2['default'].PropTypes.string,
  name: _react2['default'].PropTypes.string,

  initialView: _react2['default'].PropTypes.oneOf(viewEnum),
  finalView: _react2['default'].PropTypes.oneOf(viewEnum),

  disabled: _utilPropTypes2['default'].disabled,
  readOnly: _utilPropTypes2['default'].readOnly,
  autoFocus: _react2['default'].PropTypes.bool,

  parse: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string), _react2['default'].PropTypes.string, _react2['default'].PropTypes.func]),

  'aria-labelledby': _react2['default'].PropTypes.string,

  messages: _react2['default'].PropTypes.shape({
    calendarButton: _react2['default'].PropTypes.string,
    timeButton: _react2['default'].PropTypes.string
  })
});

var DateTimePicker = _react2['default'].createClass(babelHelpers.createDecoratedObject([{
  key: 'displayName',
  initializer: function initializer() {
    return 'DateTimePicker';
  }
}, {
  key: 'mixins',
  initializer: function initializer() {
    return [require('./mixins/TimeoutMixin'), require('./mixins/PureRenderMixin'), require('./mixins/PopupScrollToMixin'), require('./mixins/RtlParentContextMixin'), require('./mixins/AriaDescendantMixin')('valueInput', function (key, id) {
      var open = this.props.open;
      var current = this.ariaActiveDescendant();
      var calIsActive = open === popups.CALENDAR && key === 'calendar';
      var timeIsActive = open === popups.TIME && key === 'timelist';

      if (!current || (timeIsActive || calIsActive)) return id;
    })];
  }
}, {
  key: 'propTypes',
  initializer: function initializer() {
    return propTypes;
  }
}, {
  key: 'getInitialState',
  value: function getInitialState() {
    return {
      focused: false
    };
  }
}, {
  key: 'getDefaultProps',
  value: function getDefaultProps() {

    return {
      value: null,

      min: new Date(1900, 0, 1),
      max: new Date(2099, 11, 31),
      calendar: true,
      time: true,
      open: false,

      //calendar override
      footer: true,

      messages: {
        calendarButton: 'Select Date',
        timeButton: 'Select Time'
      },

      ariaActiveDescendantKey: 'dropdownlist'
    };
  }
}, {
  key: 'render',
  value: function render() {
    var _cx,
        _this = this;

    var _props = this.props;
    var className = _props.className;
    var calendar = _props.calendar;
    var time = _props.time;
    var open = _props.open;
    var tabIndex = _props.tabIndex;
    var value = _props.value;
    var editFormat = _props.editFormat;
    var timeFormat = _props.timeFormat;
    var culture = _props.culture;
    var duration = _props.duration;
    var step = _props.step;
    var messages = _props.messages;
    var min = _props.min;
    var max = _props.max;
    var busy = _props.busy;
    var placeholder = _props.placeholder;
    var disabled = _props.disabled;
    var readOnly = _props.readOnly;
    var name = _props.name;
    var dropUp = _props.dropUp;
    var timeComponent = _props.timeComponent;
    var autoFocus = _props.autoFocus;
    var ariaLabelledby = _props['aria-labelledby'];
    var focused = this.state.focused;

    var inputID = _utilWidgetHelpers.instanceId(this, '_input'),
        timeListID = _utilWidgetHelpers.instanceId(this, '_time_listbox'),
        dateListID = _utilWidgetHelpers.instanceId(this, '_cal'),
        owns = '';

    var elementProps = omit(this.props, Object.keys(propTypes)),
        calProps = pick(this.props, Object.keys(_utilCompat2['default'].type(Calendar).propTypes));

    var shouldRenderList = _utilWidgetHelpers.isFirstFocusedRender(this) || open,
        disabledOrReadonly = disabled || readOnly,
        calendarIsOpen = open === popups.CALENDAR,
        timeIsOpen = open === popups.TIME;

    if (calendar) owns += dateListID;
    if (time) owns += ' ' + timeListID;

    value = dateOrNull(value);

    return _react2['default'].createElement(
      'div',
      babelHelpers._extends({}, elementProps, {
        ref: 'element',
        tabIndex: '-1',
        onKeyDown: this._keyDown,
        onFocus: this._focus.bind(null, true),
        onBlur: this._focus.bind(null, false),
        className: _classnames2['default'](className, 'rw-datetimepicker', 'rw-widget', (_cx = {
          'rw-state-focus': focused,
          'rw-state-disabled': disabled,
          'rw-state-readonly': readOnly,
          'rw-has-both': calendar && time,
          'rw-has-neither': !calendar && !time,
          'rw-rtl': this.isRtl()

        }, _cx['rw-open' + (dropUp ? '-up' : '')] = open, _cx))
      }),
      _react2['default'].createElement(_DateInput2['default'], {
        ref: 'valueInput',
        id: inputID,
        autoFocus: autoFocus,
        tabIndex: tabIndex || 0,
        role: 'combobox',
        'aria-labelledby': ariaLabelledby,
        'aria-expanded': !!open,
        'aria-busy': !!busy,
        'aria-owns': owns.trim(),
        'aria-haspopup': true,
        placeholder: placeholder,
        name: name,
        disabled: disabled,
        readOnly: readOnly,
        value: value,
        format: getFormat(this.props),
        editFormat: editFormat,
        editing: focused,
        culture: culture,
        parse: this._parse,
        onChange: this._change
      }),
      (calendar || time) && _react2['default'].createElement(
        'span',
        { className: 'rw-select' },
        calendar && _react2['default'].createElement(
          _WidgetButton2['default'],
          {
            tabIndex: '-1',
            className: 'rw-btn-calendar',
            disabled: disabledOrReadonly,
            'aria-disabled': disabledOrReadonly,
            'aria-label': messages.calendarButton,
            onClick: this._click.bind(null, popups.CALENDAR)
          },
          _react2['default'].createElement('i', { className: 'rw-i rw-i-calendar',
            'aria-hidden': 'true'
          })
        ),
        time && _react2['default'].createElement(
          _WidgetButton2['default'],
          {
            tabIndex: '-1',
            className: 'rw-btn-time',
            disabled: disabledOrReadonly,
            'aria-disabled': disabledOrReadonly,
            'aria-label': messages.timeButton,
            onClick: this._click.bind(null, popups.TIME)
          },
          _react2['default'].createElement('i', { className: 'rw-i rw-i-clock-o',
            'aria-hidden': 'true'
          })
        )
      ),
      _react2['default'].createElement(
        _Popup2['default'],
        {
          dropUp: dropUp,
          open: timeIsOpen,
          onRequestClose: this.close,
          duration: duration,
          onOpening: function () {
            return _this.refs.timePopup.forceUpdate();
          }
        },
        _react2['default'].createElement(
          'div',
          null,
          shouldRenderList && _react2['default'].createElement(_TimeList2['default'], { ref: 'timePopup',
            id: timeListID,
            ariaActiveDescendantKey: 'timelist',
            'aria-labelledby': inputID,
            'aria-live': open && 'polite',
            'aria-hidden': !open,
            value: value,
            format: timeFormat,
            step: step,
            min: min,
            max: max,
            culture: culture,
            onMove: this._scrollTo,
            preserveDate: !!calendar,
            itemComponent: timeComponent,
            onSelect: this._selectTime
          })
        )
      ),
      _react2['default'].createElement(
        _Popup2['default'],
        {
          className: 'rw-calendar-popup',
          dropUp: dropUp,
          open: calendarIsOpen,
          duration: duration,
          onRequestClose: this.close
        },
        shouldRenderList && _react2['default'].createElement(Calendar, babelHelpers._extends({}, calProps, {
          ref: 'calPopup',
          tabIndex: '-1',
          id: dateListID,
          value: value,
          'aria-hidden': !open,
          'aria-live': 'polite',
          ariaActiveDescendantKey: 'calendar',
          onChange: this._selectDate,
          // #75: need to aggressively reclaim focus from the calendar otherwise
          // disabled header/footer buttons will drop focus completely from the widget
          onNavigate: function () {
            return _this.focus();
          }
        }))
      )
    );
  }
}, {
  key: '_change',
  decorators: [_utilInteraction.widgetEditable],
  value: function _change(date, str, constrain) {
    var _props2 = this.props;
    var onChange = _props2.onChange;
    var value = _props2.value;

    if (constrain) date = this.inRangeValue(date);

    if (onChange) {
      if (date == null || value == null) {
        if (date != value) //eslint-disable-line eqeqeq
          onChange(date, str);
      } else if (!_utilDates2['default'].eq(date, value)) onChange(date, str);
    }
  }
}, {
  key: '_keyDown',
  decorators: [_utilInteraction.widgetEditable],
  value: function _keyDown(e) {
    var _props3 = this.props;
    var open = _props3.open;
    var calendar = _props3.calendar;
    var time = _props3.time;

    if (e.key === 'Escape' && open) this.close();else if (e.altKey) {
      e.preventDefault();

      if (e.key === 'ArrowDown') {
        if (calendar && time) this.open(open === popups.CALENDAR ? popups.TIME : popups.CALENDAR);else if (time) this.open(popups.TIME);else if (calendar) this.open(popups.CALENDAR);
      } else if (e.key === 'ArrowUp') this.close();
    } else if (open) {
      if (open === popups.CALENDAR) this.refs.calPopup._keyDown(e);
      if (open === popups.TIME) this.refs.timePopup._keyDown(e);
    }

    _utilWidgetHelpers.notify(this.props.onKeyDown, [e]);
  }
}, {
  key: '_focus',
  decorators: [_utilInteraction.widgetEnabled],
  value: function _focus(focused, e) {
    var _this2 = this;

    this.setTimeout('focus', function () {
      if (!focused) _this2.close();

      if (focused !== _this2.state.focused) {
        _utilWidgetHelpers.notify(_this2.props[focused ? 'onFocus' : 'onBlur'], e);
        _this2.setState({ focused: focused });
      }
    });
  }
}, {
  key: 'focus',
  value: function focus() {
    if (_reactLibGetActiveElement2['default']() !== _utilCompat2['default'].findDOMNode(this.refs.valueInput)) this.refs.valueInput.focus();
  }
}, {
  key: '_selectDate',
  decorators: [_utilInteraction.widgetEditable],
  value: function _selectDate(date) {
    var format = getFormat(this.props),
        dateTime = _utilDates2['default'].merge(date, this.props.value),
        dateStr = formatDate(date, format, this.props.culture);

    this.close();
    _utilWidgetHelpers.notify(this.props.onSelect, [dateTime, dateStr]);
    this._change(dateTime, dateStr, true);
    this.focus();
  }
}, {
  key: '_selectTime',
  decorators: [_utilInteraction.widgetEditable],
  value: function _selectTime(datum) {
    var format = getFormat(this.props),
        dateTime = _utilDates2['default'].merge(this.props.value, datum.date),
        dateStr = formatDate(datum.date, format, this.props.culture);

    this.close();
    _utilWidgetHelpers.notify(this.props.onSelect, [dateTime, dateStr]);
    this._change(dateTime, dateStr, true);
    this.focus();
  }
}, {
  key: '_click',
  decorators: [_utilInteraction.widgetEditable],
  value: function _click(view, e) {
    this.focus();
    this.toggle(view, e);
  }
}, {
  key: '_parse',
  value: function _parse(string) {
    var format = getFormat(this.props, true),
        editFormat = this.props.editFormat,
        parse = this.props.parse,
        formats = [];

    if (typeof parse === 'function') return parse(string, this.props.culture);

    if (typeof format === 'string') formats.push(format);

    if (typeof editFormat === 'string') formats.push(editFormat);

    if (parse) formats = formats.concat(this.props.parse);

    _reactLibInvariant2['default'](formats.length, 'React Widgets: there are no specified `parse` formats provided and the `format` prop is a function. ' + 'the DateTimePicker is unable to parse `%s` into a dateTime, ' + 'please provide either a parse function or Globalize.js compatible string for `format`', string);

    return formatsParser(formats, this.props.culture, string);
  }
}, {
  key: 'toggle',
  value: function toggle(view) {
    this.props.open ? this.props.open !== view ? this.open(view) : this.close(view) : this.open(view);
  }
}, {
  key: 'open',
  value: function open(view) {
    if (this.props.open !== view && this.props[view] === true) _utilWidgetHelpers.notify(this.props.onToggle, view);
  }
}, {
  key: 'close',
  value: function close() {
    if (this.props.open) _utilWidgetHelpers.notify(this.props.onToggle, false);
  }
}, {
  key: 'inRangeValue',
  value: function inRangeValue(value) {
    if (value == null) return value;

    return _utilDates2['default'].max(_utilDates2['default'].min(value, this.props.max), this.props.min);
  }
}]));

var UncontrolledDateTimePicker = _uncontrollable2['default'](DateTimePicker, { open: 'onToggle', value: 'onChange' });

UncontrolledDateTimePicker.BaseDateTimePicker = DateTimePicker;

exports['default'] = UncontrolledDateTimePicker;

function getFormat(props) {
  var cal = props[popups.CALENDAR] != null ? props.calendar : true,
      time = props[popups.TIME] != null ? props.time : true;

  return props.format ? props.format : cal && time || !cal && !time ? localizers.date.formats['default'] : localizers.date.formats[cal ? 'date' : 'time'];
}

function formatDate(date, format, culture) {
  var val = '';

  if (date instanceof Date && !isNaN(date.getTime())) val = localizers.date.format(date, format, culture);

  return val;
}

function formatsParser(formats, culture, str) {
  var date;

  for (var i = 0; i < formats.length; i++) {
    date = localizers.date.parse(str, formats[i], culture);
    if (date) return date;
  }
  return null;
}

function dateOrNull(dt) {
  if (dt && !isNaN(dt.getTime())) return dt;
  return null;
}
module.exports = exports['default'];
},{"./Calendar":7,"./DateInput":9,"./Popup":22,"./TimeList":25,"./WidgetButton":26,"./mixins/AriaDescendantMixin":29,"./mixins/PopupScrollToMixin":32,"./mixins/PureRenderMixin":33,"./mixins/RtlParentContextMixin":35,"./mixins/TimeoutMixin":36,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/configuration":40,"./util/constants":41,"./util/dates":43,"./util/interaction":47,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react","react/lib/getActiveElement":78,"react/lib/invariant":79,"uncontrollable":75}],11:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilWidgetHelpers = require('./util/widgetHelpers');

var localizers = _utilConfiguration2['default'].locale;

var format = function format(props) {
  return props.yearFormat || localizers.date.formats.year;
};

var propTypes = {
  optionID: _react2['default'].PropTypes.func,
  culture: _react2['default'].PropTypes.string,

  value: _react2['default'].PropTypes.instanceOf(Date),
  focused: _react2['default'].PropTypes.instanceOf(Date),
  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),
  onChange: _react2['default'].PropTypes.func.isRequired,

  yearFormat: _utilPropTypes2['default'].dateFormat
};

var isEqual = function isEqual(dataA, dateB) {
  return _utilDates2['default'].eq(dataA, dateB, 'year');
};
var optionId = function optionId(id, date) {
  return id + '__decade_' + _utilDates2['default'].year(date);
};

exports['default'] = _react2['default'].createClass({

  displayName: 'DecadeView',

  mixins: [require('./mixins/PureRenderMixin'), require('./mixins/RtlChildContextMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: propTypes,

  componentDidUpdate: function componentDidUpdate() {
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), this.props.focused);
    this.ariaActiveDescendant(activeId);
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var focused = _props.focused;
    var years = getDecadeYears(focused);
    var rows = _util_2['default'].chunk(years, 4);

    var elementProps = _util_2['default'].omit(this.props, Object.keys(propTypes));

    return _react2['default'].createElement(
      'table',
      babelHelpers._extends({}, elementProps, {
        role: 'grid',
        className: _classnames2['default'](className, 'rw-nav-view')
      }),
      _react2['default'].createElement(
        'tbody',
        null,
        rows.map(this._row)
      )
    );
  },

  _row: function _row(row, rowIdx) {
    var _this = this;

    var _props2 = this.props;
    var focused = _props2.focused;
    var disabled = _props2.disabled;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var today = _props2.today;
    var culture = _props2.culture;
    var min = _props2.min;
    var max = _props2.max;
    var id = _utilWidgetHelpers.instanceId(this);

    return _react2['default'].createElement(
      'tr',
      { key: 'row_' + rowIdx, role: 'row' },
      row.map(function (date, colIdx) {
        var isFocused = isEqual(date, focused),
            isSelected = isEqual(date, value),
            currentYear = isEqual(date, today),
            label = localizers.date.format(date, format(_this.props), culture);

        var currentID = optionId(id, date);

        return !_utilDates2['default'].inRange(date, min, max, 'year') ? _react2['default'].createElement(
          'td',
          { key: colIdx, role: 'presentation', className: 'rw-empty-cell' },
          ' '
        ) : _react2['default'].createElement(
          'td',
          {
            key: colIdx,
            role: 'gridcell',
            id: currentID,
            title: label,
            'aria-selected': isSelected,
            'aria-label': label,
            'aria-readonly': disabled
          },
          _react2['default'].createElement(
            'span',
            {
              'aria-labelledby': currentID,
              onClick: onChange.bind(null, date),
              className: _classnames2['default']('rw-btn', {
                'rw-off-range': !inDecade(date, focused),
                'rw-state-focus': isFocused,
                'rw-state-selected': isSelected,
                'rw-now': currentYear
              })
            },
            label
          )
        );
      })
    );
  }
});

function inDecade(date, start) {
  return _utilDates2['default'].gte(date, _utilDates2['default'].startOf(start, 'decade'), 'year') && _utilDates2['default'].lte(date, _utilDates2['default'].endOf(start, 'decade'), 'year');
}

function getDecadeYears(_date) {
  var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      date = _utilDates2['default'].add(_utilDates2['default'].startOf(_date, 'decade'), -2, 'year');

  return days.map(function () {
    return date = _utilDates2['default'].add(date, 1, 'year');
  });
}
module.exports = exports['default'];
},{"./mixins/AriaDescendantMixin":29,"./mixins/PureRenderMixin":33,"./mixins/RtlChildContextMixin":34,"./util/_":37,"./util/babelHelpers.js":38,"./util/configuration":40,"./util/dates":43,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],12:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactLibGetActiveElement = require('react/lib/getActiveElement');

var _reactLibGetActiveElement2 = babelHelpers.interopRequireDefault(_reactLibGetActiveElement);

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = babelHelpers.interopRequireDefault(_domHelpersQueryContains);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _Popup = require('./Popup');

var _Popup2 = babelHelpers.interopRequireDefault(_Popup);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _List = require('./List');

var _List2 = babelHelpers.interopRequireDefault(_List);

var _ListGroupable = require('./ListGroupable');

var _ListGroupable2 = babelHelpers.interopRequireDefault(_ListGroupable);

var _utilValidateListInterface = require('./util/validateListInterface');

var _utilValidateListInterface2 = babelHelpers.interopRequireDefault(_utilValidateListInterface);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = babelHelpers.interopRequireDefault(_uncontrollable);

var _utilDataHelpers = require('./util/dataHelpers');

var _utilInteraction = require('./util/interaction');

var _utilWidgetHelpers = require('./util/widgetHelpers');

var omit = _util_2['default'].omit;
var pick = _util_2['default'].pick;
var result = _util_2['default'].result;

var propTypes = {
  //-- controlled props -----------
  value: _react2['default'].PropTypes.any,
  onChange: _react2['default'].PropTypes.func,
  open: _react2['default'].PropTypes.bool,
  onToggle: _react2['default'].PropTypes.func,
  //------------------------------------

  data: _react2['default'].PropTypes.array,
  valueField: _react2['default'].PropTypes.string,
  textField: _utilPropTypes2['default'].accessor,

  valueComponent: _utilPropTypes2['default'].elementType,
  itemComponent: _utilPropTypes2['default'].elementType,
  listComponent: _utilPropTypes2['default'].elementType,

  groupComponent: _utilPropTypes2['default'].elementType,
  groupBy: _utilPropTypes2['default'].accessor,

  onSelect: _react2['default'].PropTypes.func,

  searchTerm: _react2['default'].PropTypes.string,
  onSearch: _react2['default'].PropTypes.func,

  busy: _react2['default'].PropTypes.bool,

  delay: _react2['default'].PropTypes.number,

  dropUp: _react2['default'].PropTypes.bool,
  duration: _react2['default'].PropTypes.number, //popup

  disabled: _utilPropTypes2['default'].disabled,

  readOnly: _utilPropTypes2['default'].readOnly,

  messages: _react2['default'].PropTypes.shape({
    open: _utilPropTypes2['default'].message,
    emptyList: _utilPropTypes2['default'].message,
    emptyFilter: _utilPropTypes2['default'].message,
    filterPlaceholder: _utilPropTypes2['default'].message
  })
};

var DropdownList = _react2['default'].createClass(babelHelpers.createDecoratedObject([{
  key: 'displayName',
  initializer: function initializer() {
    return 'DropdownList';
  }
}, {
  key: 'mixins',
  initializer: function initializer() {
    return [require('./mixins/TimeoutMixin'), require('./mixins/PureRenderMixin'), require('./mixins/DataFilterMixin'), require('./mixins/PopupScrollToMixin'), require('./mixins/RtlParentContextMixin'), require('./mixins/AriaDescendantMixin')()];
  }
}, {
  key: 'propTypes',
  initializer: function initializer() {
    return propTypes;
  }
}, {
  key: 'getDefaultProps',
  value: function getDefaultProps() {
    return {
      delay: 500,
      value: '',
      open: false,
      data: [],
      searchTerm: '',
      messages: msgs(),
      ariaActiveDescendantKey: 'dropdownlist'
    };
  }
}, {
  key: 'getInitialState',
  value: function getInitialState() {
    var _props = this.props;
    var open = _props.open;
    var filter = _props.filter;
    var value = _props.value;
    var data = _props.data;
    var searchTerm = _props.searchTerm;
    var valueField = _props.valueField;

    var processed = filter ? this.filter(data, searchTerm) : data,
        initialIdx = _utilDataHelpers.dataIndexOf(data, value, valueField);

    return {
      filteredData: open && filter ? processed : null,
      selectedItem: processed[initialIdx],
      focusedItem: processed[initialIdx] || data[0]
    };
  }
}, {
  key: 'componentDidUpdate',
  value: function componentDidUpdate() {
    this.refs.list && _utilValidateListInterface2['default'](this.refs.list);
  }
}, {
  key: 'componentWillReceiveProps',
  value: function componentWillReceiveProps(props) {
    var open = props.open;
    var filter = props.filter;
    var value = props.value;
    var data = props.data;
    var searchTerm = props.searchTerm;
    var valueField = props.valueField;

    var processed = filter ? this.filter(data, searchTerm) : data,
        idx = _utilDataHelpers.dataIndexOf(data, value, valueField);

    this.setState({
      filteredData: open && filter ? processed : null,
      selectedItem: processed[idx],
      focusedItem: processed[! ~idx ? 0 : idx]
    });
  }
}, {
  key: 'render',
  value: function render() {
    var _cx,
        _this = this;

    var _props2 = this.props;
    var className = _props2.className;
    var tabIndex = _props2.tabIndex;
    var filter = _props2.filter;
    var valueField = _props2.valueField;
    var textField = _props2.textField;
    var groupBy = _props2.groupBy;
    var messages = _props2.messages;
    var data = _props2.data;
    var busy = _props2.busy;
    var dropUp = _props2.dropUp;
    var placeholder = _props2.placeholder;
    var value = _props2.value;
    var open = _props2.open;
    var disabled = _props2.disabled;
    var readOnly = _props2.readOnly;
    var ValueComponent = _props2.valueComponent;
    var List = _props2.listComponent;

    List = List || groupBy && _ListGroupable2['default'] || _List2['default'];

    var elementProps = omit(this.props, Object.keys(propTypes));
    var listProps = pick(this.props, Object.keys(_utilCompat2['default'].type(List).propTypes));
    var popupProps = pick(this.props, Object.keys(_utilCompat2['default'].type(_Popup2['default']).propTypes));

    var _state = this.state;
    var focusedItem = _state.focusedItem;
    var selectedItem = _state.selectedItem;
    var focused = _state.focused;

    var items = this._data(),
        valueItem = _utilDataHelpers.dataItem(data, value, valueField),
        // take value from the raw data
    listID = _utilWidgetHelpers.instanceId(this, '__listbox');

    var shouldRenderList = _utilWidgetHelpers.isFirstFocusedRender(this) || open;

    messages = msgs(messages);

    return _react2['default'].createElement(
      'div',
      babelHelpers._extends({}, elementProps, {
        ref: 'input',
        role: 'combobox',
        tabIndex: tabIndex || '0',
        'aria-expanded': open,
        'aria-haspopup': true,
        'aria-owns': listID,
        'aria-busy': !!busy,
        'aria-live': !open && 'polite',
        //aria-activedescendant={activeID}
        'aria-autocomplete': 'list',
        'aria-disabled': disabled,
        'aria-readonly': readOnly,
        onKeyDown: this._keyDown,
        onClick: this._click,
        onFocus: this._focus.bind(null, true),
        onBlur: this._focus.bind(null, false),
        className: _classnames2['default'](className, 'rw-dropdownlist', 'rw-widget', (_cx = {
          'rw-state-disabled': disabled,
          'rw-state-readonly': readOnly,
          'rw-state-focus': focused,
          'rw-rtl': this.isRtl()

        }, _cx['rw-open' + (dropUp ? '-up' : '')] = open, _cx)) }),
      _react2['default'].createElement(
        'span',
        { className: 'rw-dropdownlist-picker rw-select rw-btn' },
        _react2['default'].createElement(
          'i',
          { className: 'rw-i rw-i-caret-down' + (busy ? ' rw-loading' : '') },
          _react2['default'].createElement(
            'span',
            { className: 'rw-sr' },
            result(messages.open, this.props)
          )
        )
      ),
      _react2['default'].createElement(
        'div',
        {
          className: 'rw-input'
        },
        !valueItem && placeholder ? _react2['default'].createElement(
          'span',
          { className: 'rw-placeholder' },
          placeholder
        ) : this.props.valueComponent ? _react2['default'].createElement(ValueComponent, { item: valueItem }) : _utilDataHelpers.dataText(valueItem, textField)
      ),
      _react2['default'].createElement(
        _Popup2['default'],
        babelHelpers._extends({}, popupProps, {
          onOpen: function () {
            return _this.focus();
          },
          onOpening: function () {
            return _this.refs.list.forceUpdate();
          },
          onRequestClose: this.close
        }),
        _react2['default'].createElement(
          'div',
          null,
          filter && this._renderFilter(messages),
          shouldRenderList && _react2['default'].createElement(List, babelHelpers._extends({ ref: 'list'
          }, listProps, {
            data: items,
            id: listID,
            'aria-live': open && 'polite',
            'aria-labelledby': _utilWidgetHelpers.instanceId(this),
            'aria-hidden': !this.props.open,
            selected: selectedItem,
            focused: open ? focusedItem : null,
            onSelect: this._onSelect,
            onMove: this._scrollTo,
            messages: {
              emptyList: data.length ? messages.emptyFilter : messages.emptyList
            } }))
        )
      )
    );
  }
}, {
  key: '_renderFilter',
  value: function _renderFilter(messages) {
    var _this2 = this;

    return _react2['default'].createElement(
      'div',
      { ref: 'filterWrapper', className: 'rw-filter-input' },
      _react2['default'].createElement(
        'span',
        { className: 'rw-select rw-btn' },
        _react2['default'].createElement('i', { className: 'rw-i rw-i-search' })
      ),
      _react2['default'].createElement('input', { ref: 'filter', className: 'rw-input',
        placeholder: _util_2['default'].result(messages.filterPlaceholder, this.props),
        value: this.props.searchTerm,
        onChange: function (e) {
          return _utilWidgetHelpers.notify(_this2.props.onSearch, e.target.value);
        } })
    );
  }
}, {
  key: '_focus',
  decorators: [_utilInteraction.widgetEnabled],
  value: function _focus(focused, e) {
    var _this3 = this;

    this.setTimeout('focus', function () {
      if (!focused) _this3.close();

      if (focused !== _this3.state.focused) {
        _utilWidgetHelpers.notify(_this3.props[focused ? 'onFocus' : 'onBlur'], e);
        _this3.setState({ focused: focused });
      }
    });
  }
}, {
  key: '_onSelect',
  decorators: [_utilInteraction.widgetEditable],
  value: function _onSelect(data) {
    this.close();
    _utilWidgetHelpers.notify(this.props.onSelect, data);
    this.change(data);
    this.focus(this);
  }
}, {
  key: '_click',
  decorators: [_utilInteraction.widgetEditable],
  value: function _click(e) {
    var wrapper = this.refs.filterWrapper;

    if (!this.props.filter || !this.props.open) this.toggle();else if (!_domHelpersQueryContains2['default'](_utilCompat2['default'].findDOMNode(wrapper), e.target)) this.close();

    _utilWidgetHelpers.notify(this.props.onClick, e);
  }
}, {
  key: '_keyDown',
  decorators: [_utilInteraction.widgetEditable],
  value: function _keyDown(e) {
    var _this4 = this;

    var self = this,
        key = e.key,
        alt = e.altKey,
        list = this.refs.list,
        filtering = this.props.filter,
        focusedItem = this.state.focusedItem,
        selectedItem = this.state.selectedItem,
        isOpen = this.props.open,
        closeWithFocus = function closeWithFocus() {
      _this4.close(), _utilCompat2['default'].findDOMNode(_this4).focus();
    };

    if (key === 'End') {
      if (isOpen) this.setState({ focusedItem: list.last() });else change(list.last());
      e.preventDefault();
    } else if (key === 'Home') {
      if (isOpen) this.setState({ focusedItem: list.first() });else change(list.first());
      e.preventDefault();
    } else if (key === 'Escape' && isOpen) {
      closeWithFocus();
    } else if ((key === 'Enter' || key === ' ' && !filtering) && isOpen) {
      change(this.state.focusedItem, true);
    } else if (key === 'ArrowDown') {
      if (alt) this.open();else if (isOpen) this.setState({ focusedItem: list.next(focusedItem) });else change(list.next(selectedItem));
      e.preventDefault();
    } else if (key === 'ArrowUp') {
      if (alt) closeWithFocus();else if (isOpen) this.setState({ focusedItem: list.prev(focusedItem) });else change(list.prev(selectedItem));
      e.preventDefault();
    } else if (!(this.props.filter && isOpen)) this.search(String.fromCharCode(e.keyCode), function (item) {
      isOpen ? _this4.setState({ focusedItem: item }) : change(item);
    });

    _utilWidgetHelpers.notify(this.props.onKeyDown, [e]);

    function change(item, fromList) {
      if (!item) return;
      fromList ? self._onSelect(item) : self.change(item);
    }
  }
}, {
  key: 'change',
  value: function change(data) {
    if (!_util_2['default'].isShallowEqual(data, this.props.value)) {
      _utilWidgetHelpers.notify(this.props.onChange, data);
      _utilWidgetHelpers.notify(this.props.onSearch, '');
      this.close();
    }
  }
}, {
  key: 'focus',
  value: function focus(target) {
    var inst = target || (this.props.filter && this.props.open ? this.refs.filter : this.refs.input);

    if (_reactLibGetActiveElement2['default']() !== _utilCompat2['default'].findDOMNode(inst)) _utilCompat2['default'].findDOMNode(inst).focus();
  }
}, {
  key: '_data',
  value: function _data() {
    return this.state.filteredData || this.props.data.concat();
  }
}, {
  key: 'search',
  value: function search(character, cb) {
    var _this5 = this;

    var word = ((this._searchTerm || '') + character).toLowerCase();

    this._searchTerm = word;

    this.setTimeout('search', function () {
      var list = _this5.refs.list,
          key = _this5.props.open ? 'focusedItem' : 'selectedItem',
          item = list.next(_this5.state[key], word);

      _this5._searchTerm = '';
      if (item) cb(item);
    }, this.props.delay);
  }
}, {
  key: 'open',
  value: function open() {
    _utilWidgetHelpers.notify(this.props.onToggle, true);
  }
}, {
  key: 'close',
  value: function close() {
    _utilWidgetHelpers.notify(this.props.onToggle, false);
  }
}, {
  key: 'toggle',
  value: function toggle() {
    this.props.open ? this.close() : this.open();
  }
}]));

function msgs(msgs) {
  return babelHelpers._extends({
    open: 'open dropdown',
    filterPlaceholder: '',
    emptyList: 'There are no items in this list',
    emptyFilter: 'The filter returned no results'
  }, msgs);
}

module.exports = _uncontrollable2['default'](DropdownList, { open: 'onToggle', value: 'onChange', searchTerm: 'onSearch' });

module.exports.BaseDropdownList = DropdownList;
},{"./List":15,"./ListGroupable":16,"./Popup":22,"./mixins/AriaDescendantMixin":29,"./mixins/DataFilterMixin":30,"./mixins/PopupScrollToMixin":32,"./mixins/PureRenderMixin":33,"./mixins/RtlParentContextMixin":35,"./mixins/TimeoutMixin":36,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/dataHelpers":42,"./util/interaction":47,"./util/propTypes":49,"./util/validateListInterface":50,"./util/widgetHelpers":51,"classnames":52,"dom-helpers/query/contains":56,"react":"react","react/lib/getActiveElement":78,"uncontrollable":75}],13:[function(require,module,exports){
'use strict';

var React = require('react'),
    Btn = require('./WidgetButton'),
    localizers = require('./util/configuration').locale;

var format = function format(props) {
  return props.format || localizers.date.formats.footer;
};

module.exports = React.createClass({

  displayName: 'Footer',

  render: function render() {
    var now = this.props.value,
        formatted = localizers.date.format(now, format(this.props), this.props.culture);

    return React.createElement(
      'div',
      { className: 'rw-footer' },
      React.createElement(
        Btn,
        { tabIndex: '-1',
          'aria-disabled': !!this.props.disabled,
          'aria-readonly': !!this.props.readOnly,
          disabled: this.props.disabled,
          readOnly: this.props.readOnly,
          onClick: this.props.onClick.bind(null, now)
        },
        formatted
      )
    );
  }

});
},{"./WidgetButton":26,"./util/configuration":40,"react":"react"}],14:[function(require,module,exports){
'use strict';
var React = require('react'),
    Btn = require('./WidgetButton');

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    label: React.PropTypes.string.isRequired,
    labelId: React.PropTypes.string,

    upDisabled: React.PropTypes.bool.isRequired,
    prevDisabled: React.PropTypes.bool.isRequired,
    nextDisabled: React.PropTypes.bool.isRequired,
    onViewChange: React.PropTypes.func.isRequired,
    onMoveLeft: React.PropTypes.func.isRequired,
    onMoveRight: React.PropTypes.func.isRequired,

    messages: React.PropTypes.shape({
      moveBack: React.PropTypes.string,
      moveForward: React.PropTypes.string
    })
  },

  mixins: [require('./mixins/PureRenderMixin'), require('./mixins/RtlChildContextMixin')],

  getDefaultProps: function getDefaultProps() {
    return {
      messages: {
        moveBack: 'navigate back',
        moveForward: 'navigate forward'
      }
    };
  },

  render: function render() {
    var _props = this.props;
    var messages = _props.messages;
    var label = _props.label;
    var labelId = _props.labelId;
    var onMoveRight = _props.onMoveRight;
    var onMoveLeft = _props.onMoveLeft;
    var onViewChange = _props.onViewChange;
    var prevDisabled = _props.prevDisabled;
    var upDisabled = _props.upDisabled;
    var nextDisabled = _props.nextDisabled;

    var rtl = this.isRtl();

    return React.createElement(
      'div',
      { className: 'rw-header' },
      React.createElement(
        Btn,
        { className: 'rw-btn-left',
          tabIndex: '-1',
          onClick: onMoveLeft,
          disabled: prevDisabled,
          'aria-disabled': prevDisabled,
          'aria-label': messages.moveBack,
          title: messages.moveBack
        },
        React.createElement('i', { 'aria-hidden': 'false',
          className: 'rw-i rw-i-caret-' + (rtl ? 'right' : 'left')
        })
      ),
      React.createElement(
        Btn,
        {
          id: labelId,
          tabIndex: '-1',
          className: 'rw-btn-view',
          disabled: upDisabled,
          'aria-disabled': upDisabled,
          'aria-live': 'polite',
          'aria-atomic': 'true',
          onClick: onViewChange
        },
        label
      ),
      React.createElement(
        Btn,
        { className: 'rw-btn-right',
          tabIndex: '-1',
          onClick: onMoveRight,
          disabled: nextDisabled,
          title: messages.moveForward,
          'aria-label': messages.moveForward,
          'aria-disabled': nextDisabled
        },
        React.createElement('i', { 'aria-hidden': 'false',
          className: 'rw-i rw-i-caret-' + (rtl ? 'left' : 'right')
        })
      )
    );
  }
});
},{"./WidgetButton":26,"./mixins/PureRenderMixin":33,"./mixins/RtlChildContextMixin":34,"react":"react"}],15:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _ListOption = require('./ListOption');

var _ListOption2 = babelHelpers.interopRequireDefault(_ListOption);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _utilDataHelpers = require('./util/dataHelpers');

var _utilWidgetHelpers = require('./util/widgetHelpers');

var optionId = function optionId(id, idx) {
  return id + '__option__' + idx;
};

exports['default'] = _react2['default'].createClass({

  displayName: 'List',

  mixins: [require('./mixins/ListMovementMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: {
    data: _react2['default'].PropTypes.array,
    onSelect: _react2['default'].PropTypes.func,
    onMove: _react2['default'].PropTypes.func,

    optionComponent: _utilPropTypes2['default'].elementType,
    itemComponent: _utilPropTypes2['default'].elementType,

    selectedIndex: _react2['default'].PropTypes.number,
    focusedIndex: _react2['default'].PropTypes.number,
    valueField: _react2['default'].PropTypes.string,
    textField: _utilPropTypes2['default'].accessor,

    optionID: _react2['default'].PropTypes.func,

    messages: _react2['default'].PropTypes.shape({
      emptyList: _utilPropTypes2['default'].message
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      optID: '',
      onSelect: function onSelect() {},
      optionComponent: _ListOption2['default'],
      ariaActiveDescendantKey: 'list',
      data: [],
      messages: {
        emptyList: 'There are no items in this list'
      }
    };
  },

  componentDidMount: function componentDidMount() {
    this.move();
  },

  componentDidUpdate: function componentDidUpdate() {
    var _props = this.props;
    var data = _props.data;
    var focused = _props.focused;
    var idx = data.indexOf(focused);
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), idx);

    this.ariaActiveDescendant(idx !== -1 ? activeId : null);

    this.move();
  },

  render: function render() {
    var _props2 = this.props;
    var className = _props2.className;
    var role = _props2.role;
    var data = _props2.data;
    var textField = _props2.textField;
    var valueField = _props2.valueField;
    var focused = _props2.focused;
    var selected = _props2.selected;
    var messages = _props2.messages;
    var onSelect = _props2.onSelect;
    var ItemComponent = _props2.itemComponent;
    var Option = _props2.optionComponent;
    var optionID = _props2.optionID;
    var props = babelHelpers.objectWithoutProperties(_props2, ['className', 'role', 'data', 'textField', 'valueField', 'focused', 'selected', 'messages', 'onSelect', 'itemComponent', 'optionComponent', 'optionID']);
    var id = _utilWidgetHelpers.instanceId(this);
    var items;

    items = !data.length ? _react2['default'].createElement(
      'li',
      { className: 'rw-list-empty' },
      _util_2['default'].result(messages.emptyList, this.props)
    ) : data.map(function (item, idx) {
      var currentId = optionId(id, idx);

      return _react2['default'].createElement(
        Option,
        {
          key: 'item_' + idx,
          id: currentId,
          dataItem: item,
          focused: focused === item, z: true,
          selected: selected === item,
          onClick: onSelect.bind(null, item)
        },
        ItemComponent ? _react2['default'].createElement(ItemComponent, {
          item: item,
          value: _utilDataHelpers.dataValue(item, valueField),
          text: _utilDataHelpers.dataText(item, textField)
        }) : _utilDataHelpers.dataText(item, textField)
      );
    });

    return _react2['default'].createElement(
      'ul',
      babelHelpers._extends({
        id: id,
        tabIndex: '-1',
        className: _classnames2['default'](className, 'rw-list'),
        role: role === undefined ? 'listbox' : role
      }, props),
      items
    );
  },

  _data: function _data() {
    return this.props.data;
  },

  move: function move() {
    var list = _utilCompat2['default'].findDOMNode(this),
        idx = this._data().indexOf(this.props.focused),
        selected = list.children[idx];

    if (!selected) return;

    _utilWidgetHelpers.notify(this.props.onMove, [selected, list, this.props.focused]);
  }

});
module.exports = exports['default'];
},{"./ListOption":17,"./mixins/AriaDescendantMixin":29,"./mixins/ListMovementMixin":31,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/dataHelpers":42,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],16:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _ListOption = require('./ListOption');

var _ListOption2 = babelHelpers.interopRequireDefault(_ListOption);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _reactLibWarning = require('react/lib/warning');

var _reactLibWarning2 = babelHelpers.interopRequireDefault(_reactLibWarning);

var _utilDataHelpers = require('./util/dataHelpers');

var _utilWidgetHelpers = require('./util/widgetHelpers');

var optionId = function optionId(id, idx) {
  return id + '__option__' + idx;
};

exports['default'] = _react2['default'].createClass({

  displayName: 'List',

  mixins: [require('./mixins/ListMovementMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: {
    data: _react2['default'].PropTypes.array,
    onSelect: _react2['default'].PropTypes.func,
    onMove: _react2['default'].PropTypes.func,

    optionComponent: _utilPropTypes2['default'].elementType,
    itemComponent: _utilPropTypes2['default'].elementType,
    groupComponent: _utilPropTypes2['default'].elementType,

    selected: _react2['default'].PropTypes.any,
    focused: _react2['default'].PropTypes.any,

    valueField: _react2['default'].PropTypes.string,
    textField: _utilPropTypes2['default'].accessor,

    optID: _react2['default'].PropTypes.string,

    groupBy: _utilPropTypes2['default'].accessor,

    messages: _react2['default'].PropTypes.shape({
      emptyList: _utilPropTypes2['default'].message
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      optID: '',
      onSelect: function onSelect() {},
      data: [],
      optionComponent: _ListOption2['default'],
      ariaActiveDescendantKey: 'groupedList',
      messages: {
        emptyList: 'There are no items in this list'
      }
    };
  },

  getInitialState: function getInitialState() {
    var keys = [];

    return {
      groups: this._group(this.props.groupBy, this.props.data, keys),

      sortedKeys: keys
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var keys = [];

    if (nextProps.data !== this.props.data || nextProps.groupBy !== this.props.groupBy) this.setState({
      groups: this._group(nextProps.groupBy, nextProps.data, keys),
      sortedKeys: keys
    });
  },

  componentDidMount: function componentDidMount() {
    this.move();
  },

  componentDidUpdate: function componentDidUpdate() {
    this.ariaActiveDescendant(this._currentActiveID);
    this.move();
  },

  render: function render() {
    var _this = this;

    var _props = this.props;
    var className = _props.className;
    var role = _props.role;
    var data = _props.data;
    var messages = _props.messages;
    var onSelect = _props.onSelect;
    var selectedIndex = _props.selectedIndex;
    var props = babelHelpers.objectWithoutProperties(_props, ['className', 'role', 'data', 'messages', 'onSelect', 'selectedIndex']);
    var id = _utilWidgetHelpers.instanceId(this);var _state = this.state;
    var sortedKeys = _state.sortedKeys;
    var groups = _state.groups;

    var items = [],
        idx = -1,
        group = undefined;

    this._currentActiveID = null;

    if (data.length) {
      items = sortedKeys.reduce(function (items, key) {
        group = groups[key];
        items.push(_this._renderGroupHeader(key));

        for (var itemIdx = 0; itemIdx < group.length; itemIdx++) items.push(_this._renderItem(key, group[itemIdx], ++idx));

        return items;
      }, []);
    } else items = _react2['default'].createElement(
      'li',
      { className: 'rw-list-empty' },
      _util_2['default'].result(messages.emptyList, this.props)
    );

    return _react2['default'].createElement(
      'ul',
      babelHelpers._extends({
        ref: 'scrollable',
        id: id,
        tabIndex: '-1',
        className: _classnames2['default'](className, 'rw-list', 'rw-list-grouped'),
        role: role === undefined ? 'listbox' : role
      }, props),
      items
    );
  },

  _renderGroupHeader: function _renderGroupHeader(group) {
    var GroupComponent = this.props.groupComponent,
        id = _utilWidgetHelpers.instanceId(this);

    return _react2['default'].createElement(
      'li',
      {
        key: 'item_' + group,
        tabIndex: '-1',
        role: 'separator',
        id: id + '_group_' + group,
        className: 'rw-list-optgroup'
      },
      GroupComponent ? _react2['default'].createElement(GroupComponent, { item: group }) : group
    );
  },

  _renderItem: function _renderItem(group, item, idx) {
    var _props2 = this.props;
    var focused = _props2.focused;
    var selected = _props2.selected;
    var onSelect = _props2.onSelect;
    var textField = _props2.textField;
    var valueField = _props2.valueField;
    var ItemComponent = _props2.itemComponent;
    var Option = _props2.optionComponent;

    var currentID = optionId(_utilWidgetHelpers.instanceId(this), idx);

    if (focused === item) this._currentActiveID = currentID;

    return _react2['default'].createElement(
      Option,
      {
        key: 'item_' + group + '_' + idx,
        id: currentID,
        dataItem: item,
        focused: focused === item,
        selected: selected === item,
        onClick: onSelect.bind(null, item)
      },
      ItemComponent ? _react2['default'].createElement(ItemComponent, {
        item: item,
        value: _utilDataHelpers.dataValue(item, valueField),
        text: _utilDataHelpers.dataText(item, textField)
      }) : _utilDataHelpers.dataText(item, textField)
    );
  },

  _isIndexOf: function _isIndexOf(idx, item) {
    return this.props.data[idx] === item;
  },

  _group: function _group(groupBy, data, keys) {
    var iter = typeof groupBy === 'function' ? groupBy : function (item) {
      return item[groupBy];
    };

    // the keys array ensures that groups are rendered in the order they came in
    // which means that if you sort the data array it will render sorted,
    // so long as you also sorted by group
    keys = keys || [];

    _reactLibWarning2['default'](typeof groupBy !== 'string' || !data.length || _util_2['default'].has(data[0], groupBy), '[React Widgets] You are seem to be trying to group this list by a ' + ('property `' + groupBy + '` that doesn\'t exist in the dataset items, this may be a typo'));

    return data.reduce(function (grps, item) {
      var group = iter(item);

      _util_2['default'].has(grps, group) ? grps[group].push(item) : (keys.push(group), grps[group] = [item]);

      return grps;
    }, {});
  },

  _data: function _data() {
    var groups = this.state.groups;

    return this.state.sortedKeys.reduce(function (flat, grp) {
      return flat.concat(groups[grp]);
    }, []);
  },

  move: function move() {
    var selected = this.getItemDOMNode(this.props.focused);

    if (!selected) return;

    _utilWidgetHelpers.notify(this.props.onMove, [selected, _utilCompat2['default'].findDOMNode(this), this.props.focused]);
  },

  getItemDOMNode: function getItemDOMNode(item) {
    var list = _utilCompat2['default'].findDOMNode(this),
        groups = this.state.groups,
        idx = -1,
        itemIdx,
        child;

    this.state.sortedKeys.some(function (group) {
      itemIdx = groups[group].indexOf(item);
      idx++;

      if (itemIdx !== -1) return !!(child = list.children[idx + itemIdx + 1]);

      idx += groups[group].length;
    });

    return child;
  }

});
module.exports = exports['default'];
},{"./ListOption":17,"./mixins/AriaDescendantMixin":29,"./mixins/ListMovementMixin":31,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/dataHelpers":42,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react","react/lib/warning":80}],17:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var ListOption = _react2['default'].createClass({
  displayName: 'ListOption',

  propTypes: {
    dataItem: _react2['default'].PropTypes.any,
    focused: _react2['default'].PropTypes.bool,
    selected: _react2['default'].PropTypes.bool
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var children = _props.children;
    var focused = _props.focused;
    var selected = _props.selected;
    var props = babelHelpers.objectWithoutProperties(_props, ['className', 'children', 'focused', 'selected']);

    var classes = {
      'rw-state-focus': focused,
      'rw-state-selected': selected
    };

    return _react2['default'].createElement(
      'li',
      babelHelpers._extends({
        role: 'option',
        tabIndex: '-1',
        'aria-selected': !!selected,
        className: _classnames2['default']('rw-list-option', className, classes)
      }, props),
      children
    );
  }
});

exports['default'] = ListOption;
module.exports = exports['default'];
},{"./util/babelHelpers.js":38,"classnames":52,"react":"react"}],18:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _utilWidgetHelpers = require('./util/widgetHelpers');

var localizers = _utilConfiguration2['default'].locale,
    dayFormat = function dayFormat(props) {
  return props.dayFormat || localizers.date.formats.weekday;
},
    dateFormat = function dateFormat(props) {
  return props.dateFormat || localizers.date.formats.dayOfMonth;
};

var optionId = function optionId(id, date) {
  return id + '__month_' + _utilDates2['default'].month(date) + '-' + _utilDates2['default'].date(date);
};

var propTypes = {
  optionID: _react2['default'].PropTypes.func,

  culture: _react2['default'].PropTypes.string,
  value: _react2['default'].PropTypes.instanceOf(Date),
  focused: _react2['default'].PropTypes.instanceOf(Date),
  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),

  dayComponent: _utilPropTypes2['default'].elementType,

  dayFormat: _utilPropTypes2['default'].dateFormat,
  dateFormat: _utilPropTypes2['default'].dateFormat,
  footerFormat: _utilPropTypes2['default'].dateFormat,

  onChange: _react2['default'].PropTypes.func.isRequired
};

var isEqual = function isEqual(dateA, dateB) {
  return _utilDates2['default'].eq(dateA, dateB, 'day');
};

var MonthView = _react2['default'].createClass({

  displayName: 'MonthView',

  statics: {
    isEqual: isEqual
  },

  mixins: [require('./mixins/RtlChildContextMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: propTypes,

  componentDidUpdate: function componentDidUpdate() {
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), this.props.focused);
    this.ariaActiveDescendant(activeId, null);
  },

  render: function render() {
    var _props = this.props;
    var focused = _props.focused;
    var culture = _props.culture;
    var month = _utilDates2['default'].visibleDays(focused, culture);
    var rows = _util_2['default'].chunk(month, 7);

    var elementProps = _util_2['default'].omit(this.props, Object.keys(propTypes));

    return _react2['default'].createElement(
      'table',
      babelHelpers._extends({}, elementProps, {
        role: 'grid'
      }),
      _react2['default'].createElement(
        'thead',
        null,
        _react2['default'].createElement(
          'tr',
          null,
          this._headers(dayFormat(this.props), culture)
        )
      ),
      _react2['default'].createElement(
        'tbody',
        null,
        rows.map(this._row)
      )
    );
  },

  _row: function _row(row, rowIdx) {
    var _this = this;

    var _props2 = this.props;
    var focused = _props2.focused;
    var today = _props2.today;
    var disabled = _props2.disabled;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var culture = _props2.culture;
    var min = _props2.min;
    var max = _props2.max;
    var Day = _props2.dayComponent;
    var id = _utilWidgetHelpers.instanceId(this);
    var labelFormat = localizers.date.formats.footer;

    return _react2['default'].createElement(
      'tr',
      { key: 'week_' + rowIdx, role: 'row' },
      row.map(function (day, colIdx) {

        var isFocused = isEqual(day, focused),
            isSelected = isEqual(day, value),
            isToday = isEqual(day, today),
            date = localizers.date.format(day, dateFormat(_this.props), culture),
            label = localizers.date.format(day, labelFormat, culture);

        var currentID = optionId(id, day);

        return !_utilDates2['default'].inRange(day, min, max) ? _react2['default'].createElement(
          'td',
          { key: 'day_' + colIdx, role: 'presentation', className: 'rw-empty-cell' },
          ' '
        ) : _react2['default'].createElement(
          'td',
          {
            key: 'day_' + colIdx,
            role: 'gridcell',
            id: currentID,
            title: label,
            'aria-selected': isSelected,
            'aria-label': label,
            'aria-readonly': disabled
          },
          _react2['default'].createElement(
            'span',
            {
              'aria-labelledby': currentID,
              onClick: onChange.bind(null, day),
              className: _classnames2['default']('rw-btn', {
                'rw-off-range': _utilDates2['default'].month(day) !== _utilDates2['default'].month(focused),
                'rw-state-focus': isFocused,
                'rw-state-selected': isSelected,
                'rw-now': isToday
              })
            },
            Day ? _react2['default'].createElement(Day, { date: day, label: date }) : date
          )
        );
      })
    );
  },

  _headers: function _headers(format, culture) {
    return [0, 1, 2, 3, 4, 5, 6].map(function (day) {
      return _react2['default'].createElement(
        'th',
        { key: 'header_' + day },
        localizers.date.format(day, format, culture)
      );
    });
  }

});

exports['default'] = MonthView;
module.exports = exports['default'];
},{"./mixins/AriaDescendantMixin":29,"./mixins/RtlChildContextMixin":34,"./util/_":37,"./util/babelHelpers.js":38,"./util/configuration":40,"./util/dates":43,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],19:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _Popup = require('./Popup');

var _Popup2 = babelHelpers.interopRequireDefault(_Popup);

var _utilDomSupport = require('./util/dom/support');

var _utilDomSupport2 = babelHelpers.interopRequireDefault(_utilDomSupport);

var _MultiselectInput = require('./MultiselectInput');

var _MultiselectInput2 = babelHelpers.interopRequireDefault(_MultiselectInput);

var _MultiselectTagList = require('./MultiselectTagList');

var _MultiselectTagList2 = babelHelpers.interopRequireDefault(_MultiselectTagList);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _List = require('./List');

var _List2 = babelHelpers.interopRequireDefault(_List);

var _ListGroupable = require('./ListGroupable');

var _ListGroupable2 = babelHelpers.interopRequireDefault(_ListGroupable);

var _utilValidateListInterface = require('./util/validateListInterface');

var _utilValidateListInterface2 = babelHelpers.interopRequireDefault(_utilValidateListInterface);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = babelHelpers.interopRequireDefault(_uncontrollable);

var _utilDataHelpers = require('./util/dataHelpers');

var _utilInteraction = require('./util/interaction');

var _utilWidgetHelpers = require('./util/widgetHelpers');

var compatCreate = function compatCreate(props, msgs) {
  return typeof msgs.createNew === 'function' ? msgs.createNew(props) : [_react2['default'].createElement(
    'strong',
    null,
    '"' + props.searchTerm + '"'
  ), ' ' + msgs.createNew];
};

_react2['default'].initializeTouchEvents(true);

var omit = _util_2['default'].omit;
var pick = _util_2['default'].pick;
var splat = _util_2['default'].splat;

var propTypes = {
  data: _react2['default'].PropTypes.array,
  //-- controlled props --
  value: _react2['default'].PropTypes.array,
  onChange: _react2['default'].PropTypes.func,

  searchTerm: _react2['default'].PropTypes.string,
  onSearch: _react2['default'].PropTypes.func,

  open: _react2['default'].PropTypes.bool,
  onToggle: _react2['default'].PropTypes.func,
  //-------------------------------------------

  valueField: _react2['default'].PropTypes.string,
  textField: _utilPropTypes2['default'].accessor,

  tagComponent: _utilPropTypes2['default'].elementType,
  itemComponent: _utilPropTypes2['default'].elementType,
  listComponent: _utilPropTypes2['default'].elementType,

  groupComponent: _utilPropTypes2['default'].elementType,
  groupBy: _utilPropTypes2['default'].accessor,

  createComponent: _utilPropTypes2['default'].elementType,

  onSelect: _react2['default'].PropTypes.func,
  onCreate: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.oneOf([false]), _react2['default'].PropTypes.func]),

  dropUp: _react2['default'].PropTypes.bool,
  duration: _react2['default'].PropTypes.number, //popup

  placeholder: _react2['default'].PropTypes.string,

  disabled: _utilPropTypes2['default'].disabled.acceptsArray,
  readOnly: _utilPropTypes2['default'].readOnly.acceptsArray,
  autoFocus: _react2['default'].PropTypes.bool,

  messages: _react2['default'].PropTypes.shape({
    open: _utilPropTypes2['default'].message,
    emptyList: _utilPropTypes2['default'].message,
    emptyFilter: _utilPropTypes2['default'].message,
    createNew: _utilPropTypes2['default'].message
  })
};

var Multiselect = _react2['default'].createClass(babelHelpers.createDecoratedObject([{
  key: 'displayName',
  initializer: function initializer() {
    return 'Multiselect';
  }
}, {
  key: 'mixins',
  initializer: function initializer() {
    return [require('./mixins/TimeoutMixin'), require('./mixins/DataFilterMixin'), require('./mixins/PopupScrollToMixin'), require('./mixins/RtlParentContextMixin'), require('./mixins/AriaDescendantMixin')('input', function (key, id) {
      var myKey = this.props.ariaActiveDescendantKey;

      var createIsActive = (!this._data().length || this.state.focusedItem === null) && key === myKey;

      var tagIsActive = this.state.focusedTag != null && key === 'taglist';
      var listIsActive = this.state.focusedTag == null && key === 'list';

      if (createIsActive || tagIsActive || listIsActive) return id;
    })];
  }
}, {
  key: 'propTypes',
  initializer: function initializer() {
    return propTypes;
  }
}, {
  key: 'getDefaultProps',
  value: function getDefaultProps() {
    return {
      data: [],
      filter: 'startsWith',
      value: [],
      open: false,
      searchTerm: '',
      ariaActiveDescendantKey: 'multiselect',
      messages: {
        createNew: '(create new tag)',
        emptyList: 'There are no items in this list',
        emptyFilter: 'The filter returned no results',
        tagsLabel: 'selected items',
        selectedItems: 'selected items',
        noneSelected: 'no selected items',
        removeLabel: 'remove selected item'
      }
    };
  }
}, {
  key: 'getInitialState',
  value: function getInitialState() {
    var _props = this.props;
    var data = _props.data;
    var value = _props.value;
    var valueField = _props.valueField;
    var searchTerm = _props.searchTerm;
    var dataItems = splat(value).map(function (item) {
      return _utilDataHelpers.dataItem(data, item, valueField);
    });
    var processedData = this.process(this.props.data, dataItems, searchTerm);

    return {
      focusedTag: null,
      focusedItem: processedData[0],
      processedData: processedData,
      dataItems: dataItems
    };
  }
}, {
  key: 'componentDidUpdate',
  value: function componentDidUpdate() {
    this.ariaActiveDescendant(_utilWidgetHelpers.instanceId(this, '__createlist_option'));

    this.refs.list && _utilValidateListInterface2['default'](this.refs.list);
  }
}, {
  key: 'componentDidMount',
  value: function componentDidMount() {
    // https://github.com/facebook/react/issues/1169
    if (_utilDomSupport2['default'].ios) _utilCompat2['default'].findDOMNode(this.refs.wrapper).onClick = function () {};
  }
}, {
  key: 'componentWillReceiveProps',
  value: function componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    var value = nextProps.value;
    var valueField = nextProps.valueField;
    var searchTerm = nextProps.searchTerm;
    var values = _util_2['default'].splat(value);
    var current = this.state.focusedItem;
    var items = this.process(data, values, searchTerm);

    this.setState({
      processedData: items,
      focusedItem: items.indexOf(current) === -1 ? items[0] : current,
      dataItems: values.map(function (item) {
        return _utilDataHelpers.dataItem(data, item, valueField);
      })
    });
  }
}, {
  key: 'render',
  value: function render() {
    var _cx,
        _this = this;

    var _props2 = this.props;
    var searchTerm = _props2.searchTerm;
    var maxLength = _props2.maxLength;
    var className = _props2.className;
    var tabIndex = _props2.tabIndex;
    var textField = _props2.textField;
    var groupBy = _props2.groupBy;
    var messages = _props2.messages;
    var data = _props2.data;
    var busy = _props2.busy;
    var dropUp = _props2.dropUp;
    var open = _props2.open;
    var disabled = _props2.disabled;
    var readOnly = _props2.readOnly;
    var TagComponent = _props2.tagComponent;
    var List = _props2.listComponent;

    List = List || groupBy && _ListGroupable2['default'] || _List2['default'];

    messages = msgs(messages);

    var elementProps = omit(this.props, Object.keys(propTypes));
    var tagsProps = pick(this.props, ['valueField', 'textField']);
    var inputProps = pick(this.props, ['maxLength', 'searchTerm', 'autoFocus']);
    var listProps = pick(this.props, Object.keys(_utilCompat2['default'].type(List).propTypes));
    var popupProps = pick(this.props, Object.keys(_utilCompat2['default'].type(_Popup2['default']).propTypes));

    var _state = this.state;
    var focusedTag = _state.focusedTag;
    var focusedItem = _state.focusedItem;
    var focused = _state.focused;
    var dataItems = _state.dataItems;

    var items = this._data(),
        tagsID = _utilWidgetHelpers.instanceId(this, '_taglist'),
        listID = _utilWidgetHelpers.instanceId(this, '__listbox'),
        createID = _utilWidgetHelpers.instanceId(this, '__createlist'),
        createOptionID = _utilWidgetHelpers.instanceId(this, '__createlist_option');

    var shouldRenderTags = !!dataItems.length,
        shouldRenderPopup = _utilWidgetHelpers.isFirstFocusedRender(this) || open,
        shouldShowCreate = this._shouldShowCreate(),
        createIsFocused = !items.length || focusedItem === null;

    if (focused) {
      var notify = dataItems.length ? messages.selectedItems + ': ' + dataItems.map(function (item) {
        return _utilDataHelpers.dataText(item, textField);
      }).join(', ') : messages.noneSelected;
    }

    return _react2['default'].createElement(
      'div',
      babelHelpers._extends({}, elementProps, {
        ref: 'element',
        id: _utilWidgetHelpers.instanceId(this),
        onKeyDown: this._keyDown,
        onFocus: this._focus.bind(null, true),
        onBlur: this._focus.bind(null, false),
        onTouchEnd: this._focus.bind(null, true),
        tabIndex: '-1',
        className: _classnames2['default'](className, 'rw-widget', 'rw-multiselect', (_cx = {
          'rw-state-focus': focused,
          'rw-state-disabled': disabled === true,
          'rw-state-readonly': readOnly === true,
          'rw-rtl': this.isRtl()
        }, _cx['rw-open' + (dropUp ? '-up' : '')] = open, _cx)) }),
      _react2['default'].createElement(
        'span',
        {
          ref: 'status',
          id: _utilWidgetHelpers.instanceId(this, '__notify'),
          role: 'status',
          className: 'rw-sr',
          'aria-live': 'assertive',
          'aria-atomic': 'true',
          'aria-relevant': 'additions removals text'
        },
        notify
      ),
      _react2['default'].createElement(
        'div',
        { className: 'rw-multiselect-wrapper', ref: 'wrapper' },
        busy && _react2['default'].createElement('i', { className: 'rw-i rw-loading' }),
        shouldRenderTags && _react2['default'].createElement(_MultiselectTagList2['default'], babelHelpers._extends({}, tagsProps, {
          ref: 'tagList',
          id: tagsID,
          'aria-label': messages.tagsLabel,
          value: dataItems,
          focused: focusedTag,
          disabled: disabled,
          readOnly: readOnly,
          onDelete: this._delete,
          valueComponent: TagComponent,
          ariaActiveDescendantKey: 'taglist'
        })),
        _react2['default'].createElement(_MultiselectInput2['default'], babelHelpers._extends({}, inputProps, {
          ref: 'input',
          tabIndex: tabIndex || 0,
          role: 'listbox',
          'aria-expanded': open,
          'aria-busy': !!busy,
          'aria-owns': listID + ' ' + _utilWidgetHelpers.instanceId(this, '__notify') + (shouldRenderTags ? ' ' + tagsID : '') + (shouldShowCreate ? ' ' + createID : ''),
          'aria-haspopup': true,
          value: searchTerm,
          maxLength: maxLength,
          disabled: disabled === true,
          readOnly: readOnly === true,
          placeholder: this._placeholder(),
          onKeyDown: this._searchKeyDown,
          onKeyUp: this._searchgKeyUp,
          onChange: this._typing,
          onFocus: this._inputFocus,
          onClick: this._inputFocus,
          onTouchEnd: this._inputFocus
        }))
      ),
      _react2['default'].createElement(
        _Popup2['default'],
        babelHelpers._extends({}, popupProps, {
          onOpening: function () {
            return _this.refs.list.forceUpdate();
          },
          onRequestClose: this.close
        }),
        _react2['default'].createElement(
          'div',
          null,
          shouldRenderPopup && [_react2['default'].createElement(List, babelHelpers._extends({ ref: 'list',
            key: '0'
          }, listProps, {
            readOnly: !!readOnly,
            disabled: !!disabled,
            id: listID,
            'aria-live': 'polite',
            'aria-labelledby': _utilWidgetHelpers.instanceId(this),
            'aria-hidden': !open,
            ariaActiveDescendantKey: 'list',
            data: items,
            focused: focusedItem,
            onSelect: this._onSelect,
            onMove: this._scrollTo,
            messages: {
              emptyList: data.length ? messages.emptyFilter : messages.emptyList
            }
          })), shouldShowCreate && _react2['default'].createElement(
            'ul',
            { role: 'listbox', id: createID, className: 'rw-list rw-multiselect-create-tag', key: '1' },
            _react2['default'].createElement(
              'li',
              { onClick: this._onCreate.bind(null, searchTerm),
                role: 'option',
                id: createOptionID,
                className: _classnames2['default']({
                  'rw-list-option': true,
                  'rw-state-focus': createIsFocused
                }) },
              compatCreate(this.props, messages)
            )
          )]
        )
      )
    );
  }
}, {
  key: '_data',
  value: function _data() {
    return this.state.processedData;
  }
}, {
  key: '_delete',
  value: function _delete(value) {
    this._focus(true);
    this.change(this.state.dataItems.filter(function (d) {
      return d !== value;
    }));
  }
}, {
  key: '_inputFocus',
  value: function _inputFocus() {
    this._focus(true);
    !this.props.open && this.open();
  }
}, {
  key: '_focus',
  decorators: [_utilInteraction.widgetEnabled],
  value: function _focus(focused, e) {
    var _this2 = this;

    if (this.props.disabled === true) return;

    if (focused) this.refs.input.focus();

    this.setTimeout('focus', function () {
      if (!focused) _this2.refs.tagList && _this2.setState({ focusedTag: null });

      if (focused !== _this2.state.focused) {
        focused ? _this2.open() : _this2.close();

        _utilWidgetHelpers.notify(_this2.props[focused ? 'onFocus' : 'onBlur'], e);
        _this2.setState({ focused: focused });
      }
    });
  }
}, {
  key: '_searchKeyDown',
  value: function _searchKeyDown(e) {
    if (e.key === 'Backspace' && e.target.value && !this._deletingText) this._deletingText = true;
  }
}, {
  key: '_searchgKeyUp',
  value: function _searchgKeyUp(e) {
    if (e.key === 'Backspace' && this._deletingText) this._deletingText = false;
  }
}, {
  key: '_typing',
  value: function _typing(e) {
    _utilWidgetHelpers.notify(this.props.onSearch, [e.target.value]);
    this.open();
  }
}, {
  key: '_onSelect',
  decorators: [_utilInteraction.widgetEditable],
  value: function _onSelect(data) {

    if (data === undefined) {
      if (this.props.onCreate) this._onCreate(this.props.searchTerm);

      return;
    }

    _utilWidgetHelpers.notify(this.props.onSelect, data);
    this.change(this.state.dataItems.concat(data));

    this.close();
    this._focus(true);
  }
}, {
  key: '_onCreate',
  decorators: [_utilInteraction.widgetEditable],
  value: function _onCreate(tag) {
    if (tag.trim() === '') return;

    _utilWidgetHelpers.notify(this.props.onCreate, tag);
    this.props.searchTerm && _utilWidgetHelpers.notify(this.props.onSearch, ['']);

    this.close();
    this._focus(true);
  }
}, {
  key: '_keyDown',
  decorators: [_utilInteraction.widgetEditable],
  value: function _keyDown(e) {
    var key = e.key;
    var altKey = e.altKey;
    var ctrlKey = e.ctrlKey;
    var noSearch = !this.props.searchTerm && !this._deletingText;
    var isOpen = this.props.open;var _state2 = this.state;
    var focusedTag = _state2.focusedTag;
    var focusedItem = _state2.focusedItem;
    var _refs = this.refs;
    var list = _refs.list;
    var tagList = _refs.tagList;

    var nullTag = { focusedTag: null };

    if (key === 'ArrowDown') {
      var next = list.next(focusedItem),
          creating = this._shouldShowCreate() && focusedItem === next || focusedItem === null;

      next = creating ? null : next;

      e.preventDefault();
      if (isOpen) this.setState(babelHelpers._extends({ focusedItem: next }, nullTag));else this.open();
    } else if (key === 'ArrowUp') {
      var prev = focusedItem === null ? list.last() : list.prev(focusedItem);

      e.preventDefault();

      if (altKey) this.close();else if (isOpen) this.setState(babelHelpers._extends({ focusedItem: prev }, nullTag));
    } else if (key === 'End') {
      if (isOpen) this.setState(babelHelpers._extends({ focusedItem: list.last() }, nullTag));else tagList && this.setState({ focusedTag: tagList.last() });
    } else if (key === 'Home') {
      if (isOpen) this.setState(babelHelpers._extends({ focusedItem: list.first() }, nullTag));else tagList && this.setState({ focusedTag: tagList.first() });
    } else if (isOpen && key === 'Enter') ctrlKey && this.props.onCreate || focusedItem === null ? this._onCreate(this.props.searchTerm) : this._onSelect(this.state.focusedItem);else if (key === 'Escape') isOpen ? this.close() : tagList && this.setState(nullTag);else if (noSearch && key === 'ArrowLeft') tagList && this.setState({ focusedTag: tagList.prev(focusedTag) });else if (noSearch && key === 'ArrowRight') tagList && this.setState({ focusedTag: tagList.next(focusedTag) });else if (noSearch && key === 'Delete') tagList && tagList.remove(focusedTag);else if (noSearch && key === 'Backspace') tagList && tagList.removeNext();

    _utilWidgetHelpers.notify(this.props.onKeyDown, [e]);
  }
}, {
  key: 'change',
  decorators: [_utilInteraction.widgetEditable],
  value: function change(data) {
    _utilWidgetHelpers.notify(this.props.onChange, [data]);
    _utilWidgetHelpers.notify(this.props.onSearch, ['']);
  }
}, {
  key: 'open',
  value: function open() {
    if (!(this.props.disabled === true || this.props.readOnly === true)) _utilWidgetHelpers.notify(this.props.onToggle, true);
  }
}, {
  key: 'close',
  value: function close() {
    _utilWidgetHelpers.notify(this.props.onToggle, false);
  }
}, {
  key: 'toggle',
  value: function toggle() {
    this.props.open ? this.close() : this.open();
  }
}, {
  key: 'process',
  value: function process(data, values, searchTerm) {
    var valueField = this.props.valueField;

    var items = data.filter(function (i) {
      return !values.some(function (v) {
        return _utilDataHelpers.valueMatcher(i, v, valueField);
      });
    });

    if (searchTerm) items = this.filter(items, searchTerm);

    return items;
  }
}, {
  key: '_shouldShowCreate',
  value: function _shouldShowCreate() {
    var _props3 = this.props;
    var textField = _props3.textField;
    var searchTerm = _props3.searchTerm;
    var onCreate = _props3.onCreate;

    if (!onCreate || !searchTerm) return false;

    // if there is an exact match on textFields: "john" => { name: "john" }, don't show
    return !this._data().some(function (v) {
      return _utilDataHelpers.dataText(v, textField) === searchTerm;
    }) && !this.state.dataItems.some(function (v) {
      return _utilDataHelpers.dataText(v, textField) === searchTerm;
    });
  }
}, {
  key: '_placeholder',
  value: function _placeholder() {
    return (this.props.value || []).length ? '' : this.props.placeholder || '';
  }
}]));

function msgs(msgs) {
  return babelHelpers._extends({
    createNew: '(create new tag)',
    emptyList: 'There are no items in this list',
    emptyFilter: 'The filter returned no results',
    tagsLabel: 'selected items',
    selectedItems: 'selected items',
    removeLabel: 'remove selected item'
  }, msgs);
}

module.exports = _uncontrollable2['default'](Multiselect, { open: 'onToggle', value: 'onChange', searchTerm: 'onSearch' });

module.exports.BaseMultiselect = Multiselect;
},{"./List":15,"./ListGroupable":16,"./MultiselectInput":20,"./MultiselectTagList":21,"./Popup":22,"./mixins/AriaDescendantMixin":29,"./mixins/DataFilterMixin":30,"./mixins/PopupScrollToMixin":32,"./mixins/RtlParentContextMixin":35,"./mixins/TimeoutMixin":36,"./util/_":37,"./util/babelHelpers.js":38,"./util/compat":39,"./util/dataHelpers":42,"./util/dom/support":45,"./util/interaction":47,"./util/propTypes":49,"./util/validateListInterface":50,"./util/widgetHelpers":51,"classnames":52,"react":"react","uncontrollable":75}],20:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _utilCompat = require('./util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

exports['default'] = _react2['default'].createClass({

  displayName: 'MultiselectInput',

  propTypes: {
    value: _react2['default'].PropTypes.string,
    maxLength: _react2['default'].PropTypes.number,
    onChange: _react2['default'].PropTypes.func.isRequired,
    onFocus: _react2['default'].PropTypes.func,

    disabled: _utilPropTypes2['default'].disabled,
    readOnly: _utilPropTypes2['default'].readOnly
  },

  componentDidUpdate: function componentDidUpdate() {
    this.props.focused && this.focus();
  },

  render: function render() {
    var value = this.props.value,
        placeholder = this.props.placeholder,
        size = Math.max((value || placeholder).length, 1) + 1;

    return _react2['default'].createElement('input', babelHelpers._extends({}, this.props, {
      className: 'rw-input',
      autoComplete: 'off',
      'aria-disabled': this.props.disabled,
      'aria-readonly': this.props.readOnly,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      size: size
    }));
  },

  focus: function focus() {
    _utilCompat2['default'].findDOMNode(this).focus();
  }

});
module.exports = exports['default'];
},{"./util/babelHelpers.js":38,"./util/compat":39,"./util/propTypes":49,"react":"react"}],21:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilWidgetHelpers = require('./util/widgetHelpers');

var _utilDataHelpers = require('./util/dataHelpers');

var _utilInteraction = require('./util/interaction');

var optionId = function optionId(id, idx) {
  return id + '__option__' + idx;
};

exports['default'] = _react2['default'].createClass({

  displayName: 'MultiselectTagList',

  mixins: [require('./mixins/PureRenderMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: {
    value: _react2['default'].PropTypes.array,
    focused: _react2['default'].PropTypes.number,

    valueField: _react2['default'].PropTypes.string,
    textField: _utilPropTypes2['default'].accessor,

    valueComponent: _react2['default'].PropTypes.func,

    disabled: _utilPropTypes2['default'].disabled.acceptsArray,
    readOnly: _utilPropTypes2['default'].readOnly.acceptsArray
  },

  getDefaultProps: function getDefaultProps() {
    return {
      ariaActiveDescendantKey: 'taglist'
    };
  },

  componentDidUpdate: function componentDidUpdate() {
    var focused = this.props.focused;
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), focused);

    this.ariaActiveDescendant(focused == null || _utilInteraction.isDisabledItem(focused, this.props) ? null : activeId);
  },

  render: function render() {
    var _this = this;

    var props = _util_2['default'].omit(this.props, ['value', 'disabled', 'readOnly']);
    var _props = this.props;
    var focused = _props.focused;
    var value = _props.value;
    var textField = _props.textField;
    var ValueComponent = _props.valueComponent;

    var id = _utilWidgetHelpers.instanceId(this);

    return _react2['default'].createElement(
      'ul',
      babelHelpers._extends({}, props, {
        role: 'listbox',
        tabIndex: '-1',
        className: 'rw-multiselect-taglist'
      }),
      value.map(function (item, i) {
        var isDisabled = _utilInteraction.isDisabledItem(item, _this.props),
            isReadonly = _utilInteraction.isReadOnlyItem(item, _this.props),
            isFocused = !isDisabled && focused === i,
            currentID = optionId(id, i);

        return _react2['default'].createElement(
          'li',
          {
            key: i,
            id: currentID,
            tabIndex: '-1',
            role: 'option',
            className: _classnames2['default']({
              'rw-state-focus': isFocused,
              'rw-state-disabled': isDisabled,
              'rw-state-readonly': isReadonly
            })
          },
          ValueComponent ? _react2['default'].createElement(ValueComponent, { item: item }) : _utilDataHelpers.dataText(item, textField),
          _react2['default'].createElement(
            'span',
            {
              tabIndex: '-1',
              onClick: !(isDisabled || isReadonly) && _this._delete.bind(null, item),
              'aria-disabled': isDisabled,
              'aria-label': 'Unselect',
              disabled: isDisabled
            },
            _react2['default'].createElement(
              'span',
              { className: 'rw-tag-btn', 'aria-hidden': 'true' },
              '×'
            )
          )
        );
      })
    );
  },

  _delete: function _delete(val) {
    this.props.onDelete(val);
  },

  remove: function remove(idx) {
    var val = this.props.value[idx];

    if (val && !(_utilInteraction.isDisabledItem(val, this.props) || _utilInteraction.isReadOnlyItem(val, this.props))) this.props.onDelete(val);
  },

  removeNext: function removeNext() {
    var val = this.props.value[this.props.value.length - 1];

    if (val && !(_utilInteraction.isDisabledItem(val, this.props) || _utilInteraction.isReadOnlyItem(val, this.props))) this.props.onDelete(val);
  },

  clear: function clear() {
    this.setState({ focused: null });
  },

  first: function first() {
    var idx = 0,
        value = this.props.value,
        l = value.length;

    while (idx < l && _utilInteraction.isDisabledItem(value[idx], this.props)) idx++;

    return idx !== l ? idx : null;
  },

  last: function last() {
    var value = this.props.value,
        idx = value.length - 1;

    while (idx > -1 && _utilInteraction.isDisabledItem(value[idx], this.props)) idx--;

    return idx >= 0 ? idx : null;
  },

  next: function next(current) {
    var nextIdx = current + 1,
        value = this.props.value,
        l = value.length;

    while (nextIdx < l && _utilInteraction.isDisabledItem(nextIdx, this.props)) nextIdx++;

    if (current === null || nextIdx >= l) return null;

    return nextIdx;
  },

  prev: function prev(current) {
    var nextIdx = current,
        value = this.props.value;

    if (nextIdx === null || nextIdx === 0) nextIdx = value.length;

    nextIdx--;

    while (nextIdx > -1 && _utilInteraction.isDisabledItem(value[nextIdx], this.props)) nextIdx--;

    return nextIdx >= 0 ? nextIdx : null;
  }
});
module.exports = exports['default'];
},{"./mixins/AriaDescendantMixin":29,"./mixins/PureRenderMixin":33,"./util/_":37,"./util/babelHelpers.js":38,"./util/dataHelpers":42,"./util/interaction":47,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],22:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    css = require('dom-helpers/style'),
    getHeight = require('dom-helpers/query/height'),
    config = require('./util/configuration'),
    cn = require('classnames'),
    compat = require('./util/compat');

var transform = config.animate.transform;

function properties(prop, value) {
  var _ref, _ref2;

  var TRANSLATION_MAP = config.animate.TRANSLATION_MAP;

  if (TRANSLATION_MAP && TRANSLATION_MAP[prop]) return (_ref = {}, _ref[transform] = TRANSLATION_MAP[prop] + '(' + value + ')', _ref);

  return (_ref2 = {}, _ref2[prop] = value, _ref2);
}

var PopupContent = React.createClass({
  displayName: 'PopupContent',

  render: function render() {
    var child = this.props.children;

    if (!child) return React.createElement('span', { className: 'rw-popup rw-widget' });

    child = React.Children.only(this.props.children);

    return compat.cloneElement(child, {
      className: cn(child.props.className, 'rw-popup rw-widget')
    });
  }
});

module.exports = React.createClass({

  displayName: 'Popup',

  propTypes: {
    open: React.PropTypes.bool,
    dropUp: React.PropTypes.bool,
    duration: React.PropTypes.number,

    onRequestClose: React.PropTypes.func.isRequired,
    onClosing: React.PropTypes.func,
    onOpening: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {};
  },

  getDefaultProps: function getDefaultProps() {
    return {
      duration: 200,
      open: false,
      onClosing: function onClosing() {},
      onOpening: function onOpening() {},
      onClose: function onClose() {},
      onOpen: function onOpen() {}
    };
  },

  // componentDidMount(){
  //   !this.props.open && this.close(0)
  // },
  componentWillMount: function componentWillMount() {
    !this.props.open && (this._initialPosition = true);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      contentChanged: childKey(nextProps.children) !== childKey(this.props.children)
    });
  },

  componentDidUpdate: function componentDidUpdate(pvProps) {
    var closing = pvProps.open && !this.props.open,
        opening = !pvProps.open && this.props.open,
        open = this.props.open;

    if (opening) this.open();else if (closing) this.close();else if (open) this.height();
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var open = _props.open;
    var dropUp = _props.dropUp;
    var props = babelHelpers.objectWithoutProperties(_props, ['className', 'open', 'dropUp']);
    var display = open ? 'block' : void 0;

    if (this._initialPosition) {
      display = 'none';
    }

    return React.createElement(
      'div',
      babelHelpers._extends({}, props, {
        style: babelHelpers._extends({
          display: display,
          height: this.state.height
        }, props.style),
        className: cn(className, 'rw-popup-container', { 'rw-dropup': dropUp })
      }),
      React.createElement(
        PopupContent,
        { ref: 'content' },
        this.props.children
      )
    );
  },

  reset: function reset() {
    var container = compat.findDOMNode(this),
        content = compat.findDOMNode(this.refs.content),
        style = { display: 'block', overflow: 'hidden' };

    css(container, style);
    this.height();
    css(content, properties('top', this.props.dropUp ? '100%' : '-100%'));
  },

  height: function height() {
    var el = compat.findDOMNode(this),
        content = compat.findDOMNode(this.refs.content),
        margin = parseInt(css(content, 'margin-top'), 10) + parseInt(css(content, 'margin-bottom'), 10);

    var height = getHeight(content) + (isNaN(margin) ? 0 : margin);

    if (this.state.height !== height) {
      el.style.height = height + 'px';
      this.setState({ height: height });
    }
  },

  open: function open() {
    var self = this,
        anim = compat.findDOMNode(this),
        el = compat.findDOMNode(this.refs.content);

    this.ORGINAL_POSITION = css(el, 'position');
    this._isOpening = true;

    if (this._initialPosition) {
      this._initialPosition = false;
      this.reset();
    } else this.height();

    this.props.onOpening();

    anim.className += ' rw-popup-animating';
    el.style.position = 'absolute';

    config.animate(el, { top: 0 }, self.props.duration, 'ease', function () {
      if (!self._isOpening) return;

      anim.className = anim.className.replace(/ ?rw-popup-animating/g, '');

      el.style.position = self.ORGINAL_POSITION;
      anim.style.overflow = 'visible';
      self.ORGINAL_POSITION = null;

      self.props.onOpen();
    });
  },

  close: function close(dur) {
    var self = this,
        el = compat.findDOMNode(this.refs.content),
        anim = compat.findDOMNode(this);

    this.ORGINAL_POSITION = css(el, 'position');

    this._isOpening = false;
    this.height();
    this.props.onClosing();

    anim.style.overflow = 'hidden';
    anim.className += ' rw-popup-animating';
    el.style.position = 'absolute';

    config.animate(el, { top: this.props.dropUp ? '100%' : '-100%' }, dur === undefined ? this.props.duration : dur, 'ease', function () {
      if (self._isOpening) return;

      el.style.position = self.ORGINAL_POSITION;
      anim.className = anim.className.replace(/ ?rw-popup-animating/g, '');

      anim.style.display = 'none';
      self.ORGINAL_POSITION = null;
      self.props.onClose();
    });
  }

});

function childKey(children) {
  var nextChildMapping = React.Children.map(children, function (c) {
    return c;
  });
  for (var key in nextChildMapping) return key;
}
},{"./util/babelHelpers.js":38,"./util/compat":39,"./util/configuration":40,"classnames":52,"dom-helpers/query/height":57,"dom-helpers/style":64,"react":"react"}],23:[function(require,module,exports){
/**
 * A streamlined version of TransitionGroup built for managing at most two active children
 * also provides additional hooks for animation start/end
 * https://github.com/facebook/react/blob/master/src/addons/transitions/ReactTransitionGroup.js
 * relevent code is licensed accordingly
 */
'use strict';

var React = require('react'),
    css = require('dom-helpers/style'),
    height = require('dom-helpers/query/height'),
    width = require('dom-helpers/query/width'),
    compat = require('./util/compat'),
    _ = require('./util/_');

module.exports = React.createClass({

  displayName: 'ReplaceTransitionGroup',

  propTypes: {
    component: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.string]),
    childFactory: React.PropTypes.func,

    onAnimating: React.PropTypes.func,
    onAnimate: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      component: 'span',
      childFactory: function childFactory(a) {
        return a;
      },

      onAnimating: _.noop,
      onAnimate: _.noop
    };
  },

  getInitialState: function getInitialState() {
    return {
      children: _.splat(this.props.children)
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var nextChild = getChild(nextProps.children),
        stack = this.state.children.slice(),
        next = stack[1],
        last = stack[0];

    var isLastChild = last && key(last) === key(nextChild),
        isNextChild = next && key(next) === key(nextChild);

    //no children
    if (!last) {
      stack.push(nextChild);
      this.entering = nextChild;
    } else if (last && !next && !isLastChild) {
      //new child
      stack.push(nextChild);
      this.leaving = last;
      this.entering = nextChild;
    } else if (last && next && !isLastChild && !isNextChild) {
      // the child is not the current one, exit the current one, add the new one
      //  - shift the stack down
      stack.shift();
      stack.push(nextChild);
      this.leaving = next;
      this.entering = nextChild;
    }
    //new child that just needs to be re-rendered
    else if (isLastChild) stack.splice(0, 1, nextChild);else if (isNextChild) stack.splice(1, 1, nextChild);

    if (this.state.children[0] !== stack[0] || this.state.children[1] !== stack[1]) this.setState({ children: stack });
  },

  componentWillMount: function componentWillMount() {
    this.animatingKeys = {};
    this.leaving = null;
    this.entering = null;
  },

  componentDidUpdate: function componentDidUpdate() {
    var entering = this.entering,
        leaving = this.leaving,
        first = this.refs[key(entering) || key(leaving)],
        node = compat.findDOMNode(this),
        el = first && compat.findDOMNode(first);

    if (el) css(node, {
      overflow: 'hidden',
      height: height(el) + 'px',
      width: width(el) + 'px'
    });

    this.props.onAnimating();

    this.entering = null;
    this.leaving = null;

    if (entering) this.performEnter(key(entering));
    if (leaving) this.performLeave(key(leaving));
  },

  performEnter: function performEnter(key) {
    var component = this.refs[key];

    if (!component) return;

    this.animatingKeys[key] = true;

    if (component.componentWillEnter) component.componentWillEnter(this._handleDoneEntering.bind(this, key));else this._handleDoneEntering(key);
  },

  _tryFinish: function _tryFinish() {

    if (this.isTransitioning()) return;

    if (this.isMounted()) css(compat.findDOMNode(this), { overflow: 'visible', height: '', width: '' });

    this.props.onAnimate();
  },

  _handleDoneEntering: function _handleDoneEntering(enterkey) {
    var component = this.refs[enterkey];

    if (component && component.componentDidEnter) component.componentDidEnter();

    delete this.animatingKeys[enterkey];

    if (key(this.props.children) !== enterkey) this.performLeave(enterkey); // This was removed before it had fully entered. Remove it.

    this._tryFinish();
  },

  isTransitioning: function isTransitioning() {
    return Object.keys(this.animatingKeys).length !== 0;
  },

  performLeave: function performLeave(key) {
    var component = this.refs[key];

    if (!component) return;

    this.animatingKeys[key] = true;

    if (component.componentWillLeave) component.componentWillLeave(this._handleDoneLeaving.bind(this, key));else this._handleDoneLeaving(key);
  },

  _handleDoneLeaving: function _handleDoneLeaving(leavekey) {
    var component = this.refs[leavekey];

    if (component && component.componentDidLeave) component.componentDidLeave();

    delete this.animatingKeys[leavekey];

    if (key(this.props.children) === leavekey) this.performEnter(leavekey); // This entered again before it fully left. Add it again.

    else if (this.isMounted()) this.setState({
        children: this.state.children.filter(function (c) {
          return key(c) !== leavekey;
        })
      });

    this._tryFinish();
  },

  render: function render() {
    var _this = this;

    var Component = this.props.component;
    return React.createElement(
      Component,
      this.props,
      this.state.children.map(function (c) {
        return _this.props.childFactory(c, key(c));
      })
    );
  }
});

function getChild(children) {
  return React.Children.only(children);
}

function key(child) {
  return child && child.key;
}
},{"./util/_":37,"./util/compat":39,"dom-helpers/query/height":57,"dom-helpers/query/width":62,"dom-helpers/style":64,"react":"react"}],24:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    ReplaceTransitionGroup = require('./ReplaceTransitionGroup'),
    compat = require('./util/compat'),
    css = require('dom-helpers/style'),
    getWidth = require('dom-helpers/query/width'),
    config = require('./util/configuration');

var SlideChildGroup = React.createClass({
  displayName: 'SlideChildGroup',

  propTypes: {
    direction: React.PropTypes.oneOf(['left', 'right']),
    duration: React.PropTypes.number
  },

  componentWillEnter: function componentWillEnter(done) {
    var _this = this;

    var node = compat.findDOMNode(this),
        width = getWidth(node),
        direction = this.props.direction;

    width = direction === 'left' ? width : -width;

    this.ORGINAL_POSITION = node.style.position;

    css(node, { position: 'absolute', left: width + 'px', top: 0 });

    config.animate(node, { left: 0 }, this.props.duration, function () {

      css(node, {
        position: _this.ORGINAL_POSITION,
        overflow: 'hidden'
      });

      _this.ORGINAL_POSITION = null;
      done && done();
    });
  },

  componentWillLeave: function componentWillLeave(done) {
    var _this2 = this;

    var node = compat.findDOMNode(this),
        width = getWidth(node),
        direction = this.props.direction;

    width = direction === 'left' ? -width : width;

    this.ORGINAL_POSITION = node.style.position;

    css(node, { position: 'absolute', top: 0, left: 0 });

    config.animate(node, { left: width + 'px' }, this.props.duration, function () {
      css(node, {
        position: _this2.ORGINAL_POSITION,
        overflow: 'hidden'
      });

      _this2.ORGINAL_POSITION = null;
      done && done();
    });
  },

  render: function render() {
    return React.Children.only(this.props.children);
  }

});

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    direction: React.PropTypes.oneOf(['left', 'right']),
    duration: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      direction: 'left',
      duration: 250
    };
  },

  _wrapChild: function _wrapChild(child, ref) {
    return React.createElement(
      SlideChildGroup,
      { key: child.key, ref: ref,
        direction: this.props.direction,
        duration: this.props.duration },
      child
    );
  },

  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;
    var props = babelHelpers.objectWithoutProperties(_props, ['style', 'children']);

    style = babelHelpers._extends({}, style, { position: 'relative', overflow: 'hidden' });

    return React.createElement(
      ReplaceTransitionGroup,
      babelHelpers._extends({}, props, {
        ref: 'container',
        childFactory: this._wrapChild,
        style: style,
        component: 'div' }),
      children
    );
  },

  isTransitioning: function isTransitioning() {
    return this.isMounted() && this.refs.container.isTransitioning();
  }
});
},{"./ReplaceTransitionGroup":23,"./util/babelHelpers.js":38,"./util/compat":39,"./util/configuration":40,"dom-helpers/query/width":62,"dom-helpers/style":64,"react":"react"}],25:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    dates = require('./util/dates'),
    List = require('./List'),
    localizers = require('./util/configuration').locale,
    CustomPropTypes = require('./util/propTypes');

var format = function format(props) {
  return props.format || localizers.date.formats.time;
};

module.exports = React.createClass({

  displayName: 'TimeList',

  propTypes: {
    value: React.PropTypes.instanceOf(Date),
    min: React.PropTypes.instanceOf(Date),
    max: React.PropTypes.instanceOf(Date),
    step: React.PropTypes.number,
    itemComponent: CustomPropTypes.elementType,
    format: CustomPropTypes.dateFormat,
    onSelect: React.PropTypes.func,
    preserveDate: React.PropTypes.bool,
    culture: React.PropTypes.string
  },

  mixins: [require('./mixins/TimeoutMixin')],

  getDefaultProps: function getDefaultProps() {
    return {
      step: 30,
      onSelect: function onSelect() {},
      min: new Date(1900, 0, 1),
      max: new Date(2099, 11, 31),
      preserveDate: true,
      delay: 300
    };
  },

  getInitialState: function getInitialState() {
    var data = this._dates(this.props),
        focusedItem = this._closestDate(data, this.props.value);

    return {
      focusedItem: focusedItem || data[0],
      dates: data
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var data = this._dates(nextProps),
        focusedItem = this._closestDate(data, nextProps.value),
        valChanged = !dates.eq(nextProps.value, this.props.value, 'minutes'),
        minChanged = !dates.eq(nextProps.min, this.props.min, 'minutes'),
        maxChanged = !dates.eq(nextProps.max, this.props.max, 'minutes');

    if (valChanged || minChanged || maxChanged) {
      this.setState({
        focusedItem: focusedItem || data[0],
        dates: data
      });
    }
  },

  render: function render() {
    var _props = this.props;
    var min = _props.min;
    var max = _props.max;
    var value = _props.value;
    var step = _props.step;
    var props = babelHelpers.objectWithoutProperties(_props, ['min', 'max', 'value', 'step']);

    var times = this.state.dates,
        date = this._closestDate(times, value);

    return React.createElement(List, babelHelpers._extends({}, props, {
      ref: 'list',
      data: times,
      textField: 'label',
      valueField: 'date',
      selected: date,
      focused: this.state.focusedItem
    }));
  },

  _closestDate: function _closestDate(times, date) {
    var roundTo = 1000 * 60 * this.props.step,
        inst = null,
        label;

    if (!date) return null;

    date = new Date(Math.floor(date.getTime() / roundTo) * roundTo);
    label = dates.format(date, this.props.format, this.props.culture);

    times.some(function (time) {
      if (time.label === label) return inst = time;
    });

    return inst;
  },

  _data: function _data() {
    return this.state.dates;
  },

  _dates: function _dates(props) {
    var times = [],
        i = 0,
        values = this._dateValues(props),
        start = values.min,
        startDay = dates.date(start);

    while (dates.date(start) === startDay && dates.lte(start, values.max)) {
      i++;
      times.push({ date: start, label: localizers.date.format(start, format(props), props.culture) });
      start = dates.add(start, props.step || 30, 'minutes');
    }
    return times;
  },

  _dateValues: function _dateValues(props) {
    var value = props.value || dates.today(),
        useDate = props.preserveDate,
        min = props.min,
        max = props.max,
        start,
        end;

    //compare just the time regradless of whether they fall on the same day
    if (!useDate) {
      start = dates.startOf(dates.merge(new Date(), min), 'minutes');
      end = dates.startOf(dates.merge(new Date(), max), 'minutes');

      if (dates.lte(end, start) && dates.gt(max, min, 'day')) end = dates.tomorrow();

      return {
        min: start,
        max: end
      };
    }

    start = dates.today();
    end = dates.tomorrow();
    //date parts are equal
    return {
      min: dates.eq(value, min, 'day') ? dates.merge(start, min) : start,
      max: dates.eq(value, max, 'day') ? dates.merge(start, max) : end
    };
  },

  _keyDown: function _keyDown(e) {
    var _this = this;

    var key = e.key,
        character = String.fromCharCode(e.keyCode),
        focusedItem = this.state.focusedItem,
        list = this.refs.list;

    if (key === 'End') this.setState({ focusedItem: list.last() });else if (key === 'Home') this.setState({ focusedItem: list.first() });else if (key === 'Enter') this.props.onSelect(focusedItem);else if (key === 'ArrowDown') {
      e.preventDefault();
      this.setState({ focusedItem: list.next(focusedItem) });
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      this.setState({ focusedItem: list.prev(focusedItem) });
    } else {
      e.preventDefault();

      this.search(character, function (item) {
        _this.setState({ focusedItem: item });
      });
    }
  },

  scrollTo: function scrollTo() {
    this.refs.list.move && this.refs.list.move();
  },

  search: function search(character, cb) {
    var _this2 = this;

    var word = ((this._searchTerm || '') + character).toLowerCase();

    this._searchTerm = word;

    this.setTimeout('search', function () {
      var list = _this2.refs.list,
          item = list.next(_this2.state.focusedItem, word);

      _this2._searchTerm = '';
      if (item) cb(item);
    }, this.props.delay);
  }

});
},{"./List":15,"./mixins/TimeoutMixin":36,"./util/babelHelpers.js":38,"./util/configuration":40,"./util/dates":43,"./util/propTypes":49,"react":"react"}],26:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react');
var cn = require('classnames');
module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var children = _props.children;
    var props = babelHelpers.objectWithoutProperties(_props, ['className', 'children']);

    return React.createElement(
      'button',
      babelHelpers._extends({}, props, { type: 'button', className: cn(className, 'rw-btn') }),
      children
    );
  }
});
},{"./util/babelHelpers.js":38,"classnames":52,"react":"react"}],27:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = babelHelpers.interopRequireDefault(_classnames);

var _utilDates = require('./util/dates');

var _utilDates2 = babelHelpers.interopRequireDefault(_utilDates);

var _utilConfiguration = require('./util/configuration');

var _utilConfiguration2 = babelHelpers.interopRequireDefault(_utilConfiguration);

var _util_ = require('./util/_');

var _util_2 = babelHelpers.interopRequireDefault(_util_);

var _utilPropTypes = require('./util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilWidgetHelpers = require('./util/widgetHelpers');

var localizers = _utilConfiguration2['default'].locale;
var format = function format(props) {
  return props.monthFormat || localizers.date.formats.month;
};

var propTypes = {
  optionID: _react2['default'].PropTypes.func,
  culture: _react2['default'].PropTypes.string,
  value: _react2['default'].PropTypes.instanceOf(Date),
  focused: _react2['default'].PropTypes.instanceOf(Date),
  min: _react2['default'].PropTypes.instanceOf(Date),
  max: _react2['default'].PropTypes.instanceOf(Date),
  onChange: _react2['default'].PropTypes.func.isRequired,

  monthFormat: _utilPropTypes2['default'].dateFormat
};

var isEqual = function isEqual(dateA, dateB) {
  return _utilDates2['default'].eq(dateA, dateB, 'month');
};
var optionId = function optionId(id, date) {
  return id + '__year_' + _utilDates2['default'].year(date) + '-' + _utilDates2['default'].month(date);
};

var YearView = _react2['default'].createClass({

  displayName: 'YearView',

  mixins: [require('./mixins/RtlChildContextMixin'), require('./mixins/AriaDescendantMixin')()],

  propTypes: propTypes,

  componentDidUpdate: function componentDidUpdate() {
    var activeId = optionId(_utilWidgetHelpers.instanceId(this), this.props.focused);
    this.ariaActiveDescendant(activeId);
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var focused = _props.focused;
    var months = _utilDates2['default'].monthsInYear(_utilDates2['default'].year(focused));
    var rows = _util_2['default'].chunk(months, 4);

    var elementProps = _util_2['default'].omit(this.props, Object.keys(propTypes));

    return _react2['default'].createElement(
      'table',
      babelHelpers._extends({}, elementProps, {
        role: 'grid',
        className: _classnames2['default'](className, 'rw-nav-view')
      }),
      _react2['default'].createElement(
        'tbody',
        null,
        rows.map(this._row)
      )
    );
  },

  _row: function _row(row, rowIdx) {
    var _this = this;

    var _props2 = this.props;
    var focused = _props2.focused;
    var disabled = _props2.disabled;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var today = _props2.today;
    var culture = _props2.culture;
    var min = _props2.min;
    var max = _props2.max;
    var id = _utilWidgetHelpers.instanceId(this);
    var labelFormat = localizers.date.formats.header;

    return _react2['default'].createElement(
      'tr',
      { key: rowIdx, role: 'row' },
      row.map(function (date, colIdx) {
        var isFocused = isEqual(date, focused),
            isSelected = isEqual(date, value),
            currentMonth = isEqual(date, today),
            label = localizers.date.format(date, labelFormat, culture);

        var currentID = optionId(id, date);

        return _utilDates2['default'].inRange(date, min, max, 'month') ? _react2['default'].createElement(
          'td',
          {
            key: colIdx,
            role: 'gridcell',
            id: currentID,
            title: label,
            'aria-selected': isSelected,
            'aria-readonly': disabled,
            'aria-label': label
          },
          _react2['default'].createElement(
            'span',
            {
              'aria-labelledby': currentID,
              onClick: onChange.bind(null, date),
              className: _classnames2['default']('rw-btn', {
                'rw-state-focus': isFocused,
                'rw-state-selected': isSelected,
                'rw-now': currentMonth
              })
            },
            localizers.date.format(date, format(_this.props), culture)
          )
        ) : _react2['default'].createElement(
          'td',
          { key: colIdx, className: 'rw-empty-cell', role: 'presentation' },
          ' '
        );
      })
    );
  }

});

exports['default'] = YearView;
module.exports = exports['default'];
},{"./mixins/AriaDescendantMixin":29,"./mixins/RtlChildContextMixin":34,"./util/_":37,"./util/babelHelpers.js":38,"./util/configuration":40,"./util/dates":43,"./util/propTypes":49,"./util/widgetHelpers":51,"classnames":52,"react":"react"}],28:[function(require,module,exports){
'use strict';

var _require = require('./util/localizers');

var NumberLocalizer = _require.NumberLocalizer;
var DateLocalizer = _require.DateLocalizer;

var dates = require('date-arithmetic');

function globalizeDateLocalizer(globalize) {
  var shortNames = Object.create(null);

  function getCulture(culture) {
    return culture ? (localizer.globalize || globalize).findClosestCulture(culture) : (localizer.globalize || globalize).culture();
  }

  function firstOfWeek(culture) {
    culture = getCulture(culture);
    return culture && culture.calendar.firstDay || 0;
  }

  function shortDay(dayOfTheWeek) {
    var culture = getCulture(arguments[1]),
        name = culture.name,
        start = firstOfWeek(culture),
        days = function days() {
      var days = culture.calendar.days.namesShort.slice();
      return start === 0 ? days : days.concat(days.splice(0, start));
    };

    var names = shortNames[name] || (shortNames[name] = days());

    return names[dayOfTheWeek];
  }

  var localizer = new DateLocalizer({

    formats: {
      date: 'd',
      time: 't',
      'default': 'f',
      header: 'MMMM yyyy',
      footer: 'D',
      weekday: shortDay,
      dayOfMonth: 'dd',
      month: 'MMM',
      year: 'yyyy',

      decade: function decade(dt, culture, l) {
        return l.format(dt, l.formats.year, culture) + ' - ' + l.format(dates.endOf(dt, 'decade'), l.formats.year, culture);
      },

      century: function century(dt, culture, l) {
        return l.format(dt, l.formats.year, culture) + ' - ' + l.format(dates.endOf(dt, 'century'), l.formats.year, culture);
      }
    },

    firstOfWeek: firstOfWeek,

    parse: function parse(value, format, culture) {
      return (this.globalize || globalize).parseDate(value, format, culture);
    },

    format: function format(value, _format, culture) {
      return (this.globalize || globalize).format(value, _format, culture);
    }
  });

  // Back-compat cruft, expose the globalize instance so setGlobalizeInstance can mutate it after initialization
  // this works b/c there is no need to change the default prop values
  localizer.globalize = globalize;
  return localizer;
}

function globalizeNumberLocalizer(globalize) {

  function getCulture(culture) {
    return culture ? (localizer.globalize || globalize).findClosestCulture(culture) : (localizer.globalize || globalize).culture();
  }

  var localizer = new NumberLocalizer({

    formats: {
      'default': 'D'
    },

    parse: function parse(value, culture) {
      return (this.globalize || globalize).parseFloat(value, 10, culture);
    },

    format: function format(value, _format2, culture) {
      return (this.globalize || globalize).format(value, _format2, culture);
    },

    precision: function precision(format, _culture) {
      var culture = getCulture(_culture),
          numFormat = culture.numberFormat;

      if (typeof format === 'string') {
        if (format.length > 1) return parseFloat(format.substr(1));

        if (format.indexOf('p') !== -1) numFormat = numFormat.percent;
        if (format.indexOf('c') !== -1) numFormat = numFormat.curency;

        return numFormat.decimals || null;
      }

      return null;
    }
  });

  // see point above
  localizer.globalize = globalize;
  return localizer;
}

module.exports = {
  globalizeNumberLocalizer: globalizeNumberLocalizer, globalizeDateLocalizer: globalizeDateLocalizer
};
},{"./util/localizers":48,"date-arithmetic":53}],29:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _utilCompat = require('../util/compat');

var _utilCompat2 = babelHelpers.interopRequireDefault(_utilCompat);

var shape = _react2['default'].PropTypes.shape({
  //setActive: React.PropTypes.func,
  reconcile: _react2['default'].PropTypes.func
});

function defaultReconcile(key, id) {
  return id;
}

function flushAriaToNode(id, nodeOrComponent, ctx) {
  var node = typeof nodeOrComponent === 'function' ? nodeOrComponent(ctx) : typeof nodeOrComponent === 'string' ? ctx.refs[nodeOrComponent] : ctx;

  if (node) {
    if (id) _utilCompat2['default'].findDOMNode(node).setAttribute('aria-activedescendant', id);else _utilCompat2['default'].findDOMNode(node).removeAttribute('aria-activedescendant');
  }
}

exports['default'] = function (nodeOrComponent) {
  var reconcileChildren = arguments.length <= 1 || arguments[1] === undefined ? defaultReconcile : arguments[1];

  return {
    propTypes: {
      ariaActiveDescendantKey: _react2['default'].PropTypes.string.isRequired
    },

    contextTypes: {
      activeDescendants: shape
    },

    childContextTypes: {
      activeDescendants: shape
    },

    ariaActiveDescendant: function ariaActiveDescendant(id) {
      var key = arguments.length <= 1 || arguments[1] === undefined ? this.props.ariaActiveDescendantKey : arguments[1];
      var activeDescendants = this.context.activeDescendants;

      var current = this.__ariaActiveDescendantId;

      if (id === undefined) return current;

      id = reconcileChildren.call(this, key, id);

      if (id === undefined) id = current;else {
        this.__ariaActiveDescendantId = id;
        flushAriaToNode(id, nodeOrComponent, this);
      }

      activeDescendants && activeDescendants.reconcile(key, id);
    },

    getChildContext: function getChildContext() {
      var _this = this;

      return this._context || (this._context = {
        activeDescendants: {
          reconcile: function reconcile(key, id) {
            return _this.ariaActiveDescendant(id, key);
          }
        }
      });
    }
  };
};

module.exports = exports['default'];
},{"../util/babelHelpers.js":38,"../util/compat":39,"react":"react"}],30:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _utilFilter = require('../util/filter');

var _utilFilter2 = babelHelpers.interopRequireDefault(_utilFilter);

var _utilPropTypes = require('../util/propTypes');

var _utilPropTypes2 = babelHelpers.interopRequireDefault(_utilPropTypes);

var _utilDataHelpers = require('../util/dataHelpers');

var dflt = function dflt(f) {
  return f === true ? 'startsWith' : f ? f : 'eq';
};

module.exports = {

  propTypes: {
    data: _react2['default'].PropTypes.array,
    value: _react2['default'].PropTypes.any,
    filter: _utilPropTypes2['default'].filter,
    caseSensitive: _react2['default'].PropTypes.bool,
    minLength: _react2['default'].PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      caseSensitive: false,
      minLength: 1
    };
  },

  filterIndexOf: function filterIndexOf(items, searchTerm) {
    var idx = -1,
        matches = typeof this.props.filter === 'function' ? this.props.filter : getFilter(_utilFilter2['default'][dflt(this.props.filter)], searchTerm, this);

    if (!searchTerm || !searchTerm.trim() || this.props.filter && searchTerm.length < (this.props.minLength || 1)) return -1;

    items.every(function (item, i) {
      if (matches(item, searchTerm, i)) return (idx = i, false);

      return true;
    });

    return idx;
  },

  filter: function filter(items, searchTerm) {
    var matches = typeof this.props.filter === 'string' ? getFilter(_utilFilter2['default'][this.props.filter], searchTerm, this) : this.props.filter;

    if (!matches || !searchTerm || !searchTerm.trim() || searchTerm.length < (this.props.minLength || 1)) return items;

    return items.filter(function (item, idx) {
      return matches(item, searchTerm, idx);
    });
  }
};

function getFilter(matcher, searchTerm, ctx) {
  searchTerm = !ctx.props.caseSensitive ? searchTerm.toLowerCase() : searchTerm;

  return function (item) {
    var val = _utilDataHelpers.dataText(item, ctx.props.textField);

    if (!ctx.props.caseSensitive) val = val.toLowerCase();

    return matcher(val, searchTerm);
  };
}
},{"../util/babelHelpers.js":38,"../util/dataHelpers":42,"../util/filter":46,"../util/propTypes":49,"react":"react"}],31:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _utilFilter = require('../util/filter');

var _utilFilter2 = babelHelpers.interopRequireDefault(_utilFilter);

var _utilDataHelpers = require('../util/dataHelpers');

module.exports = {

  propTypes: {
    textField: _react2['default'].PropTypes.string
  },

  first: function first() {
    return this._data()[0];
  },

  last: function last() {
    var data = this._data();
    return data[data.length - 1];
  },

  prev: function prev(item, word) {
    var textField = this.props.textField,
        data = this._data(),
        idx = data.indexOf(item);

    if (idx === -1) idx = data.length;

    return word ? findPrevInstance(textField, data, word, idx) : --idx < 0 ? data[0] : data[idx];
  },

  next: function next(item, word) {
    var textField = this.props.textField,
        data = this._data(),
        idx = data.indexOf(item);

    return word ? findNextInstance(textField, data, word, idx) : ++idx === data.length ? data[data.length - 1] : data[idx];
  }

};

function findNextInstance(textField, data, word, startIndex) {
  var matches = _utilFilter2['default'].startsWith,
      idx = -1,
      len = data.length,
      foundStart,
      itemText;

  word = word.toLowerCase();

  while (++idx < len) {
    foundStart = foundStart || idx > startIndex;
    itemText = foundStart && _utilDataHelpers.dataText(data[idx], textField).toLowerCase();

    if (foundStart && matches(itemText, word)) return data[idx];
  }
}

function findPrevInstance(textField, data, word, startIndex) {
  var matches = _utilFilter2['default'].startsWith,
      idx = data.length,
      foundStart,
      itemText;

  word = word.toLowerCase();

  while (--idx >= 0) {
    foundStart = foundStart || idx < startIndex;
    itemText = foundStart && _utilDataHelpers.dataText(data[idx], textField).toLowerCase();

    if (foundStart && matches(itemText, word)) return data[idx];
  }
}
},{"../util/babelHelpers.js":38,"../util/dataHelpers":42,"../util/filter":46,"react":"react"}],32:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

exports.__esModule = true;

var _domHelpersUtilScrollTo = require('dom-helpers/util/scrollTo');

var _domHelpersUtilScrollTo2 = babelHelpers.interopRequireDefault(_domHelpersUtilScrollTo);

exports['default'] = {

  _scrollTo: function _scrollTo(selected, list, focused) {
    var state = this._scrollState || (this._scrollState = {}),
        handler = this.props.onMove,
        lastVisible = state.visible,
        lastItem = state.focused,
        shown,
        changed;

    state.visible = !(!list.offsetWidth || !list.offsetHeight);
    state.focused = focused;

    changed = lastItem !== focused;
    shown = state.visible && !lastVisible;

    if (shown || state.visible && changed) {
      if (handler) handler(selected, list, focused);else {
        state.scrollCancel && state.scrollCancel();
        state.scrollCancel = _domHelpersUtilScrollTo2['default'](selected, list);
      }
    }
  }
};
module.exports = exports['default'];
},{"../util/babelHelpers.js":38,"dom-helpers/util/scrollTo":73}],33:[function(require,module,exports){
'use strict';
var _ = require('../util/_');

//backport PureRenderEqual
module.exports = {

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return !_.isShallowEqual(this.props, nextProps) || !_.isShallowEqual(this.state, nextState);
  }
};
},{"../util/_":37}],34:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

exports.__esModule = true;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

exports['default'] = {

  contextTypes: {
    isRtl: _react2['default'].PropTypes.bool
  },

  isRtl: function isRtl() {
    return !!this.context.isRtl;
  }

};
module.exports = exports['default'];
},{"../util/babelHelpers.js":38,"react":"react"}],35:[function(require,module,exports){
'use strict';
var React = require('react');

module.exports = {

  propTypes: {
    isRtl: React.PropTypes.bool
  },

  contextTypes: {
    isRtl: React.PropTypes.bool
  },

  childContextTypes: {
    isRtl: React.PropTypes.bool
  },

  getChildContext: function getChildContext() {
    return {
      isRtl: this.props.isRtl || this.context && this.context.isRtl
    };
  },

  isRtl: function isRtl() {
    return !!(this.props.isRtl || this.context && this.context.isRtl);
  }

};
},{"react":"react"}],36:[function(require,module,exports){
'use strict';

var _require = require('../util/_');

var has = _require.has;

module.exports = {

  componentWillUnmount: function componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;

    for (var k in timers) if (has(timers, k)) clearTimeout(timers[k]);
  },

  setTimeout: function setTimeout(key, cb, duration) {
    var timers = this._timers || (this._timers = Object.create(null));

    if (this._unmounted) return;

    clearTimeout(timers[key]);
    timers[key] = window.setTimeout(cb, duration);
  }

};
},{"../util/_":37}],37:[function(require,module,exports){
'use strict';
var idCount = 0;

var _ = module.exports = {

  has: has,

  result: function result(value) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return typeof value === 'function' ? value.apply(undefined, args) : value;
  },

  isShallowEqual: function isShallowEqual(a, b) {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();

    if (typeof a !== 'object' && typeof b !== 'object') return a === b;

    if (typeof a !== typeof b) return false;

    return shallowEqual(a, b);
  },

  transform: function transform(obj, cb, seed) {
    _.each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})));
    return seed;
  },

  each: function each(obj, cb, thisArg) {
    if (Array.isArray(obj)) return obj.forEach(cb, thisArg);

    for (var key in obj) if (has(obj, key)) cb.call(thisArg, obj[key], key, obj);
  },

  pick: function pick(obj, keys) {
    keys = [].concat(keys);
    return _.transform(obj, function (mapped, val, key) {
      if (keys.indexOf(key) !== -1) mapped[key] = val;
    }, {});
  },

  omit: function omit(obj, keys) {
    keys = [].concat(keys);
    return _.transform(obj, function (mapped, val, key) {
      if (keys.indexOf(key) === -1) mapped[key] = val;
    }, {});
  },

  find: function find(arr, cb, thisArg) {
    var result;
    if (Array.isArray(arr)) {
      arr.every(function (val, idx) {
        if (cb.call(thisArg, val, idx, arr)) return (result = val, false);
        return true;
      });
      return result;
    } else for (var key in arr) if (has(arr, key)) if (cb.call(thisArg, arr[key], key, arr)) return arr[key];
  },

  chunk: function chunk(array, chunkSize) {
    var index = 0,
        length = array ? array.length : 0,
        result = [];

    chunkSize = Math.max(+chunkSize || 1, 1);

    while (index < length) result.push(array.slice(index, index += chunkSize));

    return result;
  },

  splat: function splat(obj) {
    return obj == null ? [] : [].concat(obj);
  },

  noop: function noop() {},

  uniqueId: function uniqueId(prefix) {
    return '' + ((prefix == null ? '' : prefix) + ++idCount);
  }

};

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}

function eql(a, b) {
  return a === b;
}

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 */
function shallowEqual(objA, objB) {

  if (objA == null || objB == null) return false;

  var keysA = Object.keys(objA),
      keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) if (!has(objB, keysA[i]) || !eql(objA[keysA[i]], objB[keysA[i]])) return false;

  return true;
}
},{}],38:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory(root.babelHelpers = {});
  }
})(this, function (global) {
  var babelHelpers = global;

  babelHelpers.createDecoratedObject = function (descriptors) {
    var target = {};

    for (var i = 0; i < descriptors.length; i++) {
      var descriptor = descriptors[i];
      var decorators = descriptor.decorators;
      var key = descriptor.key;
      delete descriptor.key;
      delete descriptor.decorators;
      descriptor.enumerable = true;
      descriptor.configurable = true;
      if ("value" in descriptor || descriptor.initializer) descriptor.writable = true;

      if (decorators) {
        for (var f = 0; f < decorators.length; f++) {
          var decorator = decorators[f];

          if (typeof decorator === "function") {
            descriptor = decorator(target, key, descriptor) || descriptor;
          } else {
            throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator);
          }
        }
      }

      if (descriptor.initializer) {
        descriptor.value = descriptor.initializer.call(target);
      }

      Object.defineProperty(target, key, descriptor);
    }

    return target;
  };

  babelHelpers.objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers.interopRequireWildcard = function (obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj["default"] = obj;
      return newObj;
    }
  };

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
})
},{}],39:[function(require,module,exports){
'use strict';
var React = require('react'),
    _ = require('./_');

var _version = React.version.split('.').map(parseFloat);

module.exports = {

  version: function version() {
    return _version;
  },

  type: function type(component) {
    if (_version[0] === 0 && _version[1] >= 13) return component;

    return component.type;
  },

  findDOMNode: function findDOMNode(component) {
    if (React.findDOMNode) return React.findDOMNode(component);

    return component.getDOMNode();
  },

  cloneElement: function cloneElement(child, props) {
    if (React.cloneElement) return React.cloneElement(child, props);

    //just mutate if pre 0.13
    _.each(props, function (value, prop) {
      return child.props[prop] = value;
    });

    return child;
  }
};
},{"./_":37,"react":"react"}],40:[function(require,module,exports){
(function (process){
'use strict';

var _require = require('../globalize-localizers');

var globalizeNumberLocalizer = _require.globalizeNumberLocalizer;
var globalizeDateLocalizer = _require.globalizeDateLocalizer;

var globalize;

try {
  globalize = require('globalize');
} catch (err) {
  globalize = {};
  if (process.env.NODE_ENV !== 'production') {
    var desc = { get: function get() {
        throw new Error('Globalize.js is available but is still set as the localization strategy. ' + 'Please include Globalize.js or provide an alternative localization strategy.');
      } };
    Object.defineProperties(globalize, { format: desc, parseDate: desc, parseFloat: desc, findClosestCulture: desc, culture: desc });
  }
}

module.exports = {

  animate: require('./dom/animate'),

  locale: {
    date: globalizeDateLocalizer(globalize),
    number: globalizeNumberLocalizer(globalize)
  }
};
}).call(this,require('_process'))
},{"../globalize-localizers":28,"./dom/animate":44,"_process":1,"globalize":74}],41:[function(require,module,exports){
'use strict';

var _calendarViewHierarchy, _calendarViewUnits;

var views = {
  MONTH: 'month',
  YEAR: 'year',
  DECADE: 'decade',
  CENTURY: 'century'
};

module.exports = {

  directions: {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN'
  },

  datePopups: {
    TIME: 'time',
    CALENDAR: 'calendar'
  },

  calendarViews: views,

  calendarViewHierarchy: (_calendarViewHierarchy = {}, _calendarViewHierarchy[views.MONTH] = views.YEAR, _calendarViewHierarchy[views.YEAR] = views.DECADE, _calendarViewHierarchy[views.DECADE] = views.CENTURY, _calendarViewHierarchy),

  calendarViewUnits: (_calendarViewUnits = {}, _calendarViewUnits[views.MONTH] = 'day', _calendarViewUnits[views.YEAR] = views.MONTH, _calendarViewUnits[views.DECADE] = views.YEAR, _calendarViewUnits[views.CENTURY] = views.DECADE, _calendarViewUnits)
};
},{}],42:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.dataValue = dataValue;
exports.dataText = dataText;
exports.dataIndexOf = dataIndexOf;
exports.valueMatcher = valueMatcher;
exports.dataItem = dataItem;

var _ = require('./_');

function accessor(data, field) {
  var value = data;

  if (typeof field === 'function') value = field(data);else if (data == null) value = data;else if (typeof field === 'string' && typeof data === 'object' && field in data) value = data[field];

  return value;
}

function dataValue(item, valueField) {
  return valueField && item && _.has(item, valueField) ? item[valueField] : item;
}

function dataText(item, textField) {
  var value = accessor(item, textField);
  return value == null ? '' : value + '';
}

function dataIndexOf(data, item, valueField) {
  var idx = -1,
      len = data.length,
      finder = function finder(datum) {
    return valueMatcher(item, datum, valueField);
  };

  while (++idx < len) if (finder(data[idx])) return idx;

  return -1;
}

function valueMatcher(a, b, valueField) {
  return _.isShallowEqual(dataValue(a, valueField), dataValue(b, valueField));
}

function dataItem(data, item, valueField) {
  var first = data[0],
      idx;

  // make an attempt to see if we were passed in dataItem vs just a valueField value
  // either an object with the right prop, or a primitive
  // { valueField: 5 } || "hello" [ "hello" ]
  if (_.has(item, valueField) || typeof first === typeof val) return item;

  idx = dataIndexOf(data, dataValue(item, valueField), valueField);

  if (idx !== -1) return data[idx];

  return item;
}
},{"./_":37}],43:[function(require,module,exports){
'use strict';

var babelHelpers = require('./babelHelpers.js');

var dateMath = require('date-arithmetic');

var _require = require('./constants');

var directions = _require.directions;
var calendarViewUnits = _require.calendarViewUnits;
var locale = require('./configuration').locale;

var dates = module.exports = babelHelpers._extends(dateMath, {

  parse: function parse(date, format, culture) {
    return locale.date.parse(date, format, culture);
  },

  format: function format(date, _format, culture) {
    return locale.date.format(date, _format, culture);
  },

  monthsInYear: function monthsInYear(year) {
    var months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        date = new Date(year, 0, 1);

    return months.map(function (i) {
      return dates.month(date, i);
    });
  },

  firstVisibleDay: function firstVisibleDay(date, culture) {
    var firstOfMonth = dates.startOf(date, 'month');

    return dates.startOf(firstOfMonth, 'week', locale.date.startOfWeek(culture));
  },

  lastVisibleDay: function lastVisibleDay(date, culture) {
    var endOfMonth = dates.endOf(date, 'month');

    return dates.endOf(endOfMonth, 'week', locale.date.startOfWeek(culture));
  },

  visibleDays: function visibleDays(date, culture) {
    var current = dates.firstVisibleDay(date, culture),
        last = dates.lastVisibleDay(date, culture),
        days = [];

    while (dates.lte(current, last, 'day')) {
      days.push(current);
      current = dates.add(current, 1, 'day');
    }

    return days;
  },

  move: function move(date, min, max, unit, direction) {
    var isMonth = unit === 'month',
        isUpOrDown = direction === directions.UP || direction === directions.DOWN,
        rangeUnit = calendarViewUnits[unit],
        addUnit = isMonth && isUpOrDown ? 'week' : calendarViewUnits[unit],
        amount = isMonth || !isUpOrDown ? 1 : 4,
        newDate;

    if (direction === directions.UP || direction === directions.LEFT) amount *= -1;

    newDate = dates.add(date, amount, addUnit);

    return dates.inRange(newDate, min, max, rangeUnit) ? newDate : date;
  },

  merge: function merge(date, time) {
    if (time == null && date == null) return null;

    if (time == null) time = new Date();
    if (date == null) date = new Date();

    date = dates.startOf(date, 'day');
    date = dates.hours(date, dates.hours(time));
    date = dates.minutes(date, dates.minutes(time));
    date = dates.seconds(date, dates.seconds(time));
    return dates.milliseconds(date, dates.milliseconds(time));
  },

  sameMonth: function sameMonth(dateA, dateB) {
    return dates.eq(dateA, dateB, 'month');
  },

  today: function today() {
    return this.startOf(new Date(), 'day');
  },

  yesterday: function yesterday() {
    return this.add(this.startOf(new Date(), 'day'), -1, 'day');
  },

  tomorrow: function tomorrow() {
    return this.add(this.startOf(new Date(), 'day'), 1, 'day');
  }
});
},{"./babelHelpers.js":38,"./configuration":40,"./constants":41,"date-arithmetic":53}],44:[function(require,module,exports){
'use strict';
var hyphenate = require('dom-helpers/util/hyphenate'),
    css = require('dom-helpers/style'),
    on = require('dom-helpers/events/on'),
    off = require('dom-helpers/events/off'),
    transitionProps = require('dom-helpers/transition/properties');

var has = Object.prototype.hasOwnProperty,
    reset = {},
    TRANSLATION_MAP = {
  left: 'translateX',
  right: 'translateX',
  top: 'translateY',
  bottom: 'translateY'
};

reset[transitionProps.property] = reset[transitionProps.duration] = reset[transitionProps.delay] = reset[transitionProps.timing] = '';

animate.endEvent = transitionProps.end;
animate.transform = transitionProps.transform;
animate.TRANSLATION_MAP = TRANSLATION_MAP;

module.exports = animate;

// super lean animate function for transitions
// doesn't support all translations to keep it matching the jquery API
/**
 * code in part from: Zepto 1.1.4 | zeptojs.com/license
 */
function animate(node, properties, duration, easing, callback) {
  var cssProperties = [],
      fakeEvent = { target: node, currentTarget: node },
      cssValues = {},
      transforms = '',
      fired;

  if (typeof easing === 'function') callback = easing, easing = null;

  if (!transitionProps.end) duration = 0;
  if (duration === undefined) duration = 200;

  for (var key in properties) if (has.call(properties, key)) {
    if (/(top|bottom)/.test(key)) transforms += TRANSLATION_MAP[key] + '(' + properties[key] + ') ';else {
      cssValues[key] = properties[key];
      cssProperties.push(hyphenate(key));
    }
  }

  if (transforms) {
    cssValues[transitionProps.transform] = transforms;
    cssProperties.push(transitionProps.transform);
  }

  if (duration > 0) {
    cssValues[transitionProps.property] = cssProperties.join(', ');
    cssValues[transitionProps.duration] = duration / 1000 + 's';
    cssValues[transitionProps.delay] = 0 + 's';
    cssValues[transitionProps.timing] = easing || 'linear';

    on(node, transitionProps.end, done);

    setTimeout(function () {
      if (!fired) done(fakeEvent);
    }, duration + 500);
  }

  node.clientLeft; // trigger page reflow
  css(node, cssValues);

  if (duration <= 0) setTimeout(done.bind(null, fakeEvent), 0);

  function done(event) {
    if (event.target !== event.currentTarget) return;

    fired = true;
    off(event.target, transitionProps.end, done);
    css(node, reset);
    callback && callback.call(this);
  }
}
},{"dom-helpers/events/off":54,"dom-helpers/events/on":55,"dom-helpers/style":64,"dom-helpers/transition/properties":66,"dom-helpers/util/hyphenate":69}],45:[function(require,module,exports){
'use strict';

module.exports = {
  ios: typeof navigator !== 'undefined' && navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
};
},{}],46:[function(require,module,exports){
'use strict';
var common = {
  eq: function eq(a, b) {
    return a === b;
  },
  neq: function neq(a, b) {
    return a !== b;
  },
  gt: function gt(a, b) {
    return a > b;
  },
  gte: function gte(a, b) {
    return a >= b;
  },
  lt: function lt(a, b) {
    return a < b;
  },
  lte: function lte(a, b) {
    return a <= b;
  },

  contains: function contains(a, b) {
    return a.indexOf(b) !== -1;
  },

  startsWith: function startsWith(a, b) {
    return a.lastIndexOf(b, 0) === 0;
  },

  endsWith: function endsWith(a, b) {
    var pos = a.length - b.length,
        lastIndex = a.indexOf(b, pos);

    return lastIndex !== -1 && lastIndex === pos;
  }
};

module.exports = common;
},{}],47:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.isDisabled = isDisabled;
exports.isReadOnly = isReadOnly;
exports.isDisabledItem = isDisabledItem;
exports.isReadOnlyItem = isReadOnlyItem;
exports.contains = contains;
exports.move = move;

var _dataHelpers = require('./dataHelpers');

function isDisabled(props) {
  return props.disabled === true || props.disabled === 'disabled';
}

function isReadOnly(props) {
  return props.readOnly === true || props.readOnly === 'readOnly';
}

function isDisabledItem(item, props) {
  return isDisabled(props) || contains(item, props.disabled, props.valueField);
}

function isReadOnlyItem(item, props) {
  return isReadOnly(props) || contains(item, props.readOnly, props.valueField);
}

function contains(item, values, valueField) {
  return Array.isArray(values) ? values.some(function (value) {
    return _dataHelpers.valueMatcher(item, value, valueField);
  }) : _dataHelpers.valueMatcher(item, values, valueField);
}

function move(dir, item, props, list) {
  var isDisabledOrReadonly = function isDisabledOrReadonly(item) {
    return isDisabledItem(item, props) || isReadOnlyItem(item, props);
  },
      stop = dir === 'next' ? list.last() : list.first(),
      next = list[dir](item);

  while (next !== stop && isDisabledOrReadonly(next)) next = list[dir](next);

  return isDisabledOrReadonly(next) ? item : next;
}

var widgetEnabled = interactionDecorator(true);

exports.widgetEnabled = widgetEnabled;
var widgetEditable = interactionDecorator(false);

exports.widgetEditable = widgetEditable;
function interactionDecorator(disabledOnly) {
  function wrap(method) {
    return function decoratedMethod() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (!(isDisabled(this.props) || !disabledOnly && isReadOnly(this.props))) return method.apply(this, args);
    };
  }

  return function decorate(target, key, desc) {
    if (desc.initializer) {
      (function () {
        var init = desc.initializer;
        desc.initializer = function () {
          return wrap(init());
        };
      })();
    } else desc.value = wrap(desc.value);
    return desc;
  };
}
},{"./dataHelpers":42}],48:[function(require,module,exports){
(function (process){
'use strict';

var babelHelpers = require('./babelHelpers.js');

var invariant = require('react/lib/invariant');

var _require = require('./_');

var has = _require.has;

var React = require('react');

var REQUIRED_NUMBER_FORMATS = ['default'];

var localePropType = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]);

var REQUIRED_DATE_FORMATS = ['default', 'date', 'time', 'header', 'footer', 'dayOfMonth', 'month', 'year', 'decade', 'century'];

function _format(localizer, formatter, value, format, culture) {
  var result = typeof format === 'function' ? format(value, culture, localizer) : formatter.call(localizer, value, format, culture);

  invariant(result == null || typeof result === 'string', '`localizer format(..)` must return a string, null, or undefined');

  return result;
}

function checkFormats(requiredFormats, formats) {
  if (process.env.NODE_ENV !== 'production') requiredFormats.forEach(function (f) {
    return invariant(has(formats, f), 'localizer missing required format: `%s`', f);
  });
}

var NumberLocalizer = function NumberLocalizer(_ref) {
  var _this = this;

  var format = _ref.format;
  var parse = _ref.parse;
  var precision = _ref.precision;
  var formats = _ref.formats;
  var propType = _ref.propType;
  babelHelpers.classCallCheck(this, NumberLocalizer);

  invariant(typeof format === 'function', 'number localizer `format(..)` must be a function');
  invariant(typeof parse === 'function', 'number localizer `parse(..)` must be a function');

  // invariant(typeof precision === 'function'
  //   , 'number localizer `precision(..)` must be a function')

  checkFormats(REQUIRED_NUMBER_FORMATS, formats);

  this.propType = propType || localePropType;
  this.formats = formats;
  this.precision = precision || function () {
    return null;
  };

  this.format = function (value, str, culture) {
    return _format(_this, format, value, str, culture);
  };

  this.parse = function (value, culture) {
    var result = parse.call(_this, value, culture);

    invariant(result == null || typeof result === 'number', 'number localizer `parse(..)` must return a number, null, or undefined');

    return result;
  };
};

var DateLocalizer = function DateLocalizer(spec) {
  var _this2 = this;

  babelHelpers.classCallCheck(this, DateLocalizer);

  invariant(typeof spec.format === 'function', 'date localizer `format(..)` must be a function');
  invariant(typeof spec.parse === 'function', 'date localizer `parse(..)` must be a function');
  invariant(typeof spec.firstOfWeek === 'function', 'date localizer `firstOfWeek(..)` must be a function');
  checkFormats(REQUIRED_DATE_FORMATS, spec.formats);

  this.propType = spec.propType || localePropType;
  this.formats = spec.formats;
  this.startOfWeek = spec.firstOfWeek;

  this.format = function (value, format, culture) {
    return _format(_this2, spec.format, value, format, culture);
  };

  this.parse = function (value, format, culture) {
    var result = spec.parse.call(_this2, value, format, culture);

    invariant(result == null || result instanceof Date && !isNaN(result.getTime()), 'date localizer `parse(..)` must return a valid Date, null, or undefined');

    return result;
  };
};

module.exports = {
  NumberLocalizer: NumberLocalizer, DateLocalizer: DateLocalizer
};
}).call(this,require('_process'))
},{"./_":37,"./babelHelpers.js":38,"_process":1,"react":"react","react/lib/invariant":79}],49:[function(require,module,exports){
'use strict';

var babelHelpers = require('./babelHelpers.js');

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _configuration = require('./configuration');

var _configuration2 = babelHelpers.interopRequireDefault(_configuration);

var _filter = require('./filter');

var _filter2 = babelHelpers.interopRequireDefault(_filter);

var localizers = _configuration2['default'].locale;
var filterTypes = Object.keys(_filter2['default']).filter(function (i) {
  return i !== 'filter';
});

function getInteractionPropType(key) {
  var types = [_react.PropTypes.bool, _react.PropTypes.oneOf([key])],
      propType = _react.PropTypes.oneOfType(types);

  propType.acceptsArray = _react.PropTypes.oneOfType(types.concat(_react.PropTypes.array));

  return propType;
}

module.exports = {

  elementType: createChainableTypeChecker(function (props, propName, componentName) {

    if (typeof props[propName] !== 'function') {
      if (_react2['default'].isValidElement(props[propName])) return new Error('Invalid prop `' + propName + '` specified in  `' + componentName + '`.' + ' Expected an Element `type`, not an actual Element');

      if (typeof props[propName] !== 'string') return new Error('Invalid prop `' + propName + '` specified in  `' + componentName + '`.' + ' Expected an Element `type` such as a tag name or return value of React.createClass(...)');
    }
    return true;
  }),

  numberFormat: createChainableTypeChecker(function () {
    var _localizers$number;

    return (_localizers$number = localizers.number).propType.apply(_localizers$number, arguments);
  }),

  dateFormat: createChainableTypeChecker(function () {
    var _localizers$date;

    return (_localizers$date = localizers.date).propType.apply(_localizers$date, arguments);
  }),

  disabled: getInteractionPropType('disabled'),
  readOnly: getInteractionPropType('readOnly'),

  accessor: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.func]),

  message: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string]),

  filter: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.bool, _react2['default'].PropTypes.oneOf(filterTypes)])
};

function createChainableTypeChecker(validate) {

  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || '<<anonymous>>';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error('Required prop `' + propName + '` was not specified in  `' + componentName + '`.');
      }
    } else return validate(props, propName, componentName, location);
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
},{"./babelHelpers.js":38,"./configuration":40,"./filter":46,"react":"react"}],50:[function(require,module,exports){
(function (process){
'use strict';
var METHODS = ['next', 'prev', 'first', 'last'];

module.exports = function validateListComponent(list) {

  if (process.env.NODE_ENV !== 'production') {
    METHODS.forEach(function (method) {
      return assert(typeof list[method] === 'function', 'List components must implement a `' + method + '()` method');
    });
  }
};

function assert(condition, msg) {
  var error;

  if (!condition) {
    error = new Error(msg);
    error.framesToPop = 1;
    throw error;
  }
}
}).call(this,require('_process'))
},{"_process":1}],51:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.notify = notify;
exports.instanceId = instanceId;
exports.isFirstFocusedRender = isFirstFocusedRender;

var _ = require('./_');

function notify(handler, args) {
  handler && handler.apply(null, [].concat(args));
}

function instanceId(component) {
  var suffix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  component.__id || (component.__id = _.uniqueId('rw_'));
  return (component.props.id || component.__id) + suffix;
}

function isFirstFocusedRender(component) {
  return component._firstFocus || component.state.focused && (component._firstFocus = true);
}
},{"./_":37}],52:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],53:[function(require,module,exports){
var MILI    = 'milliseconds'
  , SECONDS = 'seconds'
  , MINUTES = 'minutes'
  , HOURS   = 'hours'
  , DAY     = 'day'
  , WEEK    = 'week'
  , MONTH   = 'month'
  , YEAR    = 'year'
  , DECADE  = 'decade'
  , CENTURY = 'century';

var dates = module.exports = {

  add: function(date, num, unit) {
    date = new Date(date)

    switch (unit){
      case MILI:
      case SECONDS:
      case MINUTES:
      case HOURS:
      case YEAR:
        return dates[unit](date, dates[unit](date) + num)
      case DAY:
        return dates.date(date, dates.date(date) + num)
      case WEEK:
        return dates.date(date, dates.date(date) + (7 * num))
      case MONTH:
        return monthMath(date, num)
      case DECADE:
        return dates.year(date, dates.year(date) + (num * 10))
      case CENTURY:
        return dates.year(date, dates.year(date) + (num * 100))
    }

    throw new TypeError('Invalid units: "' + unit + '"')
  },

  subtract: function(date, num, unit) {
    return dates.add(date, -num, unit)
  },

  startOf: function(date, unit, firstOfWeek) {
    date = new Date(date)

    switch (unit) {
      case 'century':
      case 'decade':
      case 'year':
          date = dates.month(date, 0);
      case 'month':
          date = dates.date(date, 1);
      case 'week':
      case 'day':
          date = dates.hours(date, 0);
      case 'hours':
          date = dates.minutes(date, 0);
      case 'minutes':
          date = dates.seconds(date, 0);
      case 'seconds':
          date = dates.milliseconds(date, 0);
    }

    if (unit === DECADE)
      date = dates.subtract(date, dates.year(date) % 10, 'year')

    if (unit === CENTURY)
      date = dates.subtract(date, dates.year(date) % 100, 'year')

    if (unit === WEEK)
      date = dates.weekday(date, 0, firstOfWeek);

    return date
  },

  endOf: function(date, unit, firstOfWeek){
    date = new Date(date)
    date = dates.startOf(date, unit, firstOfWeek)
    date = dates.add(date, 1, unit)
    date = dates.subtract(date, 1, MILI)
    return date
  },

  eq:  createComparer(function(a, b){ return a === b }),
  neq: createComparer(function(a, b){ return a !== b }),
  gt:  createComparer(function(a, b){ return a > b }),
  gte: createComparer(function(a, b){ return a >= b }),
  lt:  createComparer(function(a, b){ return a < b }),
  lte: createComparer(function(a, b){ return a <= b }),

  min: function(){
    return new Date(Math.min.apply(Math, arguments))
  },

  max: function(){
    return new Date(Math.max.apply(Math, arguments))
  },

  inRange: function(day, min, max, unit){
    unit = unit || 'day'

    return (!min || dates.gte(day, min, unit))
        && (!max || dates.lte(day, max, unit))
  },

  milliseconds:   createAccessor('Milliseconds'),
  seconds:        createAccessor('Seconds'),
  minutes:        createAccessor('Minutes'),
  hours:          createAccessor('Hours'),
  day:            createAccessor('Day'),
  date:           createAccessor('Date'),
  month:          createAccessor('Month'),
  year:           createAccessor('FullYear'),

  decade: function (date, val) {
    return val === undefined
      ? dates.year(dates.startOf(date, DECADE))
      : dates.add(date, val + 10, YEAR);
  },

  century: function (date, val) {
    return val === undefined
      ? dates.year(dates.startOf(date, CENTURY))
      : dates.add(date, val + 100, YEAR);
  },

  weekday: function (date, val, firstDay) {
      var weekday = (dates.day(date) + 7 - (firstDay || 0) ) % 7;

      return val === undefined
        ? weekday
        : dates.add(date, val - weekday, DAY);
  }
}


function monthMath(date, val){
  var current = dates.month(date)
    , newMonth  = (current + val);

    date = dates.month(date, newMonth)

    if (newMonth < 0 ) newMonth = 12 + val

    //month rollover
    if ( dates.month(date) !== ( newMonth % 12))
      date = dates.date(date, 0) //move to last of month

    return date
}

function createAccessor(method){
  return function(date, val){
    if (val === undefined)
      return date['get' + method]()

    date = new Date(date)
    date['set' + method](val)
    return date
  }
}

function createComparer(operator) {
  return function (a, b, unit, maybeFoW) {
    return operator(+dates.startOf(a, unit, maybeFoW), +dates.startOf(b, unit, maybeFoW))
  };
}

},{}],54:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var off = function off() {};

if (canUseDOM) {

  off = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.removeEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.detachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = off;
},{"../util/inDOM":71}],55:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var on = function on() {};

if (canUseDOM) {
  on = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.addEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.attachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = on;
},{"../util/inDOM":71}],56:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var contains = (function () {
  var root = canUseDOM && document.documentElement;

  return root && root.contains ? function (context, node) {
    return context.contains(node);
  } : root && root.compareDocumentPosition ? function (context, node) {
    return context === node || !!(context.compareDocumentPosition(node) & 16);
  } : function (context, node) {
    if (node) do {
      if (node === context) return true;
    } while (node = node.parentNode);

    return false;
  };
})();

module.exports = contains;
},{"../util/inDOM":71}],57:[function(require,module,exports){
'use strict';

var offset = require('./offset'),
    getWindow = require('./isWindow');

module.exports = function height(node, client) {
  var win = getWindow(node);
  return win ? win.innerHeight : client ? node.clientHeight : offset(node).height;
};
},{"./isWindow":58,"./offset":59}],58:[function(require,module,exports){
'use strict';

module.exports = function getWindow(node) {
  return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
};
},{}],59:[function(require,module,exports){
'use strict';
var contains = require('./contains'),
    getWindow = require('./isWindow');

module.exports = function offset(node) {
  var doc = node.ownerDocument,
      docElem = doc && doc.documentElement,
      box = { top: 0, left: 0, height: 0, width: 0 };

  if (!doc) return;

  if (!contains(docElem, node)) return box;

  if (node.getBoundingClientRect !== undefined) box = node.getBoundingClientRect();

  var win = getWindow(doc);

  return {
    top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
    left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0),
    width: box.width || node.offsetWidth,
    height: box.height || node.offsetHeight
  };
};
},{"./contains":56,"./isWindow":58}],60:[function(require,module,exports){
'use strict';

var css = require('../style'),
    height = require('./height');

module.exports = function scrollPrarent(node) {
  var position = css(node, 'position'),
      excludeStatic = position === 'absolute',
      ownerDoc = node.ownerDocument;

  if (position === 'fixed') return ownerDoc || document;

  while ((node = node.parentNode) && node.nodeType !== 9) {

    var isStatic = excludeStatic && css(node, 'position') === 'static',
        style = css(node, 'overflow') + css(node, 'overflow-y') + css(node, 'overflow-x');

    if (isStatic) continue;

    if (/(auto|scroll)/.test(style) && height(node) < node.scrollHeight) return node;
  }

  return document;
};
},{"../style":64,"./height":57}],61:[function(require,module,exports){
'use strict';
var getWindow = require('./isWindow');

module.exports = function scrollTop(node, val) {
  var win = getWindow(node);

  if (val === undefined) return win ? 'pageYOffset' in win ? win.pageYOffset : win.document.documentElement.scrollTop : node.scrollTop;

  if (win) win.scrollTo('pageXOffset' in win ? win.pageXOffset : win.document.documentElement.scrollLeft, val);else node.scrollTop = val;
};
},{"./isWindow":58}],62:[function(require,module,exports){
'use strict';

var offset = require('./offset'),
    getWindow = require('./isWindow');

module.exports = function width(node, client) {
  var win = getWindow(node);
  return win ? win.innerWidth : client ? node.clientWidth : offset(node).width;
};
},{"./isWindow":58,"./offset":59}],63:[function(require,module,exports){
"use strict";

module.exports = function _getComputedStyle(node) {
  if (!node) throw new TypeError("No Element passed to `getComputedStyle()`");
  var doc = node.ownerDocument;

  return "defaultView" in doc ? doc.defaultView.opener ? node.ownerDocument.defaultView.getComputedStyle(node, null) : window.getComputedStyle(node, null) : { //ie 8 "magic"
    getPropertyValue: function getPropertyValue(prop) {
      var re = /(\-([a-z]){1})/g;
      if (prop == "float") prop = "styleFloat";
      if (re.test(prop)) prop = prop.replace(re, function () {
        return arguments[2].toUpperCase();
      });

      return node.currentStyle[prop] || null;
    }
  };
};
},{}],64:[function(require,module,exports){
'use strict';

var camelize = require('../util/camelizeStyle'),
    hyphenate = require('../util/hyphenateStyle'),
    _getComputedStyle = require('./getComputedStyle'),
    removeStyle = require('./removeStyle');

var has = Object.prototype.hasOwnProperty;

module.exports = function style(node, property, value) {
  var css = '',
      props = property;

  if (typeof property === 'string') {
    if (value === undefined) return node.style[camelize(property)] || _getComputedStyle(node).getPropertyValue(property);else (props = {})[property] = value;
  }

  for (var key in props) if (has.call(props, key)) {
    !props[key] && props[key] !== 0 ? removeStyle(node, hyphenate(key)) : css += hyphenate(key) + ':' + props[key] + ';';
  }

  node.style.cssText += ';' + css;
};
},{"../util/camelizeStyle":68,"../util/hyphenateStyle":70,"./getComputedStyle":63,"./removeStyle":65}],65:[function(require,module,exports){
'use strict';

module.exports = function removeStyle(node, key) {
  return 'removeProperty' in node.style ? node.style.removeProperty(key) : node.style.removeAttribute(key);
};
},{}],66:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var has = Object.prototype.hasOwnProperty,
    transform = 'transform',
    transition = {},
    transitionTiming,
    transitionDuration,
    transitionProperty,
    transitionDelay;

if (canUseDOM) {
  transition = getTransitionProperties();

  transform = transition.prefix + transform;

  transitionProperty = transition.prefix + 'transition-property';
  transitionDuration = transition.prefix + 'transition-duration';
  transitionDelay = transition.prefix + 'transition-delay';
  transitionTiming = transition.prefix + 'transition-timing-function';
}

module.exports = {
  transform: transform,
  end: transition.end,
  property: transitionProperty,
  timing: transitionTiming,
  delay: transitionDelay,
  duration: transitionDuration
};

function getTransitionProperties() {
  var endEvent,
      prefix = '',
      transitions = {
    O: 'otransitionend',
    Moz: 'transitionend',
    Webkit: 'webkitTransitionEnd',
    ms: 'MSTransitionEnd'
  };

  var element = document.createElement('div');

  for (var vendor in transitions) if (has.call(transitions, vendor)) {
    if (element.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-';
      endEvent = transitions[vendor];
      break;
    }
  }

  if (!endEvent && element.style.transitionProperty !== undefined) endEvent = 'transitionend';

  return { end: endEvent, prefix: prefix };
}
},{"../util/inDOM":71}],67:[function(require,module,exports){
"use strict";

var rHyphen = /-(.)/g;

module.exports = function camelize(string) {
  return string.replace(rHyphen, function (_, chr) {
    return chr.toUpperCase();
  });
};
},{}],68:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/camelizeStyleName.js
 */

'use strict';
var camelize = require('./camelize');
var msPattern = /^-ms-/;

module.exports = function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
};
},{"./camelize":67}],69:[function(require,module,exports){
'use strict';

var rUpper = /([A-Z])/g;

module.exports = function hyphenate(string) {
  return string.replace(rUpper, '-$1').toLowerCase();
};
},{}],70:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */

"use strict";

var hyphenate = require("./hyphenate");
var msPattern = /^ms-/;

module.exports = function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
};
},{"./hyphenate":69}],71:[function(require,module,exports){
'use strict';
module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
},{}],72:[function(require,module,exports){
'use strict';

var canUseDOM = require('./inDOM');

var vendors = ['', 'webkit', 'moz', 'o', 'ms'],
    cancel = 'clearTimeout',
    raf = fallback,
    compatRaf;

var getKey = function getKey(vendor, k) {
  return vendor + (!vendor ? k : k[0].toUpperCase() + k.substr(1)) + 'AnimationFrame';
};

if (canUseDOM) {
  vendors.some(function (vendor) {
    var rafKey = getKey(vendor, 'request');

    if (rafKey in window) {
      cancel = getKey(vendor, 'cancel');
      return raf = function (cb) {
        return window[rafKey](cb);
      };
    }
  });
}

/* https://github.com/component/raf */
var prev = new Date().getTime();

function fallback(fn) {
  var curr = new Date().getTime(),
      ms = Math.max(0, 16 - (curr - prev)),
      req = setTimeout(fn, ms);

  prev = curr;
  return req;
}

compatRaf = function (cb) {
  return raf(cb);
};
compatRaf.cancel = function (id) {
  return window[cancel](id);
};

module.exports = compatRaf;
},{"./inDOM":71}],73:[function(require,module,exports){
'use strict';
var getOffset = require('../query/offset'),
    height = require('../query/height'),
    getScrollParent = require('../query/scrollParent'),
    scrollTop = require('../query/scrollTop'),
    raf = require('./requestAnimationFrame'),
    getWindow = require('../query/isWindow');

module.exports = function scrollTo(selected, scrollParent) {
    var offset = getOffset(selected),
        poff = { top: 0, left: 0 },
        list,
        listScrollTop,
        selectedTop,
        isWin,
        selectedHeight,
        listHeight,
        bottom;

    if (!selected) return;

    list = scrollParent || getScrollParent(selected);
    isWin = getWindow(list);
    listScrollTop = scrollTop(list);

    listHeight = height(list, true);
    isWin = getWindow(list);

    if (!isWin) poff = getOffset(list);

    offset = {
        top: offset.top - poff.top,
        left: offset.left - poff.left,
        height: offset.height,
        width: offset.width
    };

    selectedHeight = offset.height;
    selectedTop = offset.top + (isWin ? 0 : listScrollTop);
    bottom = selectedTop + selectedHeight;

    listScrollTop = listScrollTop > selectedTop ? selectedTop : bottom > listScrollTop + listHeight ? bottom - listHeight : listScrollTop;

    var id = raf(function () {
        return scrollTop(list, listScrollTop);
    });

    return function () {
        return raf.cancel(id);
    };
};
},{"../query/height":57,"../query/isWindow":58,"../query/offset":59,"../query/scrollParent":60,"../query/scrollTop":61,"./requestAnimationFrame":72}],74:[function(require,module,exports){
/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat[ "NaN" ];
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	//Remove percentage character from number string before parsing
	if ( value.indexOf(culture.numberFormat.percent.symbol) > -1){
		value = value.replace( culture.numberFormat.percent.symbol, "" );
	}

	// remove spaces: leading, trailing and between - and number. Used for negative currency pt-BR
	value = value.replace( / /g, "" );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));

},{}],75:[function(require,module,exports){
(function (process){
"use strict";
var babelHelpers = require("./util/babelHelpers.js");
var React = require("react");
var invariant = require("react/lib/invariant");

function customPropType(handler, propType, name) {

  return function (props, propName, componentName, location) {

    if (props[propName] !== undefined) {
      if (!props[handler]) return new Error("You have provided a `" + propName + "` prop to " + "`" + name + "` without an `" + handler + "` handler. This will render a read-only field. " + "If the field should be mutable use `" + defaultKey(propName) + "`. Otherwise, set `" + handler + "`");

      return propType && propType(props, propName, name, location);
    }
  };
}

var version = React.version.split(".").map(parseFloat);

function getType(component) {
  if (version[0] === 0 && version[1] >= 13) return component;

  return component.type;
}

function getLinkName(name) {
  return name === "value" ? "valueLink" : name === "checked" ? "checkedLink" : null;
}

module.exports = function (Component, controlledValues, taps) {
  var name = Component.displayName || Component.name || "Component",
      types = {};

  if (process.env.NODE_ENV !== "production" && getType(Component).propTypes) {
    types = transform(controlledValues, function (obj, handler, prop) {
      var type = getType(Component).propTypes[prop];

      invariant(typeof handler === "string" && handler.trim().length, "Uncontrollable - [%s]: the prop `%s` needs a valid handler key name in order to make it uncontrollable", Component.displayName, prop);

      obj[prop] = customPropType(handler, type, Component.displayName);
      if (type !== undefined) {
        obj[defaultKey(prop)] = type;
      }
    }, {});
  }

  name = name[0].toUpperCase() + name.substr(1);

  taps = taps || {};

  return React.createClass({

    displayName: "Uncontrolled" + name,

    propTypes: types,

    getInitialState: function () {
      var props = this.props,
          keys = Object.keys(controlledValues);

      return transform(keys, function (state, key) {
        state[key] = props[defaultKey(key)];
      }, {});
    },

    shouldComponentUpdate: function () {
      //let the setState trigger the update
      return !this._notifying;
    },

    render: function () {
      var _this = this;

      var newProps = {};
      var _props = this.props;
      var valueLink = _props.valueLink;
      var checkedLink = _props.checkedLink;
      var props = babelHelpers.objectWithoutProperties(_props, ["valueLink", "checkedLink"]);

      each(controlledValues, function (handle, propName) {
        var linkPropName = getLinkName(propName),
            prop = _this.props[propName];

        if (linkPropName && !isProp(_this.props, propName) && isProp(_this.props, linkPropName)) {
          prop = _this.props[linkPropName].value;
        }

        newProps[propName] = prop !== undefined ? prop : _this.state[propName];

        newProps[handle] = setAndNotify.bind(_this, propName);
      });

      newProps = babelHelpers._extends({}, props, newProps);

      //console.log('props: ', newProps)
      each(taps, function (val, key) {
        return newProps[key] = chain(_this, val, newProps[key]);
      });

      return React.createElement(Component, newProps);
    }
  });

  function setAndNotify(propName, value) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var linkName = getLinkName(propName),
        handler = this.props[controlledValues[propName]];
    //, controlled = handler && isProp(this.props, propName);

    if (linkName && isProp(this.props, linkName) && !handler) {
      handler = this.props[linkName].requestChange
      //propName = propName === 'valueLink' ? 'value' : 'checked'
      ;
    }

    if (handler) {
      this._notifying = true;
      handler.call.apply(handler, [this, value].concat(args));
      this._notifying = false;
    }

    this.setState((function () {
      var _setState = {};
      _setState[propName] = value;
      return _setState;
    })());
  }

  function isProp(props, prop) {
    return props[prop] !== undefined;
  }
};

function defaultKey(key) {
  return "default" + key.charAt(0).toUpperCase() + key.substr(1);
}

function chain(thisArg, a, b) {
  return function chainedFunction() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    a && a.call.apply(a, [thisArg].concat(args));
    b && b.call.apply(b, [thisArg].concat(args));
  };
}

function transform(obj, cb, seed) {
  each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})));
  return seed;
}

function each(obj, cb, thisArg) {
  if (Array.isArray(obj)) return obj.forEach(cb, thisArg);

  for (var key in obj) if (has(obj, key)) cb.call(thisArg, obj[key], key, obj);
}

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}
//return !controlled
}).call(this,require('_process'))
},{"./util/babelHelpers.js":76,"_process":1,"react":"react","react/lib/invariant":79}],76:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory(root.babelHelpers = {});
  }
})(this, function (global) {
  var babelHelpers = global;

  babelHelpers.objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
})
},{}],77:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() { return this; };
emptyFunction.thatReturnsArgument = function(arg) { return arg; };

module.exports = emptyFunction;

},{}],78:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document body is not yet defined.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;

},{}],79:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":1}],80:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
      console.warn(message);
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"./emptyFunction":77,"_process":1}],81:[function(require,module,exports){
'use strict';

var React = require('react');
var formiojs = require('formiojs')();
var FormioComponent = require('./FormioComponent');

require('./components');

module.exports = React.createClass({
  displayName: 'Formio',
  getInitialState: function getInitialState() {
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: this.props.form ? false : true,
      isSubmitting: false,
      isValid: true
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false,
      formAction: false
    };
  },
  componentWillMount: function componentWillMount() {
    this.data = {};
    this.inputs = {};
  },
  attachToForm: function attachToForm(component) {
    this.inputs[component.props.component.key] = component;
    this.data[component.props.component.key] = component.state.value;
    this.validate(component);
  },
  detachFromForm: function detachFromForm(component) {
    delete this.inputs[component.props.name];
    delete this.data[component.props.name];
  },
  validate: function validate(component) {
    var state = {
      isValid: true,
      errorMessage: ''
    };
    // Validate each item if multiple.
    if (component.props.component.multiple) {
      component.state.value.forEach((function (item, index) {
        if (state.isValid) {
          state = this.validateItem(item, component);
        }
      }).bind(this));
    } else {
      state = this.validateItem(component.state.value, component);
    }
    component.setState(state, this.validateForm);
  },
  validateItem: function validateItem(item, component) {
    var state = {
      isValid: true,
      errorMessage: ''
    };
    if (item || component.props.component.validate && component.props.component.validate.required) {
      if (item) {
        if (state.isValid && component.props.component.type === 'email' && !item.match(/\S+@\S+/)) {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be a valid email.';
        }
        // MaxLength
        if (state.isValid && component.props.component.validate && component.props.component.validate.maxLength && item.length > component.props.component.validate.maxLength) {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be shorter than ' + (component.props.component.validate.maxLength + 1) + ' characters';
        }
        // MinLength
        if (state.isValid && component.props.component.validate && component.props.component.validate.minLength && item.length < component.props.component.validate.minLength) {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be longer than ' + (component.props.component.validate.minLength - 1) + ' characters';
        }
        // Regex
        if (state.isValid && component.props.component.validate && component.props.component.validate.pattern) {
          var re = new RegExp(component.props.component.validate.pattern, "g");
          state.isValid = item.match(re);
          if (!state.isValid) {
            state.errorMessage = (component.props.component.label || component.props.component.key) + ' must match the expression: ' + component.props.component.validate.pattern;
          }
        }
        // Custom
        if (state.isValid && component.props.component.validate && component.props.component.validate.custom) {
          var custom = component.props.component.validate.custom;
          this.updateData();
          custom = custom.replace(/({{\s+(.*)\s+}})/, (function (match, $1, $2) {
            return this.data[$2];
          }).bind(this));
          var input = item;
          /* jshint evil: true */
          var valid = eval(custom);
          state.isValid = valid === true;
          if (!state.isValid) {
            state.errorMessage = valid || (component.props.component.label || component.props.component.key) + "is not a valid value.";
          }
        }
      }
      // Only gets here if required but no value.
      else {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' is required.';
        }
    }
    return state;
  },
  componentDidMount: function componentDidMount() {
    if (this.props.src) {
      this.formio = new formiojs(this.props.src);
      this.formio.loadForm().then((function (form) {
        if (typeof this.props.onFormLoad === 'function') {
          this.props.onFormLoad(form);
        }
        this.setState({
          form: form,
          isLoading: false
        }, this.validateForm);
      }).bind(this));
      if (this.formio.submissionId) {
        this.formio.loadSubmission().then((function (submission) {
          if (typeof this.props.onSubmissionLoad === 'function') {
            this.props.onSubmissionLoad(submission);
          }
          this.setState({
            submission: submission
          }, this.validateForm);
        }).bind(this));
      }
    }
  },
  updateData: function updateData(component) {
    Object.keys(this.inputs).forEach((function (name) {
      this.data[name] = this.inputs[name].state.value;
    }).bind(this));
  },
  validateForm: function validateForm() {
    var allIsValid = true;

    var inputs = this.inputs;
    Object.keys(inputs).forEach(function (name) {
      if (!inputs[name].state.isValid) {
        allIsValid = false;
      }
    });

    this.setState({
      isValid: allIsValid
    });
  },
  showAlert: function showAlert(type, message) {
    this.setState(function (previousState) {
      return previousState.alerts.concat({ type: type, message: message });
    });
  },
  onSubmit: function onSubmit(event) {
    event.preventDefault();
    this.setState({
      alerts: [],
      isSubmitting: true
    });
    this.updateData();
    var sub = this.state.submission;
    sub.data = this.data;

    var request;
    var method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = formiojs.request(this.state.form.action, method, sub);
    } else {
      request = this.formio.saveSubmission(sub);
    }
    request.then((function (submission) {
      if (typeof this.props.onFormSubmit === 'function') {
        this.props.onFormSubmit(submission);
      }
      this.setState({
        submission: submission,
        isSubmitting: false,
        alerts: [{
          type: 'success',
          message: 'Submission was ' + (method === 'put' ? 'updated' : 'created')
        }]
      });
    }).bind(this))['catch']((function (response) {
      if (typeof this.props.onFormError === 'function') {
        this.props.onFormError(response);
      }
      this.setState({
        isSubmitting: false
      });
      if (response.hasOwnProperty('name') && response.name === "ValidationError") {
        response.details.forEach((function (detail) {
          if (this.inputs[detail.path]) {
            this.inputs[detail.path].setState({
              isValid: false,
              isPristine: false,
              errorMessage: detail.message
            });
          }
        }).bind(this));
      } else {
        this.showAlert('error', response);
      }
    }).bind(this));
  },
  resetForm: function resetForm() {
    this.setState(function (previousState) {
      for (var key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  },
  render: function render() {
    if (this.state.form.components) {
      this.componentNodes = this.state.form.components.map((function (component) {
        var value = this.state.submission.data && this.state.submission.data.hasOwnProperty(component.key) ? this.state.submission.data[component.key] : component.defaultValue || '';
        var key = component.key || component.type;
        return React.createElement(FormioComponent, {
          key: key,
          component: component,
          value: value,
          readOnly: this.props.readOnly,
          attachToForm: this.attachToForm,
          detachFromForm: this.detachFromForm,
          validate: this.validate,
          isSubmitting: this.state.isSubmitting,
          isFormValid: this.state.isValid,
          data: this.state.submission.data,
          onElementRender: this.props.onElementRender,
          resetForm: this.resetForm,
          formio: this.formio,
          showAlert: this.showAlert
        });
      }).bind(this));
    }
    var loading = this.state.isLoading ? React.createElement('i', { id: 'formio-loading', className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
    var alerts = this.state.alerts.map(function (alert) {
      var className = "alert alert-" + alert.type;
      return React.createElement(
        'div',
        { className: className, role: 'alert' },
        alert.message
      );
    });

    return React.createElement(
      'form',
      { role: 'form', name: 'formioForm', onSubmit: this.onSubmit },
      loading,
      alerts,
      this.componentNodes
    );
  }
});


},{"./FormioComponent":82,"./components":92,"formiojs":2,"react":"react"}],82:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioComponent',
  render: function render() {
    // FormioComponents is a global variable so external scripts can define custom components.
    var FormioElement = FormioComponents[this.props.component.type];
    //console.log(this.props.component.type);
    var className = "form-group has-feedback form-field-type-" + this.props.component.type;
    if (typeof this.props.onElementRender === 'function') {
      this.props.onElementRender(this.props.component);
    }
    return React.createElement(
      'div',
      { className: className },
      React.createElement(FormioElement, _extends({
        name: this.props.component.key
      }, this.props))
    );
  }
});


},{"react":"react"}],83:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');

module.exports = React.createClass({
  displayName: 'Address',
  mixins: [componentMixin, selectMixin],
  getTextField: function getTextField() {
    return 'formatted_address';
  },
  getValueField: function getValueField() {
    return null;
  },
  doSearch: function doSearch(text) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + text + '&sensor=false').then((function (response) {
      response.json().then((function (data) {
        this.setState({
          selectItems: data.results
        });
      }).bind(this));
    }).bind(this));
  }
});


},{"./mixins/componentMixin":93,"./mixins/selectMixin":96,"react":"react"}],84:[function(require,module,exports){
'use strict';

var React = require('react');

// TODO: Support other button actions like reset.
module.exports = React.createClass({
  displayName: 'Button',
  onClick: function onClick(event) {
    switch (this.props.component.action) {
      case 'submit':
        // Allow default submit to continue.
        break;
      case 'reset':
        event.preventDefault();
        this.props.resetForm();
        break;
    }
  },
  render: function render() {
    var classNames = "btn btn-" + this.props.component.theme + " btn-" + this.props.component.size;
    classNames += this.props.component.block ? ' btn-block' : '';
    var leftIcon = this.props.component.leftIcon ? React.createElement('span', { className: this.props.component.leftIcon, 'aria-hidden': 'true' }) : '';
    var rightIcon = this.props.component.rightIcon ? React.createElement('span', { className: this.props.component.rightIcon, 'aria-hidden': 'true' }) : '';
    var disabled = this.props.isSubmitting || this.props.component.disableOnInvalid && !this.props.isFormValid;
    var submitting = this.props.isSubmitting && this.props.component.action == "submit" ? React.createElement('i', { className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
    return React.createElement(
      'button',
      {
        className: classNames,
        type: this.props.component.action == 'submit' ? 'submit' : 'button',
        disabled: disabled,
        onClick: this.onClick
      },
      submitting,
      leftIcon,
      this.props.component.label,
      rightIcon
    );
  }
});


},{"react":"react"}],85:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Checkbox',
  mixins: [componentMixin, multiMixin],
  onChangeCheckbox: function onChangeCheckbox(event) {
    var value = event.currentTarget.checked;
    var index = this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null;
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    var required = this.props.component.validate.required ? 'field-required' : '';
    return React.createElement(
      'div',
      { className: 'checkbox' },
      React.createElement(
        'label',
        { className: required },
        React.createElement('input', {
          type: 'checkbox',
          id: this.props.component.key,
          'data-index': index,
          name: this.props.name,
          value: value,
          disabled: this.props.readOnly,
          onChange: this.onChangeCheckbox
        }),
        this.props.component.label
      )
    );
  }
});


},{"./mixins/componentMixin":93,"./mixins/multiMixin":95,"react":"react"}],86:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Column',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      this.props.component.columns.map((function (column) {
        return React.createElement(
          'div',
          { className: 'col-xs-6' },
          column.components.map((function (component) {
            var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
            return React.createElement(FormioComponent, _extends({}, this.props, {
              key: component.key,
              name: component.key,
              component: component,
              value: value
            }));
          }).bind(this))
        );
      }).bind(this))
    );
  }
});


},{"../FormioComponent":82,"react":"react"}],87:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'Content',
  render: function render() {
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.component.html } });
  }
});


},{"react":"react"}],88:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var DateTimePicker = require('react-widgets/lib/DateTimePicker');

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [componentMixin, multiMixin],
  onChangeDatetime: function onChangeDatetime(index, value, str) {
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    return React.createElement(DateTimePicker, {
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      value: value,
      onChange: this.onChangeDatetime.bind(null, index)
    });
  }
});


},{"./mixins/componentMixin":93,"./mixins/multiMixin":95,"react":"react","react-widgets/lib/DateTimePicker":10}],89:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'Email',
  mixins: [componentMixin, multiMixin, inputMixin]
});


},{"./mixins/componentMixin":93,"./mixins/inputMixin":94,"./mixins/multiMixin":95,"react":"react"}],90:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function render() {
    var legend = this.props.component.legend ? React.createElement(
      'legend',
      null,
      this.props.component.legend
    ) : '';
    return React.createElement(
      'fieldset',
      null,
      legend,
      this.props.component.components.map((function (component) {
        var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
        return React.createElement(FormioComponent, _extends({}, this.props, {
          key: component.key,
          name: component.key,
          component: component,
          value: value
        }));
      }).bind(this))
    );
  }
});


},{"../FormioComponent":82,"react":"react"}],91:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'Hidden',
  render: function render() {
    var value = this.props.data && this.props.data.hasOwnProperty(this.props.component.key) ? this.props.data[this.props.component.key] : '';
    return React.createElement('input', { type: 'hidden', id: this.props.component.key, name: this.props.component.key, value: value });
  }
});


},{"react":"react"}],92:[function(require,module,exports){
'use strict';

// Is this the best way to create a registry? We don't have providers like Angular.
window.FormioComponents = {};
FormioComponents.address = require('./address');
FormioComponents.button = require('./button');
FormioComponents.checkbox = require('./checkbox');
FormioComponents.columns = require('./columns');
FormioComponents.content = require('./content');
FormioComponents.datetime = require('./datetime');
FormioComponents.email = require('./email');
FormioComponents.fieldset = require('./fieldset');
FormioComponents.hidden = require('./hidden');
FormioComponents.number = require('./number');
FormioComponents.panel = require('./panel');
FormioComponents.password = require('./password');
FormioComponents.phoneNumber = require('./phoneNumber');
FormioComponents.radio = require('./radio');
FormioComponents.resource = require('./resource');
FormioComponents.select = require('./select');
FormioComponents.signature = require('./signature');
FormioComponents.textarea = require('./textarea');
FormioComponents.textfield = require('./textfield');
FormioComponents.well = require('./well');

module.exports = {};


},{"./address":83,"./button":84,"./checkbox":85,"./columns":86,"./content":87,"./datetime":88,"./email":89,"./fieldset":90,"./hidden":91,"./number":97,"./panel":98,"./password":99,"./phoneNumber":100,"./radio":101,"./resource":102,"./select":103,"./signature":104,"./textarea":105,"./textfield":106,"./well":107}],93:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = {
  getInitialState: function getInitialState() {
    var value = this.props.value || null;
    if (this.props.component.multiple && !Array.isArray(value)) {
      value = [value];
    }
    // If this was a multivalue but is now single value.
    else if (!this.props.component.multiple && Array.isArray(value)) {
        value = value[0];
      }
    return {
      value: value,
      isValid: true,
      errorMessage: '',
      isPristine: true
    };
  },
  componentWillMount: function componentWillMount() {
    this.props.attachToForm(this);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.props.detachFromForm(this);
  },
  onChange: function onChange(event) {
    var value = event.currentTarget.value;
    var index = this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null;
    this.setValue(value, index);
  },
  setValue: function setValue(value, index) {
    this.setState(function (previousState, currentProps) {
      if (index) {
        previousState.value[index] = value;
      } else {
        previousState.value = value;
      }
      previousState.isPristine = false;
      return previousState;
    }, (function () {
      if (typeof this.props.validate === 'function') {
        this.props.validate(this);
      }
    }).bind(this));
  },
  getComponent: function getComponent() {
    var classNames = "form-group has-feedback form-field-type-" + this.props.component.type + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error' : '');
    var id = "form-group-" + this.props.component.key;
    var Elements = this.getElements();
    var Error = this.state.errorMessage && !this.state.isPristine ? React.createElement(
      'p',
      { className: 'help-block' },
      this.state.errorMessage
    ) : '';
    return React.createElement(
      'div',
      { className: classNames, id: id },
      React.createElement(
        'div',
        null,
        Elements
      ),
      Error
    );
  },
  render: function render() {
    return this.getComponent();
  }
};


},{"react":"react"}],94:[function(require,module,exports){
'use strict';

var React = require('react');
var Input = require('react-input-mask');

module.exports = {
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return React.createElement(Input, {
      type: this.props.component.inputType,
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      mask: this.props.component.inputMask,
      onChange: this.onChange
    });
  }
};


},{"react":"react","react-input-mask":5}],95:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = {
  addFieldValue: function addFieldValue() {
    var values = this.state.value;
    values.push(this.props.component.defaultValue);
    this.setState({
      value: values
    });
  },
  removeFieldValue: function removeFieldValue(id) {
    var values = this.state.value;
    values.splice(id, 1);
    this.setState({
      value: values
    });
  },
  getElements: function getElements() {
    var Component;
    var classLabel = "control-label" + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var className = this.props.component.prefix || this.props.component.suffix ? 'input-group' : '';
    var prefix = this.props.component.prefix ? React.createElement(
      'div',
      { className: 'input-group-addon' },
      this.props.component.prefix
    ) : '';
    var suffix = this.props.component.suffix ? React.createElement(
      'div',
      { className: 'input-group-addon' },
      this.props.component.suffix
    ) : '';
    var data = this.state.value;
    if (this.props.component.multiple) {
      var rows = data.map((function (value, id) {
        var Element = this.getSingleElement(value, id);
        return React.createElement(
          'tr',
          { key: id },
          React.createElement(
            'td',
            null,
            requiredInline,
            React.createElement(
              'div',
              { className: className },
              prefix,
              ' ',
              Element,
              ' ',
              suffix
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement(
              'a',
              { onClick: this.removeFieldValue.bind(null, id), className: 'btn btn-danger' },
              React.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
            )
          )
        );
      }).bind(this));
      Component = React.createElement(
        'div',
        null,
        inputLabel,
        React.createElement(
          'table',
          { className: 'table table-bordered' },
          React.createElement(
            'tbody',
            null,
            rows,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                { colSpan: '2' },
                React.createElement(
                  'a',
                  { onClick: this.addFieldValue, className: 'btn btn-primary' },
                  React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
                  ' Add another'
                )
              )
            )
          )
        )
      );
    } else {
      var Element = this.getSingleElement(data);
      Component = React.createElement(
        'div',
        null,
        inputLabel,
        ' ',
        requiredInline,
        React.createElement(
          'div',
          { className: className },
          prefix,
          ' ',
          Element,
          ' ',
          suffix
        )
      );
    }
    return Component;
  }
};


},{"react":"react"}],96:[function(require,module,exports){
'use strict';

var React = require('react');
var DropdownList = require('react-widgets/lib/DropdownList');
var Multiselect = require('react-widgets/lib/Multiselect');

module.exports = {
  getInitialState: function getInitialState() {
    return {
      selectItems: [],
      searchTerm: ''
    };
  },
  valueField: function valueField() {
    var valueField = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueField = this.getValueField();
    }
    return valueField;
  },
  textField: function textField() {
    var textField = 'label';
    if (typeof this.getTextField === 'function') {
      textField = this.getTextField();
    }
    return textField;
  },
  onChangeSelect: function onChangeSelect(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach((function (val, index) {
        value[index] = val[this.valueField()];
      }).bind(this));
    } else if (typeof value === "object" && this.valueField()) {
      value = value[this.valueField()];
    }
    this.setValue(value);
  },
  onSearch: function onSearch(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.doSearch === 'function') {
      this.doSearch(text);
    }
  },
  getElements: function getElements() {
    // TODO: Need to support custom item rendering in item template.
    var Element = this.props.component.multiple ? Multiselect : DropdownList;
    var valueField = this.valueField();
    var textField = this.textField();
    var classLabel = "control-label" + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var className = this.props.component.prefix || this.props.component.suffix ? 'input-group' : '';
    return React.createElement(
      'div',
      null,
      inputLabel,
      ' ',
      requiredInline,
      React.createElement(
        'div',
        { className: className },
        React.createElement(Element, {
          data: this.state.selectItems,
          valueField: valueField,
          textField: textField,
          suggest: true,
          filter: 'contains',
          value: this.state.value,
          searchTerm: this.state.searchTerm,
          onSearch: this.onSearch,
          onChange: this.onChangeSelect
        })
      )
    );
  }
};


},{"react":"react","react-widgets/lib/DropdownList":12,"react-widgets/lib/Multiselect":19}],97:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Number',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return React.createElement('input', {
      type: this.props.component.inputType,
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      mask: this.props.component.inputMask,
      min: this.props.component.validate.min,
      max: this.props.component.validate.max,
      step: this.props.component.validate.step,
      onChange: this.onChangeNumber
    });
  }
});


},{"./mixins/componentMixin":93,"./mixins/multiMixin":95,"react":"react"}],98:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Panel',
  render: function render() {
    var title = this.props.component.title ? React.createElement(
      'div',
      { className: 'panel-heading' },
      React.createElement(
        'h3',
        { className: 'panel-title' },
        this.props.component.title
      )
    ) : '';
    var className = "panel panel-" + this.props.component.theme;
    return React.createElement(
      'div',
      { className: className },
      title,
      React.createElement(
        'div',
        { className: 'panel-body' },
        this.props.component.components.map((function (component) {
          var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
          return React.createElement(FormioComponent, _extends({}, this.props, {
            key: component.key,
            name: component.key,
            component: component,
            value: value
          }));
        }).bind(this))
      )
    );
  }
});


},{"../FormioComponent":82,"react":"react"}],99:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'Password',
  mixins: [componentMixin, multiMixin, inputMixin]
});


},{"./mixins/componentMixin":93,"./mixins/inputMixin":94,"./mixins/multiMixin":95,"react":"react"}],100:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'PhoneNumber',
  mixins: [componentMixin, multiMixin, inputMixin]
});


},{"./mixins/componentMixin":93,"./mixins/inputMixin":94,"./mixins/multiMixin":95,"react":"react"}],101:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Radio',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return React.createElement(
      'div',
      { className: 'radio-wrapper' },
      this.props.component.values.map((function (v) {
        return React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            { className: 'control-label' },
            React.createElement('input', {
              type: this.props.component.inputType,
              id: v.value,
              'data-index': index,
              name: this.props.component.key,
              value: v.value,
              disabled: this.props.readOnly,
              onChange: this.onChange
            }),
            v.label
          )
        );
      }).bind(this))
    );
  }
});


},{"./mixins/componentMixin":93,"./mixins/multiMixin":95,"react":"react"}],102:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs')();

module.exports = React.createClass({
  displayName: 'Resource',
  mixins: [componentMixin, selectMixin],
  componentWillMount: function componentWillMount() {
    this.doSearch();
  },
  getValueField: function getValueField() {
    return '_id';
  },
  doSearch: function doSearch(text) {
    var settings = this.props.component;
    if (settings.resource) {
      this.formio = new formiojs(this.props.formio.projectUrl + '/form/' + settings.resource);
      var params = {};

      // If they wish to filter the results.
      if (settings.selectFields) {
        params.select = settings.selectFields;
      }

      // TODO: Should implement settings.searchExpression && settings.searchFields

      // Load the submissions.
      this.formio.loadSubmissions({
        params: params
      }).then((function (submissions) {
        this.setState({
          selectItems: submissions
        });
      }).bind(this));
    }
  }
});


},{"./mixins/componentMixin":93,"./mixins/selectMixin":96,"formiojs":2,"react":"react"}],103:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs');

module.exports = React.createClass({
  displayName: 'Select',
  mixins: [componentMixin, selectMixin],
  componentWillMount: function componentWillMount() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          this.setState({
            selectItems: JSON.parse(this.props.component.data.json)
          });
        } catch (error) {
          this.setState({
            selectItems: []
          });
        }
        break;
      case 'url':
        var url = this.props.component.data.url;
        if (url.substr(0, 1) === '/') {
          url = formiojs.baseUrl + url;
        }
        // Disable auth for outgoing requests.
        // TODO: Do we need this?
        //if (settings.data.url.indexOf(Formio.baseUrl) === -1) {
        //  options = {
        //    disableJWT: true,
        //    headers: {
        //      Authorization: undefined,
        //      Pragma: undefined,
        //      'Cache-Control': undefined
        //    }
        //  };
        //}
        formiojs.request(url).then((function (data) {
          this.setState({
            selectItems: data
          });
        }).bind(this));
        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  }
});


},{"./mixins/componentMixin":93,"./mixins/selectMixin":96,"formiojs":2,"react":"react"}],104:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var SignaturePad = require('react-signature-pad');

module.exports = React.createClass({
  displayName: 'Signature',
  mixins: [componentMixin],
  getElements: function getElements() {
    return React.createElement(
      'div',
      null,
      React.createElement(SignaturePad, _extends({
        clearButton: 'true'
      }, this.props.component))
    );
  }
});


},{"./mixins/componentMixin":93,"react":"react","react-signature-pad":6}],105:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Textarea',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function getSingleElement(value, index) {
    return React.createElement('textarea', {
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      rows: this.props.component.rows,
      onChange: this.onChange
    });
  }
});


},{"./mixins/componentMixin":93,"./mixins/multiMixin":95,"react":"react"}],106:[function(require,module,exports){
'use strict';

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'Textfield',
  mixins: [componentMixin, multiMixin, inputMixin]
});


},{"./mixins/componentMixin":93,"./mixins/inputMixin":94,"./mixins/multiMixin":95,"react":"react"}],107:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Well',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'well' },
      this.props.component.components.map((function (component) {
        var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
        return React.createElement(FormioComponent, _extends({}, this.props, {
          key: component.key,
          name: component.key,
          component: component,
          value: value
        }));
      }).bind(this))
    );
  }
});


},{"../FormioComponent":82,"react":"react"}]},{},[81]);
