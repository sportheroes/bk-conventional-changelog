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
    gitDummyCommit('⏩ [PUB] (release) Published sub-packages');
    gitDummyCommit('Merge pull request #2334 from sportheroes/romain/feature/facebook-email-fallback');
    gitDummyCommit(' ✴️ [FIX] (unitedMonthly) use getHighest date between userClientCreatedAt and exportStartAt');
    gitDummyCommit('⏩ [PUB] (release) 1.87.0');
    gitDummyCommit('Bump marked from 0.3.9 to 0.3.19');
  });

  it('should work if there is no semver tag', (done) => {
    const params = {
      config: preset,
    };

    conventionalChangelogCore(params)
      .on('error', err => done(err))
      .pipe(through(chunk => {
        chunk = chunk.toString();

        // Changelog should include this commits
        expect(chunk).to.include('Add default port AWS');
        expect(chunk).to.include('Sort by members count');
        expect(chunk).to.include('Include filters keys to promote target');
        expect(chunk).to.include('Change createRanking implementation, use count');
        expect(chunk).to.include('Added documentation to parseFilters middleware');
        expect(chunk).to.include('Events collections are now setup per ranking');
        expect(chunk).to.include('KeyStore collections can now be cloned');
        expect(chunk).to.include('Adjusted MemoryRange unit tests');
        expect(chunk).to.include('Published sub-packages');
        expect(chunk).to.include('Merge pull request #2334 from sportheroes/romain/feature/facebook-email-fallback');
        expect(chunk).to.include('use getHighest date between userClientCreatedAt and exportStartAt');
        expect(chunk).to.include('Bump marked from 0.3.9 to 0.3.19');

        // Changelog should NOT INCLUDE this commits
        expect(chunk).to.not.include('1.87.0');

        done();
      }));
  });
});
