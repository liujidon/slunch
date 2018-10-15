/**
 * Created by MichaelWang on 2018-10-14.
 */
import { TestBed, inject } from '@angular/core/testing';

import { PastOrderService } from './past-order.service';

describe('PastOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PastOrderService]
    });
  });

  it('should be created', inject([PastOrderService], (service: PastOrderService) => {
    expect(service).toBeTruthy();
  }));
});
