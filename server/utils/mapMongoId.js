// utils/mapMongoId.js
export const mapMongoId = (doc) => {
  if (!doc) return doc;

  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
};
