import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import i18n from 'meteor/universe:i18n';
import { Todos } from '../todos/todos.js';

export const Translate = new Mongo.Collection('translate');

// Deny all client-side updates since we will be using methods to manage this collection
Translate.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Translate.schema = new SimpleSchema({
  translateKey: { type: String },
  isDraft: { type: Boolean, defaultValue: true },
  isDeleted: { type: Boolean, defaultValue: false },
});

Translate.attachSchema(Translate.schema);

// This represents the keys from Translate objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Translate.publicFields = {
  translateKey: 1,
  isDraft: 1,
  isDeleted: 1,
};

Factory.define('translate', Translate, {});

Translate.helpers({
  // A list is considered to be private if it has a userId set
  todos() {
    return Todos.find({ listId: this._id }, { sort: { createdAt: -1 } });
  },
});
