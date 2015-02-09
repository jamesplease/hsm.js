describe('When creating a new hsm', function() {
  describe('and not passing any options', function() {
    beforeEach(function() {
      this.hsm = new Hsm();
    });

    it('should start in an undefined state', function() {
      expect(this.hsm.currentStateName()).to.be.undefined;
      expect(this.hsm.currentState()).to.be.undefined;
    });
  });

  describe('and passing in states', function() {
    beforeEach(function() {
      this.hsm = new Hsm({
        states: {
          '': {},
          'books': {},
          'books.book': {}
        }
      });
    });

    it('should register each of those states', function() {
      expect(this.hsm.hasState('')).to.be.true;
      expect(this.hsm.hasState('books')).to.be.true;
      expect(this.hsm.hasState('books.book')).to.be.true;
    });
  });
});
