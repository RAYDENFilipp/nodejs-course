const randomIndex = indices => Math.floor(Math.random() * indices);

const getRandomEntityIdCreator = entityList => {
  const entityListCopy = [...entityList];

  return () => {
    const indices = entityListCopy.length;

    if (indices) {
      const entityIndex = randomIndex(indices);
      const entityId = entityListCopy[entityIndex].id;

      entityListCopy.splice(entityIndex, 1);

      return entityId;
    }

    return null;
  };
};

module.exports = {
  getRandomEntityIdCreator
};
