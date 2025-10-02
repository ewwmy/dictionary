import { Messages } from 'src/messages/messages.const'

export class NoImporterFoundException extends Error {
  constructor(name: string) {
    super(Messages.WORD.NO_IMPORTER_FOUND(name))
  }
}
