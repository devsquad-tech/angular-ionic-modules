import { bootstrap } from './fix-test';
import { async, inject, TestBed } from '@angular/core/testing';
import { Config, ConfigData } from '../src';

function configProvider(data?: any) {
  TestBed.configureTestingModule({
    providers: [
      { provide: ConfigData, useValue: data || {}},
      Config,
    ]
  });
}

describe('Config Provider', () => {
  beforeAll(() => {
    bootstrap();
  });
  beforeEach(() => {
    configProvider({
      'dev': {
        'key': 'value'
      }
    });
  });

  it('Get all', inject([ Config ], (config: Config) => {
    const keys = Object.keys(config.getAll());
    expect(keys.length).toBe(1);
  }));

  it('Get value', inject([ Config ], (config: Config) => {
    expect(config.get('key', 'dev')).toBe('value');
  }));

  it('Set value', inject([ Config ], (config: Config) => {
    const chainConfig = config.set('key2', 'foo', 'dev');
    expect(chainConfig).toBe(config);
    expect(config.get('key2', 'dev')).toBe('foo');
  }));

  it('Set value section not exists', inject([ Config ], (config: Config) => {
    config.set('keyProd', 'secret', 'prod');
    expect(config.get('keyProd', 'prod')).toBe('secret');
  }));
});