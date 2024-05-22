const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '.', 'connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('Admin@privateintellectual.com');
    if (!identity) {
        console.log(`An identity for the user "Admin@privateintellectual.com" does not exist in the wallet`);
        return;
    }

    // Create a new gateway instance for interacting with the fabric network.
    const gateway = new Gateway();
    try {
        // Connect to the gateway using the identity from wallet and the connection profile.
        await gateway.connect(ccp, { wallet, identity: identity, discovery: { enabled: false, asLocalhost: false } });

        // Now connected to the gateway.
        console.log('Connected to the gateway.');

        // Get the network (channel) and contract.
        const network = await gateway.getNetwork('intellectualpropertychannel');
        const contract = network.getContract('intellectualmgt');

        // CREATE IP ASSET
        console.log('\n--> Submit Transaction: CreateIPAsset, creates new IP asset');
        await contract.submitTransaction('CreateIPAsset', '2', 'My Third Painting', 'Artist C', 'Artist C', '2024-01-01');
        console.log('*** Result: committed');

        // QUERY IP ASSET
        console.log('\n--> Evaluate Transaction: QueryIPAsset, function returns the IP asset with the given ID');
        let result = await contract.evaluateTransaction('QueryIPAsset', '2');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);

        // TRANSFER IP ASSET OWNERSHIP
        console.log('\n--> Submit Transaction: TransferIPAsset, updates the owner of the IP asset with the given ID');
        await contract.submitTransaction('TransferIPAsset', '2', 'Gallery Z');
        console.log('*** Result: committed');

        // QUERY UPDATED IP ASSET
        console.log('\n--> Evaluate Transaction: QueryIPAsset, function returns the updated IP asset with the given ID');
        result = await contract.evaluateTransaction('QueryIPAsset', '2');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);

        // LICENSE IP ASSET
        console.log('\n--> Submit Transaction: LicenseIPAsset, adds a licensing agreement to the IP asset with the given ID');
        await contract.submitTransaction('LicenseIPAsset', '2', 'Licensee C', '2024-03-01', '2024-12-31');
        console.log('*** Result: committed');

        // QUERY LICENSED IP ASSET
        console.log('\n--> Evaluate Transaction: QueryIPAsset, function returns the licensed IP asset with the given ID');
        result = await contract.evaluateTransaction('QueryIPAsset', '2');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    } finally {
        // Disconnect from the gateway when you're done.
        gateway.disconnect();
    }
}

main().catch(console.error);
