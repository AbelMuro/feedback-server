const db = require('../src/Config/MySQL/db.js');

exports.handler = async (event, context) => { 
    try{
        if(event.httpMethod === "OPTIONS") {   //preflight
            return { 
                statusCode: 200, 
                headers: { 
                    "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                    "Access-Control-Allow-Credentials": "true", 
                    "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                    "Access-Control-Allow-Methods": "GET, OPTIONS" 
                }, 
                body: "" 
            }; 
        }

        const params = event.queryStringParameters;
        const imageId = params.imageId;
        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE id = ?',
            [imageId]
        );

        const imageData = results[0];
        const blob = imageData.data;
        const mimeType = imageData.mime_type;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": mimeType,
                "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                "Access-Control-Allow-Credentials": "true", 
                "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                "Access-Control-Allow-Methods": "GET, OPTIONS" 
            },
            body: blob.toString('base64'),
            isBase64Encoded: true
        }
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }

}