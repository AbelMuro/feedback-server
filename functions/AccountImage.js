const jwt = require('jsonwebtoken');
const db = require('../../src/Config/MySQL/db.js');
const {config} = require('dotenv');
config();


exports.handler = async (event, context) => { 
    try { 
        const JWT_SECRET = process.env.JWT_SECRET; 
        const cookies = event.headers.cookie || ""; 
        const accessToken = cookies
            .split("; ")
            .find(c => c.startsWith("accessToken="))
            ?.split("=")[1]; 
            
        if (!accessToken) { 
            return { 
                statusCode: 401, 
                body: "User is not logged in" 
            }; 
        } 
        
        const decoded = jwt.verify(accessToken, JWT_SECRET); 
        const imageId = decoded.image; 
        if (!imageId) { 
            return { 
                statusCode: 404, 
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
                body: "Image not found" }; 
        } 
        
        const { data, mime_type } = rows[0]; 
        
        return { 
            statusCode: 200, 
            headers: { "Content-Type": mime_type },
            body: data.toString("base64"), 
            isBase64Encoded: true 
        }; 
    } 
    
    catch (err) { 
        return { statusCode: 500, body: err.message }; 
    } 
};