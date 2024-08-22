# PDF unlocker

Remove passwords from PDFs in group. Just provide a folder path in `constants.inputs.mjs` and even if the files are nested in a lot of folders, it will unlock all of them.

For program to run, create a folder called `Statements` at the root of this project and add your stuff. After the execution, it will create a folder called `Unprotected` which has all the PDFs(only). So, there might be more files in your actual folder (this works and outputs only PDFs), so just copy paste and replace all the files in your folder.

## Prerequisites

qpdf & nodejs must be installed

```sh
    brew install qpdf
    brew install nvm
```
