import {TestBed, inject} from '@angular/core/testing';
import {BlockChainService} from "./block-chain.service";

describe('BlockChainServiceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BlockChainService]
        });
    });

    it('should be created', inject([BlockChainService], (service: BlockChainService) => {
        expect(service).toBeTruthy();
    }));
});
