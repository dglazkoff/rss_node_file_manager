export const parseArgs = () => {
    const args = process.argv.slice(2);
    const result = {};

    for (const argument of args) {
        const keyValue = argument.split('=');
        const key = keyValue[0].replace('--', '').trim();

        if (key) {
            result[key] = keyValue[1];
        }
    }

    return result;
};

export const parseCommandArgs = (commandArgs) => {
    const parsedCommandArgs = [];

    for (let i = 0; i < commandArgs.length; i++) {
        if (commandArgs[i].startsWith('"')) {
            let j = i;
            while (!commandArgs[j].endsWith('"')) {
                j++;
            }
            parsedCommandArgs.push(commandArgs.slice(i, j + 1).join(' ').slice(1, -1));
            i = j;
        } else {
            parsedCommandArgs.push(commandArgs[i]);
        }
    }

    return parsedCommandArgs;
}