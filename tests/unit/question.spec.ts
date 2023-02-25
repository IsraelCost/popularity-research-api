/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Question } from '../../src/domain/entities/question'
import { Vote } from '../../src/domain/entities/vote'

test('Should get null winner for all votes equality', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: [] },
      { id: '2', label: 'second', picture: 'some-picture', votes: [] },
      { id: '3', label: 'thirth', picture: 'some-picture', votes: [] },
      { id: '4', label: 'fourth', picture: 'some-picture', votes: [] }
    ]
  })
  expect(sut.getWinner()).toEqual(null)
})

test('Should get the correct winner for only one option', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: generateVotes(10) }
    ]
  })
  expect(sut.getWinner()).toEqual(sut.options[0])
})

test('Should verificate if is a valid percentage', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: generateVotes(0) },
      { id: '2', label: 'second', picture: 'some-picture', votes: generateVotes(1) },
      { id: '3', label: 'thirth', picture: 'some-picture', votes: generateVotes(2) },
      { id: '4', label: 'fourth', picture: 'some-picture', votes: generateVotes(1) }
    ]
  })
  expect(sut.isAValidPercentage(70)).toEqual(false)
  expect(sut.isAValidPercentage(50)).toEqual(true)
  expect(sut.isAValidPercentage(25)).toEqual(true)
  expect(sut.isAValidPercentage(90)).toEqual(false)
})

const generateVotes = (quantity: number) => {
  const votes: Vote[] = []
  while (votes.length !== quantity) {
    votes.push({ deviceIp: '' + Math.random(), phoneNumber: '' + Math.random() })
  }
  return votes
}
