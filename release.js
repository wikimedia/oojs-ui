const execSync = require('child_process').execSync;
const fs = require('fs');

const rawPkg = fs.readFileSync('./package.json');
const rawLock = fs.readFileSync('./package-lock.json');
const pkg = JSON.parse(rawPkg);
const lock = JSON.parse(rawLock);

// take the `0.0.1` from `0.0.1---base-0.35.1`
const oldBaseVersion = pkg.version.split('---')[0];
// take the specific parts from `0.0.1-dev.0`
const [major, minor, patch, prerelease] = oldBaseVersion.split('.');
// get the update type from `npm run release <update-type>
const updateType = process.argv[2];
// get the identifier from `npm run release <update-type> <dev-identifier>
const devIdentifier = process.argv[3] || 'dev';
const isProdUpdate = ['major', 'minor', 'patch'].includes(updateType);
let newVersion = '';

if (updateType === 'major') {
  newVersion = `${Number(major) + 1}.${minor}.${patch}.${prerelease}`;
} else if (updateType === 'minor') {
  newVersion = `${major}.${Number(minor) + 1}.${patch}.${prerelease}`;
} else if (updateType === 'patch') {
  newVersion = `${major}.${minor}.${Number(patch) + 1}.${prerelease}`;
} else {
  newVersion = `${major}.${minor}.${patch}-${devIdentifier}.${prerelease ? Number(prerelease) + 1 : 0}`;
}

newVersion = `${newVersion}---base-${pkg.upstreamVersion}`;

console.log('New version:', newVersion);

// update package.json with `proper` field
fs.writeFileSync('./package.json', JSON.stringify({ ...pkg, version: newVersion }, null, 2));
fs.writeFileSync('./package-lock.json', JSON.stringify({ ...lock, version: newVersion }, null, 2));

const onMaster = 'git checkout master && git pull';
const build = 'npm run publish-build';
const tag = `git tag -a ${newVersion} -m ${newVersion}`;
const commit = `git add . && git commit -m "Release: ${newVersion}"`;
// use origin HEAD to push to the same branch you're currently on
const push = 'git push origin HEAD --follow-tags';
const publish = 'npm publish';

const commands = isProdUpdate
  ? [onMaster, build, tag, commit, push, publish]
  : [build, tag, commit, push, publish];

// run all commands with instant output to terminal
execSync(commands.join(' && '), { stdio: [0, 1, 2] });

