export const shuffleArray = <T>(arr: T[]): T[] => {
  for (let index = arr.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1))
    const oldRandom = arr[random]
    const oldIndex = arr[index]
    arr[index] = oldRandom
    arr[random] = oldIndex
  }

  return arr
}
