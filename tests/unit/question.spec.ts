import { ApplicationError } from '../../src/domain/entities/error'
import { Question } from '../../src/domain/entities/question'

test('Should get null winner for all votes equality', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: 0 },
      { id: '2', label: 'second', picture: 'some-picture', votes: 0 },
      { id: '3', label: 'thirth', picture: 'some-picture', votes: 0 },
      { id: '4', label: 'fourth', picture: 'some-picture', votes: 0 }
    ]
  })
  expect(sut.getWinner()).toEqual(null)
})

test('Should get the correct winner', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: 10 },
      { id: '2', label: 'second', picture: 'some-picture', votes: 2 },
      { id: '3', label: 'thirth', picture: 'some-picture', votes: 3 },
      { id: '4', label: 'fourth', picture: 'some-picture', votes: 20 }
    ]
  })
  expect(sut.getWinner()).toEqual({ id: '4', label: 'fourth', picture: 'some-picture', votes: 20 })
})

test('Should get the correct winner for only one option', () => {
  const sut = new Question({
    id: 'Generated_id',
    label: 'Some question',
    options: [
      { id: '1', label: 'first', picture: 'some-picture', votes: 10 }
    ]
  })
  expect(sut.getWinner()).toEqual({ id: '1', label: 'first', picture: 'some-picture', votes: 10 })
})

test('Should not create a question with less than 1 option', () => {
  expect(() => (
    new Question({
      id: 'Generated_id',
      label: 'Some question',
      options: []
    })
  )).toThrow(new ApplicationError('Cada questão deve possuir ao menos uma opção', 400))
})
