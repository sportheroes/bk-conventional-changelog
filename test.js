'use strict';

const conventionalChangelogCore = require('conventional-changelog-core');
const preset = require('./');
const expect = require('chai').expect;
const gitDummyCommit = require('git-dummy-commit');
const shell = require('shelljs');
const through = require('through2');

describe('SportHeroesGroup backend preset', () => {
  before(() => {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    gitDummyCommit('Add default port AWS');
    gitDummyCommit('✅ [ADD] Sort by members count');
    gitDummyCommit('✴️ [FIX] (services) Include filters keys to promote target');
    gitDummyCommit('🔄 [MOD] (controllers) Change createRanking implementation, use count');
    gitDummyCommit('☑️ [DOC] (api) Added documentation to parseFilters middleware');
    gitDummyCommit('🔄 [MOD] (services) Events collections are now setup per ranking');
    gitDummyCommit('✅ [ADD] (services) KeyStore collections can now be cloned');
    gitDummyCommit('🔀 [TEST] (services) Adjusted MemoryRange unit tests');
  });

  it('should work if there is no semver tag', (done) => {
    const params = {
      config: preset,
    };

    conventionalChangelogCore(params)
      .on('error', err => done(err))
      .pipe(through(chunk => {
        chunk = chunk.toString();

        expect(chunk).to.include('Add default port AWS');
        expect(chunk).to.include('Sort by members count');
        expect(chunk).to.include('Include filters keys to promote target');
        expect(chunk).to.include('Change createRanking implementation, use count');
        expect(chunk).to.include('Added documentation to parseFilters middleware');
        expect(chunk).to.include('Events collections are now setup per ranking');
        expect(chunk).to.include('KeyStore collections can now be cloned');
        expect(chunk).to.include('Adjusted MemoryRange unit tests');

        done();
      }));
  });
});
