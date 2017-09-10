import './fix-test';
import { async, TestBed } from '@angular/core/testing';
import { Config } from '../src';

describe('Config Provider', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Config,
      ]
    });
  }));
});
