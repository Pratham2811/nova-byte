import { ObjectId } from "mongodb";

export function normalizeDoc(doc) {
  if (!doc) {
    return doc;
  }
  const converted = {};
  if (doc._id) {
    converted.id = doc._id.toString();
    delete converted._id;
  }

  for (const key in doc) {
    if (key === "_id") continue;
    const value = doc[key];
    if (value instanceof ObjectId) {
      converted[key] = value.toString();
    } else if (Array.isArray(value)) {
      converted[key] = value.map((val) =>
        val instanceof ObjectId ? val.toString() : val
      );
    } else {
      converted[key] = value;
    }
  }

  return converted;
}
