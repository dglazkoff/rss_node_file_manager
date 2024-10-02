import * as readline from 'node:readline/promises';
import { homedir } from 'node:os'
import {parseArgs, parseCommandArgs} from "./parseArgs.js";
import path from "node:path";
import * as filesUtils from './utils/files.js';
import * as outputUtils from './utils/output.js';
import * as osUtils from './utils/os.js';
import * as hashUtils from './utils/hash.js';
import * as brotliUtils from './utils/brotli.js';
import {goodbye, greeting, showCurrentDirPath} from "./utils/output.js";
import fs from "node:fs/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const args = parseArgs();
let currentDir = homedir();

const resolvePath = (pathToResolve) => {
    return path.resolve(currentDir, pathToResolve);
}

class InvalidInputError extends Error {
    constructor() {
        super('Invalid input');
    }
}

async function executeCommand(command, commandArgs) {
    switch (command) {
        case 'cd': {
            const newPath = path.resolve(currentDir, commandArgs[0]);
            await fs.access(newPath);
            currentDir = newPath;
            break;
        }
        case 'up': {
            currentDir = path.resolve(currentDir, '..');
            break;
        }
        case 'add': {
            await filesUtils.add(resolvePath(commandArgs[0]))
            break;
        }
        case 'rn':
            const [oldName, newName] = commandArgs;
            await filesUtils.rename(resolvePath(oldName), resolvePath(newName));
            break;
        case 'rm': {
            await filesUtils.remove(resolvePath(commandArgs[0]));
            break;
        }
        case 'cp': {
            const [sourceFilePath, destinationDirPath] = commandArgs;
            await filesUtils.copy(resolvePath(sourceFilePath), resolvePath(destinationDirPath));

            break;
        }
        case 'cat': {
            await filesUtils.read(resolvePath(commandArgs[0]));
            console.log('\n');
            break;
        }
        case 'mv': {
            const [sourceFilePath, destinationDirPath] = commandArgs;
            await filesUtils.move(resolvePath(sourceFilePath), resolvePath(destinationDirPath));

            break;
        }
        case 'ls': {
            await outputUtils.showDirContent(currentDir);
            break;
        }
        case 'os': {
            const result = osUtils.osInfo(commandArgs);
            console.log(result);
            break;
        }
        case 'hash': {
            const result = await hashUtils.fileHash(resolvePath(commandArgs[0]));
            console.log(result);
            break;
        }
        case 'compress': {
            const [sourceFilePath, destinationDirPath] = commandArgs;
            await brotliUtils.compress(resolvePath(sourceFilePath), resolvePath(destinationDirPath));

            break;
        }
        case 'decompress': {
            const [sourceFilePath, destinationDirPath] = commandArgs;
            await brotliUtils.decompress(resolvePath(sourceFilePath), resolvePath(destinationDirPath));

            break;
        }
        case '.exit': {
            rl.close();
            break;
        }

        default:
            throw new InvalidInputError();
    }
}

function validateCommandArgs(command, commandArgs) {
    let isValid = true;

    switch (command) {
        case 'up':
        case '.exit':
        case 'ls': {
            if (commandArgs.length !== 0) {
                isValid = false;
            }

            break;
        }
        case 'cd':
        case 'add':
        case 'rm':
        case 'cat':
        case 'hash': {
            if (commandArgs.length !== 1) {
                isValid = false;
            }
            break;
        }

        case 'rn':
        case 'cp':
        case 'mv':
        case 'decompress':
        case 'compress': {
            if (commandArgs.length !== 2) {
                isValid = false;
            }
            break;
        }
        case 'os': {
            if (commandArgs.length !== 1 || !commandArgs[0].startsWith('--')) {
                isValid = false;
            }
            break;
        }
    }

    if (!isValid) {
        throw new InvalidInputError();
    }
}

greeting(args.username);
showCurrentDirPath(currentDir);

rl.prompt();

rl.on('line', async (line) => {
    const [command, ...commandArgs] = line.trim().split(' ');

    const parsedCommandArgs = parseCommandArgs(commandArgs);

    try {
        validateCommandArgs(command, parsedCommandArgs);
        await executeCommand(command, parsedCommandArgs);
    } catch (err) {
        if (err instanceof InvalidInputError) {
            console.log(err.message);
        } else {
            console.log('Operation failed');
        }
    }

    showCurrentDirPath(currentDir);
    rl.prompt();
}).on('close', () => {
    goodbye(args.username);
    process.exit(0);
});