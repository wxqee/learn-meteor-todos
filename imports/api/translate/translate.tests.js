/* eslint-env mocha */

import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';

import { Translate } from './translate.js';
import { draftInsert } from './methods.js';
import '../../../i18n/en.i18n.json';

if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';

  describe('translate', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const translate = Factory.create('translate');
        assert.typeOf(translate, 'object');
      });
    });

    describe('methods', () => {
      let translateId;

      beforeEach(() => {
        // Clear
        Translate.remove({});

        // Create a list and a todo in that list
        translateId = Factory.create('translate')._id;
      });

      describe('rate limiting', () => {
        it('does not allow more than 5 operations rapidly', () => {
          const connection = DDP.connect(Meteor.absoluteUrl());

          _.times(5, () => {
            connection.call(draftInsert.name, { locale: 'en' });
          });

          assert.throws(() => {
            connection.call(draftInsert.name, {});
          }, Meteor.Error, /too-many-requests/);

          connection.disconnect();
        });
      });
    });
  });
}
