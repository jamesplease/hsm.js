describe('Hsm.getParentStateName', function() {
  describe('and you are at the root', function() {
    beforeEach(function() {
      this.parentStateName = Hsm.getParentStateName('');
    });

    it('should return undefined', function() {
      expect(this.parentStateName).to.be.undefined;
    });
  });

  describe('and you are one level deep', function() {
    beforeEach(function() {
      this.parentStateName = Hsm.getParentStateName('lala');
    });

    it('should return the root', function() {
      expect(this.parentStateName).to.equal('');
    });
  });

  describe('and you are two levels deep', function() {
    beforeEach(function() {
      this.parentStateName = Hsm.getParentStateName('lala.please');
    });

    it('should return the parent state', function() {
      expect(this.parentStateName).to.equal('lala');
    });
  });

  describe('and you are three levels deep', function() {
    beforeEach(function() {
      this.parentStateName = Hsm.getParentStateName('lala.please.ty');
    });

    it('should return the parent state', function() {
      expect(this.parentStateName).to.equal('lala.please');
    });
  });
});
