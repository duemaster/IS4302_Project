'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const {BusinessNetworkDefinition, CertificateUtil, IdCard} = require('composer-common');
const path = require('path');
var assert = require('assert');

require('chai').should();

const namespace = 'org.airline.airChain';
    describe
('Array', function () {
    describe('#indexOf()', function () {

        const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({type: 'composer-wallet-inmemory'});


        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});