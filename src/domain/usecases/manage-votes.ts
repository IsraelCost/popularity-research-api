export interface IManageVotes {
  manage: (input: ManageVotesDTO.Input) => Promise<ManageVotesDTO.Output>
}

export namespace ManageVotesDTO {
  type Percentage = {
    optionId: string
    percentage: number
  }

  export type Input = {
    surveyId: string
    questionId: string
    options: Percentage[]
  }

  export type Output = void
}
