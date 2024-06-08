const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const qr = require('qrcode');
const config = require('config');
const { log } = require('console');
const { Question } = require('./models/question');

function parse_route_path(fullPath) {
    let pathFile = './';
    let pathUrl = '';

    pathFile += fullPath.replaceAll("\\", "/");

    pathUrl += fullPath.replaceAll("routes", "").replaceAll("\\", "/").replaceAll(".js", "");


    return {pathFile, pathUrl};
}

function get_routes(initPath='', routersPath = [], routesFolderPath='') {
    let folderPath = routesFolderPath;
    if (initPath) {
        let {pathFile, _} = parse_route_path(initPath);
        folderPath = pathFile;
    }

    fs.readdirSync(folderPath).forEach(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            if (initPath) {
                return get_routes(initPath+('\\' + file), routersPath)
            }
            return get_routes(filePath, routersPath)
            // console.log(`${file} is a directory`);
        } else if (stats.isFile()) {
            if (initPath) {
                if (file == 'index.js') {
                    routersPath.push(initPath);
                }
                routersPath.push(initPath + ('\\' + file));
            }
            else {
                routersPath.push(filePath)
            }
        }
    });

    return routersPath;
}

function applyRoutesByFiles(app, routesFolderPath='./routes') {
    const routersPath = get_routes('', [], routesFolderPath);

    for (let i = 0; i < routersPath.length; i++) {
        const { pathFile, pathUrl } = parse_route_path(routersPath[i]);
        const moduleElement = require(pathFile);
        // console.log(typeof moduleElement);
        app.use(pathUrl, moduleElement);
    }
}

function mergeObjects(structure, validateObj, settings={separateRelationObj: false}) {
    const notallowedKeys = ["_id", "__v"]
    let ret = {mainModelFields: {}};
    for (const key in validateObj) {
        if (structure.hasOwnProperty(key) && structure[key] != false && !notallowedKeys.includes(key)) {
            if (structure[key]?.separateRelationObj && typeof validateObj[key] === 'object' && typeof structure[key] === 'object') {
                const modelsFields = mergeObjects(structure[key], validateObj[key]);
                let i = 0;
                for (let localModelKey in modelsFields) {
                    if(i === 0) ret[key + 'Fields'] = modelsFields[localModelKey];
                    else {ret[localModelKey] = modelsFields[localModelKey]}
                    i++
                }
            } else {
                if ( typeof validateObj[key] === 'object' && !validateObj[key]?.instance ) {
                    const {mainModelFields} = mergeObjects(structure[key], validateObj[key]);
                    // return structure[key]
                    ret["mainModelFields"][key] = mainModelFields;
                }
                else {
                    ret["mainModelFields"][key] = validateObj[key];
                }
            }
        }
    }
    if (!settings.separateRelationObj) return ret["mainModelFields"]
    else return ret;
}

async function generateQrCode(url, filename) {
    // qr.toFile('./assets/qr_codes/' + filename, url, (err) => {
    //     if (err) console.log(err);
    //     console.log('QR code generated successfully');
    // });
    // const pic_url = config.get('HOST') + 'qr_codes/' + filename 
    // return pic_url;
    // Generate QR Code as a Data URL
    const qrCodeDataUrl = await qr.toDataURL(url);

    // Convert Data URL to Buffer
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `qr_codes/${filename}`, // Include folder path in the Key
        Body: qrBuffer,
        ContentEncoding: 'base64', // Required for base64
        ContentType: 'image/png',
        ACL: 'public-read', // Make the file publicly readable
    };

    const res = await new Promise((resolve, reject) => {
        global.s3.upload(s3Params, (err, data) => {
            if (err) {
                return resolve(null);
            }
            resolve(data.Location)
            // return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/qr_codes/${this.filename}`;
        });
    }) 
    return res;
    // Upload to S3
}


async function deleteFilesInDirectory(directory, filesToDelete) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        if (typeof filesToDelete === 'string') {
            fs.unlink(path.join(directory, filesToDelete), err => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log(`Deleted ${filesToDelete}`);
            });
        } else {

            for (const file of files) {
                // console.log(file);
                if ( filesToDelete.includes(file) ) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            return;
                        }
                        console.log(`Deleted ${file}`);
                    });
                }
            }
        }
    });
}
  
async function translate(sourceText, from, to) {
    try {
        const sourceLang = from; // Hebrew language code
        const targetLang = to; // Russian language code
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;

        
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Translation request failed');
    }
    const data = await response.json();
    // console.log(data[0][0][0]);
    return data[0][0][0];
    } catch (error) {
        console.error('Error translating:', error);
        return null;
    }
}

async function createQuestion(req) {
    let answers = [
        { value: 1, text: 'גרוע'},
        { value: 2, text: 'חייב שיפור'},
        { value: 3, text: 'ממש טוב'},
        { value: 4, text: 'וואו, אהבתי'}
    ];
    for (let i = 0; i < answers.length; i++) {
        answers[i].textEn = await translate(answers[i].text, 'he', "en");
        // console.log(answers[i].textEn);
        answers[i].textRu = await translate(answers[i].text, 'he', "ru");
        answers[i].textRo = await translate(answers[i].text, 'he', "ro");
    }
    let user = req.user;

    const fields = req.body
    fields.userId = user._id;
    fields.answers = answers;
    
    if (fields?.text) {
        fields.textEn = await translate(fields.text, 'he', "en");
        fields.textRu = await translate(fields.text, 'he', "ru");
        fields.textRo = await translate(fields.text, 'he', "ro");
    }
    
    let question = new Question(fields);
    question = await question.save();
    user.questions.push(question._id);
    user = await user.save();
    return {question, user}
}

async function generateExcel(columns, data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Feedback Report');

    worksheet.columns = columns;

    for (let item of data) {
        worksheet.addRow(item);
    }
    const buffer = workbook.xlsx.writeBuffer();
    return buffer;
}


module.exports = {
    applyRoutesByFiles,
    mergeObjects,
    generateQrCode,
    deleteFilesInDirectory,
    translate,
    createQuestion,
    generateExcel
};