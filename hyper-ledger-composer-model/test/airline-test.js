'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
chai.should();
//chai.use(require('chai-as-promised'));

const namespace = 'org.airline.airChain';

//Participants
const airlineParticipant = "AirlineEmployee";

//Assets
const airlineCompanyAsset = "AirlineCompany";

//Roles
const ROLE_OFFICER = "OFFICER";
const ROLE_STAFF = "STAFF";

// const assetType = 'SampleAsset';
// const assetNS = namespace + '.' + assetType;
// const participantType = 'SampleParticipant';
// const participantNS = namespace + '.' + participantType;

let adminConnection;

describe("Airline Testing", () => {

    // Name of the business network card containing the administrative identity for the business network
    const adminCardName = 'admin';

    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({ type: 'composer-wallet-inmemory' });

    // Embedded connection used for local testing
    const connectionProfile = {
        name: 'embedded',
        'x-type': 'embedded'
    };

    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    let businessNetworkName;

    // This is the factory for creating instances of types.
    let factory;

    before(async () => {
        //Setup Business Network

        // Generate certificates for use with the embedded connection
        const credentials = CertificateUtil.generate({ commonName: 'admin' });

        // Identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: ['PeerAdmin']
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);
        const deployerCardName = 'PeerAdmin';

        adminConnection = new AdminConnection({ cardStore: cardStore });

        await adminConnection.importCard(deployerCardName, deployerCard);
        await adminConnection.connect(deployerCardName);
    })

    /**
     *
     * @param {String} cardName The card name to use for this identity
     * @param {Object} identity The identity details
     */
    async function importCardForIdentity(cardName, identity) {
        const metadata = {
            userName: identity.userID,
            version: 1,
            enrollmentSecret: identity.userSecret,
            businessNetwork: businessNetworkName
        };
        const card = new IdCard(metadata, connectionProfile);
        await adminConnection.importCard(cardName, card);
    }

    // This is called before each test is executed.
    beforeEach(async () => {
        // Generate a business network definition from the project directory.
        let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        businessNetworkName = businessNetworkDefinition.getName();
        await adminConnection.install(businessNetworkDefinition);
        const startOptions = {
            networkAdmins: [
                {
                    userName: 'admin',
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkName, businessNetworkDefinition.getVersion(), startOptions);
        await adminConnection.importCard(adminCardName, adminCards.get('admin'));

        // Create and establish a business network connection
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        await businessNetworkConnection.connect(adminCardName);

        // Get the factory for the business network.
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();

        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);

        //Create Airline Company
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        // Create the assets.
        const airlineCompany = factory.newResource(namespace, airlineCompanyAsset, 'AirlineCompany');
        airlineCompany.name = "Singapore Airlines";
        //TODO: Fill in other components of Airline Company

        // // Create the participants.
        const airlineOfficer = factory.newResource(namespace, airlineParticipant, 'AirlineOfficer');
        airlineOfficer.role = "OFFICER"
        airlineOfficer.name = "Airline Officer 1";

        //Add Airline Employee to Airline Company
        airlineOfficer.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
        airlineCompany.employees = [];
        airlineCompany.employees.push(
            factory.newRelationship(namespace, airlineParticipant, "AirlineOfficer")
        );

        await participantRegistry.addAll([airlineOfficer]);
        await assetRegistry.addAll([airlineCompany]);

        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${airlineParticipant}#AirlineOfficer`, 'AirlineOfficer');
        await importCardForIdentity("AirlineOfficer", identity);
    });

    /**
     * Reconnect using a different identity.
     * @param {String} cardName The name of the card for the identity to use
     */
    async function useIdentity(cardName) {
        await businessNetworkConnection.disconnect();
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        await businessNetworkConnection.connect(cardName);
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    }

    it("Airline Officer should be in Airline Company", async () => {
        await useIdentity("AirlineOfficer");

        const assetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);
        const airlineCompany = await assetRegistry.get("AirlineCompany");
        const airlineOfficer = await participantRegistry.get("AirlineOfficer");

        expect(airlineCompany.employees.length).be.equal(1);
        let isEmployeeInCompany = airlineCompany.employees.some((employee) => {
            return employee.getFullyQualifiedIdentifier() === airlineOfficer.getFullyQualifiedIdentifier();
        });

        expect(isEmployeeInCompany).to.be.equal(true);
        expect(airlineOfficer.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    })
})