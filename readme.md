# bk-conventional-changelog #

> [conventional-changelog](https://github.com/sportheroes/bk-conventional-changelog) [Sport Heroes Group](https://github.com/orgs/sportheroes) preset

## Recommanded Git Commit Messages

* Use the past tense ("*Added feature*" not "*Add feature*")
* Use the imperative mood ("*Moved cursor to..*" not "*Moves cursor to...*")
* Limit the first line to `72` characters or less
* Reference issues and pull requests liberally

### Acceptable commits ###

* Commit baseline: `%icon% [%type%] (%scope%) %description%`
    * `%icon%`, `[%type%]` and `%description%` are **mandatory**. 
    * `[%type%]` must be wrapped into brackets. Example: `[MOD]`.
    * `(%scope%)` is **optional**; If present, it must be wrapped into parenthesis. Example: `(api)`.

### Types of commits ###

* Consider starting the commit message with an applicable prefix:
    * `✅ [ADD]` when adding new features.
    * `🔄 [MOD]` when modifying code, removing files/code, upgrading dependencies, refactoring.
    * `✴️ [FIX]` when fixing issues or bugs, plugging memory leaks.
    * `🔀 [TEST]` when adding tests.
    * `☑️ [DOC]` when adding/modifying documentation.
    * `⏩ [PUB]` when bumping package version

* Examples of commits:
    * `✅ [ADD] (core) This is a brand new feature`
    * `🔄 [MOD] (core) The new feature is now 10 times more efficient`
    * `✴️ [FIX] (api) No longer writing bad commits`
    * `☑️ [DOC] (npm) Spreading some love`
    * `⏩ [PUB] Version is now 1.0.0`
