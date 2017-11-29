import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { BundleCollection } from '/imports/both/BundleCollection';
import { PersonCollection } from '/imports/both/PersonCollection';

Meteor.startup(() => {
  BundleCollection.remove({});
  PersonCollection.remove({});

  [{
    _id: 'ABC',
    list: [
      { id: 'a', name: 'John' },
      { id: 'b', name: 'Bob' },
      { id: 'c', name: 'Steve' },
    ],
  }].forEach(doc => {
    BundleCollection.insert(doc);
  });

  [
    { _id: 'a', name: 'John', Phone: 123 },
    { _id: 'b', name: 'Bob', Phone: 456 },
    { _id: 'c', name: 'Steve', Phone: 789 },
  ].forEach(doc => {
    PersonCollection.insert(doc);
  });
});

Meteor.publish('bundlePub', function (bid) {
  return BundleCollection.find(bid);
});

Meteor.publish('personPub', function (ids) {
  return PersonCollection.find({ _id: { $in: ids } });
});

Meteor.methods({
  remove(bid, pid) {
    check(bid, String);
    check(pid, String);
    BundleCollection.update({ _id: bid }, { $pull: { list: { id: pid } } });
  },
  add(bid, name) {
    check(bid, String);
    check(name, String);
    if (name !== '') {
      const pid = PersonCollection.insert({ name });
      BundleCollection.update({ _id: bid }, { $push: { list: { id: pid, name } } });
    }
  },
});
