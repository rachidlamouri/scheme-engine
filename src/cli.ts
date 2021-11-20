import fs from 'fs';
import { run } from './run';

const usage = () => {
  process.stdout.write('Usage: npm run scheme -- [-i] [-f] [<filepath>]\n');
  process.stdout.write('  -i: read from stdin\n');
  process.stdout.write('  -f: input is filepath specified by <filepath> or stdin');
  process.exit();
};

const abort = (message: string) => {
  process.stderr.write(message);
  process.exit();
}

const readFile = (filepath: string) => {
  if(!fs.existsSync(filepath)) {
    abort(`"${filepath}" does not exist in cwd "${process.cwd()}"`)
  }

  const code = fs.readFileSync(filepath, 'utf8');
  return code;
}

const args = process.argv.slice(2);
const useStdin = args.includes('-i');
const isInputFilepath = args.includes('-f');
const [filepath] = args.filter((arg) => !['-i', '-f'].includes(arg));

if (args.length === 0 || (!useStdin && isInputFilepath && !filepath)) {
  usage();
}

const onInput = (input: string) => {
  const code = isInputFilepath ? readFile(input) : input;
  const result = run(code);
  process.stdout.write(result);
}

if (useStdin) {
  let input = '';
  process.stdin.on('data', (data) => {
    input += data.toString();
  })
  process.stdin.on('close', () => {
    onInput(input.trim());
  })
} else {
  onInput(filepath);
}
