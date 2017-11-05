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
  beforeEach(() => {
    configProvider({
      'dev': {
        'key': 'value'
      },
      'staging': {
        'foo': 'bar'
      }
    });
  });

  it('Get all', inject([ Config ], (config: Config) => {
    const keys = Object.keys(config.get());
    expect(keys.length).toBe(2);
  }));

  it('Get by key', inject([ Config ], (config: Config) => {
    expect(config.getByKey('key', 'dev')).toBe('value');
  }));

  it('Add value', inject([ Config ], (config: Config) => {
    const chainConfig = config.add('key2', 'foo', 'dev');
    expect(chainConfig).toBe(config);
    expect(config.getByKey('key2', 'dev')).toBe('foo');
  }));

  it('Get by Key section not exists', inject([ Config ], (config: Config) => {

    expect(() => config.getByKey('key2', 'prod'))
    .toThrow(new Error('Section \'prod\' not exists'));
  }));
});
