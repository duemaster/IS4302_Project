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
 * @param {org.airline.airChain.HandleFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function HandleFlightServiceRequest(tx) {
    var service = tx.service;
    var isApproved = tx.isApproved;

    //Get access to calling participant
    var caller = getParticipant();

    //Only Allow if Service is attached to flight the participant is incharge of
    var isAuthorised = caller.company.flights.filter(function(flight) {
        return flight.getIdentifier() === service.flight.getIdentifier();
    }).length === 1;

    if (!isAuthorised)
        throw new Error("Not authorised to approve flight services");

    //Process Services
    service.status = isApproved ? SERVICE_STATUS.APPROVED : SERVICE_STATUS.REJECTED;
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

    var caller = getParticipant();
    var isAuthorised =


        //Process Services
        service.status = isApproved ? SERVICE_STATUS.DONE : SERVICE_STATUS.NOT_DONE;
    saveService(service);
}


/*
 ** GHA Company Action
 */

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.IssueFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function IssueFlightServiceRequest(tx) {
    var service = tx.service;
    var flight = tx.flight;

    //Add Services to Flight
    flight.services.push(service);

    //Save Flight
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.CollectCargoFromWarehouse} tx The sample transaction instance.
 * @transaction
 */
function CollectCargoFromWarehouse(tx) {
    var cargo = tx.cargo;

    //Update Cargo status
    cargo.status = CARGO_STATUS.COLLECTED;

    //Save cargos
    saveCargo(cargo);
}


/*
 ** Cargo Company Action
 */

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ConfirmCargoToWarehouse} tx The sample transaction instance.
 * @transaction
 */
function ConfirmCargoToWarehouse(tx) {
    var cargo = tx.cargo;

    //Update Cargo status
    cargo.status = CARGO_STATUS.DELIVERED;

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

    //Ensure Cargo does not exceed weight limit
    var limit = flight.aircraft.cargoCapacity;
    var loadedWight = flight.cargos.reduce(function(a, b) { a + b.weight }, 0);

    if (loadedWight + cargo.weight > limit)
        throw new Error('Total weight has exceeded limit');


    //Attach Cargo to flight
    flight.cargos.push(cargo);

    //Update Cargo status
    cargo.status = CARGO_STATUS.APPROVED;
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

    //Ensure Cargo does not exceed weight limit
    var limit = flight.aircraft.cargoCapacity;
    var loadedWight = flight.cargos.reduce(function(a, b) { a + b.weight }, 0);

    if (loadedWight + cargoRequest.cargo.weight > limit)
        throw new Error('Total weight has exceeded limit');

    //Attach Cargos to flight
    flight.cargos.push(cargo);

    //Update Cargo status
    cargo.status = CARGO_STATUS.APPROVED;
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