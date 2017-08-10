'use strict';

const Q = require('q');
const readFile = Q.denodeify(require('fs').readFile);
const resolve = require('path').resolve;

const fullNames = {
  ADD: '✅ Features',
  DOC: '☑️ Documentation',
  FIX: '✴️ Bug Fixes',
  MOD: '🔄 Notable changes',
  PUB: '⏩ Versioning',
  TEST: '🔀 Testing',
};

const beautifyType = commit => {
  const type = commit.type;
  const name = (fullNames[type]) ? fullNames[type] : fullNames.MOD;

  commit.type = name;
};

const beautifyScope = commit => {
  const scopeText = (commit.scope) ? commit.scope : '(miscellaneous)';
  const scopeOnly = scopeText.slice(1, -1);

  commit.scope = scopeOnly.charAt(0).toUpperCase() + scopeOnly.slice(1);
};

const beatifyDescription = commit => {
  commit.shortDesc = commit.shortDesc.substring(0, 72);
};

function presetOpts(cb) {
  const parserOpts = {
    headerPattern: /^([\uD800-\uDBFF]|[\u2702-\u27B0]|[\uF680-\uF6C0]|[\u24C2-\uF251])*(.*){1}\[(.*)\]\s(\(.*\))?\s(.*)$/,
    headerCorrespondence: [
      'emoji',
      'space',
      'type',
      'scope',
      'shortDesc'
    ]
  };

  const writerOpts = {
    transform: function(commit) {
      if (!commit.type || typeof commit.type !== 'string') {
        return;
      }
      
      beautifyType(commit);
      beautifyScope(commit);
      beatifyDescription(commit);

      if (typeof commit.hash === 'string') {
        console.log('---> commit.hash');
        console.log(commit.hash);
        commit.hash = commit.hash.substring(0, 7);
      }

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'shortDesc']
  };

  Q.all([
    readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8')
  ])
    .spread(function(template, header, commit) {
      writerOpts.mainTemplate = template;
      writerOpts.headerPartial = header;
      writerOpts.commitPartial = commit;

      cb(null, {
        parserOpts: parserOpts,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
