/**
 * Implements advanced find features
 *
 *  - Basic Filtering,
 *  - Advanced filtering,
 *  - Field selecting,
 *  - sorting fields,
 *  - and paginating requests
 */

import { Model, Query } from 'mongoose'
import { IQueryString } from './types'

class FindFeatures<T> {
  query: Query<any, T> | Model<T>

  queryStr: IQueryString = {}

  /**
   *
   * @param query Calling object;
   * @param queryStr Request query object
   */
  constructor(query: Query<any, T> | Model<T>, queryStr: IQueryString = {}) {
    this.queryStr = queryStr
    this.query = query
  }

  // HELPER METHODS
  _formatQueryFields(str: string) {
    return str.split(',').join(' ')
  }

  // FEATURES
  // FILTERING
  filterQuery() {
    let queryStr = { ...this.queryStr }

    // Filter fields that are not in the table [sort, fields, page, limit]
    const filterFields = ['sort', 'fields', 'page', 'limit']

    filterFields.forEach(el => delete queryStr[el as keyof IQueryString])

    //Advanced filtering
    queryStr = JSON.parse(
      JSON.stringify(queryStr).replace(
        /\b(gt|gte|lt|lte)\b/g,
        match => `$${match}`,
      ),
    )

    // Create query;
    this.query = (this.query as Query<any, T>).find(queryStr)

    return this
  }

  // FIELDS
  limitFields() {
    const requestedFields = this.queryStr.fields
    if (requestedFields) {
      const formattedFields = this._formatQueryFields(requestedFields)
      //return query

      this.query = (this.query as Query<any, T>).select(formattedFields)
    } else {
      // do not show __v field
      this.query = (this.query as Query<any, T>).select('-__v')
    }

    return this
  }

  // SORTING
  sortBy() {
    const sortByRequest = this.queryStr.sort
    if (sortByRequest) {
      const formattedSortingFields = this._formatQueryFields(sortByRequest)
      //return query
      this.query = (this.query as Query<any, T>).sort(formattedSortingFields)
    } else {
      // do not show __v field
      this.query = (this.query as Query<any, T>).sort('-createdAt')
    }

    return this
  }

  // PAGINATION
  paginate() {
    // page, limit, skip
    const { page, limit } = this.queryStr

    // Requested page
    const reqPage = +page! || 1

    // Requested Limit
    const reqLimit = +limit! || 100

    // Pages to skip
    const skipPages = (reqPage - 1) * reqLimit

    // Construct query
    this.query = (this.query as Query<any, T>).skip(skipPages).limit(reqLimit)

    // return query
    return this
  }
}

export default FindFeatures
