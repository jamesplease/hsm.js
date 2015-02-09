# hsm.js
[![Travis build status](http://img.shields.io/travis/6to5/6to5-library-boilerplate.svg?style=flat)](https://travis-ci.org/6to5/6to5-library-boilerplate)
[![Code Climate](https://codeclimate.com/github/6to5/6to5-library-boilerplate/badges/gpa.svg)](https://codeclimate.com/github/6to5/6to5-library-boilerplate)
[![Test Coverage](https://codeclimate.com/github/6to5/6to5-library-boilerplate/badges/coverage.svg)](https://codeclimate.com/github/6to5/6to5-library-boilerplate)
[![Dependency Status](https://david-dm.org/6to5/6to5-library-boilerplate.svg)](https://david-dm.org/6to5/6to5-library-boilerplate)
[![devDependency Status](https://david-dm.org/6to5/6to5-library-boilerplate/dev-status.svg)](https://david-dm.org/6to5/6to5-library-boilerplate#info=devDependencies)

A minimal hierarchal state machine for Javascript.

### What is a state machine?

A state machine is a thing that consists of a number of states. At any time, it can
only be in exactly one state at a time.

The name 'state machine' is shorthand for 'finite state machine,' which describes another
property of these objects: they have a finite number of states.

### What is a hierarchal state machine?

A state machine that has a notion of nested states is called a hierarchal state machine. When
a nested state is active, all of its parent states are also active.

### What's this library?

This library provides the scaffolding to represent a system like the above. It provides
a hook for asynchronous transitions, but is unopinionated about what a state is, and how
to transition between two states.

The point is that you can use build from this library to solve problems.

### The `index` State

If a given state needs custom behavior that does not happen when its children states are
activated, then you can use the `index` state.

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
  outStates: ['author', 'book'],
  inStates: ['comments']
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

When you transition to `books.book`, both `books` and `book` will be called. If
instead you transition to just `books`, only `books` is triggered. This is fine
in some situations, but what if you want something special to happen only when you
land on `books`, but not when you enter a child of `books`? That's what the `index`
route is for.

Taking those same routes from above:

```js
{
  '': RootState,
  'books': BooksRoute,
  'books.index': BookIndexRoute,
  'books.book': BookRoute
}
```

Transitioning to `books.book` is exactly the same. But if you transition to `books`,
both `books` and `index` will be activated.

Note that tansitioning to `books` and `books.index` behaves identically.
