describe('When creating a new hsm', function() {
  beforeEach(function() {
    this.hsm = new Hsm();
  });

  it('should start in an undefined state', function() {
    expect(this.hsm.currentStateName()).to.be.undefined;
    expect(this.hsm.currentState()).to.be.undefined;
  });
});
