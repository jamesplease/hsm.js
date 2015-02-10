describe('transitionTo', function() {
  beforeEach(function() {
    this.hsm = new Hsm({
      states: {
        '': {},
        'comments': {},
        'comments.comment': {},
        'comments.comment.author': {},
        'books': {},
        'books.index': {},
        'books.book': {id: 2},
        'books.book.comments': {}
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
        this.hsm.transitionTo('comments.comment')
          .then(done);
      });

      it('should call transition', function() {
        expect(this.hsm.transition).to.have.been.calledOnce;
      });

      it('should pass the diff as the first argument', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: [],
          inStates: ['comments', 'comments.comment']
        });
      });

      it('should be in the new state', function() {
        expect(this.hsm.currentStateName()).to.equal('comments.comment');
      });
    });

    describe('when canceling the transition', function() {
      beforeEach(function(done) {
        this.hsm.transition = function(diff, cancel) {
          cancel();
        };

        this.hsm.transitionTo('books.book')
          .then(function() {
            done();
          });
      });

      it('should not be in the new state', function() {
        expect(this.hsm.currentStateName()).to.be.undefined;
      });
    });
  });

  describe('when in some state', function() {
    beforeEach(function(done) {
      this.hsm.transitionTo('comments.comment')
        .then(done);
    });

    describe('transitioning to a child state', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('comments.comment.author')
          .then(done);
      });

      it('should call transition with the correct diff', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: [],
          inStates: ['comments.comment.author']
        });
      });
    });

    describe('transitioning to a parent state', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('comments')
          .then(done);
      });

      it('should call transition with the correct diff', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: ['comments.comment'],
          inStates: []
        });
      });
    });

    describe('transitioning to a completely separate branch', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('books.book')
          .then(done);
      });

      it('should call transition with the correct diff', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: ['comments.comment', 'comments'],
          inStates: ['books', 'books.book']
        });
      });
    });

    describe('transitioning to a state with an index defined', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('books')
          .then(done);
      });

      it('should call transition with the correct diff', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: ['comments.comment', 'comments'],
          inStates: ['books', 'books.index']
        });
      });
    });

    describe('transitioning directly to the index state', function() {
      beforeEach(function(done) {
        this.hsm.transitionTo('books')
          .then(done);
      });

      it('should call transition with the same diff', function() {
        expect(this.hsm.transition).to.have.been.calledWith({
          outStates: ['comments.comment', 'comments'],
          inStates: ['books', 'books.index']
        });
      });
    });
  });
});
