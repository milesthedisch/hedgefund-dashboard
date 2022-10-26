const isInsideString = (string, match) => {
  return string.indexOf(match) > -1;
};

const matchPositionsWithBalanes = (positions, balances) => {
  if (!positions.success) {
    console.error("Could not fetch positions");
    throw "Bad positions";
  }

  if (!balances.success) {
    console.error("Could not fetch balances");
    throw "Bad balances";
  }

  if (positions.result.length === 0) {
    return { result: [] };
  }

  const groupedPos = {};

  positions.result.forEach((r) => {
    const tickerA = r.future.split("-")[0];

    // Check if the position has already been matched
    if (Object.keys(groupedPos).length > 0) {
      const alreadyMatched = Object.entries(groupedPos).some((pos: any) => {
        return pos[1].some((p) => p.future === r.future);
      });

      if (alreadyMatched) return;
    }

    const matchBalance = balances.result.find((bal) => {
      return bal.coin === tickerA;
    });

    const match = positions.result.find((pos) => {
      if (pos.future === r.future) return false;
      const tickerB = pos.future.split("-")[0];
      return isInsideString(tickerB, tickerA);
    });

    if (match) {
      groupedPos[`${r.future}/${match.future}`] = [r, match];
    }

    if (matchBalance) {
      groupedPos[`${r.future}/${matchBalance.coin}`] = [r, matchBalance];
    }
  });

  return groupedPos;
};

export default matchPositionsWithBalanes;
