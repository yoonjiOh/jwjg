export const fruits = ['🍎', '🍋', '🍇', '🍈', '🍊'];

export const getFruitForStanceTitle = stances => {
  return stances.map((s, i) => ({
    ...s,
    fruit: fruits[s.orderNum],
  }));
};
