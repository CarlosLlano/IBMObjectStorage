# ACCESO A IBM OBJECT STORAGE SIN TOKEN TEMPORAL #

***Generar credenciales***
![captura de pantalla 2018-04-19 a la s 2 38 17 p m](https://user-images.githubusercontent.com/17281733/39014766-ed9079f4-43e0-11e8-953c-24e895f49b9f.png)

![captura de pantalla 2018-04-19 a la s 2 50 17 p m](https://user-images.githubusercontent.com/17281733/39014838-09cd44d0-43e1-11e8-8c53-f6fb17ce89d0.png)

![captura de pantalla 2018-04-19 a la s 2 51 10 p m](https://user-images.githubusercontent.com/17281733/39015007-a2d1c6c4-43e1-11e8-9c0c-9786a36eb363.png)


Con estas credenciales se puede acceder usando aws cli o una libreria para un lenguaje de programacion.
A continuación, se muestra ejemplo de cada uno


___


***Acceso con cliente de aws***

documentacion: https://console.bluemix.net/docs/services/cloud-object-storage/cli/aws-cli.html#use-the-aws-cli

operaciones permitidas: https://www.ibm.com/support/knowledgecenter/en/STXNRM_3.12.2/coss.doc/aws_cli_c_examples.html

recordar: en el paso anterior se definio 
```bash
"access_key_id": "cb611f4408b340bd82e3d07248174d7f",
"secret_access_key": "0ec52497614e830862654becb6224810d4f8deced0344307"
```

comandos:

```bash
pip install awscli
aws configure
```
![captura de pantalla 2018-04-19 a la s 3 01 58 p m](https://user-images.githubusercontent.com/17281733/39015311-a611dc4c-43e2-11e8-84d9-e219c123625c.png)


Con esto ya se tiene la conexion al object storage. 
Algunas comandos utiles son:

Ver buckets
```bash
aws --endpoint-url=https://s3-api.us-geo.objectstorage.softlayer.net s3 ls
```

Ver contenido del bucket con nombre "username-mywebsite"
```bash
aws --endpoint-url=https://s3-api.us-geo.objectstorage.softlayer.net/ s3 ls s3://username-mywebsite
```

Subir archivo a bucket con nombre "username-mywebsite"
```bash
aws --endpoint-url=https://s3-api.us-geo.objectstorage.softlayer.net/ s3 cp someFile.txt s3://username-mywebsite
```

Descargar archivo de bucket "username-mywebsite"
```bash
aws --endpoint-url=https://s3-api.us-geo.objectstorage.softlayer.net/ s3 cp s3://username-mywebsite/someFile.txt someFile.txt
```

___

***Acceso con libreria de nodejs***

documentacion: https://console.bluemix.net/docs/services/cloud-object-storage/libraries/node.html#node-js

se debe instalar la libreria:
```bash
npm install ibm-cos-sdk
```

Conexion:
```js
var AWS = require('ibm-cos-sdk');
var config = {
    endpoint: "https://s3-api.us-geo.objectstorage.softlayer.net/",
    accessKeyId: "cb611f4408b340bd82e3d07248174d7f",
    secretAccessKey: "0ec52497614e830862654becb6224810d4f8deced0344307",
};
var cos = new AWS.S3(config);
```

Algunos casos de uso:

```js
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

//Subir Archivo
function doCreateObject() {
    console.log('Subiendo archivo');
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
    console.log('Descargando Archivo')
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
    console.log('Borrando archivo');
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

```

