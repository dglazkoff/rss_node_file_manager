import os from 'node:os'

export function osInfo(args) {
    const argument = args[0].replace('--', '');

    switch (argument) {
        case 'EOL': {
            return JSON.stringify(os.EOL);
        }
        case 'homedir': {
            return os.homedir();
        }
        case 'cpus': {
            const cpus = os.cpus().map(cpu => ({ model: cpu.model, speed: cpu.speed / 1000 }));
            return {
                amount: cpus.length,
                cpus
            }
        }
        case 'username': {
            return os.userInfo().username;
        }
        case 'architecture': {
            return os.arch();
        }
        default:
            throw new Error('Unknown argument');
    }
}