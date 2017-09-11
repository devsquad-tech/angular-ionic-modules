import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface Data {
  [section: string]: { [key: string]: any };
}

export const ConfigData = new InjectionToken('ConfigDataId');

@Injectable()
export class Config {

  private sectionsExtends: {[section: string]: string} = {};

  constructor(@Inject(ConfigData) private data: Data) {}

  /**
   * Return all data
   *
   * @return {Data}
   */
  getAll(): Data {
    return this.data;
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {string} section that can used how enviroment
   * @return {Config} fluent interface
   */
  set(key: string, value: any, section: string): this {
    // case section not exists create empty
    if (!(section in this.data)) {
      this.data[section] = {};
    }

    this.data[section][key] = value;

    return this;
  }

  /**
   * @param {string} section section main
   * @param {string} sectionExtends section that the main inherits
   * @return {Config} fluent interface
   */
  setSectionExtends(section: string, sectionExtends: string): this {
    this.sectionsExtends[section] = sectionExtends;

    // can't inherits case not exists in data
    if (!(sectionExtends in this.data)) {
      const messageException = `Not allow inherits '${sectionExtends}' because not exists in data`;
      throw new Error(messageException);
    }

    // case section main not exists create empty
    if (!(section in this.data)) {
      this.data[section] = {};
    }

    return this;
  }

  /**
   * Get name inherits of a section
   *
   * @param {string} section
   * @return {string}
   */
  getSectionExtends(section: string): string {
    // case section not inherits throw exception
    if (!this.sectionsExtends[section]) {
      throw new Error(`Section '${section}' not exists`);
    }

    return this.sectionsExtends[section];
  }

  /**
   * Get value in section or in inherits
   *
   * @param {string} key
   * @param {string} section
   * @return {any}
   */
  get(key: string, section: string): any {
    // if section not exists throw exception
    if (!(section in this.data)) {
      throw new Error(`Section ${section} not exists`);
    }

    // case exists key return to not check extends
    if (key in this.data[section]) {
      return this.data[section][key];
    }

    // get name section extends
    const sectionExtends = this.getSectionExtends(section);

    return this.data[sectionExtends][key] || null;
  }
}
