import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Translate } from './translate.js';

export const draftInsert = new ValidatedMethod({
  name: 'translate.draft.insert',
  validate: new SimpleSchema({
    translateKey: {
      type: String
    },
  }).validator(),
  run({ translateKey }) {
    return Translate.insert({translateKey}, null);
  },
});

// Get list of all method names on Translate
const LISTS_METHODS = _.pluck([
  draftInsert,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(LISTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
