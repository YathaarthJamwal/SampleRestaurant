var AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" })
const tablename = "SampleRestaurantTable";

var dbHelper = function() {};
var docClient = new AWS.DynamoDB.DocumentClient();

dbHelper.prototype.addItem = (itemname, quantity = 1, userID) => {

    return new Promise((resolve, reject) => {
        const params = {
            TableName: tablename,
            Item: {
                'ItemName': itemname,
                'ItemQuantity': quantity,
                'userID': userID
            }
        };

        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err));
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbHelper.prototype.getItem = (userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#userID = :user_id",
            ExpressionAttributeNames: {
                "#userID": "userId"
            },
            ExpressionAttributeValues: {
                ":user_id": userID
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            }
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
        })
    });
}

dbHelper.prototype.removeItem = (itemname, userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "userId": userID,
                "ItemName": itemname
            },
            ConditionExpression: "attribute_exists(ItemName)"
        }
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            }
            console.log(JSON.stringify(err));
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            resolve()
        })
    });
}

module.exports = new dbHelper();