const jwt = require('jsonwebtoken');
const db = require('../src/Config/MySQL/db.js');
const {config} = require('dotenv');
config();

exports.handler = async (event, context) => { 
    try { 

        if (event.httpMethod === "OPTIONS") {   //preflight
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

        const JWT_SECRET = process.env.JWT_SECRET; 
        const cookies = event.headers.cookie || ""; 
        const accessToken = cookies
            .split("; ")
            .find(c => c.startsWith("accessToken="))
            ?.split("=")[1]; 
            
        if(!accessToken) { 
            return { 
                statusCode: 401, 
                headers: { 
                    "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                    "Access-Control-Allow-Credentials": "true", 
                    "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                    "Access-Control-Allow-Methods": "GET, OPTIONS" 
                },
                body: "User is not logged in" 
            }; 
        } 
        
        const decoded = jwt.verify(accessToken, JWT_SECRET); 
        const imageId = decoded.image; 
        if (!imageId) { 
            return { 
                statusCode: 404, 
                headers: { 
                    "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                    "Access-Control-Allow-Credentials": "true", 
                    "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                    "Access-Control-Allow-Methods": "GET, OPTIONS" 
                },
                body: "User doesn't have an image" 
            }; 
        } 
        const [rows] = await db.execute( 
            "SELECT data, mime_type FROM account_images WHERE id = ?", 
            [imageId] 
        ); 
        
        if (!rows.length) { 
            return { 
                statusCode: 404, 
                headers: { 
                    "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                    "Access-Control-Allow-Credentials": "true", 
                    "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                    "Access-Control-Allow-Methods": "GET, OPTIONS" 
                },
                body: "Image not found" 
            }; 
        } 
        
        const { data, mime_type } = rows[0]; 
        
        return { 
            statusCode: 200, 
            headers: { 
                "Content-Type": mime_type, 
                "Access-Control-Allow-Origin": "https://feedback-front-end.netlify.app", 
                "Access-Control-Allow-Credentials": "true", 
                "Access-Control-Allow-Headers": "Content-Type, Authorization", 
                "Access-Control-Allow-Methods": "GET, OPTIONS" 
            },
            body: data.toString("base64"), 
            isBase64Encoded: true 
        }; 
    } 
    
    catch (err) { 
        return { statusCode: 500, body: err.message }; 
    } 
};