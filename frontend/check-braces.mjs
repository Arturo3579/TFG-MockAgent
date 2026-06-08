import fs from 'fs';
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
content = content.replace(/'[^']*'/g, "''");
content = content.replace(/"[^"]*"/g, '""');
content = content.replace(/`[^`]*`/g, '``');

let balance = 0;
let line = 1;
let lastOpenLine = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') {
    balance++;
    lastOpenLine = line;
  }
  if (content[i] === '}') {
    balance--;
    if (balance < 0) {
      console.log('Negative balance at line', line);
      break;
    }
  }
  if (content[i] === '\n') line++;
}
console.log('Final balance:', balance);
console.log('Last open brace at line:', lastOpenLine);
