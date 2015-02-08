var State = function(stateName, stateDef, hsm, parentState) {
  this._hsm = hsm;
  this._parentState = parentState;
  var root = parentState ? parentState._stateName : '';
  this._stateName = root + '.' + stateName;
};

State.prototype.transitionTo = function(newState) {
  return this._hsm.transitionTo(newState);
};

State.prototype.getState = function(stateName) {
  return this._hsm.getState(stateName);
};

State.prototype.setState = function(stateName, stateDef) {
  Hsm.validateState(stateName);
  this._hsm._states[stateName] = new Hsm.State(stateName, stateDef, this._hsm, this);
};

export default State;
