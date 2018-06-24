const mongodb = require('mongodb');
const request = require('request')

async function updateDb(collection, userId, message, watsonMessage) {
    try {
        const data = await collection.findOneAndUpdate({
            _id: mongodb.ObjectId(userId)
        }, {
            $push: {
                history: { $each: [{
                    message,
                    fromUser: true,
                    timestamp: Date.now()
                }, {
                    message: watsonMessage,
                    fromUser: false,
                    timestamp: Date.now() + 1
                }]}
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

async function callWatson(watsonUri, watsonUserName, watsonPassword, watsonContext, message) {
    return new Promise((resolve, reject) => {
        request.post({
            headers: {'content-type' : 'application/json'},
            url: watsonUri,
            auth: {
                user: watsonUserName,
                pass: watsonPassword,
            },
            json: {
                ...watsonContext,
                input: {
                    text: message
                }
            },
        }, function(error, response, body){
            if(error){
                reject({error: 'watson url'});
            }
            resolve(body);
        });
    });
}

async function main(params) {
    if (('userId' in params === false)) {
        return {
            error: 'expecting keys: userId, message'
        }
    }

    const client = await mongodb.MongoClient.connect(params.mongoDbUri);
    const collection = await client.db('data').collection('users');

    const watsonResponse = await callWatson(
        params.watsonUri,
        params.watsonUserName,
        params.watsonPassword,
        params.watsonContext,
        params.message
    )

    console.log(watsonResponse)

    const dbData = await updateDb(
        collection,
        params.userId,
        params.message,
        watsonResponse.output.text.join(' ')
    )

    client.close()
    return {
        conversation_id: watsonResponse.context.conversation_id,
        ...dbData
    }
}

module.exports = {
    main
}