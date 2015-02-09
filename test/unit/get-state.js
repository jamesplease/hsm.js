describe('getState', function() {
  beforeEach(function() {
    this.hsm = new Hsm({
      states: {
        '': {},
        'books': {},
        'books.book': {id: 2}
      }
    });
  });

  describe('when the state exists', function() {
    it('should return the state', function() {
      expect(this.hsm.getState('books.book')).to.deep.equal({id: 2});
    });
  });

  describe('when the state does not exist', function() {
    it('should return undefined', function() {
      expect(this.hsm.getState('sandwiches.are.good')).to.be.undefined;
    });
  });
});
