import fs from "node:fs/promises";

function TableRow(name, isDirectory) {
    this.name = name;
    this.type = isDirectory ? 'directory' : 'file';
}

export async function showDirContent(dirPath) {
    const dirContent = await fs.readdir(dirPath, { withFileTypes: true });

    const [directories, files] = dirContent.reduce((acc, file) => {
        if (file.isDirectory()) {
            acc[0].push(file);
        } else {
            acc[1].push(file);
        }
        return acc;
    }, [[], []]);

    const directoriesRows = directories.map((directory) => new TableRow(directory.name, true));
    const filesRows = files.map((file) => new TableRow(file.name, false));

    console.table(directoriesRows.concat(filesRows));
}

export function greeting(username) {
    console.log(`Welcome to the File Manager, ${username}`);
}

export function showCurrentDirPath(dirPath) {
    console.log(`You are currently in ${dirPath}`);
}

export function goodbye(username) {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}