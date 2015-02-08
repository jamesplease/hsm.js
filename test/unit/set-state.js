describe('When setting the root state', function() {
  beforeEach(function() {
    this.hsm = new Hsm();
    this.hsm.setState('', {name:'james'});
  });

  it('should register the state', function() {
    expect(this.hsm.hasState('')).to.be.true;
  });
});

describe('When setting the root state, and then a child state', function() {
  beforeEach(function() {
    this.hsm = new Hsm();
    this.hsm.setState('', {name:'james'});
    this.hsm.setState('hello', {hello:true});
  });

  it('should register both states', function() {
    expect(this.hsm.hasState('')).to.be.true;
    expect(this.hsm.hasState('hello')).to.be.true;
  });
});

describe('When attempting to register a child state before a parent is defined', function() {
  beforeEach(function() {
    this.hsm = new Hsm();
  });

  it('should throw an Error', function() {
    var suite = this;
    expect(function() {
      suite.hsm.setState('hello.friend', {friend: false});
    }).to.throw('A parent state must exist to register hello.friend');
  });
});
