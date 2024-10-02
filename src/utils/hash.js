import {createHash} from "node:crypto";
import fs from "node:fs/promises";

export async function fileHash(filePath) {
    const hash = createHash('sha256');

    const file = await fs.open(filePath, 'r');
    const input = file.createReadStream();

    return new Promise((resolve, reject) => {
        input.on('data', (data) => {
            hash.update(data);
        });
        input.on('end', () => {
            resolve(hash.digest('hex'));
        });
        input.on('error', reject);
    });
}