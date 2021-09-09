const fs = require("fs");                                      //1   import file system
const myArgs = process.argv.slice(2);           //22
const { createCanvas, loadImage } = require("canvas");         //2 canvas used to load and create the image
const canvas = createCanvas(1000, 1000);                       //3     give width and hight of the image
//ctx is a varible .used for draw and create new shapes
const ctx = canvas.getContext("2d");                            //4     context underlying the canvas system
const {layers,width,height} =require("../input/config");       // 11 that comes into config.js file
const edition= myArgs.length > 0 ? Number(myArgs[0]) : 1;                                         //12 adding 1 edition nft

var metadata = [];           //23
var attributes = [];
var hash = [];
var decodedHash = [];

const saveLayer = (_canvas, _edition) =>       {                                       //8
  fs.writeFileSync(`../output/${_edition}.png`, _canvas.toBuffer("image/png"));        //21
 
};



const addMetadata = (_edition) => {            //24
    let dateTime = Date.now();
    let tempMetadata = {
      hash: hash.join(""),
      decodedHash: decodedHash,
      edition: _edition,
      date: dateTime,
      attributes: attributes,
    };
    metadata.push(tempMetadata);
    attributes = [];
    hash = [];
    decodedHash = [];
  };

  const addAttributes = (_element, _layer) => {     //26
    let tempAttr = {
      id: _element.id,
      layer: _layer.name,
      name: _element.name,
      rarity: _element.rarity,
    };
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push({ [_layer.id]: _element.id });
  };
  

const drawLayer = async (_layer,_edition) => {                                        //5 draw the image
  let element= _layer.elements[Math.floor(Math.random() * _layer.elements.length)]  //17    this is give us random element
  // console.log(element);
  addAttributes(element, _layer);
  const image = await loadImage(`${_layer.location}${element.fileName}`);            //18 location of file name that comes on layer
  ctx.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);       //19   // 6 ctx.drawImage(img,x,y,width,height);  
  console.log(`I created the ${_layer.name} layer, and chose elemnet ${element.name} `);  //20                  //ctx.drawImage(image, 200, 440, 1000, 1000);    // ctx.drawImage(image, 200, 440, 100, 100);  

  saveLayer(canvas, _edition);                                           //9 here is passing a global canvas that pas in line 4
};




for(let i=1; i<=edition; i++){                 //13  each edition run our program that is  drawLayer()
  layers.forEach(layer =>{                     //14
    drawLayer(layer ,i);                                //15   draw a image that comes in layers for each time
  });
  addMetadata(i);                //25
  console.log("Creating edition" + i);          //16
}



fs.readFile("../output/_metadata.json", (err, data) => {
    if (err) throw err;
    fs.writeFileSync("../output/_metadata.json", JSON.stringify(metadata));
  });

 