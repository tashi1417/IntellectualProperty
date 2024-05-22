# IntellectualProperty

In this Assignment 2, we are writing chaincode for Hyperledger Fabric, we’ll embark on a journey through the entire process of developing smart contracts, from setting up my environment to deploying and testing my code. I’ll learn how to write chaincode scripts that define asset structures and transaction functions, compile my code to prepare it for deployment, and then package and install it on the network’s peer nodes. Finally, I’ll test my chaincode to ensure it operates correctly, managing ledger state and transactions as intended. 
We will develop a digital wallet application using Node.js that interfaces with the IntelllectualPropertyConsortium’s Hyperledger Fabric network. The wallet will enable transactions and interactions with the student contract chaincode on the blockchain. We’ll set up our Node.js environment, connect to the Hyperledger network, and create functions to manage chaincode operations using our wallet as the authentication mechanism. Additionally, we’ll use Express.js to build a backend capable of handling external requests for the chaincode. This report will cover the entire process from initial setup to final deployment, ensuring we have a robust and secure wallet application ready for use.


# Chain code Explanation
The contract defines a SmartContract struct that provides various functions for interacting with the ledger, including initializing the ledger with predefined IP assets, creating new IP assets, querying existing IP assets, transferring ownership of IP assets, and adding licensing agreements to IP assets. Each IP asset is represented by the IPAsset struct, which includes fields such as ID, title, creator, owner, creation date, license holder, and licensing dates. The main function creates and starts the chaincode by instantiating the SmartContract struct and registering it with the Fabric network.

1.	Imports and Struct Definitions:
  •	Imports essential packages: encoding/json for JSON operations, fmt for formatting strings, and github.com/hyperledger/fabric-contract-api-go/contractapi for Fabric contract API.
  •	Defines the SmartContract struct embedding contractapi.Contract.
  •	Defines the IPAsset struct with fields for ID, title, creator, owner, creation date, license holder, and licensing dates.

2.	InitLedger Function:
  •	Initializes the ledger with a base set of IP assets.
  •	Prepares two IP assets with hardcoded details.
  •	Converts each IP asset to JSON and stores it in the ledger using ctx.GetStub().PutState.

3.	CreateIPAsset Function:
  •	Issues a new IP asset to the ledger with given details.
  •	Constructs an IPAsset struct with the provided parameters.
  •	Converts the IP asset to JSON and stores it in the ledger.


4.	QueryIPAsset Function:
  •	Returns the IP asset stored in the ledger with the given ID.
  •	Reads the asset's JSON data from the ledger using ctx.GetStub().GetState.
  •	Unmarshals the JSON data into an IPAsset struct and returns it.

5.	TransferIPAsset Function:
  •	Updates the owner of the IP asset with the given ID.
  •	Queries the existing IP asset using QueryIPAsset.
  •	Modifies the owner field and updates the ledger with the new JSON data.

6.	LicenseIPAsset Function:
  •	Adds a licensing agreement to the IP asset with the given ID.
  •	Queries the existing IP asset using QueryIPAsset.
  •	Updates the licensing fields and stores the updated asset in the ledger.

7.	Main Function:
  •	Creates a new chaincode instance from the SmartContract struct.
  •	Starts the chaincode, registering it with the Fabric network.



# Compiling and Packaging chain codes.
we are going to compile and package each of the peers that have joined the intellectualproperty channel.  

1.	Set the environment variable.
   . tool-bins/set_creators_env.sh 

3.	Packaging the chain code
   peer lifecycle chaincode package $CC_PACKAGE_FILE -p $CC_PATH --label $CC_LABEL

5.	Install the chain code
   peer lifecycle chaincode install $CC_PACKAGE_FILE

7.	Approve the chaincode
   peer lifecycle chaincode approveformyorg -n intellectualmgt -v 1.0 -C intellectualpropertychannel --sequence 1 --package-id $CC_PACKAGE_ID

9.	Commit the chain code
     peer lifecycle chaincode commit -n intellectualmgt -v 1.0 -C intellectualpropertychannel --sequence 1

11.	Verify the committed chain code
    peer lifecycle chaincode querycommitted -n intellectualmgt -C intellectualpropertychannel




# Testing the chaincode on terminal
1.  peer chaincode invoke -o orderer.intellectualproperty.com:7050 -C intellectualpropertychannel -n ip_chaincode -c '{"function":"CreateIPAsset","Args":["1", "My First Book", "Author A",     "Author A", "2023-01-01"]}'
2.  peer chaincode query -C intellectualpropertychannel -n ip_chaincode -c '{"function":"QueryIPAsset","Args":["1"]}'
3. peer chaincode invoke -o orderer.intellectualproperty.com:7050 -C intellectualpropertychannel -n ip_chaincode -c '{"function":"TransferIPAsset","Args":["1", "Publisher X"]}'
4. peer chaincode invoke -o orderer.intellectualproperty.com:7050 -C intellectualpropertychannel -n ip_chaincode -c '{"function":"LicenseIPAsset","Args":["1", "Licensee A", "2024-01-01",       "2024-12-31"]}'

# Creating the wallet
  Inside the wallet folder we will create the wallet.js to store the user credentials.
  we also create the connectin.json to connect the client application and blockchain network.

 # wallet.js
1.	Modules and constants:
    •	fs and path: Modules for file system operations and handling file paths.
    •	Wallets: A class from fabric-network used to manage file system wallets.
    •	CRYPTO_CONFIG: Path to the crypto configuration directory.
    •	CRYPTO_CONFIG_PEER_ORGS: Path to the peer organizations directory within the crypto configuration.
    •	WALLET_FOLDER: Directory where the wallet files are stored.
    •	wallet: Variable to hold the wallet instance

3.	main () function:
  • main: The main function that determines which action to perform based on command-line arguments.
  • action: Determines the action to perform (list, add, export).
  • process.argv: Array containing command-line arguments.
  • wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER): Creates a new file system wallet at the specified folder.
  • Conditionals: Based on the action, calls appropriate functions (	listIdentities, addToWallet, exportIdentity).

4.	addToWallet function:
  •	addToWallet(org, user): Adds a new identity to the wallet.
  •	readCertCryptogen: Reads the certificate for the user.
  •	readPrivateKeyCryptogen: Reads the private key for the user.
  •	createMSPId(org): Creates the MSP ID based on the organization.
  •	createIdentityLabel(org, user): Creates a unique label for the identity.
  •	wallet.put(identityLabel, identity): Adds the identity to the wallet.

5.	listIdentities function:
  •	listIdentities: Lists all identities stored in the wallet.
  •	wallet.list(): Retrieves all identities in the wallet.

6.	Exportidentity function:  
  •	exportIdentity(org, user): Exports the specified identity from the wallet.
  •	wallet.export(label): Retrieves the identity based on the label.

 # connection.json

  This JSON configuration file defines the network settings for a Hyperledger Fabric network called "IntellectualPropertyConsortium." It includes details about channels, organizations, orderers, and peers. Let's break down each section of the file:
1.	Network Metadata:
  a.	The name of the network
  b.	The version of this configuration

2.	Channels:
  a.	intellectualpropertychannel: This section defines the channel named "intellectualpropertychannel".
  b.	orderers: Lists the orderer node(s) associated with this channel. Here, it's orderer.intellectualproperty.com.
  c.	peers: Lists the peer nodes that are part of this channel.
    i.	creators.interintellectual.com
    ii.	publishers.interintellectual.com
    iii.	regulatoryauthorities.privateintellectual.com

3.	Organization:
  a.	InterIntellectual: Defines an organization named "InterIntellectual".
  b.	mspid: The Membership Service Provider ID (MSP ID) for the organization.
  c.	peers: Lists the peer nodes that belong to this organization.
    i.	creators.interintellectual.com
    ii.	publishers.interintellectual.com

4.	Orderer:
  a.	orderer.intellectualproperty.com: Defines the orderer node.
  b.	url: The gRPC URL to access the orderer node.
  c.	grpcOptions: Additional gRPC options for communication with the orderer node.
    i.	ssl-target-name-override: Used for overriding the SSL target name, helpful in environments with TLS enabled.

5.	Peers:
  •	creators.interintellectual.com: The gRPC URL for the peer node.
  •	publishers.interintellectual.com: The gRPC URL for the peer node.
  •	regulatoryauthorities.privateintellectual.com: The gRPC URL for the peer node.


# Creating a test file

Explanation
The script begins by loading the network configuration from a JSON file and creating a wallet to manage identities. It then checks if the identity for the user Admin@privateintellectual.com is present in the wallet. If the identity is not found, it prints a message and exits. If the identity exists, the script connects to the Hyperledger Fabric network gateway using this identity and the connection profile. Once connected, it accesses the intellectualpropertychannel channel and the intellectualmgt smart contract. The script performs several transactions, including creating a new IP asset, querying the asset, transferring ownership, licensing the asset, and querying the asset again to verify the updates. After performing these operations, the script disconnects from the gateway.

1.	Imports and Utility Function:
  •	Imports Gateway and Wallets from the fabric-network package.
  •	Imports fs and path modules for file and path operations.
  •	Defines a utility function prettyJSONString to format JSON strings for better readability.

2.	Load Network Configuration:
  •	Loads the network configuration from connection.json using fs.readFileSync.

3.	Create Wallet:
  •	Creates a new file system wallet to manage identities, stored in the wallet directory.

4.	Check User Identity:
  •	Checks if the identity Admin@privateintellectual.com exists in the wallet.
  •	If the identity does not exist, logs a message and exits.


5.	Connect to Gateway:
  •	Creates a new Gateway instance.
  •	Connects to the gateway using the loaded network configuration and the identity from the wallet.
  •	Logs a message confirming connection to the gateway.

6.	Access Network and Contract:
  •	Gets the network (channel) intellectualpropertychannel.
  •	Gets the smart contract intellectualmgt from the network.

7.	Perform Transactions:
  •	Create IP Asset:
    o	Submits the CreateIPAsset transaction to create a new IP asset with specified attributes.
    o	Logs the result of the transaction.
  •	Query IP Asset:
    o	Evaluates the QueryIPAsset transaction to retrieve the IP asset details by ID.
    o	Logs the result formatted as a pretty JSON string.
  •	Transfer IP Asset Ownership:
    o	Submits the TransferIPAsset transaction to update the owner of the IP asset.
    o	Logs the result of the transaction.
  •	Query Updated IP Asset:
    o	Evaluates the QueryIPAsset transaction to retrieve the updated IP asset details.
    o	Logs the result formatted as a pretty JSON string.
  •	License IP Asset:
    o	Submits the LicenseIPAsset transaction to add a licensing agreement to the IP asset.
    o	Logs the result of the transaction.
  •	Query Licensed IP Asset:
    o	Evaluates the QueryIPAsset transaction to retrieve the licensed IP asset details.
    o	Logs the result formatted as a pretty JSON string.

8.	Disconnect from Gateway:
  •	Disconnects from the gateway after completing all operations to free up resources.






## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/enterpriseblockchain/intellectualproperty.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/enterpriseblockchain/intellectualproperty/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
