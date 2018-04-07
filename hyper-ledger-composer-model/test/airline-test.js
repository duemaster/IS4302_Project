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
const ghaParticipant = "GHAEmployee";
const cargoParticipant = "CargoEmployee";

//Assets
const airlineCompanyAsset = "AirlineCompany";
const airlineAircraftAsset = "Aircraft";
const airlineFlightAsset = "Flight";

const ghaCompanyAsset = "GHACompany";
const ghaServiceAsset = "Service";


//Roles
const ROLE_OFFICER = "OFFICER";
const ROLE_STAFF = "STAFF";

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

    before(async() => {
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
    beforeEach(async() => {
        // Generate a business network definition from the project directory.
        let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        businessNetworkName = businessNetworkDefinition.getName();
        await adminConnection.install(businessNetworkDefinition);
        const startOptions = {
            networkAdmins: [{
                userName: 'admin',
                enrollmentSecret: 'adminpw'
            }]
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
        airlineOfficer.role = ROLE_OFFICER;
        airlineOfficer.name = "Airline Officer 1";

        const airlineStaff = factory.newResource(namespace, airlineParticipant, 'AirlineStaff');
        airlineStaff.role = ROLE_STAFF;
        airlineStaff.name = "Airline Staff 1";

        //Add Airline Employee to Airline Company
        airlineOfficer.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
        airlineStaff.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
        airlineCompany.employees = [];
        airlineCompany.employees.push(
            factory.newRelationship(namespace, airlineParticipant, "AirlineOfficer")
        );
        airlineCompany.employees.push(
            factory.newRelationship(namespace, airlineParticipant, "AirlineStaff")
        );

        await participantRegistry.addAll([airlineOfficer, airlineStaff]);
        await assetRegistry.addAll([airlineCompany]);

        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${airlineParticipant}#AirlineOfficer`, 'AirlineOfficer');
        await importCardForIdentity("AirlineOfficer", identity);

        await setUpGHACompany();
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

    async function setUpGHACompany() {
        //Add Company
        const ghaAssetCompanyRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaCompanyAsset}`);
        const ghaCompany = factory.newResource(namespace, ghaCompanyAsset, "GHACompany1");
        ghaCompany.name = "GHA1"

        await ghaAssetCompanyRegistry.addAll([ghaCompany]);


        //Add Employee
        const ghaParticipantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${ghaParticipant}`);
        const ghaOfficer = factory.newResource(namespace, ghaParticipant, "GHAOfficer");
        ghaOfficer.role = ROLE_OFFICER;
        ghaOfficer.name = "GHA Officer 1";
        ghaOfficer.company = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");

        const ghaStaff = factory.newResource(namespace, ghaParticipant, "GHAStaff");
        ghaStaff.role = ROLE_STAFF;
        ghaStaff.name = "GHA Staff 1";
        ghaStaff.company = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");

        await ghaParticipantRegistry.addAll([ghaOfficer, ghaStaff]);


        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${ghaParticipant}#${ghaOfficer.$identifier}`, "GHAOfficer");
        await importCardForIdentity("GHAOfficer", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${ghaParticipant}#${ghaStaff.$identifier}`, "GHAStaff");
        await importCardForIdentity("GHAStaff", identity);
    }

    it("Airline Officer should be in Airline Company", async() => {
        await useIdentity("AirlineOfficer");

        const assetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);
        const airlineCompany = await assetRegistry.get("AirlineCompany");
        const airlineOfficer = await participantRegistry.get("AirlineOfficer");

        expect(airlineOfficer.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);

        expect(airlineCompany.employees.length).be.above(0);
        let isEmployeeInCompany = airlineCompany.employees.some((employee) => {
            return employee.getFullyQualifiedIdentifier() === airlineOfficer.getFullyQualifiedIdentifier();
        });

        expect(isEmployeeInCompany).to.be.equal(true);
        expect(airlineOfficer.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    })

    it("Airline Officer should be able to add Aircraft to company", async() => {
        await useIdentity("AirlineOfficer");

        //Create new aircraft
        let newAircraft = factory.newResource(namespace, airlineAircraftAsset, "SQ123");
        newAircraft.model = "A380";
        newAircraft.passengerCapacity = 10;
        newAircraft.cargoCapacity = 20;
        newAircraft.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
        const aircraftAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineAircraftAsset}`);
        await aircraftAssetRegistry.addAll([newAircraft]);

        //Submit Add Aircraft Transaction
        let companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);

        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraftToCompany");
        addAircraftTransaction.aircraft = factory.newRelationship(namespace, airlineAircraftAsset, "SQ123");
        addAircraftTransaction.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        let airlineCompany = await companyAssetRegistry.get("AirlineCompany");

        expect(airlineCompany.aircrafts.length).to.be.above(0);

        let hasAircraft = airlineCompany.aircrafts.some((aircraft) => {
            return aircraft.getFullyQualifiedIdentifier() === newAircraft.getFullyQualifiedIdentifier();
        })

        expect(hasAircraft).to.be.equal(true);
    });

    // it("Airline Officer should be able to add Flight to company", async() => {
    //     await useIdentity("AirlineOfficer");

    //     //Create new Flight
    //     let newFlight = factory.newResource(namespace, airlineFlightAsset, "Flight1");
    //     newFlight.origin = "Singapore";
    //     newFlight.destination = "China";
    //     newFlight.flightNumber = "AZ123";
    //     newFlight.departureTime = new Date().toLocaleDateString();
    //     newFlight.paxCount = 123;
    //     newFlight.status = "SCHEDULED";

    //     //Create New Aircraft
    //     let newAircraft = factory.newResource(namespace, airlineAircraftAsset, "SQ123");
    //     newAircraft.model = "A380";
    //     newAircraft.passengerCapacity = 10;
    //     newAircraft.cargoCapacity = 20;
    //     newAircraft.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany");
    //     const aircraftAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineAircraftAsset}`);
    //     await aircraftAssetRegistry.addAll([newAircraft]);


    //     let airlineCompany = await companyAssetRegistry.get("AirlineCompany");

    //     expect(airlineCompany.aircrafts.length).to.be.above(0);

    //     let hasAircraft = airlineCompany.aircrafts.some((aircraft) => {
    //         return aircraft.getFullyQualifiedIdentifier() === newAircraft.getFullyQualifiedIdentifier();
    //     })

    //     expect(hasAircraft).to.be.equal(true);
    // });

    it("GHA Officer should be able to create Service", async() => {
        await useIdentity("GHAOfficer");

        //Add Service
        const serviceAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaServiceAsset}`);
        let newService = factory.newResource(namespace, ghaServiceAsset, "Service1");
        newService.description = "Test Service";
        newService.type = "FOOD";
        newService.status = "PENDING";
        newService.company = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        await serviceAssetRegistry.addAll([newService]);

        //Check for service
        newService = await serviceAssetRegistry.get("Service1");
        expect(newService).not.be.equal(null);

        //Submit Add Service to Company Transaction
        let transaction = factory.newTransaction(namespace, "AddServiceToCompany");
        transaction.company = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        transaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service1");
        await businessNetworkConnection.submitTransaction(transaction);

        //Check if company has service
        const ghaCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaCompanyAsset}`);
        const ghaCompany = await ghaCompanyAssetRegistry.get("GHACompany1");
        let hasService = ghaCompany.services.some((service) => {
            return service.getFullyQualifiedIdentifier() == newService.getFullyQualifiedIdentifier();
        })

        expect(hasService).to.be.equal(true);
    })
})