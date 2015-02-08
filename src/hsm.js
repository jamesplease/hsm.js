import namespaceDiff from 'namespace-diff';
import _ from 'underscore';
import State from './state';

var Hsm = function(options) {
  options = options || {};
  this._states = {};
  this._currentState = '';
  var states = options.states;
  for (var stateName in states) {
    if(!states.hasOwnProperty(stateName)){ return; }
    this.setState(stateName, states[stateName]);
  }
};

Hsm.prototype.isValidState = function(stateName) {
  if (/\./.test(stateName)) {
    return stateName.length === 1;
  }
  return true;
};

Hsm.prototype.validateState = function(stateName) {
  if (Hsm.isValidState(stateName)) {
    throw new Error('State names with a period can contain no other characters.');
  }
};

Hsm.prototype.setState = function(stateName, stateDef) {
  this.validateState(stateName);
  this._states[stateName] = new this.State(stateName, stateDef, this);
};

Hsm.prototype.currentState = function() {
  return this._currentState;
};

Hsm.prototype.getState = function(stateName) {
  return this._states[stateName];
};

Hsm.prototype.transitionTo = function(newState) {
  if (this.currentState === newState) { return; }
  if (!this.hasState(newState)) { return; }
  var stop = false;
  var cancel = function() { stop = true; };
  var diff = namespaceDiff(this._currentState, newState);
  Promise.resolve(this.willTransition(diff, cancel))
    .then(function() {
      if (stop) { return false; }
      this._currentState = newState;
    });
};

Hsm.prototype.hasState = function(stateName) {
  return this._states.indexOf(stateName) >= 0;
};

// Write your own transition
Hsm.prototype.willTransition = function(diff, cancel) {};

Hsm.prototype.State = State;

export default Hsm;
