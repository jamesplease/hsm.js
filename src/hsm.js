import namespaceDiff from 'namespace-diff';

var Hsm = function(options = {}) {
  this._states = {};

  // Add states passed in as options
  var states = options.states;
  for (var stateName in states) {
    if(!states.hasOwnProperty(stateName)){ return; }
    this.setState(stateName, states[stateName]);
  }
};

// Get a parent state name from a child state name
Hsm.getParentStateName = function(stateName) {
  if (!stateName) { return undefined; }
  return stateName.substring(0, stateName.lastIndexOf('.'));
};

// Create a new state
Hsm.prototype.setState = function(stateName, stateDef) {
  if (stateName) {
    this._validateStateName(stateName);
  }
  this._states[stateName] = stateDef;
};

// Get the current state name
Hsm.prototype.currentStateName = function() {
  console.log('returning', this._currentStateName);
  return this._currentStateName;
};

// Get the current state
Hsm.prototype.currentState = function() {
  return this._states[this._currentStateName];
};

// Get a state by its name
Hsm.prototype.getState = function(stateName) {
  return this._states[stateName];
};

// Transition to a new state
Hsm.prototype.transitionTo = function(newState) {
  if (this.currentState() === newState) { return; }
  if (!this.hasState(newState)) { return; }
  var stop = false;
  var cancel = function() { stop = true; };

  // Determine if we have an index state specified.
  // If so, we will transition to that instead
  var indexState = newState + '.index';
  if (this.hasState(indexState)) {
    newState = indexState;
  }

  var diff;
  if (!this.currentState()) {
    diff = {out: undefined, in: newState.split('.')};
  } else {
    diff = namespaceDiff(this._currentState, newState);
  }

  var hsm = this;
  return Promise.resolve(this.transition(diff, cancel))
    .then(function() {
      if (stop) { return false; }
      hsm._currentStateName = newState;
    });
};

// Whether or not the given state exists
Hsm.prototype.hasState = function(stateName) {
  return !!this._states[stateName];
};

// A hook to write your own transition that can be
// sync or async
Hsm.prototype.transition = function(diff, cancel) {};

Hsm.prototype._validateStateName = function(stateName) {
  if (!this._isValidStateName(stateName)) {
    throw new Error('A parent state must exist to register ' + stateName);
  }
};

Hsm.prototype._isValidStateName = function(stateName) {
  return this.hasState(Hsm.getParentStateName(stateName));
};

export default Hsm;
