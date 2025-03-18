import { TestBed } from '@angular/core/testing';

import { RencontreService } from './rencontre.service';

describe('RencontreService', () => {
  let service: RencontreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RencontreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
