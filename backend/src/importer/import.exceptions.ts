import { Messages } from 'src/messages/messages.const'

export class NoImporterFoundException extends Error {
  constructor(name: string) {
    super(Messages.IMPORT.NO_IMPORTER_FOUND(name))
  }
}

export class DuplicateWordImportException extends Error {
  constructor(word: string) {
    super(Messages.IMPORT.DUPLICATE_IN_IMPORT(word))
  }
}

export class DuplicateWordDatabaseException extends Error {
  constructor(word: string) {
    super(Messages.IMPORT.DUPLICATE_IN_DATABASE(word))
  }
}
