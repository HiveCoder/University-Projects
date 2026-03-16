const express = require('express');
const router = express.Router();
const APIService = require('../api');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const { spawn } = require('child_process');
const { handleFileUpload } = require('../api');
const path = require('path');
const fs = require('fs');
const os = require('os');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const PYTHON_EXECUTABLE = 'python'; // Uses system default Python
const EXTRACT_SCRIPT = path.join(SCRIPTS_DIR, 'extract_text.py');

const upload = multer({ dest: UPLOADS_DIR });

router.use('/uploads', express.static(UPLOADS_DIR));

router.get('/', (req, res) => {
    res.render('index', { title: 'sadsda' });
});

router.get('/goals', async (req, res) => {
    try {
        const rawGoals = await APIService.getGoals(true);
        const transformedGoals = APIService.transformGoalData(rawGoals);
        res.render('goals', { title: 'SDG Goals', goals: transformedGoals, rawGoals });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Failed to fetch SDG Goals' });
    }
});

// router.get('/upload', (req, res) => {
//     res.render('upload');
// });

router.get('/analyze', (req, res) => {
    res.render('analyze', { predictions: null, error: null, uploadedFile: null });
});

// Replace the annotate portion of your routes.js with this code
// The rest of the file remains the same

router.post('/analyze', upload.single('reportFile'), async (req, res) => {
    const uploadedFile = req.file ? req.file.filename : null;

    if (!req.file) {
        return res.render('analyze', { predictions: null, error: 'Please upload a file to analyze.', uploadedFile });
    }

    const filePath = path.resolve(req.file.path);
    console.log(`Executing: ${PYTHON_EXECUTABLE} ${EXTRACT_SCRIPT} ${filePath}`);

    try {
        // Extract text using a promise-based approach
        const extractedText = await new Promise((resolve, reject) => {
            const pythonProcess = spawn(PYTHON_EXECUTABLE, [EXTRACT_SCRIPT, filePath], { stdio: 'pipe', shell: true });
            let text = '';
            
            pythonProcess.stdout.on('data', (data) => { text += data.toString(); });
            pythonProcess.stderr.on('data', (data) => { 
                console.error(`Python Script Error: ${data.toString()}`); 
            });
            
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error('Error extracting text from file.'));
                } else {
                    resolve(text);
                }
            });
        });
        
        // Analyze the text
        const response = await axios.post('http://127.0.0.1:5000/predict', { text: extractedText });
        
        // Skip annotation for now - just return the predictions
        res.render('analyze', {
            predictions: response.data.predictions,
            error: null,
            uploadedFile: uploadedFile  // Use the original file for now
        });
        
    } catch (error) {
        console.error('Error processing file:', error);
        res.render('analyze', { 
            predictions: null, 
            error: 'Failed to analyze document: ' + error.message, 
            uploadedFile 
        });
    }
});



router.get('/view-pdf/:filename', (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf'); // Ensure correct MIME type
        res.setHeader('Content-Disposition', 'inline'); // Forces browser to display instead of downloading
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

router.get('/download-pdf/:filename', (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + req.params.filename + '"');
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});


router.get('/results', (req, res) => {
    res.render('results');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.join(UPLOADS_DIR, req.file.filename);
        await handleFileUpload(filePath);
        fs.unlinkSync(filePath);
        res.send('File uploaded and prediction processed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file.');
    }
});

module.exports = router;
