#qtree

Take a bite of sammich that is separation of promiseflow and actual code magic and say 'mmm-mmm' with `qtree`, an extension of the `Q` promise library.

The goal is to have more control over the flow of promises. With `Q`, you can
```javascript
var q = require('q');

getPromise()
.then(someFunc)
.then(someFoo)
.then(someBar)
// ...
.done();
```

If you want to split the chain conditionally, one of the functions must continue in a different direction, forcing you to mix the promise chain with hardcore code.
Because the promise chain provides such a nice overview of the order in which your code is executed, it is beneficial to be able to make promise trees in stead of promise chains.

For now, I've just implemented a chainable `if` method, but the idea is to expand on this somewhere in the future.

###if(testFunc, thenFunc, elseFunc, error)
__Synonym: switchIf()__ for IDE's that won't stop crying about using keywords as methods.

__testFunc(value)__ is a function that receives the promised value and returns either `true` or `false`.

__thenFunc(value)__ _optional_ will be executed when `testFunc` returns `true`.

__elseFunc(value)__ _optional_ will be executed when `testFunc` returns `false`.

__error__ _optional_ when `true`, this boolean value (default: `false`) makes the `if()` method throw an error when the resulting action was not provided. This makes the `if()` method very versatile. By default, the initial promised value will just pass through. This way, you can conditionally alter the promised value only _when x_ or _unless y_ by omitting either `elseFunc` or `thenFunc`. If you prefer to break your promise, set this to `true`.

```javascript
var q = require('qtree');

getPromise()
.then(someFunc)
.if(
	testFunc,
	thenFunc,
	elseFunc
)
.then(someFoo)
.then(someBar)
// ...
.done();
```

#Future wishes

Ideally, I would like to be able to do the branching outside of the method, making the promise aware that it is in a conditional branch until it is finished, like in `bash` where you have `if` and `fi`. But I don't see how that would be possible. Just a thought, in case anyone wants to commit:

_Hypothetical code_

```javascript
var q = require('qtree');

getPromise()
.then(someFunc)
.if(testFunc)
	.then(someBazBar)
	.then(someBazBaz)
.fi()
.then(someFoo)
.then(someBar)
// ...
.done();
```

Similarly, this would be even better with `case`. Any `case` would implicitly start a `switch` statement. The `break` method will traverse the promise unchanged to the `esac` (end case) method.

```javascript
var q = require('qtree');

getPromise()
.then(someFunc)
.case('someValue')
	.then(someBazBar)
	.then(someBazBaz) // No break, continues with next case
.case('otherValue')
	.then(someBarFoo)
	.then(someBarBar)
	.break() // Break, skips to esac()
.default() // When no case is matched
	.then(someFooBar)
	.then(someFooBaz)
.esac() // Promise no longer needs to be branch-aware.
.then(someFoo)
.then(someBar)
// ...
.done();
```
