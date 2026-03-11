const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
const uriLine = lines.find(line => line.startsWith('MONGODB_URI='));
if (uriLine) {
    console.log(uriLine.replace(/:([^:@]+)@/, ':***@'));
} else {
    console.log('No MONGODB_URI found');
}
