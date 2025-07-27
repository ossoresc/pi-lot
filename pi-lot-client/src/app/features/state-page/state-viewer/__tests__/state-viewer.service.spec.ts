import { TestBed } from '@angular/core/testing';

import { StateViewerService } from '../state-viewer.service';

describe('StateViewerService', () => {
  let service: StateViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
