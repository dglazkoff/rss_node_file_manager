import zlib from 'node:zlib';
import fs from "node:fs/promises";
import path from "node:path";
import {pipeline} from "node:stream/promises";

export async function compress(sourceFilePath, destinationDirPath) {
    const fileName = path.basename(sourceFilePath);
    const destinationFilePath = path.join(destinationDirPath, `${fileName}.br`);

    const sourceFile = await fs.open(sourceFilePath, 'r');
    const read = sourceFile.createReadStream();

    const destinationFile = await fs.open(destinationFilePath, 'wx');
    const write = destinationFile.createWriteStream();

    const brotli = zlib.createBrotliCompress();

    await pipeline(read, brotli, write);
}

export async function decompress(sourceFilePath, destinationDirPath) {
    const fileName = path.basename(sourceFilePath);
    const destinationFilePath = path.join(destinationDirPath, fileName.replace('.br', ''));

    const sourceFile = await fs.open(sourceFilePath, 'r');
    const read = sourceFile.createReadStream();

    const destinationFile = await fs.open(destinationFilePath, 'wx');
    const write = destinationFile.createWriteStream();

    const brotli = zlib.createBrotliDecompress();

    await pipeline(read, brotli, write);
}