export interface IFileSystem {
  save: (folder: string, fileName: string, base64: string) => Promise<string>
}

export enum FileSystemFolders {
  OPTIONS_PICTURES = 'survey.options.pictures',
  AWARD_PICTURES = 'survey.award.pictures',
  CITY_PICTURES = 'city.pictures'
}
