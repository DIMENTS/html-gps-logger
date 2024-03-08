const express = require('express');
const fs = require('fs').promises;
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const certbotPath = 'C:/YOUR/CERTIFICATE/PATH/';

console.log('Certificaatpad:', certbotPath);

// HTTP-naar-HTTPS-redirect middleware
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(301, `https://${req.hostname}${req.url}`);
    }
});


// Bestaat privkey.pem controleren
fs.readFile(certbotPath + 'privkey.pem', 'utf-8')
    .then((privkeyContent) => {
        // Bestaat fullchain.pem controleren
        return Promise.all([privkeyContent, fs.readFile(certbotPath + 'fullchain.pem', 'utf-8')]);
    })
    .then(([privkeyContent, fullchainContent]) => {
        const options = {
            key: privkeyContent,
            cert: fullchainContent,
        };

        app.use(bodyParser.json());
        app.use(express.static('public'));

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });

        // Endpoint om locatiegegevens op te slaan
        app.post('/saveLocation', async (req, res) => {
            try {
                const { locationData } = req.body;
                await writeJSONFile('locationData.json', locationData);
                console.log('Locatiegegevens succesvol opgeslagen.');
                res.json({ success: true });
            } catch (error) {
                console.error('Fout bij het verwerken van de locatiegegevens:', error);
                res.status(500).json({ success: false, error: 'Interne serverfout' });
            }
        });

        // Endpoint om locatiegegevens op te halen
        app.get('/getLocation', async (req, res) => {
            try {
                const locationData = await readJSONFile('locationData.json');
                res.json({ locationData });
            } catch (error) {
                console.error('Fout bij het verwerken van locatiegegevens:', error);
                res.status(500).json({ error: 'Interne serverfout' });
            }
        });

        // Endpoint om temperatuurgegevens op te slaan
        app.post('/saveTemperature', async (req, res) => {
            try {
                const { temperatureData } = req.body;
                await writeJSONFile('temperatureData.json', temperatureData);
                console.log('Temperatuurgegevens succesvol opgeslagen.');
                res.json({ success: true });
            } catch (error) {
                console.error('Fout bij het verwerken van de temperatuurgegevens:', error);
                res.status(500).json({ success: false, error: 'Interne serverfout' });
            }
        });

        // Endpoint om temperatuurgegevens op te halen
        app.get('/getTemperature', async (req, res) => {
            try {
                const temperatureData = await readJSONFile('temperatureData.json');
                res.json({ temperatureData });
            } catch (error) {
                console.error('Fout bij het verwerken van temperatuurgegevens:', error);
                res.status(500).json({ error: 'Interne serverfout' });
            }
        });

        // Endpoint om gegevens op te slaan
        app.post('/data', async (req, res) => {
            try {
                const { locationData, temperatureData } = req.body;
                await writeJSONFile('locationData.json', locationData);
                await writeJSONFile('temperatureData.json', temperatureData);
                console.log('Gegevens succesvol opgeslagen.');
                res.json({ success: true });
            } catch (error) {
                console.error('Fout bij het verwerken van de gegevens:', error);
                res.status(500).json({ success: false, error: 'Interne serverfout' });
            }
        });

        // Endpoint om gegevens op te halen
        app.get('/data', async (req, res) => {
            try {
                const locationData = await readJSONFile('locationData.json');
                const temperatureData = await readJSONFile('temperatureData.json');
                res.json({ locationData, temperatureData });
            } catch (error) {
                console.error('Fout bij het verwerken van bestanden:', error);
                res.status(500).json({ error: 'Interne serverfout' });
            }
        });

        async function writeJSONFile(filename, data) {
            try {
                await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
                console.log(`Bestand ${filename} succesvol bijgewerkt.`);
            } catch (error) {
                console.error(`Fout bij het bijwerken van ${filename}:`, error);
                throw error;
            }
        }

        async function readJSONFile(filename) {
            try {
                const content = await fs.readFile(filename, 'utf-8');
                return JSON.parse(content);
            } catch (error) {
                console.error(`Fout bij het lezen/parsen van ${filename}:`, error);
                return null;
            }
        }

        const server = https.createServer(options, app).listen(port, '0.0.0.0');

        server.listen(port, '0.0.0.0', () => {
            console.log(`Server is gestart op *:${port}`);
        });
    })
    .catch((error) => {
        console.error('Fout bij het controleren van bestanden:', error);
    });
