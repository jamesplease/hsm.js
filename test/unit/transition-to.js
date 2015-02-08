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

  describe('when in an undefined state', function() {
    describe('transitioning to undefined', function() {
      beforeEach(function() {
        this.hsm.transitionTo(undefined);
      });

      it('should not call transition', function() {
        expect(this.hsm.transition).to.not.have.beenCalled;
      });
    });

    describe('attempting to transition into a nonexistent state', function() {
      beforeEach(function() {
        this.hsm.transitionTo('does.not.exist');
      });

      it('should not call transition', function() {
        expect(this.hsm.transition).to.not.have.beenCalled;
      });
    });

    describe('when transitioning to a state', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('books.book')
          .then(done);
      });

      it('should call transition', function() {
        expect(this.hsm.transition).to.have.been.calledOnce;
      });

      it('should pass the diff as the first argument', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          out: undefined,
          in: ['books', 'book']
        });
      });

      it('should be in the new state', function() {
        expect(this.hsm.currentStateName()).to.equal('books.book');
      });
    });
  });
});
