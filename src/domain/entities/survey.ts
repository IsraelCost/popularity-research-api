import { Award } from './award'
import { Question } from './question'

export class Survey {
  id: string
  label: string
  award: Award
  questions: Question[]
  cityId?: string
  term?: string

  constructor (
    data: Omit<Survey, 'addQuestion' | 'getQuestion' | 'removeQuestion'>
  ) {
    this.id = data.id
    this.label = data.label
    this.questions = data.questions
    this.award = data.award
    if (data.cityId) {
      this.cityId = data.cityId
    }
    if (data.term) {
      this.term = data.term
    }
  }

  getQuestion (id: string): Question | null {
    const question = this.questions.find(searched => searched.id === id)
    return question ?? null
  }

  addQuestion (question: Question) {
    this.questions.push(question)
  }

  removeQuestion (id: string) {
    this.questions = this.questions.filter(question => question.id !== id)
  }
}
