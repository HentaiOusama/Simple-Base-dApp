import { TestBed } from '@angular/core/testing';

import { Web3ComponentsService } from './web3-components.service';

describe('Web3ComponentsService', () => {
  let service: Web3ComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3ComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
