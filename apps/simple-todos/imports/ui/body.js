import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
 
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
 	this.state = new ReactiveDict();
 	//This is where we'll store the new checkbox state when its created
 	Meteor.subscribe('tasks');
});


Template.body.helpers({
	tasks() {
		//  https://docs.meteor.com/api/collections.html#Mongo-Collection
	  	const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// If hide completed is checked, filter tasks
			return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}

		// Otherwise, return all of the tasks
		return Tasks.find({}, { sort: { createdAt: -1 } });
	},
	incompleteCount() {
		return Tasks.find({ checked: { $ne: true } }).count();
	},
});

Template.body.events({
	'submit .new-task'(event) { //When new task is entered
		event.preventDefault();
		// Get value from form element
		const target = event.target;
		const text = target.text.value;
		// Insert a task into the collection
		Meteor.call('tasks.insert', text);
		// Clear form
		target.text.value = '';
	},

	'change .hide-completed input'(event, instance) {
  		// When checkbox is changed, update the reactiveDict variable
  		instance.state.set('hideCompleted', event.target.checked);
	},
});