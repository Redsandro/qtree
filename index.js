/*
	Copyright (C) 2013 Sander Steenhuis; http://www.Redsandro.com/ <info@redsandro.com>

	This is free software, and is released under the terms of the GPL version 2 or (at your option) any later version.
	See license.txt or <http://www.gnu.org/licenses/>.
*/

/**
 * Qtree - Allows switching and branching promise chains so we can completely separate promise flow from boring code.
 * It's as sexy as separating content from markup.
 */



/**
 * Modules
 */
var	q = require('q');
module.exports = q;



/**
 * Promise prototypes
 */
q.makePromise.prototype.switchIf = function (testFunc, thenFunc, elseFunc, throwBool) {
	return switchIf(this, testFunc, thenFunc, elseFunc, throwBool);
};

// Synonym - if is a perfectly legal method. but most IDEs complain because it's also a keyword.
q.makePromise.prototype.if = q.makePromise.prototype.switchIf;

//Object.defineProperty(q.makePromise.prototype, 'if', {
//	enumerable	:	false,
//	value		:	function(testFunc, thenFunc, elseFunc, throwBool) {
//						return switchIf(this, testFunc, thenFunc, elseFunc, throwBool);
//					}
//});



/**
 * Juggling
 */
exports.switchIf = q.switchIf = switchIf;
function switchIf(val, testFunc, thenFunc, elseFunc, throwBool) {
	var deferred = q.defer();

	// By default, values will be passed unchanged when output function is not defined.
	// Explicitly set throwBool to true will throw a new error instead.
	var reject = false;
	if (throwBool === true)
		reject = true;


	// Testfunction is required.
	if (typeof testFunc !== 'function') {
		if (reject)
			deferred.reject('testFunc not specified.');
		else
			deferred.resolve(val);

		return deferred;
	}

	// Without a thenFunc, just pass through or throw error.
	if (typeof thenFunc !== 'function') {
		var thenFunc = (reject)
		?	function(val) {
				throw new Error('Value matched: ' + val);
			}
		:	function(val) {
				return val;
			}
		;
	}

	// Without an elseFunc, just pass through or throw error.
	if (typeof elseFunc !== 'function') {
		var elseFunc = (reject)
		?	function(val) {
				throw new Error('Value mismatched: ' + val);
			}
		:	function(val) {
				return val;
			}
		;
	}

	// Start with original promise
	deferred.resolve(val);

	// Append branches to promise
	return deferred.promise.then(function(val) {
		return testFunc(val) ? thenFunc(val) : elseFunc(val);
	});
}

