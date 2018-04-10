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

const cargoCompanyAsset = "CargoCompany";
const cargoCargoAsset = "Cargo";
const cargoRequestAsset = "CargoRequest";

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

        await setUpAirlineCompany();
        await setUpGHACompany();
        await setUpCargoCompany();
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

    async function setUpAirlineCompany() {
        //Add Company
        const airlineAssetCompanyRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        const airlineCompany = factory.newResource(namespace, airlineCompanyAsset, "AirlineCompany1");
        airlineCompany.name = "Airline1"

        await airlineAssetCompanyRegistry.addAll([airlineCompany]);


        //Add Employee
        const airlineParticipantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);
        const airlineOfficer = factory.newResource(namespace, airlineParticipant, "AirlineOfficer");
        airlineOfficer.role = ROLE_OFFICER;
        airlineOfficer.name = "Airline Officer 1";
        airlineOfficer.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany1");

        const airlineStaff = factory.newResource(namespace, airlineParticipant, "AirlineStaff");
        airlineStaff.role = ROLE_STAFF;
        airlineStaff.name = "Airline Staff 1";
        airlineStaff.company = factory.newRelationship(namespace, airlineCompanyAsset, "AirlineCompany1");

        await airlineParticipantRegistry.addAll([airlineOfficer, airlineStaff]);


        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${airlineParticipant}#${airlineOfficer.$identifier}`, "AirlineOfficer");
        await importCardForIdentity("AirlineOfficer", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${airlineParticipant}#${airlineStaff.$identifier}`, "AirlineStaff");
        await importCardForIdentity("AirlineStaff", identity);
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

        ghaCompany.employees = [
            factory.newRelationship(namespace, ghaParticipant, "GHAOfficer"),
            factory.newRelationship(namespace, ghaParticipant, "GHAStaff")
        ];

        ghaAssetCompanyRegistry.update(ghaCompany);


        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${ghaParticipant}#${ghaOfficer.$identifier}`, "GHAOfficer");
        await importCardForIdentity("GHAOfficer", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${ghaParticipant}#${ghaStaff.$identifier}`, "GHAStaff");
        await importCardForIdentity("GHAStaff", identity);
    }

    async function setUpCargoCompany() {
        //Add Company
        const cargoAssetCompanyRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCompanyAsset}`);
        const cargoCompany = factory.newResource(namespace, cargoCompanyAsset, "CargoCompany1");
        cargoCompany.name = "Cargo1";

        const cargoCompany2 = factory.newResource(namespace, cargoCompanyAsset, "CargoCompany2");
        cargoCompany2.name = "Cargo2";

        await cargoAssetCompanyRegistry.addAll([cargoCompany, cargoCompany2]);


        //Add Employee
        const cargoParticipantRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${cargoParticipant}`);
        const cargoOfficer = factory.newResource(namespace, cargoParticipant, "CargoOfficer");
        cargoOfficer.role = ROLE_OFFICER;
        cargoOfficer.name = "Cargo Officer 1";
        cargoOfficer.company = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany1");

        const cargoStaff = factory.newResource(namespace, cargoParticipant, "CargoStaff");
        cargoStaff.role = ROLE_STAFF;
        cargoStaff.name = "Cargo Staff 1";
        cargoStaff.company = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany1");

        const cargoOfficer2 = factory.newResource(namespace, cargoParticipant, "CargoOfficer2");
        cargoOfficer2.role = ROLE_OFFICER;
        cargoOfficer2.name = "Cargo Officer 2";
        cargoOfficer2.company = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany2");

        const cargoStaff2 = factory.newResource(namespace, cargoParticipant, "CargoStaff2");
        cargoStaff2.role = ROLE_STAFF;
        cargoStaff2.name = "Cargo Staff 2";
        cargoStaff2.company = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany2");

        await cargoParticipantRegistry.addAll([cargoOfficer, cargoStaff, cargoOfficer2, cargoStaff2]);

        cargoCompany.employees = [
            factory.newRelationship(namespace, cargoParticipant, "CargoOfficer"),
            factory.newRelationship(namespace, cargoParticipant, "CargoStaff")
        ];

        cargoCompany2.employees = [
            factory.newRelationship(namespace, cargoParticipant, "CargoOfficer2"),
            factory.newRelationship(namespace, cargoParticipant, "CargoStaff2")
        ];

        await cargoAssetCompanyRegistry.updateAll([cargoCompany, cargoCompany2]);


        // Issue the identities.
        let identity = await businessNetworkConnection.issueIdentity(`${namespace}.${cargoParticipant}#${cargoOfficer.$identifier}`, "CargoOfficer");
        await importCardForIdentity("CargoOfficer", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${cargoParticipant}#${cargoStaff.$identifier}`, "CargoStaff");
        await importCardForIdentity("CargoStaff", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${cargoParticipant}#${cargoStaff.$identifier}`, "CargoOfficer2");
        await importCardForIdentity("CargoOfficer2", identity);

        identity = await businessNetworkConnection.issueIdentity(`${namespace}.${cargoParticipant}#${cargoStaff.$identifier}`, "CargoStaff2");
        await importCardForIdentity("CargoStaff2", identity);
    }

    it("Allow Airline Officer create Airline Employee", async () => {
        await useIdentity("AirlineOfficer");

        //Create Officer
        let addEmployeeTransaction = factory.newTransaction(namespace, "AddAirlineEmployee");
        addEmployeeTransaction.id = "AirlineOfficer3";
        addEmployeeTransaction.role = ROLE_OFFICER;
        addEmployeeTransaction.name = "Test Officer";
        await businessNetworkConnection.submitTransaction(addEmployeeTransaction);

        //Create Staff
        addEmployeeTransaction = factory.newTransaction(namespace, "AddAirlineEmployee");
        addEmployeeTransaction.id = "AirlineStaff3";
        addEmployeeTransaction.role = ROLE_STAFF;
        addEmployeeTransaction.name = "Test Staff";
        await businessNetworkConnection.submitTransaction(addEmployeeTransaction);

        //Retrieve Employee
        const employeeAssetRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);
        let newOfficer = await employeeAssetRegistry.get("AirlineOfficer3");
        let newStaff = await employeeAssetRegistry.get("AirlineStaff3");

        //Retrieve Company
        const companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        let newCompany = await companyAssetRegistry.get();

        expect(newCompany.employees.length).to.be.above(2);

        let isOfficerInCompany = newCompany.employees.some((employee) => {
            employee.getFullyQualifiedIdentifier() === newOfficer.getFullyQualifiedIdentifier();
        });

        let isStaffInCompany = newCompany.employees.some((employee) => {
            employee.getFullyQualifiedIdentifier() === newStaff.getFullyQualifiedIdentifier();
        });

        //expect(isOfficerInCompany).to.be.equal(true);
        //expect(isStaffInCompany).to.be.equal(true);

        expect(newOfficer.company.getFullyQualifiedIdentifier() == newCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
        expect(newStaff.company.getFullyQualifiedIdentifier() == newCompany.getFullyQualifiedIdentifier()).to.be.equal(true);

    });

    // it("Allow GHA Officer to creat GHA Employee", async () => {
    //     await useIdentity("AirlineOfficer");

    //     //Submit Add Aircraft Transaction
    //     let companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
    //     const aircraftAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineAircraftAsset}`)

    //     const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
    //     addAircraftTransaction.id = "SQ123";
    //     addAircraftTransaction.model = "QWE";
    //     addAircraftTransaction.passengerCapacity = 12;
    //     addAircraftTransaction.cargoCapacity = 12.2;
    //     await businessNetworkConnection.submitTransaction(addAircraftTransaction);

    //     let airlineCompany = await companyAssetRegistry.get("AirlineCompany1");
    //     let newAircraft = await aircraftAssetRegistry.get("SQ123");

    //     let hasAircraft = airlineCompany.aircrafts.some((aircraft) => {
    //         return aircraft.getFullyQualifiedIdentifier() === newAircraft.getFullyQualifiedIdentifier();
    //     })

    //     expect(hasAircraft).to.be.equal(true);
    //     expect(newAircraft.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    // });

    // it("Allow Cargo Officer to create Cargo Employee", async () => {
    //     await useIdentity("AirlineOfficer");

    //     //Submit Add Aircraft Transaction
    //     let companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
    //     const aircraftAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineAircraftAsset}`)

    //     const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
    //     addAircraftTransaction.id = "SQ123";
    //     addAircraftTransaction.model = "QWE";
    //     addAircraftTransaction.passengerCapacity = 12;
    //     addAircraftTransaction.cargoCapacity = 12.2;
    //     await businessNetworkConnection.submitTransaction(addAircraftTransaction);

    //     let airlineCompany = await companyAssetRegistry.get("AirlineCompany1");
    //     let newAircraft = await aircraftAssetRegistry.get("SQ123");

    //     let hasAircraft = airlineCompany.aircrafts.some((aircraft) => {
    //         return aircraft.getFullyQualifiedIdentifier() === newAircraft.getFullyQualifiedIdentifier();
    //     })

    //     expect(hasAircraft).to.be.equal(true);
    //     expect(newAircraft.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    // });

    it("Airline Officer should be able to add Aircraft to company", async () => {
        await useIdentity("AirlineOfficer");

        //Submit Add Aircraft Transaction
        let companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        const aircraftAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineAircraftAsset}`)

        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        let airlineCompany = await companyAssetRegistry.get("AirlineCompany1");
        let newAircraft = await aircraftAssetRegistry.get("SQ123");

        let hasAircraft = airlineCompany.aircrafts.some((aircraft) => {
            return aircraft.getFullyQualifiedIdentifier() === newAircraft.getFullyQualifiedIdentifier();
        })

        expect(hasAircraft).to.be.equal(true);
        expect(newAircraft.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    });

    it("Airline Officer should be able to add Flight to company", async () => {
        await useIdentity("AirlineOfficer");

        //Add New Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create new Flight
        const addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        //Fetch Flight Asset
        let flightAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineFlightAsset}`);
        let newFlight = await flightAssetRegistry.get("Flight1");

        let companyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        let airlineCompany = await companyAssetRegistry.get("AirlineCompany1");

        expect(airlineCompany.flights.length).to.be.above(0);

        let hasFlight = airlineCompany.flights.some((flight) => {
            return flight.getFullyQualifiedIdentifier() === newFlight.getFullyQualifiedIdentifier();
        });

        expect(hasFlight).to.be.equal(true);
        expect(newFlight.company.getFullyQualifiedIdentifier() === airlineCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    });

    it("GHA Officer should be able to create Service", async () => {
        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        const addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);


        await useIdentity("GHAOfficer");
        //Add Service
        const serviceAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaServiceAsset}`);

        let addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service1";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "FOOD";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        //Check for service
        let newService = await serviceAssetRegistry.get("Service1");

        //Check if company has service
        const ghaCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaCompanyAsset}`);
        const ghaCompany = await ghaCompanyAssetRegistry.get("GHACompany1");
        let hasService = ghaCompany.services.some((service) => {
            return service.getFullyQualifiedIdentifier() == newService.getFullyQualifiedIdentifier();
        })

        expect(hasService).to.be.equal(true);
        expect(newService.company.getFullyQualifiedIdentifier() === ghaCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    })

    it("Cargo Officer should be able to create Cargo", async () => {
        await useIdentity("CargoOfficer");

        //Add Cargo
        const addCargoTransaction = factory.newTransaction(namespace, "AddCargo");
        addCargoTransaction.id = "Cargo1";
        addCargoTransaction.description = "Test Description";
        addCargoTransaction.weight = 12.012;
        await businessNetworkConnection.submitTransaction(addCargoTransaction);

        //Check for cargo
        const cargoAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCargoAsset}`);
        let newCargo = await cargoAssetRegistry.get("Cargo1");

        //Check if company has cargo
        const cargoCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCompanyAsset}`);
        const cargoCompany = await cargoCompanyAssetRegistry.get("CargoCompany1");
        let hasCargo = cargoCompany.cargos.some((cargo) => {
            return cargo.getFullyQualifiedIdentifier() == newCargo.getFullyQualifiedIdentifier();
        })

        expect(hasCargo).to.be.equal(true);
        expect(newCargo.company.getFullyQualifiedIdentifier() === cargoCompany.getFullyQualifiedIdentifier()).to.be.equal(true);
    })

    it("Cargo Officer can attach cargo to flight repeatly", async () => {
        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        let addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight2";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        //Fetch Airline Company and add authorised cargo company
        const airlineCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        let airlineCompany = await airlineCompanyAssetRegistry.get("AirlineCompany1");
        airlineCompany.authorisedCargoCompany = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany1");
        await airlineCompanyAssetRegistry.update(airlineCompany);

        await useIdentity("CargoOfficer");

        //Add Cargo
        const addCargoTransaction = factory.newTransaction(namespace, "AddCargo");
        addCargoTransaction.id = "Cargo1";
        addCargoTransaction.description = "Test Description";
        addCargoTransaction.weight = 12.012;
        await businessNetworkConnection.submitTransaction(addCargoTransaction);

        //Attach Cargo to first Flight
        let attachCargoToFlightTransaction = factory.newTransaction(namespace, "AssignCargoToFlight");
        attachCargoToFlightTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        attachCargoToFlightTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(attachCargoToFlightTransaction);

        const flightAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineFlightAsset}`);
        const cargoAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCargoAsset}`);

        //Retrieve Flight
        let firstFlight = await flightAssetRegistry.get("Flight1");
        //Retrieve Cargo
        let newCargo = await cargoAssetRegistry.get("Cargo1");

        let isCargoOnFlight = firstFlight.cargos.some((cargo) => {
            return newCargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier();
        });

        //Ensure Cargo is on first flight
        expect(isCargoOnFlight).to.be.equal(true);
        expect(newCargo.flight.getFullyQualifiedIdentifier() === firstFlight.getFullyQualifiedIdentifier()).to.be.equal(true);

        //Attach Cargo to second Flight
        attachCargoToFlightTransaction = factory.newTransaction(namespace, "AssignCargoToFlight");
        attachCargoToFlightTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight2");
        attachCargoToFlightTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(attachCargoToFlightTransaction);

        //Retrieve Flight
        firstFlight = await flightAssetRegistry.get("Flight1");
        let secondFlight = await flightAssetRegistry.get("Flight2");

        //Get updated Cargo status
        newCargo = await cargoAssetRegistry.get("Cargo1");

        let isCargoOnFirstFlight = firstFlight.cargos.some((cargo) => {
            return newCargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier();
        });

        let isCargoOnSecondFlight = secondFlight.cargos.some((cargo) => {
            return newCargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier();
        });

        //Ensure Cargo is on second flight
        expect(isCargoOnFirstFlight).to.be.equal(false);
        expect(isCargoOnSecondFlight).to.be.equal(true);
        expect(newCargo.flight.getFullyQualifiedIdentifier() === secondFlight.getFullyQualifiedIdentifier()).to.be.equal(true);

        //Attach Cargo to no flight
        attachCargoToFlightTransaction = factory.newTransaction(namespace, "AssignCargoToFlight");
        attachCargoToFlightTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(attachCargoToFlightTransaction);

        //Ensure Cargo is on no flight

        //Retrieve updated Flight status
        firstFlight = await flightAssetRegistry.get("Flight1");
        secondFlight = await flightAssetRegistry.get("Flight2");

        //Get updated Cargo status
        newCargo = await cargoAssetRegistry.get("Cargo1");

        isCargoOnFirstFlight = firstFlight.cargos.some((cargo) => {
            return newCargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier();
        });

        isCargoOnSecondFlight = secondFlight.cargos.some((cargo) => {
            return newCargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier();
        });

        //Ensure Cargo is on second flight
        expect(isCargoOnFirstFlight).to.be.equal(false);
        expect(isCargoOnSecondFlight).to.be.equal(false);
        expect(newCargo.flight).to.be.equal(undefined);
    })

    it("Cargo Officer can view flights that the airline Company allows", async () => {
        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        const addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        //Fetch Airline Company and add authorised cargo company
        const airlineCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        let airlineCompany = await airlineCompanyAssetRegistry.get("AirlineCompany1");
        airlineCompany.authorisedCargoCompany = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany1");
        await airlineCompanyAssetRegistry.update(airlineCompany);

        await useIdentity("CargoOfficer");

        //Retrieve Flight
        const flightAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineFlightAsset}`);
        let flights = await flightAssetRegistry.getAll();

        expect(flights.length).to.be.above(0);
    })

    it("Airline Staff able to process Inflight Request", async () => {
        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        const addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        //Expect Current Staff to be in cabin crew
        const flightAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineFlightAsset}`);
        let flight = await flightAssetRegistry.get("Flight1");

        const airlineEmployeeRegistry = await businessNetworkConnection.getParticipantRegistry(`${namespace}.${airlineParticipant}`);
        let cabinCrew = await airlineEmployeeRegistry.get("AirlineStaff");

        expect(flight.cabinCrew.getFullyQualifiedIdentifier() === cabinCrew.getFullyQualifiedIdentifier());

        await useIdentity("GHAOfficer");
        //Assign Service to Flight
        let addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service1";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "FOOD";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        await useIdentity("AirlineOfficer");
        //Accept Service
        let handleFlightServiceTransaction = factory.newTransaction(namespace, "HandleFlightServiceRequest");
        handleFlightServiceTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service1");
        handleFlightServiceTransaction.isApproved = true;
        await businessNetworkConnection.submitTransaction(handleFlightServiceTransaction);

        await useIdentity("AirlineStaff");
        //Confirm Service Delivery
        let confirmServiceDeliveryTransaction = factory.newTransaction(namespace, "ProcessFlightServiceDelivery");
        confirmServiceDeliveryTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service1");
        confirmServiceDeliveryTransaction.isApproved = true;
        await businessNetworkConnection.submitTransaction(confirmServiceDeliveryTransaction);


        //Confirm Service Status is delivered
        const serviceAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaServiceAsset}`);
        let service = await serviceAssetRegistry.get("Service1");
        expect(service.status).to.be.equal("DONE");
    })

    it("Airline Staff update TakeOff", async () => {
        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        const addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        await useIdentity("GHAOfficer");
        //Assign Service to Flight
        let addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service1";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "FOOD";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service2";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "UTILITY";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service3";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "UTILITY";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        addServiceTransaction = factory.newTransaction(namespace, "IssueFlightServiceRequest");
        addServiceTransaction.id = "Service4";
        addServiceTransaction.description = "Test Service";
        addServiceTransaction.type = "FOOD";
        addServiceTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(addServiceTransaction);

        await useIdentity("AirlineOfficer");
        //Accept only 2 services
        let handleFlightServiceTransaction = factory.newTransaction(namespace, "HandleFlightServiceRequest");
        handleFlightServiceTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service1");
        handleFlightServiceTransaction.isApproved = true;
        await businessNetworkConnection.submitTransaction(handleFlightServiceTransaction);

        handleFlightServiceTransaction = factory.newTransaction(namespace, "HandleFlightServiceRequest");
        handleFlightServiceTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service2");
        handleFlightServiceTransaction.isApproved = true;
        await businessNetworkConnection.submitTransaction(handleFlightServiceTransaction);

        //Reject 1 service
        handleFlightServiceTransaction = factory.newTransaction(namespace, "HandleFlightServiceRequest");
        handleFlightServiceTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service3");
        handleFlightServiceTransaction.isApproved = false;
        await businessNetworkConnection.submitTransaction(handleFlightServiceTransaction);

        await useIdentity("AirlineStaff");
        //Confirm only one service
        let confirmServiceDeliveryTransaction = factory.newTransaction(namespace, "ProcessFlightServiceDelivery");
        confirmServiceDeliveryTransaction.service = factory.newRelationship(namespace, ghaServiceAsset, "Service1");
        confirmServiceDeliveryTransaction.isApproved = true;
        await businessNetworkConnection.submitTransaction(confirmServiceDeliveryTransaction);

        //Update Flight TakeOff
        let updateFlightTakeOffTransaction = factory.newTransaction(namespace, "UpdateFlightTakeOff");
        updateFlightTakeOffTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(updateFlightTakeOffTransaction);

        const serviceAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${ghaServiceAsset}`);
        //Check Service 1 
        let service1 = await serviceAssetRegistry.get("Service1");
        expect(service1.status).to.be.equal("DONE");

        //Check Service 2 
        let service2 = await serviceAssetRegistry.get("Service2");
        expect(service2.status).to.be.equal("NOT_DONE");

        //Check Service 3 
        let service3 = await serviceAssetRegistry.get("Service3");
        expect(service3.status).to.be.equal("REJECTED");

        //Check Service 4 
        let service4 = await serviceAssetRegistry.get("Service4");
        expect(service4.status).to.be.equal("PENDING");

        //Check Flight status
        const flightAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineFlightAsset}`);
        let flight = await flightAssetRegistry.get("Flight1");

        expect(flight.status).to.be.equal("DEPARTED");
    })

    it("Cargo Officer submit CargoRequest", async () => {
        await useIdentity("CargoOfficer");

        //Add Cargo
        const addCargoTransaction = factory.newTransaction(namespace, "AddCargo");
        addCargoTransaction.id = "Cargo1";
        addCargoTransaction.description = "Test Description";
        addCargoTransaction.weight = 12.012;
        await businessNetworkConnection.submitTransaction(addCargoTransaction);

        //submit cargoRequest Transaction
        const createCargoRequestTransaction = factory.newTransaction(namespace, "CreateCargoRequest");
        createCargoRequestTransaction.id = "CargoRequest1";
        createCargoRequestTransaction.description = "Test Description";
        createCargoRequestTransaction.origin = "Singapore";
        createCargoRequestTransaction.destination = "Guang Zhou";
        createCargoRequestTransaction.earlyDepartureTime = new Date();
        createCargoRequestTransaction.lateDepartureTime = new Date();
        createCargoRequestTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(createCargoRequestTransaction);

        //Check if Request is made
        const cargoRequestAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoRequestAsset}`);
        let cargoRequest = await cargoRequestAssetRegistry.get("CargoRequest1");
        expect(cargoRequest.status).to.be.equal("PENDING");

        const cargoAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCargoAsset}`);
        let cargo = await cargoAssetRegistry.get("Cargo1");
        expect(cargoRequest.cargo.getFullyQualifiedIdentifier() === cargo.getFullyQualifiedIdentifier());
        expect(cargo.request.getFullyQualifiedIdentifier() === cargoRequest.getFullyQualifiedIdentifier());
    })

    it("Cargo staff can collect cargo to warehouse (not via cargo request)", async () => {

        await useIdentity("AirlineOfficer");
        //Create Aircraft
        const addAircraftTransaction = factory.newTransaction(namespace, "AddAircraft");
        addAircraftTransaction.id = "SQ123";
        addAircraftTransaction.model = "QWE";
        addAircraftTransaction.passengerCapacity = 12;
        addAircraftTransaction.cargoCapacity = 12.2;
        await businessNetworkConnection.submitTransaction(addAircraftTransaction);

        //Create Flight
        let addFlightTransaction = factory.newTransaction(namespace, "AddFlight");
        addFlightTransaction.id = "Flight1";
        addFlightTransaction.origin = "Singapore";
        addFlightTransaction.destination = "Tianjin";
        addFlightTransaction.flightNumber = "TZ189";
        addFlightTransaction.departureTime = new Date();
        addFlightTransaction.paxCount = 12;
        addFlightTransaction.aircraft = factory.newRelationship(namespace, "Aircraft", "SQ123");
        addFlightTransaction.cabinCrew = factory.newRelationship(namespace, airlineParticipant, "AirlineStaff");
        addFlightTransaction.collectCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        addFlightTransaction.deliverCompany = factory.newRelationship(namespace, ghaCompanyAsset, "GHACompany1");
        await businessNetworkConnection.submitTransaction(addFlightTransaction);

        //Fetch Airline Company and add authorised cargo company
        const airlineCompanyAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${airlineCompanyAsset}`);
        let airlineCompany = await airlineCompanyAssetRegistry.get("AirlineCompany1");
        airlineCompany.authorisedCargoCompany = factory.newRelationship(namespace, cargoCompanyAsset, "CargoCompany1");
        await airlineCompanyAssetRegistry.update(airlineCompany);

        await useIdentity("CargoOfficer");

        //Add Cargo
        const addCargoTransaction = factory.newTransaction(namespace, "AddCargo");
        addCargoTransaction.id = "Cargo1";
        addCargoTransaction.description = "Test Description";
        addCargoTransaction.weight = 12.012;
        await businessNetworkConnection.submitTransaction(addCargoTransaction);

        //Attach Cargo to Flight
        let attachCargoToFlightTransaction = factory.newTransaction(namespace, "AssignCargoToFlight");
        attachCargoToFlightTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        attachCargoToFlightTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(attachCargoToFlightTransaction);

        await useIdentity("GHAStaff");
        //Collect Cargo from warehouse
        let collectCargoFromWarehouseTransaction = factory.newTransaction(namespace, "CollectCargoFromWarehouse")
        collectCargoFromWarehouseTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(collectCargoFromWarehouseTransaction);

        await useIdentity("AirlineStaff");
        //Update Flight Takeoff
        let updateFlightTakeOffTransaction = factory.newTransaction(namespace, "UpdateFlightTakeOff");
        updateFlightTakeOffTransaction.flight = factory.newRelationship(namespace, airlineFlightAsset, "Flight1");
        await businessNetworkConnection.submitTransaction(updateFlightTakeOffTransaction);

        await useIdentity("CargoStaff");
        //Collect Cargo to warehouse
        let confirmCargoToWarehouseTransaction = factory.newTransaction(namespace, "ConfirmCargoToWarehouse");
        confirmCargoToWarehouseTransaction.cargo = factory.newRelationship(namespace, cargoCargoAsset, "Cargo1");
        await businessNetworkConnection.submitTransaction(confirmCargoToWarehouseTransaction);

        //check cargo status
        const cargoAssetRegistry = await businessNetworkConnection.getAssetRegistry(`${namespace}.${cargoCargoAsset}`);
        let cargo = await cargoAssetRegistry.get("Cargo1");

        expect(cargo.status).to.be.equal("DELIVERED");

    })



})