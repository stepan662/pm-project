
const mongodb = require('mongodb');

async function createNewDocument(collection) {
    const result = await collection.insertOne({
        history: []
    })
    return result.ops[0]
}

async function main(params) {
    const client = await mongodb.MongoClient.connect(params.mongoDbUri);

    const collection = await client.db('data').collection('users');

    let returnData = null

    if (!params.userId) {
        returnData = {
            user: await createNewDocument(collection)
        }
    }
    else {
        const data = await collection.find({
            _id: mongodb.ObjectId(params.userId)
        }).toArray();

        if (data.length > 0) {
            returnData = {
                user: data[0]
            }
        } else {
            returnData = {
                user: await createNewDocument(collection)
            }
        }
    }

    client.close()
    return returnData
}

module.exports = {
    main
}