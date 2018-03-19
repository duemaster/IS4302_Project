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

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.IssueFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function IssueFlightServiceRequest(tx) {
    var services = tx.services;
    var flight = tx.flight;

    //Add Services to Flight
    flight.services = flight.services.concat(services);

    //Save Flight
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.HandleFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function HandleFlightServiceRequest(tx) {
    var services = tx.services;
    var isApproved = tx.isApproved;

    //Process Services
    services.forEach(function(service) {service.type = isApproved ? SERVICE_STATUS.APPROVED : SERVICE_STATUS.REJECTED});

    //Save services
    services.forEach(function(service) {saveService(service)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ConfirmFlightServiceDelivery} tx The sample transaction instance.
 * @transaction
 */
function ConfirmFlightServiceDelivery(tx) {
    var services = tx.services;

    //Process Services
    services.forEach(function(service) {service.type = SERVICE_STATUS.DONE});

    //Save services
    services.forEach(function(service) {saveService(service)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AssignCargoToFlight} tx The sample transaction instance.
 * @transaction
 */
function AssignCargoToFlight(tx) {
    var cargos = tx.cargos;
    var flight = tx.flight;

    //TODO: Ensure Cargo does not exceed weight limit

    //Attach Cargos to flight
    flight.cargos = flight.cargos.concat(cargos);

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.APPROVED});

    //Save cargos
    cargos.forEach(function(cargo) {saveService(cargo)});

    //Save flight
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.SendCargoAddOnRequest} tx The sample transaction instance.
 * @transaction
 */
function SendCargoAddOnRequest(tx) {
    var cargos = tx.cargos;
    var flight = tx.flight;

    //Attach Cargos to flight
    flight.cargos = flight.cargos.concat(cargos);

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.PENDING});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});

    //Save flight
    saveFlight(flight);
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.HandleCargoAddOnRequest} tx The sample transaction instance.
 * @transaction
 */
function HandleCargoAddOnRequest(tx) {
    var cargos = tx.cargos;
    var isApproved = tx.isApproved;

    //TODO: Ensure Cargo does not exceed weight limit

    cargos.forEach(function(cargo) {cargo.status = isApproved ? CARGO_STATUS.APPROVED : CARGO_STATUS.REJECTED});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.CollectCargoFromWarehouse} tx The sample transaction instance.
 * @transaction
 */
function CollectCargoFromWarehouse(tx) {
    var cargos = tx.cargos;

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.COLLECTED});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.LoadCargo} tx The sample transaction instance.
 * @transaction
 */
function LoadCargo(tx) {
    var cargos = tx.cargos;

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.ON_FLIGHT});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.UnloadCargo} tx The sample transaction instance.
 * @transaction
 */
function UnloadCargo(tx) {
    var cargos = tx.cargos;

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.UNLOADED});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ConfirmCargoToWarehouse} tx The sample transaction instance.
 * @transaction
 */
function ConfirmCargoToWarehouse(tx) {
    var cargos = tx.cargos;

    //Update Cargo status
    cargos.forEach(function(cargo) {cargo.status = CARGO_STATUS.DELIVERED});

    //Save cargos
    cargos.forEach(function(cargo) {saveCargo(cargo)});
}


function saveCargo(cargo) {
    return getAssetRegistry(namespace + ".Cargo")
        .then(function (cargoRegistry) {
            return cargoRegistry.update(cargo);
        })
}

function saveService(service) {
    return getAssetRegistry(namespace + ".Service")
        .then(function (serviceRegistry) {
            return serviceRegistry.update(service);
        })
}

function saveAircraft(aircraft) {
    return getAssetRegistry(namespace + ".Aircraft")
        .then(function (aircraftRegistry) {
            return aircraftRegistry.update(aircraft);
        })
}

function saveFlight(flight) {
    return getAssetRegistry(namespace + ".Flight")
        .then(function (flightRegistry) {
            return flightRegistry.update(flight);
        })
}
