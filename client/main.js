import { Template } from 'meteor/templating';
import { PersonCollection } from '/imports/both/PersonCollection';
import { BundleCollection } from '/imports/both/BundleCollection';

Template.bundle.onCreated(function () {
  const bPub = this.subscribe('bundlePub', 'ABC');
  this.autorun(() => {
    if (bPub.ready()) {
      // Build id list
      // ids = array of id from bundle list
      const ids = BundleCollection.findOne({ _id: 'ABC'}).list.map(doc => doc.id);
      console.log(ids);
      this.subscribe('personPub', ids);
    }
  });
});

Template.bundle.helpers({
  list() {
    return PersonCollection.find();
  },
});

Template.bundle.events({
  'click button.add'(e, t) {
    e.preventDefault();
    Meteor.call('add', 'ABC', t.$('input').val());
    t.$('input').val('');
  },
});

Template.entry.events({
  'click button.remove'(e, t) {
    e.preventDefault();
    Meteor.call('remove', 'ABC', e.currentTarget.id);
  },
});