import { allocateString, levenshtein } from './as/as.js'

// Dynamic programming with a matrix
function matrixLevenshtein(a: string, b: string) {
  if (a === b)
    return 1

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => [])
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }

  const distance = matrix[a.length][b.length]
  return 1 - distance / Math.max(a.length, b.length)
}

// Optimized implementation
function optimizedLevenshtein(a: string, b: string) {
  if (a === b)
    return 1

  if (b.length < a.length)
    [a, b] = [b, a]

  let prev = Array(a.length + 1).fill(0)
  let curr = Array(a.length + 1).fill(0)

  for (let i = 0; i <= a.length; i++) prev[i] = i

  for (let j = 1; j <= b.length; j++) {
    curr[0] = j
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[i] = Math.min(
        prev[i] + 1,
        curr[i - 1] + 1,
        prev[i - 1] + cost,
      )
    }
    [prev, curr] = [curr, prev]
  }

  const distance = prev[a.length]
  return 1 - distance / Math.max(a.length, b.length)
}

function benchmark() {
  const testCases = [
    ['kitten', 'sitting'],
    ['I walk in the park', 'I walked in the park'],
    ['sunday', 'saturday'],
    ['hello world', 'hello there'],
    ['programming', 'programmer'],
    ['javascript', 'typescript'],
    [
      'Once upon a time in a bustling city, there lived a young software developer named Alex. Every day, Alex would wake up early, brew a fresh cup of coffee, and sit down at the computer to write code. The satisfaction of solving complex problems and creating elegant solutions drove Alex forward. One particularly challenging project involved optimizing a legacy system that had become slow and unwieldy over the years. Through careful analysis and methodical refactoring, Alex gradually transformed the codebase into something more maintainable and efficient. The team was impressed by the improvements, and soon other developers began asking for advice on similar optimization techniques. This experience taught Alex that sometimes the most valuable solutions come not from adding more features, but from simplifying and streamlining what already exists. The project became a case study in technical debt management and system optimization, demonstrating how thoughtful engineering practices could breathe new life into aging software systems.',
      'Once upon a time in a thriving metropolis, there lived a dedicated software engineer named Alex. Each morning, Alex would rise early, prepare a hot cup of coffee, and begin the day\'s coding challenges. The joy of tackling complex problems and designing elegant solutions motivated Alex constantly. A particularly demanding project required modernizing an outdated system that had become inefficient and difficult to maintain. Through systematic analysis and careful restructuring, Alex successfully transformed the codebase into something more sustainable and performant. Fellow team members were amazed by the improvements, and other engineers started seeking guidance on optimization strategies. This journey taught Alex that often the best solutions arise not from adding complexity, but from simplifying and streamlining existing systems. The project later became an example of effective technical debt reduction and system enhancement, showing how smart engineering principles could revitalize legacy software systems.',
    ],
  ]

  const implementations = {
    matrix: matrixLevenshtein,
    optimized: optimizedLevenshtein,
    wasm: (a: string, b: string) => {
      const aBuffer = allocateString(a)
      const bBuffer = allocateString(b)
      return levenshtein(aBuffer, bBuffer, a.length, b.length)
    },
  }

  for (const [name, fn] of Object.entries(implementations)) {
    console.log(`\nTesting ${name} implementation:`)
    let totalTime = 0

    for (const [str1, str2] of testCases) {
      const start = performance.now()
      const result = fn(str1, str2)
      const end = performance.now()
      const time = end - start

      totalTime += time
      const s1 = str1.length > 20 ? `${str1.slice(0, 20)}...` : str1
      const s2 = str2.length > 20 ? `${str2.slice(0, 20)}...` : str2
      console.log(`  "${s1}" vs "${s2}": ${result.toFixed(4)} (${time.toFixed(3)}ms)`)
    }

    console.log(`Average time: ${(totalTime / testCases.length).toFixed(3)}ms`)
  }
}

// Run the benchmark
benchmark()
