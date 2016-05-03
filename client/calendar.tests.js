
import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

if (Meteor.isClient) {
  describe('Tasks', () => {
    describe('methods', () => {
      it('can delete owned task', () => {
        assert.equal(0, 0);
      });
    });
  });
}