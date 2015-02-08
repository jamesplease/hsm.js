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
Hsm.prototype.getParentStateName = function(stateName) {
  return stateName.substring(0, stateName.lastIndexOf('.'));
};

// What to do when a state is valid. The default is to throw an error
Hsm.prototype.isValidStateName = function(stateName) {
  console.log('wat', stateName, this.getParentStateName(stateName));
  return this.hasState(this.getParentStateName(stateName));
};

Hsm.prototype.validateStateName = function(stateName) {
  if (!this.isValidStateName(stateName)) {
    throw new Error('A parent state must exist to register ' + stateName);
  }
};

// Create a new state
Hsm.prototype.setState = function(stateName, stateDef) {
  if (stateName) {
    this.validateStateName(stateName);
  }
  this._states[stateName] = stateDef;
};

// Get the current state name
Hsm.prototype.currentStateName = function() {
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
  if (this.currentState === newState) { return; }
  if (!this.hasState(newState)) { return; }
  var stop = false;
  var cancel = function() { stop = true; };

  // Determine if we have an index state specified.
  // If so, we will transition to that instead
  var indexState = newState + '.index';
  if (this.hasState(indexState)) {
    newState = indexState;
  }

  var diff = namespaceDiff(this._currentState, newState);
  Promise.resolve(this.willTransition(diff, cancel))
    .then(function() {
      if (stop) { return false; }
      this._currentState = newState;
    });
};

// Whether or not the given state exists
Hsm.prototype.hasState = function(stateName) {
  return !!this._states[stateName];
};

// A hook to write your own transition that can be
// sync or async
Hsm.prototype.transition = function(diff, cancel) {};

export default Hsm;
