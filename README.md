[![NPM version](https://badge.fury.io/js/oojs-ui.png)](https://badge.fury.io/js/oojs-ui)
=================

Quick start
----------

Clone the repo, `git clone https://git.wikimedia.org/git/oojs/ui.git`.

Versioning
----------

We use the Semantic Versioning guidelines as much as possible.

Releases will be numbered in the following format:

`<major>.<minor>.<patch>`

For more information on SemVer, please visit http://semver.org/.

Bug tracker
-----------

Found a bug? Please report it in the [issue tracker](https://bugzilla.wikimedia.org/enter_bug.cgi?product=OOjs+UI)!

Release
----------

Release process:

```bash
$ cd path/to/oojs-ui/
$ git remote update
$ git checkout origin/master

# Ensure tests pass
$ npm install && npm test

# Avoid using "npm version patch" because that creates
# both a commit and a tag, and we shouldn't tag until after
# the commit is merged.

# Change the version number
$ edit package.json
$ git add package.json && git commit -m "Tag v%s"
$ git review

# After merging:
$ git remote update
$ git checkout origin/master
$ git tag "v%s"
$ git push --tags
$ npm publish
```
