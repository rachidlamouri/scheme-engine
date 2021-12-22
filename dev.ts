import fs from 'fs';
import glob from 'glob';
import { spawn } from 'child_process';

const debug = (...data: any[]) => {
  if (false) {
    console.log(data);
  }
}

const watchDir = 'src/**/*';

const commands = {
  compile: 'npm.cmd run compile:grammar',
  test: 'npm.cmd test',
} as const;
type CommandName = keyof typeof commands;

/**
 * Manages the command queue
 */
class Runner {
  private isRunning = false;
  private queue: CommandName[] = [];

  addToQueue(commandName: CommandName) {
    debug('ADD_TO_QUEUE', commandName, this.queue);

    if (!this.queue.includes(commandName)) {
      this.queue.push(commandName);
      this.run();
    }
  }

  private run() {
    debug('RUN', this.isRunning, this.queue)

    if (this.isRunning) {
      return;
    }

    const nextCommandName = this.queue[0];
    if (!nextCommandName) {
      return;
    }

    this.isRunning = true;

    const nextCommand = commands[nextCommandName];

    const [command, ...params] = nextCommand.split(' ');
    spawn(command, params, { stdio: 'inherit' })
      .on('exit', () => {
        this.queue.shift();
        this.isRunning = false;
        this.run();
      })
  }
}

const runner = new Runner();

/**
 * Registers commands based on file changes
 */
const watchFiles = (filepaths: string[]) => {
  console.log(`Watching ${filepaths.length} files`);

  filepaths.forEach((filepath) => {
    fs.watch(filepath, () => {
      if (/g4$/.test(filepath)) {
        runner.addToQueue('compile');
      }

      runner.addToQueue('test');
    })
  })
};

const start = () => {
  const filepaths = glob.sync(watchDir).filter((filepath) => !fs.statSync(filepath).isDirectory());
  watchFiles(filepaths);
  runner.addToQueue('compile');
  runner.addToQueue('test');
}

start();
