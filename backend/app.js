const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ipassets/', async (req, res) => {
    try {
        const { id, title, creator, owner, creationDate } = req.body;
        const result = await submitTransaction('CreateIPAsset', id, title, creator, owner, creationDate);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.get('/ipassets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evaluateTransaction('QueryIPAsset', id);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});


app.put('/ipassets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { newOwner } = req.body;
        console.log(`Updating IP Asset with ID: ${id}, New Owner: ${newOwner}`); // Debugging info
        const result = await submitTransaction('TransferIPAsset', id, newOwner);
        console.log(`Transaction result: ${result}`); // Debugging info
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.post('/ipassets/:id/license', async (req, res) => {
    try {
        const { id } = req.params;
        const { licenseHolder, licenseStartDate, licenseEndDate } = req.body;
        const result = await submitTransaction('LicenseIPAsset', id, licenseHolder, licenseStartDate, licenseEndDate);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

async function getContract() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('Admin@privateintellectual.com');
    const gateway = new Gateway();
    const connectionProfile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8'));
    const connectionOptions = { wallet, identity: identity, discovery: { enabled: false, asLocalhost: true } };
    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('intellectualpropertychannel');
    const contract = network.getContract('intellectualmgt');
    return contract;
}

async function submitTransaction(functionName, ...args) {
    const contract = await getContract();
    const result = await contract.submitTransaction(functionName, ...args);
    return result.toString();
}

async function evaluateTransaction(functionName, ...args) {
    const contract = await getContract();
    const result = await contract.evaluateTransaction(functionName, ...args);
    return result.toString();
}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app; // Exporting app
