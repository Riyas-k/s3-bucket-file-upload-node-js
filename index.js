import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const json = express.json();
const PORT = 3000;
import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

app.use(json);
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

 let s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESKEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

app.post('/',async({files},res)=>{
    const uploadParams = {
        Bucket:'sampleupload',
        Key:files.file.name,
        Body:Buffer.from(files.file.data),
        ContentType:files.file.mimetype,
        ACL:'public-read'
    }
   await s3.upload(uploadParams,function(err,data){
        err&&console.log(err);
        data&&console.log(data.Location);
    })
    res.send('OK')
});
 app.listen(PORT,()=>console.log('server started'))