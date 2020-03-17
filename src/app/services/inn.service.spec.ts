import { TestBed } from '@angular/core/testing';

import { InnService } from './inn.service';

describe('InnService', () => {
  let service: InnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
