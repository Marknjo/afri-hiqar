// IMPORT MODULES
// Global Modules
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// import process from 'process'
import fs from 'fs'
import path from 'path'

// /// INIT MONGO DB
// // - Configure database connection for local loading of data to the db
import '../config/mongo.config'

import Tour from '../models/tourModel'
import User from '../models/userModel'
import Review from '../models/reviewModel'
// import { EModelNames } from '../lib/modules'
export enum EModelNames {
  TOUR = 'tour',
  BOOKING = 'booking',
  REVIEW = 'review',
  USER = 'user',
  MEDIA = 'media',
  API = 'api',
}

/// LOAD JSON FILES
//- Load tours data
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf-8'),
)

//-  load users data
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'),
)

//-  load reviews data

const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf-8'),
)

///  IMPORT DATA TO DB HELPER FUNCTION
const importCollection = async (collection: EModelNames) => {
  try {
    switch (collection) {
      case EModelNames.TOUR:
        console.log(`Importing ${collection} data... \n`)
        await Tour.create(tours, { validateBeforeSave: false })
        console.log(
          '🤪🤪🤪 Tour data imported to tour collections successfully..\n',
        )
        break

      case EModelNames.REVIEW:
        console.log(`Importing ${collection} data...\n`)
        await Review.create(reviews)
        console.log(
          '🤪🤪🤪 Reviews data imported to tour collections successfully..\n',
        )
        break

      case EModelNames.USER:
        console.log(`Importing ${collection} data...\n`)
        await User.create(users, { validateBeforeSave: false })
        console.log(
          '🤪🤪🤪 Users data imported to tour collections successfully. \n',
        )
        break

      // collection === all
      default:
        console.log(`Importing ${collection} collections data... \n`)
        await Tour.create(tours)

        await User.create(users, { validateBeforeSave: false })

        await Review.create(reviews)

        console.log('🤪🤪🤪 Tours/Users/Reviews data imported successfully.\n')
        break
    }
  } catch (error: unknown) {
    const err = error as Error

    console.log(`💥💥💥 Error during import: ${err.message} \n ${err.stack}\n`)
  }
}

/// WIPE DATA FROM DB COLLECTION
const wipeCollection = async (collection: EModelNames) => {
  try {
    switch (collection) {
      case EModelNames.TOUR:
        console.log(`Deleting ${collection} data...\n`)
        await Tour.deleteMany()
        console.log('🚮🚮🚮 Tour data wiped successfully.\n')
        break

      case EModelNames.REVIEW:
        console.log(`Deleting ${collection} data...\n`)
        await Review.deleteMany()
        console.log('🚮🚮🚮  Reviews data wiped successfully.\n')
        break

      case EModelNames.USER:
        console.log(`Deleting ${collection} data...\n`)
        await User.deleteMany()
        console.log('🚮🚮🚮 Users data wiped successfully.\n')
        break

      // collection === all
      default:
        console.log(`Wiping ${collection} collections data...\n`)
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()

        console.log('🚮🚮🚮 Tours/Users/Reviews data wiped successfully.\n')
        break
    }
  } catch (error) {
    const err = error as Error
    console.log(`💥💥💥 Error Deleting: ${err.message} \n ${err.stack}\n`)
  }
}

/// GET CMD FLAGS/ARGS
//-  --import-user --import-all --import-review --import-tour
//-  --wipe-user --wipe-all --wipe-review --wipe-tour

//-  Import CMD Arguments/Scripts
//-  import: node :dev-data/data/load-data.js --import-all
//-  import:user :node dev-data/data/load-data.js --import-user
//-  import:review :node dev-data/data/load-data.js --import-review
//-  import:tour :node dev-data/data/load-data.js --import-tour

//-  Wipe CMD Arguments/Scripts
//-  wipe: node dev-data/data/load-data.js --wipe-tour
//-  wipe:user :node dev-data/data/load-data.js --wipe-user
//-  wipe:review :node dev-data/data/load-data.js --wipe-review
//-  wipe:all :node dev-data/data/load-data.js --wipe-all

const argResponse = process.argv.at(-1)?.split('-') // Does not work with typescript
const actionType = argResponse?.at(2)
const collection = argResponse?.at(-1)

const loadData = async () => {
  if (!actionType || !collection) {
    console.warn(
      "\n Looks like you've forgot to provide an argument in your query",
    )
    return
  }
  try {
    // Set CMD Allowed Data Types
    const allowedCollections = ['user', 'tour', 'review', 'all']
    const allowedActionTypes = ['import', 'wipe']

    // Validate before loading data
    if (!allowedActionTypes.includes(actionType)) {
      throw new Error(
        `${actionType} is an invalid action type, expects (import or wipe)!`,
      )
    }

    if (!allowedCollections.includes(collection)) {
      throw new Error(`${collection} is an invalid collection!`)
    }

    // Check Action type
    if (actionType === 'import') {
      await importCollection(collection as EModelNames)
      return
    }

    // Delete data
    if (actionType === 'wipe') {
      await wipeCollection(collection as EModelNames)
      return
    }
  } catch (error) {
    const err = error as Error
    console.log(`💥💥💥 ERROR: ${err.message} \n ${err.stack} \n`)
  } finally {
    console.log('⚙⚙⚙ Shutting down nodejs...')
    process.exit()
  }
}

loadData()

console.log('Running DataLoader 🚒🚒🚒 \n')
console.table({ actionType, collection })
