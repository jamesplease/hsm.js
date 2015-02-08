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

### What does this library do?

This library provides the scaffolding to represent a system like the above.

### What doesn't this library do?

This library is intentionally unopinionated about two things:

1. What a state is
2. What happens when you transition between states

The point is that you can use this library to define more opinionated states
and the mechanism of transitions to solve problems.

### API

