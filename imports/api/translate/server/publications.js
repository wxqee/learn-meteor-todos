/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Translates } from '../translate.js';

Meteor.publish('translate', function translate() {
  return Translates.find({}, {
    fields: Translates.publicFields,
  });
});

Meteor.publish('translate.prod', function translateProd() {
  return Translates.find({
    isDraft: false,
  }, {
    fields: Translates.publicFields,
  });
});

Meteor.publish('translate.draft', function translateDraft() {
  return Translates.find({
    isDraft: true,
  }, {
    fields: Translates.publicFields,
  });
});
