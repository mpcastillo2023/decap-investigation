'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {filterHiddenCategories, sidebarItemsGenerator} = require('./filter-sidebar-categories.cjs');

test('removes a hidden category and its entire subtree', () => {
  const kept = {type: 'doc', id: 'intro'};
  const hidden = {type: 'category', customProps: {showInMenu: false}, items: [kept]};
  assert.deepEqual(filterHiddenCategories([hidden]), []);
});

test('preserves sibling order, item properties, and visible category children', () => {
  const first = {type: 'doc', id: 'first', className: 'featured'};
  const hidden = {type: 'category', customProps: {showInMenu: false}, items: [{type: 'doc', id: 'secret'}]};
  const last = {type: 'category', label: 'Visible', customProps: {showInMenu: true}, items: [{type: 'doc', id: 'last'}]};
  assert.deepEqual(filterHiddenCategories([first, hidden, last]), [first, last]);
});

test('recursively removes hidden nested categories while keeping their siblings', () => {
  const nested = {type: 'category', customProps: {showInMenu: false}, items: [{type: 'doc', id: 'hidden'}]};
  const visibleDoc = {type: 'doc', id: 'visible'};
  const parent = {type: 'category', label: 'Parent', items: [nested, visibleDoc]};
  assert.deepEqual(filterHiddenCategories([parent]), [{...parent, items: [visibleDoc]}]);
});

test('hides a document when its sidebar custom props disable menu visibility', () => {
  const visible = {type: 'doc', id: 'seller'};
  const hidden = {type: 'doc', id: 'intro', customProps: {showInMenu: false}};
  assert.deepEqual(filterHiddenCategories([visible, hidden]), [visible]);
});

test('true and missing flags remain visible', () => {
  const explicitlyVisible = {type: 'category', customProps: {showInMenu: true}, items: []};
  const legacy = {type: 'category', items: []};
  assert.deepEqual(filterHiddenCategories([explicitlyVisible, legacy]), [explicitlyVisible, legacy]);
});

test('configured generator calls the default with its original arguments and filters its output', async () => {
  const args = {item: {dirName: '.'}, docs: [], categoriesMetadata: {}};
  let received;
  const defaultSidebarItemsGenerator = async (value) => {
    received = value;
    return [
      {type: 'category', customProps: {showInMenu: false}, items: [{type: 'doc', id: 'hidden'}]},
      {type: 'doc', id: 'kept'},
    ];
  };
  const defaultArgs = {...args};
  assert.deepEqual(await sidebarItemsGenerator({...args, defaultSidebarItemsGenerator}), [{type: 'doc', id: 'kept'}]);
  assert.deepEqual(received, defaultArgs);
});
