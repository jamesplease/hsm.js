describe('transitionTo', function() {
  beforeEach(function() {
    this.hsm = new Hsm({
      states: {
        '': {},
        'comments': {},
        'books': {},
        'books.index': {},
        'books.book': {id: 2}
      }
    });

    stub(this.hsm, 'transition');
  });

  describe('when not in any state, transitioning to undefined', function() {
    beforeEach(function() {
      this.hsm.transitionTo(undefined);
    });

    it('should not call transition', function() {
      expect(this.hsm.transition).to.not.have.beenCalled;
    });
  });

  describe('when attempting to transition into a nonexistent state', function() {
    beforeEach(function() {
      this.hsm.transitionTo('does.not.exist');
    });

    it('should not call transition', function() {
      expect(this.hsm.transition).to.not.have.beenCalled;
    });
  });

  describe('when transitioning to a state', function() {
    beforeEach(function() {
      this.hsm.transitionTo('books.index');
    });

    it('should call transition', function() {
      expect(this.hsm.transition).to.have.been.calledOnce;
    });

    it('should pass the diff as the first argument', function() {
      expect(this.hsm.transition).to.have.been.calledWith({
        out: undefined,
        in: ['books', 'index']
      });
    });
  });
});
