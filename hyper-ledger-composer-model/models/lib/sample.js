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
 * @param {org.airline.airChain.AddFlight} tx The sample transaction instance.
 * @transaction
 */
function AddFlightToCompany(tx) {

    var factory = getFactory();

    var company = getCurrentParticipant().company;
    return getAssetRegistry(namespace + ".AirlineCompany").then(function(companyAssetRegistry) {
        return companyAssetRegistry.get(company.$identifier).then(function(company) {
            var flight = factory.newResource(namespace, "Flight", tx.id);
            flight.origin = tx.origin;
            flight.destination = tx.destination;
            flight.flightNumber = tx.flightNumber;
            flight.departureTime = tx.departureTime;
            flight.paxCount = tx.paxCount;
            flight.status = "SCHEDULED";

            flight.aircraft = tx.aircraft;
            flight.company = company;
            flight.cabinCrew = tx.cabinCrew;
            flight.collectCompany = tx.collectCompany;
            flight.deliverCompany = tx.deliverCompany;

            if (!company.flights) {
                company.flights = [];
            }

            company.flights.push(flight);

            return getAssetRegistry(namespace + ".Flight")
                .then(function(flightAssetRegistry) {
                    return flightAssetRegistry.add(flight)
                        .then(function() {
                            return saveAirlineCompany(company);
                        })
                })
        })
    })
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddAircraft} tx The sample transaction instance.
 * @transaction
 */
function AddAircraft(tx) {
    var company = getCurrentParticipant().company;
    return getAssetRegistry(namespace + ".AirlineCompany").then(function(companyAssetRegistry) {
        return companyAssetRegistry.get(company.$identifier).then(function(company) {
            var aircraft = getFactory().newResource(namespace, "Aircraft", tx.id);
            aircraft.model = tx.model;
            aircraft.passengerCapacity = tx.passengerCapacity;
            aircraft.cargoCapacity = tx.cargoCapacity;

            if (!company.aircrafts) {
                company.aircrafts = [];
            }

            aircraft.company = company;

            company.aircrafts.push(aircraft);

            return getAssetRegistry(namespace + ".Aircraft").then(function(assetRegistry) {
                return assetRegistry.add(aircraft).then(function() {
                    return saveAirlineCompany(company);
                })
            });
        })
    });
}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.HandleFlightServiceRequest} tx The sample transaction instance.
 * @transaction
 */
function HandleFlightServiceRequest(tx) {
    var service = tx.service;
    var isApproved = tx.isApproved;

    //Process Services
    service.status = isApproved ? "APPROVED" : "REJECTED";
    return saveService(service);
}


/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.ProcessFlightServiceDelivery} tx The sample transaction instance.
 * @transaction
 */
function ProcessFlightServiceDelivery(tx) {
    var service = tx.service;
    var isApproved = tx.isApproved;

    //Process Services
    service.status = isApproved ? "DONE" : "NOT_DONE";
    return saveService(service);
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

    var company = getCurrentParticipant().company;
    return getAssetRegistry(namespace + ".GHACompany").then(function(companyAssetRegistry) {
        return companyAssetRegistry.get(company.$identifier).then(function(company) {
            var service = getFactory().newResource(namespace, "Service", tx.id);
            service.description = tx.description;
            service.type = tx.type;
            service.status = "PENDING";
            service.flight = tx.flight;
            service.company = company;

            //Add Service to Company
            if (!company.services) {
                company.services = [];
            }
            company.services.push(service);

            //Add Service to Flight
            if (!service.flight.services) {
                service.flight.services = [];
            }

            service.flight.services.push(service);

            return getAssetRegistry(namespace + ".Service")
                .then(function(assetRegistry) {
                    return assetRegistry.add(service)
                        .then(function() {
                            return saveGHACompany(company)
                                .then(function() {
                                    return saveFlight(service.flight);
                                })
                        })
                });
        })
    });




    // var service = tx.service;
    // var flight = tx.flight;

    // if (flight.status != "SCHEDULED")
    //     throw new Error("Flight not in scheduled status");

    // //Add Services to Flight
    // if (!flight.services)
    //     flight.services = [];

    // flight.services.push(service);
    // service.flight = flight;

    // //Save Flight & service
    // return saveFlight(flight).then(function() {
    //     saveService(service);
    // })
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
    return saveCargo(cargo);
}


/*
 ** Cargo Company Action
 */


/**
 * Sample transaction processor function.
 * @param {org.airline.airChain.AddCargo} tx The sample transaction instance.
 * @transaction
 */
function AddCargoToCompany(tx) {

    var company = getCurrentParticipant().company;

    return getAssetRegistry(namespace + ".CargoCompany")
        .then(function(companyAssetRegistry) {
            return companyAssetRegistry.get(company.$identifier)
                .then(function(company) {
                    var cargo = getFactory().newResource(namespace, "Cargo", tx.id);
                    cargo.description = tx.description;
                    cargo.weight = tx.weight;
                    cargo.company = company;
                    cargo.status = "PENDING";

                    if (!company.cargos) {
                        company.cargos = [];
                    }

                    company.cargos.push(cargo);

                    return getAssetRegistry(namespace + ".Cargo")
                        .then(function(cargoAssetRegistry) {
                            return cargoAssetRegistry.add(cargo)
                                .then(function() {
                                    return saveCargoCompany(company);
                                });
                        });
                });
        });
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
    return saveCargo(cargo);
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
    return saveCargo(cargo).then(function() {
        //Save flight
        return saveFlight(flight);
    })
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
    return saveCargo(cargo).then(function() {
        return saveFlight(flight).then(function() {
            return saveCargoRequest(cargoRequest);
        });
    });
}


function saveAirlineCompany(airlineCompany) {
    return getAssetRegistry(namespace + ".AirlineCompany")
        .then(function(companyRegistry) {
            return companyRegistry.update(airlineCompany);
        })
}

function saveGHACompany(ghaCompany) {
    return getAssetRegistry(namespace + ".GHACompany")
        .then(function(companyRegistry) {
            return companyRegistry.update(ghaCompany);
        })
}

function saveCargoCompany(cargoCompany) {
    return getAssetRegistry(namespace + ".CargoCompany")
        .then(function(companyRegistry) {
            return companyRegistry.update(cargoCompany);
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