export const getSeconds = (millis) => ~~(millis / 1000).toFixed(0);

// MD: We need to start with the latest data and work backwards in time
export const getAllOfResource = async (condition, getFirst, getRest) => {
  const latest = await getFirst();

  let run = true;

  let results = [...latest.result];

  if (!results.length) return [];

  while (run) {
    const oldestEntry = results.slice(-1)[0];

    let oldestDate;

    if (oldestEntry.hasOwnProperty("time")) {
      oldestDate = new Date(oldestEntry.time);
    } else if (oldestEntry.hasOwnProperty("createdAt")) {
      oldestDate = new Date(oldestEntry.createdAt);
    } else {
      throw new Error("Property not found on result");
    }

    const oldestDateInSeconds = getSeconds(oldestDate.getTime());

    let resource = await getRest(oldestDateInSeconds);

    results = [...results, ...resource.result];

    if (condition(resource)) {
      run = false;
    }
  }

  return results;
};

export const getAllFunding = async (client, future, beginingDate, endDate) => {
  const isEndOfResource = (resource) => {
    return (
      resource.result.length < 100 ||
      resource.result.some((r) => {
        return (
          getSeconds(new Date(r.time).getTime()) <
          new Date(beginingDate).getTime()
        );
      })
    );
  };

  const getLatestPayments = () => {
    return client.getFundingPayments({
      end_time: endDate,
      future,
    });
  };

  const getNextPayments = (oldestNextDate) => {
    return client.getFundingPayments({ end_time: oldestNextDate, future });
  };

  const results = await getAllOfResource(
    isEndOfResource,
    getLatestPayments,
    getNextPayments
  );

  return results;
};

export const getAllOrdersHistory = async (
  client,
  market,
  beginingDate,
  endDate
) => {
  const isEndOfResource = (resource) => {
    return !resource.hasMoreData;
  };

  const getLatestOrders = () => {
    return client.getOrderHistory({
      end_time: endDate,
      market,
    });
  };

  const getNextOrders = (oldestNextDate) => {
    return client.getOrderHistory({ end_time: oldestNextDate, market });
  };

  const results = await getAllOfResource(
    isEndOfResource,
    getLatestOrders,
    getNextOrders
  );

  return results;
};
