var AWS = require('ibm-cos-sdk');
var util = require('util');
var fs = require('fs');

//Configuracion
var config = {
    endpoint: "https://s3-api.us-geo.objectstorage.softlayer.net/",
    accessKeyId: "d71b9e42144346bda69a7174984ca12a",
    secretAccessKey: "d2c6086c5713370065c1678932a22677424aded4d97da3fc",
};
var cos = new AWS.S3(config);

var bucket = 'gepbucketcali'

//Crear Bucket
function doCreateBucket() {
    console.log('Creando bucket');
    cos.createBucket({
        Bucket: bucket,
        CreateBucketConfiguration: {
          LocationConstraint: 'us-standard'
        },
    }).promise();
}

//Crear Objeto
function doCreateObject() {
    console.log('Creando objeto');
    //Cargar archivo
    var fileStream = fs.createReadStream('randompdf.pdf');
    fileStream.on('error', function(err) {
    console.log('File Error', err);
    });
    cos.putObject({
        Bucket: bucket,
        Key: 'randompdf.pdf',
        Body: fileStream
    }).promise();
}

//Descargar archivo
function doGetObject(){
    console.log('Obteniendo Objeto')
    cos.getObject({
        Bucket: bucket, 
        Key: "randompdf.pdf" }, function(err, data){
            if (err){
                console.log(err)
            }
            else{
                content=data.Body
                fs.writeFile('download.pdf', content, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Archivo descargado!");
                })
            }
        }
    );
}


//Borrar archivo
function doDeleteObject() {
    console.log('Borrando objeto');
    cos.deleteObject({
        Bucket: bucket,
        Key: 'randompdf.pdf'
    }).promise();
}

//Borrar bucket
function doDeleteBucket() {
    console.log('Borrando bucket');
    cos.deleteBucket({
        Bucket: bucket
    }).promise();
}

//doCreateBucket()
//doCreateObject()
//doGetObject()
//doDeleteObject()
//doDeleteBucket()