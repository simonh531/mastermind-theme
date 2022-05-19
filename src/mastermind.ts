// eslint-disable-next-line import/prefer-default-export
export function getCorrect(code:number[], solution:number[]) {
  const codeCopy:number[] = [];
  const solutionCopy:number[] = [];
  let numCorrect = 0;
  for (let i = 0; i < code.length; i += 1) {
    if (code[i] === solution[i]) {
      numCorrect += 1;
    } else {
      codeCopy.push(code[i]);
      solutionCopy.push(solution[i]);
    }
  }
  let numExist = 0;
  if (numCorrect !== code.length) {
    for (let i = 0; i < codeCopy.length; i += 1) {
      const index = solutionCopy.findIndex((item) => codeCopy[i] === item);
      if (index !== -1) {
        solutionCopy.splice(index, 1);
        numExist += 1;
      }
    }
  }
  return { numCorrect, numExist };
}

export function calcSolutionSet(guess: number[], solutionSet:number[][]) {
  const buckets:Record<string, number[][]> = {};
  solutionSet.forEach((possibleSolution) => {
    const { numCorrect, numExist } = getCorrect(guess, possibleSolution);
    const bucket = `${numCorrect}:${numExist}`;
    if (bucket in buckets) {
      buckets[bucket].push(possibleSolution);
    } else {
      buckets[bucket] = [possibleSolution];
    }
  });
  return buckets;
}

export function reduceBuckets(buckets:Record<string, number[][]>):[string, number[][]] {
  let highest = 0;
  Object.values(buckets).forEach((codeList) => {
    if (codeList.length > highest) {
      highest = codeList.length;
    }
  });
  const possibleBuckets:string[] = [];
  Object.entries(buckets).forEach(([name, codeList]) => {
    if (codeList.length === highest) {
      possibleBuckets.push(name);
    }
  });
  const correctAnswer = possibleBuckets.findIndex((value) => value === '4:0');
  if (possibleBuckets.length > 1 && correctAnswer !== -1) {
    possibleBuckets.splice(correctAnswer, 1);
  }
  const selectedBucket = possibleBuckets[Math.floor(Math.random() * possibleBuckets.length)];
  return [selectedBucket, buckets[selectedBucket]];
}

export function reduceSolutionSet(guess: number[], solutionSet:number[][]) {
  const buckets = calcSolutionSet(guess, solutionSet);
  return reduceBuckets(buckets);
}
