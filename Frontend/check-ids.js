import { readFileSync } from 'fs';

const content = readFileSync('C:\\Users\\ACER\\Desktop\\projects\\airlines-project\\airlines-office\\airlines-offices\\Frontend\\src\\components\\constdata.js', 'utf8');
const lines = content.split('\n');
const idLines = lines.filter(line => line.includes('id:'));

console.log('Found IDs:');
idLines.forEach(line => console.log(line.trim()));