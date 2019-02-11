import { TestBed } from '@angular/core/testing';

import { ShopRestService } from './shop-rest.service';

describe('ShopRestService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ShopRestService = TestBed.get(ShopRestService);
		expect(service).toBeTruthy();
	});
});
