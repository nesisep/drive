const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to NES Drive API')
})

const driveDir = __dirname;

const fs = require('fs');
const path = require('path');

app.get('/api/drive/:drivePath', async(req, res) => {
    var folderPath = driveDir;

    if(req.params.drivePath.includes('-')){
        const datas = req.params.drivePath.split('-');
        for(const data of datas){
            folderPath = path.join(folderPath,data);
        }
    }else {
        folderPath = path.join(folderPath,req.params.drivePath);
    }

    try {
        if(fs.lstatSync(folderPath).isDirectory()){
            fs.readdir(folderPath, (err, files) => {
                res.json(files);
            });
        }else {
            res.download(folderPath);
        }
    }catch (err) {
        res.json({ message: err });
    }
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))