(function($) {

  module('jQuery#tour', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    strictEqual(this.elems.tour(), this.elems, 'should be chainable');
  });

}(jQuery));
