import { ApplicationError } from './error'
import { Option } from './option'
import { Vote } from './vote'

export class Question {
  id: string
  label: string
  options: Option[]

  constructor (data: Omit<Question, 'getWinner' | 'getOption' | 'addOption' | 'removeOption' | 'vote'>) {
    this.id = data.id
    this.label = data.label
    this.options = data.options
  }

  getWinner (): Option | null {
    if (this.options.length === 1) return this.options[0]
    const winnerNotExists = this.options.every(option => option.votes.length === this.options[0].votes.length)
    if (winnerNotExists) return null
    const sortedOptions = this.options.sort((previous, current) => {
      if (previous.votes.length > current.votes.length) return 1
      if (previous.votes.length < current.votes.length) return -1
      return 0
    })
    return sortedOptions.pop()!
  }

  getOption (id: string): Option {
    const option = this.options.find(searched => searched.id === id)
    if (!option) throw new ApplicationError(`Alternativa ${id} não encontrada`, 404)
    return option
  }

  addOption (option: Option) {
    this.options.push(option)
  }

  removeOption (id: string) {
    const option = this.options.find(searched => searched.id === id)
    if (!option) throw new ApplicationError(`Alternativa ${id} não encontrada`, 404)
    this.options = this.options.filter(filtered => filtered.id !== id)
  }

  vote (optionId: string, data: Vote) {
    const option = this.options.find(searched => searched.id === optionId)
    if (!option) throw new ApplicationError(`Alternativa ${optionId} não encontrada`, 404)
    const deviceVoted = this.options.map(option => option.votes).flat().find(vote => vote.deviceIp === data.deviceIp)
    if (deviceVoted) throw new ApplicationError('Cada usuário pode votar uma única vez em cada questão', 400)
    const phoneVoted = this.options.map(option => option.votes).flat().find(vote => vote.phoneNumber === data.phoneNumber)
    if (phoneVoted) throw new ApplicationError('Cada usuário pode votar uma única vez em cada questão', 400)
    option.votes.push(data)
  }
}
