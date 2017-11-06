import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface Data {
  [section: string]: { [key: string]: any };
}

export const ConfigData = new InjectionToken('ConfigDataId');

@Injectable()
export class Config {

  private sectionsExtends: {[section: string]: string} = {};

  constructor(@Inject(ConfigData) private data: Data) {
    // @todo validate section
  }

  set(data: any): this {
    this.data = data;

    return this;
  }

  setBySection(section: string, data: any): this {
    this.data[section] = data;

    return this;
  }

  getBySection(section: string): any {
    return this.data[section];
  }

  /**
   * Return all data
   *
   * @return {Data}
   */
  get(): Data {
    return this.data;
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {string} section that can used how enviroment
   * @return {Config} fluent interface
   */
  add(key: string, value: any, section: string): this {
    // case section not exists create empty
    if (!this.data[section]) {
      this.data[section] = {};
    }

    this.data[section][key] = value;

    return this;
  }

  /**
   * Get value in section
   *
   * @param {string} key
   * @param {string} section
   * @return {any}
   */
  getByKey(key: string, section: string): any {
    if (!(section in this.data)) {
      throw new Error(`Section '${section}' not exists`);
    }

    return this.data[section][key] || null;
  }
}
