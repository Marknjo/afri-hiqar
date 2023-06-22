/**
 * Filters unwanted fields given array of strings and an object of data value pair
 * @param fields Array of fields to filter
 * @param  dataObj Object to filter its keys
 * @returns Filtered fields, key:value object
 */
export function filterRequiredFields<T extends { [key: string]: any }>(
  fields: Array<string>,
  dataObj: { [key: string]: any },
): T {
  const dataFields = new Map(Object.entries(dataObj))

  return fields.reduce((curr: { [key: string]: any }, field) => {
    if (dataFields.has(field)) curr[field] = dataObj[field]
    return curr
  }, {}) as T
}
