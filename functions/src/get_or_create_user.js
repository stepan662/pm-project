const mongodb = require('mongodb');
const request = require('request');

async function createNewDocument(collection, firstMessage) {
    const result = await collection.insertOne({
        history: [{
            message: firstMessage,
            fromUser: false,
            timestamp: Date.now()
        }]
    })
    return result.ops[0]
}

async function firstCallWatson(watsonUri, watsonUserName, watsonPassword) {
    return new Promise((resolve, reject) => {
        request.post({
            headers: {'content-type' : 'application/json'},
            url: watsonUri,
            auth: {
                user: watsonUserName,
                pass: watsonPassword,
            }
        }, function(error, response, body){
            if(error){
                reject({error: 'watson url'});
            }
            resolve(JSON.parse(body));
        });
    });
}

async function main(params) {

    const client = await mongodb.MongoClient.connect(params.mongoDbUri);

    const collection = await client.db('data').collection('users');

    let user = null

    const watsonResponse = await firstCallWatson(params.watsonUri, params.watsonUserName, params.watsonPassword)

    const firstMessage = watsonResponse.output.text.join(' ')

    if (!params.userId) {
        user = await createNewDocument(collection, firstMessage)
    }
    else {
        const data = await collection.find({
            _id: mongodb.ObjectId(params.userId)
        }).toArray();

        if (data.length > 0) {
            user = data[0]
        } else {
            user = await createNewDocument(collection, firstMessage)
        }
    }

    client.close()
    return {
        watsonContext: watsonResponse.context,
        user
    }
}

module.exports = {
    main
}