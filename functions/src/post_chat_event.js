const mongodb = require('mongodb');

async function update_db(
    collection,
    userId,
    message,
    fromUser
) {
    try {
        const data = await collection.findOneAndUpdate({
            _id: mongodb.ObjectId(userId)
        }, {
            $push: {
                history: {
                    message,
                    fromUser,
                    timestamp: Date.now()
                }
            }
        }, {
            returnOriginal: false
        })
        return {
            user: data.value
        }
    } catch(e) {
        return {
            error: "couldn't update db"
        }
    }
}

async function main(params) {
    if (('userId' in params === false)) {
        return {
            error: 'expecting keys: userId, message, fromUser(bool)'
        }
    }

    const client = await mongodb.MongoClient.connect(params.mongoDbUri);
    const collection = await client.db('data').collection('users');

    const response = await update_db(
        collection,
        params.userId,
        params.message,
        params.fromUser
    )

    client.close()
    return response
}

module.exports = {
    main
}