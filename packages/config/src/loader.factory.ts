import { Config } from './config.provider';

export function loaderJson(config: Config, files: any) {

  const typeFiles: string = typeof files;
  const filesIsString: boolean = typeFiles === 'string';
  const filesIsObject: boolean = typeFiles === 'object';

  let envs: string[];

  if (!filesIsString || !filesIsObject) {
    throw new Error('Files invalid type');
  }

  const xmlHttpRequest = new XMLHttpRequest();

  const error = (resp: any) => {
    // implements
  };

  const load = (resp: any) => {
    if (filesIsString) {
      config.set(resp);
    } else {
      // for (let env of envs) {
        // @todo compare file
      // }
    }
  };

  xmlHttpRequest.addEventListener('load', load);
  xmlHttpRequest.addEventListener('error', error);

  if (filesIsString) {
    xmlHttpRequest.open('GET', files);
    xmlHttpRequest.send();
  } else {
    envs = Object.keys(files);
    for (const env of envs) {
      xmlHttpRequest.open('GET', files[env]);
      xmlHttpRequest.send();
    }
  }
}
