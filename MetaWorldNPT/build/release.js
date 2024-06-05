import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const version = process.argv[2];
if (!version) {
    console.error('No version specified, aborting');
    process.exit(1);
}

console.log(`Releasing version ${version}`);

let changelog = readFileSync('CHANGELOG.md', {encoding: 'utf8'});
changelog = changelog.replace('### Upcoming\n', `### Upcoming\n\n### ${version}\n`);
let packageJson = JSON.parse(readFileSync('package.json', {encoding: 'utf8'}))
packageJson.version = version;
writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
writeFileSync('CHANGELOG.md', changelog);
execSync(`npm publish . --access public`);


console.log('Released!');
