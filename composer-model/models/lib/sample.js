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
 * @param {org.acme.sample.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
function sampleTransaction(tx) {

    // Save the old value of the asset.
    var oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.sample.SampleAsset')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.asset);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.sample', 'SampleEvent');
            event.asset = tx.asset;
            event.oldValue = oldValue;
            event.newValue = tx.newValue;
            emit(event);
        });

}

/**
 * Sample transaction processor function.
 * @param {org.airline.airChain} tx The sample transaction instance.
 * @transaction
 */
function processFlightRequest(tx) {
    let req = tx.request;
    let isApproved = tx.isApproved;

    //Update request status
    getAssetRegistry('org.airline.airChain.ServiceRequest')
}


function saveAircraft(aircraft) {
    return getAssetRegistry(`${namespace}.Aircraft`)
        .then(function (aircraftRegistry) {
            return aircraftRegistry.update(aircraft);
        })
}

function saveFlight(flight) {
    return getAssetRegistry(`${namespace}.Flight`)
        .then(function (flightRegistry) {
            return flightRegistry.update(flight);
        })
}

function saveServiceRequest(serviceRequest) {
    return getAssetRegistry(`${namespace}.ServiceRequest`)
        .then(function (serviceRequestRegistry) {
            return serviceRequestRegistry.update(serviceRequest);
        })
}

function saveCargoAddOnRequest(cargoAddOnRequest) {
    return getAssetRegistry(`${namespace}.CargoAddOnRequest`)
        .then(function (cargoAddOnRequestRegistry) {
            return cargoAddOnRequestRegistry.update(cargoAddOnRequest);
        })
}
