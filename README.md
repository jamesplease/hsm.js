# hsm.js
[![Travis build status](http://img.shields.io/travis/jmeas/hsm.js.svg?style=flat)](https://travis-ci.org/jmeas/hsm.js)
[![Code Climate](https://codeclimate.com/github/jmeas/hsm.js/badges/gpa.svg)](https://codeclimate.com/github/jmeas/hsm.js)
[![Test Coverage](https://codeclimate.com/github/jmeas/hsm.js/badges/coverage.svg)](https://codeclimate.com/github/jmeas/hsm.js)
[![Dependency Status](https://david-dm.org/jmeas/hsm.js.svg)](https://david-dm.org/jmeas/hsm.js)
[![devDependency Status](https://david-dm.org/jmeas/hsm.js/dev-status.svg)](https://david-dm.org/jmeas/hsm.js#info=devDependencies)

A minimal hierarchal state machine for Javascript.

### What is a state machine?

A state machine is a thing that consists of a finite number of states. At any time, it can
only be in exactly one of those states. The name 'state machine' is an abbreviation of 'finite
state machine.'

### What is a hierarchal state machine?

A state machine with a notion of nested states is called a hierarchal state machine. When
a nested state is active, each of its parent states are also active.

### What is this library?

This library provides a barebones implementation of the above system. It remains
unopinionated about two things:

1. What a state is
2. How to transition between two states

It has two opinions of importance:

1. Child states cannot be defined before parent states
2. Transitions are always asynchronous

### API

##### `Hsm.getParentStateName( stateName )`

Given a state, get the value of the parent state.

```js
Hsm.getParentStateName('cheese.is.good');
// => 'cheese.is'
```

##### `constructor( options )`

Create a new instance of Hsm. Pass the `states` option to populate the state machine with those states.

```js
var hsm = new Hsm({
  states: {
    '': IndexState,
    'books': BooksState,
    'books.book': BookState
  }
});
```

Hsm instances are created in an `undefined` state. You must transition
to the initial state manually.

##### `setState( stateName, stateDefinition )`

Set a new state. `stateDefinition` can be anything – this library
does nothing with the states. `stateName` can be anything as well,
but an Error will be thrown if the parent state does not exist.

```js
hsm.setState('food', FoodState);
hsm.setState('food.breakfast', BreakfastState);
```

##### `getState( stateName )`

Access the object that represents `stateName`.

##### `hasState( stateName )`

Returns a Boolean representing whether or not `stateName` has
been set.

##### `currentStateName()`

Return the name of the current state.

##### `currentState()`

Return the object that represents the current state.

##### `transitionTo( newState )`

Asynchronously transition to `newState` by delegating to `transition`. This
method is not intended to be overridden. To customize the transition behavior,
use the `transition` hook described below.

##### `transition( stateDiff, cancel )`

Define an asynchronous transition. `stateDiff` is an object representing the
difference between the current state and the new state.

An example diff between `books.book.author` and `books.comments` is:

```js
{
  outStates: ['books.book.author', 'books.book'],
  inStates: ['books.comments']
}
```

Call `cancel` to cancel the transition.

###### A note on transition to `index`

Defining an `index` state at any other state gives you an opportunity
to enter a unique state that is only triggered when you land **on** that state,
but not on a child state.

To get a better understanding of what I mean, consider these states:

```js
{
  '': RootState,
  'books': BooksRoute,
  'books.book': BookRoute
}
```

When you transition to `books.book`, both `books` and `book` will be entered. If
instead you transition to just `books`, only `books` is triggered, as you might
have guessed. This is fine in some situations, but what if you want something special
to happen only when you land on `books`, but not when you enter a child of `books`? That's
what the `index` route is for.

Taking those same routes from above:

```js
{
  '': RootState,
  'books': BooksRoute,
  'books.index': BookIndexRoute,
  'books.book': BookRoute
}
```

Transitioning to `books.book` remains the same. But if you transition to `books`,
both `books` and `index` will be activated, giving you a unique state for `books` by
itself. Transitioning to `books` and `books.index` behave identically.
