
const fs = require("fs");                                      //1   import file system
const { createCanvas, loadImage } = require("canvas");         //2 canvas used to load and create the image
const canvas = createCanvas(1000, 1000);                       //3     give width and hight of the image
//ctx is a varible .used for draw and create new shapes
const ctx = canvas.getContext("2d");                            //4     context underlying the canvas system
const {layers,width,height} =require("../input/config");       // 11 that comes into config.js file
const edition=10;                                          //12 adding 1 edition nft

const saveLayer = (_canvas, _edition) =>       {                                       //8
  fs.writeFileSync(`../output/${_edition}.png`, _canvas.toBuffer("image/png"));        //21
 
};

const drawLayer = async (_layer,_edition) => {                                        //5 draw the image
  let element= _layer.elements[Math.floor(Math.random() * _layer.elements.length)]  //17    this is give us random element
  // console.log(element);
  const image = await loadImage(`${_layer.location}${element.fileName}`);            //18 location of file name that comes on layer
  ctx.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);       //19   // 6 ctx.drawImage(img,x,y,width,height);  
  console.log(`I created the ${_layer.name} layer, and chose elemnet ${element.name} `);  //20                  //ctx.drawImage(image, 200, 440, 1000, 1000);    // ctx.drawImage(image, 200, 440, 100, 100);  

  saveLayer(canvas, _edition);                                           //9 here is passing a global canvas that pas in line 4
};




for(let i=1; i<=edition; i++){                 //13  each edition run our program that is  drawLayer()
  layers.forEach(layer =>{                     //14
    drawLayer(layer ,i);                                //15   draw a image that comes in layers for each time
  });

  console.log("Creating edition" + i);          //16
}

 