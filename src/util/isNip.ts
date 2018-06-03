export const isNip = (value: string): Promise<string|void> => {
  if (!value || value === "" || value.length !== 10) {
    return Promise.reject("NIP is invalid");
  }

  const valuesArr = value.split("").map(v => +v);
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7, 1];

  const weightedValues = valuesArr.map((v, i) => v * weights[i]);
  const significantValues = weightedValues.slice(0, 9);

  const sum = significantValues.reduce((prev, curr) => prev + curr, 0);

  if (sum % 11 === +value[9]) {
    return Promise.resolve();
  }

  return Promise.reject("NIP is invalid");
};
