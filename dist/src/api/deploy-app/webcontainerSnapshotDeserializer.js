"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSnapshot = deserializeSnapshot;
const WORK_DIR_NAME = 'project';
const WORK_DIR = `/home/${WORK_DIR_NAME}`;
const regex = new RegExp(`^${WORK_DIR}\/`);
function extractRelativePath(filePath) {
    return filePath.replace(regex, '');
}
function deserializeSnapshot(snapshot) {
    const files = [];
    for (const [filePath, dirent] of Object.entries(snapshot)) {
        if (dirent?.type === 'file' && !dirent.isBinary) {
            const relativePath = extractRelativePath(filePath);
            files.push({
                data: dirent.content,
                file: relativePath,
            });
        }
    }
    return files;
}
//# sourceMappingURL=webcontainerSnapshotDeserializer.js.map