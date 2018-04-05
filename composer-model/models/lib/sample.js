/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var namespace = "org.airline.airChain";

/*
 ** Airline Company Action
 */

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddFlightToCompany} tx The sample transaction instance.
 * @transaction
 */
function AddFlightToCompany(tx) {
    var flight = tx.flight;
    var caller = getCurrentParticipant();

    flight.company = caller.company;

    if (!caller.company.flights) {
        caller.company.flights = [];
    }

    caller.company.flights.push(flight);
    saveCompany(caller.company);
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddAircraftToCompany} tx The sample transaction instance.
 * @transaction
 */
function AddAircraftToCompany(tx) {
    var aircraft = tx.aircraft;
    var caller = getCurrentParticipant();

    aircraft.company = caller.company;

    if (!caller.company.aircrafts) {
        caller.company.aircrafts = [];
    }

    caller.company.aircrafts.push(aircraft);

    saveCompany(caller.company);
    saveAircraft(aircraft);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.HandleFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function HandleFlightServiceRequest(tx) {
    var service = tx.service;
    var isApproved = tx.isApproved;

    //Get access to calling participant
    var caller = getCurrentParticipant();

    //Only allow if Service is attached to flight the participant is incharge of
    var isAuthorised = caller.company.flights.filter(function(flight) {
        return flight.getIdentifier() == service.flight.getIdentifier();
    }).length === 1;

    if (!isAuthorised)
        throw new Error("Not authorised to approve flight services");

    //Only allow if flight status is "SCHEDULED"
    if (service.flight.status != "SCHEDULED")
        throw new Error("Flight is not in scheduled status!");

    //Process Services
    service.status = isApproved ? "APPROVED" : "REJECTED";
    saveService(service);
}


/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ProcessFlightServiceDelivery} tx The sample transaction instance.
 * @transaction
 */
function ProcessFlightServiceDelivery(tx) {
    var service = tx.service;
    var isApproved = tx.isApproved;

    var caller = getCurrentParticipant();
    var isAuthorised = service.flight.cabinCrews.filter(function(crew) {
        return crew.getIdentifier() == caller.getIdentifier();
    }).length == 1;

    if (!isAuthorised)
        throw new Error("Staff not authorised to confirm services");

    if (service.flight.status != "SCHEDULED")
        throw new Error("Flight is not in scheduled status");

    //Process Services
    service.status = isApproved ? "DONE" : "NOT_DONE";
    saveService(service);
}


/*
 ** GHA Company Action
 */

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddServiceToCompany} tx The sample transaction instance.
 * @transaction
 */
function AddServiceToCompany(tx) {
    var service = tx.service;

    var caller = getCurrentParticipant();

    if (!caller.company.services) {
        caller.company.services = [];
    }

    service.company = caller.company;
    caller.company.services.push(service);

    saveService(service);
    saveCompany(caller.company);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.IssueFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function IssueFlightServiceRequest(tx) {
    var service = tx.service;
    var flight = tx.flight;

    if (flight.status != "SCHEDULED")
        throw new Error("Flight not in scheduled status");

    //Add Services to Flight
    if (!flight.services)
        flight.services = [];

    flight.services.push(service);
    service.flight = flight;

    //Save Flight & service
    saveFlight(flight);
    saveService(service);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.CollectCargoFromWarehouse} tx The sample transaction instance.
 * @transaction
 */
function CollectCargoFromWarehouse(tx) {
    var cargo = tx.cargo;

    //Update Cargo status
    cargo.status = "COLLECTED";

    //Save cargo
    saveCargo(cargo);
}


/*
 ** Cargo Company Action
 */


/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddCargoToCompany} tx The sample transaction instance.
 * @transaction
 */
function AddCargoToCompany(tx) {
    var cargo = tx.cargo;

    var caller = getCurrentParticipant();

    if (!caller.company.cargos) {
        caller.company.cargos = [];
    }

    caller.company.cargos.push(cargo);
    cargo.company = caller.company;

    saveCargo(cargo);
    saveCompany(caller.company);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ConfirmCargoToWarehouse} tx The sample transaction instance.
 * @transaction
 */
function ConfirmCargoToWarehouse(tx) {
    var cargo = tx.cargo;

    //Update Cargo status
    cargo.status = "DELIVERED";

    //Save cargos
    saveCargo(cargo);
}


/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AssignCargoToFlight} tx The sample transaction instance.
 * @transaction
 */
function AssignCargoToFlight(tx) {
    var cargo = tx.cargo;
    var flight = tx.flight;

    if (!flight.cargos) {
        flight.cargos = [];
    }

    //Ensure Cargo does not exceed weight limit
    var limit = flight.aircraft.cargoCapacity;
    var loadedWeight = flight.cargos.reduce(function(a, b) { a + b.weight }, 0);

    if (loadedWeight + cargo.weight > limit)
        throw new Error('Total weight has exceeded limit');

    //Attach Cargo to flight
    flight.cargos.push(cargo);

    //Update Cargo status
    cargo.status = "APPROVED";
    cargo.flight = flight;

    //Save cargo
    saveCargo(cargo);

    //Save flight
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AcceptCargoRequest} tx The sample transaction instance.
 * @transaction
 */
function AcceptCargoRequest(tx) {
    var cargoRequest = tx.cargoRequest;
    var flight = tx.flight;

    //Ensure CargoRequest Requirement is meet
    if (cargoRequest.origin != flight.origin)
        throw new Error('CargoRequest origin mismatch with flight origin!');

    if (cargoRequest.destination != flight.destination)
        throw new Error('CargoRequest destination mismatch with flight destination!');

    if (cargoRequest.lateDepartureTime <= flight.departureTime || cargoRequest.earlyDepartureTime >= flight.departureTime)
        throw new Error('CargoRequest departureTime mismatch with flight departureTime!');

    if (!flight.cargos) {
        flight.cargos = [];
    }

    //Ensure Cargo does not exceed weight limit
    var limit = flight.aircraft.cargoCapacity;
    var loadedWeight = flight.cargos.reduce(function(a, b) { a + b.weight }, 0);

    if (loadedWeight + cargoRequest.cargo.weight > limit)
        throw new Error('Total weight has exceeded limit');

    //Attach Cargos to flight
    flight.cargos.push(cargo);

    //Update Cargo status
    cargo.status = "APPROVED";
    cargo.flight = flight;

    //Update cargoRequest status
    cargoRequest.acceptedCompany = flight.company.authorisedCargoCompany;

    //Save cargos
    saveCargo(cargo);

    //Save flight
    saveFlight(flight);

    //Save cargoRequest
    saveCargoRequest(cargoRequest);
}



function saveEmployee(employee) {
    return getAssetRegistry(namespace + ".Employee")
        .then(function(employeeRegistry) {
            return employeeRegistry.update(employee);
        })
}

function saveCompany(company) {
    return getAssetRegistry(namespace + ".Company")
        .then(function(companyRegistry) {
            return companyRegistry.update(company);
        })
}

function saveCargo(cargo) {
    return getAssetRegistry(namespace + ".Cargo")
        .then(function(cargoRegistry) {
            return cargoRegistry.update(cargo);
        })
}

function saveService(service) {
    return getAssetRegistry(namespace + ".Service")
        .then(function(serviceRegistry) {
            return serviceRegistry.update(service);
        })
}

function saveAircraft(aircraft) {
    return getAssetRegistry(namespace + ".Aircraft")
        .then(function(aircraftRegistry) {
            return aircraftRegistry.update(aircraft);
        })
}

function saveFlight(flight) {
    return getAssetRegistry(namespace + ".Flight")
        .then(function(flightRegistry) {
            return flightRegistry.update(flight);
        })
}

function saveCargoRequest(cargoRequest) {
    return getAssetRegistry(namespace + ".CargoRequest")
        .then(function(cargoRegistry) {
            return cargoRegistry.update(cargoRequest);
        })
}