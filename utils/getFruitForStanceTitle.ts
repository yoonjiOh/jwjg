export const fruits = ['🍎', '🍋', '🍇', '🍈', '🍊'];

export const getFruitForStanceTitle = stances => {
  return stances.map((s, i) => ({
    ...s,
    fruit: s.orderNum >= fruits.length ? '🍊' : fruits[s.orderNum],
  }));
};
