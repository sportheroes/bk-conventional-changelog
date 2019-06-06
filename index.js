'use strict';

const {CHANGELOG: {GITHUB_USERNAMES = {}} = {}} = require('config');
const Q = require('q');
const readFile = Q.denodeify(require('fs').readFile);
const resolve = require('path').resolve;

const legacyMergeRegex = /Merge pull request #[0-9]+ from .*/ig;
const securityFixRegex = /Bump .* from .* to .*/i;
const semverRegex = /^[\d.]+.?-?(.*)?$/ig;
const fullNames = {
  ADD: '✅ Features',
  DOC: '☑️ Documentation',
  FIX: '✴️ Bug Fixes',
  MOD: '🔄 Notable changes',
  PUB: '⏩ Versioning',
  TEST: '🔀 Testing',
  BUMP: '⏩ Bump version',
  DEFAULT: 'Unclassified (not [following convention](https://github.com/sportheroes/bk-conventional-changelog#types-of-commits))',
};

const beautifyDescription = commit => {
  if (commit.shortDesc) {
    commit.shortDesc = commit.shortDesc.trim();
  }
};

const beautifyType = commit => {
  const description = commit.shortDesc || commit.header;
  let type = (commit.type) ? commit.type.trim() : 'DEFAULT';

  if (type === 'DEFAULT') {

    if (description.match(legacyMergeRegex)) {
      type = 'PUB';

      if (!commit.scope) {
        commit.scope = 'Release';
      }
    } else if (description.match(securityFixRegex)) {
      type = 'BUMP';
      commit.scope = 'Security';
    }
  }

  commit.type = (fullNames[type]) ? fullNames[type] : fullNames.MOD;
};

const beautifyScope = commit => {
  const scopeText = (commit.scope) ? commit.scope.trim() : 'Miscellaneous';
  commit.scope = scopeText.charAt(0).toUpperCase() + scopeText.slice(1);
};

const beautifyHash = commit => {
  if (typeof commit.hash === 'string') {
    commit.hash = commit.hash.substring(0, 7);
  }
};

const setUsername = commit => {
  if (typeof commit.committerEmail === 'string') {
    if (GITHUB_USERNAMES[commit.committerEmail]) {
      commit.username = GITHUB_USERNAMES[commit.committerEmail];
    }
  }
};

const process = commit => {
  const pub = 'PUB';
  const isReleaseCommit = (commit.type === fullNames[pub] && commit.scope === 'Release');

  // Discard release commit that aren't merges or lerna publish
  if (isReleaseCommit && commit.shortDesc && commit.shortDesc.match(semverRegex)) {
    return;
  }

  return commit;
};

function presetOpts(cb) {
  const parserOpts = {
    headerPattern: /^(?:\s|\t)*([\uD800-\uDBFF]|[\u2702-\u27B0]|[\uF680-\uF6C0]|[\u23C2-\uF251])+.+?\[([A-Z]{3,4})\]\s(?:\((.*?)\))?\s?(.*)$/,
    headerCorrespondence: [
      'emoji',
      'type',
      'scope',
      'shortDesc'
    ]
  };

  const writerOpts = {
    transform: function(commit) {
      beautifyDescription(commit);
      beautifyType(commit);
      beautifyScope(commit);
      beautifyHash(commit);
      setUsername(commit);

      return process(commit);
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

presetOpts.commitFormat = '%B' + // body
  '%n-hash-%n%H' +               // short hash
  '%n-gitTags-%n%d' +            // tags
  '%n-committerDate-%n%ci' +     // Committer date
  '%n-committerName-%n%aN' +     // Committer name (author)
  '%n-committerEmail-%n%aE' +    // Committer email (author)
  '%n-mergerName-%n%cN' +        // Merger name (committer)
  '%n-mergerEmail-%n%cE';        // Merger email (committer)

module.exports = presetOpts;
