import { exec } from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import path from "path";
import { INPUT_DATA } from './constants.inputs.mjs';

const unprotectedFolderReplace = path => path.replace('Statements', 'Unprotected')

const erroneousPaths = [] // they might be just warnings and the doc may get unlocked but do check the docs in this list
let fileCount = 0

async function removePasswordFromPdf(inputPath, outputPath, password) {
    await fse.ensureFile(outputPath);
    return new Promise((resolve, reject) => {
        const command = `qpdf --password=${password} --decrypt "${inputPath}" "${outputPath}"`;
        exec(command, async (err, stdout, stderr) => {
            if (err) {
                // console.log(`Error Unlocking: ${outputPath}`);
                console.error(stderr);
                erroneousPaths.push(outputPath)
            }
            resolve();
        });
    });
}

async function processPdfFile(protectedFilePath, password) {
    fileCount++
    const unprotectedFilePath = unprotectedFolderReplace(protectedFilePath);
    await removePasswordFromPdf(protectedFilePath, unprotectedFilePath, password)
}

function processStatEntity(dirPath, password) {
    fs.readdir(dirPath, (err, files) => {
        if (err) { console.error(err); throw new Error('Some error happened') }
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, async (err, stats) => {
                if (err) {
                    console.error('Error getting stats for file:', err);
                    throw new Error("-- Stats error");
                }
                if (stats.isDirectory()) {
                    processStatEntity(filePath, password);
                }
                if (file.toLowerCase().endsWith('.pdf')) {
                    await processPdfFile(filePath, password);
                }
            })
        }
    })
}

async function init() {
    for (const statEntity of INPUT_DATA) {
        processStatEntity(statEntity.path, statEntity.password)
    }
    setTimeout(() => {
        console.log('File Count: ', fileCount)
        console.log('Failed File Count: ', erroneousPaths.length)
        console.log('Failed paths:', erroneousPaths.toSorted())
    }, 5000)
}

init()