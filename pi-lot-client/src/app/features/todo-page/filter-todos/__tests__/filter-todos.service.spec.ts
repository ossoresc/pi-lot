import { TestBed } from '@angular/core/testing';

import { FilterTodosService } from '../filter-todos.service';

describe('FilterTodosService', () => {
  let service: FilterTodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterTodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
