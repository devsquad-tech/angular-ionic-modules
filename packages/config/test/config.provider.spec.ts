import './bootstrap';
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
  /* beforeAll(() => {
    bootstrap();
  }); */
  beforeEach(() => {
    configProvider({
      'dev': {
        'key': 'value'
      },
      'staging:dev': {
        'foo': 'bar'
      }
    });
  });

  it('Get all', inject([ Config ], (config: Config) => {
    const keys = Object.keys(config.getAll());
    expect(keys.length).toBe(2);
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

  it('Section extends', inject([ Config ], (config: Config) => {
    config.setSectionExtends('prod', 'dev');
    expect(config.getSectionExtends('prod')).toBe('dev');
  }));

  it('Get value extends', inject([ Config ], (config: Config) => {
    expect(config.get('key', 'staging')).toBe('value');
    expect(config.get('foo', 'staging')).toBe('bar');
  }));

  it('Set section inherits not exists', inject([ Config ], (config: Config) => {
    expect(() => config.setSectionExtends('prod', 'dev2'))
     .toThrow(new Error('Not allow inherits \'dev2\' because not exists in data'));
  }));

  it('Get Section inherits not exists', inject([ Config ], (config: Config) => {
    expect(() => config.getSectionExtends('prod'))
     .toThrow(new Error('Section \'prod\' not exists'));
  }));
});
