export interface IPackage {
  author: Author;
  bugs: Bugs;
  description: string;
  "dist-tags": DistTags;
  homepage: string;
  keywors: Array<string>;
  license: string;
  maintainers: Array<Maintainer>;
  name: string;
  readme: string;
  readmeFilename: string;
  repository: Repository;
  time: Time;
  users: User;
  versions: Array<Version>;

  attachments: any;
}

interface Author {
  email: string;
  name: string;
  url: string;
}

interface Bugs {
  url: string
}

interface DistTags {
  beta: string;
  latest: string;
  next: string;
}

interface Maintainer {
  email: string;
  name: string;
}

interface Repository {
  type: string;
  url: string;
}

interface Time {
  /**
  keys: version number ex:(2.5.1) value: datetime
  */
  versions: any;
  created: string;
  modified: string;
}

interface User {
  /*
  keys: username value: bool
  */
  name: string;
}

interface Version {
  // TODO
}