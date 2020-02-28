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

// versioning is similar to what NPM does by using `npm version`
// eg. 1.2.3-alpha.0
// `patch` is always called with `parseInt` to handle `-alpha` identifier
if (updateType === 'major') {
  newVersion = `${Number(major) + 1}.${minor}.${parseInt(patch)}`;
} else if (updateType === 'minor') {
  newVersion = `${major}.${Number(minor) + 1}.${parseInt(patch)}`;
} else if (updateType === 'patch') {
  newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
} else {
  newVersion = `${major}.${minor}.${parseInt(patch)}-${devIdentifier}.${prerelease ? Number(prerelease) + 1 : 0}`;
}

newVersion = `${newVersion}---base-${pkg.upstreamVersion}`;

console.log('New version:', newVersion);

// update package.json with `proper` field
fs.writeFileSync('./package.json', JSON.stringify({ ...pkg, version: newVersion }, null, 2));
fs.writeFileSync('./package-lock.json', JSON.stringify({ ...lock, version: newVersion }, null, 2));

const onMaster = 'git checkout master && git pull';
const tag = `git tag -a ${newVersion} -m ${newVersion}`;
const commit = `git add . && git commit -m "Release: ${newVersion}"`;
// use origin HEAD to push to the same branch you're currently on
const push = 'git push origin HEAD --follow-tags';
// this also builds app in prepublishOnly script
const publish = 'npm publish';

// skip tagging and commits for dev
const commands = isProdUpdate ? [onMaster, tag, commit, push, publish] : [publish];

// run all commands with instant output to terminal
execSync(commands.join(' && '), { stdio: [0, 1, 2] });
