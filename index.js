'use strict';
var CLASSNAME_REGEX =  /\@\@([^(]+)\(([^\)]+)\)/;
var TOKEN_TYPE = 'classname';
var MARKUP = "@@";

function getAttrs(attrs) {
  if(!attrs || attrs.length < 1) { return null; }
  var obj = {};
  for(var ii=0; ii< attrs.length; ii++) {
    var att = attrs[ii];
    if(att && att.length > 1) {
      obj[att[0]] = att[1];
    }
  }

  return obj;
}

function color(state, silent) {

  var token,
      result,
      content,
      max = state.posMax,
      start = state.pos;
  if (state.src.charCodeAt(start) !== 0x40) { return false; }
  // don't run any pairs in validation mode
  if (silent) { return false; } 
  content = state.src.slice(start);
  result = CLASSNAME_REGEX.exec(content);
  if(!result) {
    return false;
  }
  state.posMax = start + result[0].length;
  token         = state.push(TOKEN_TYPE, 'span');
  token.markup  = MARKUP;
  token.attrPush(['classname', result[1]]);
  token.attrPush(['content', result[2]]);
  state.pos = state.posMax;
  state.posMax = max;
  return true;
}

function renderDefault(tokens, idx, _options, env, self) {
    var token = tokens[idx];
    var attrs = getAttrs(token.attrs);
    return `<span classname="${attrs.classname}">${attrs.content}</span>`;
}

module.exports = function plugin(md, name, options) {
  options = options || {};
  md.inline.ruler.after('text', 'span', color);
  md.renderer.rules[TOKEN_TYPE] = options.render || renderDefault;
};
