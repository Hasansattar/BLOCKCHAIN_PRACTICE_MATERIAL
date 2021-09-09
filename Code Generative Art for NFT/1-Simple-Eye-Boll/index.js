const fs = require("fs");                             //1   import file system
const { createCanvas, loadImage } = require("canvas"); //2 canvas used to load and create the image
const canvas = createCanvas(1000, 1000);             //3     give width and hight of the image
//ctx is a varible .used for draw and create new shapes
const ctx = canvas.getContext("2d");              //4     context underlying the canvas system

const saveLayer = (_canvas) =>       {                                       //8
  fs.writeFileSync("./output/newImage.png", _canvas.toBuffer("image/png"));
  console.log("Image Created");                             //10
};

const drawLayer = async () => {                    //5 draw the image
  const image = await loadImage("./image/eyeball.png");
  ctx.drawImage(image, 0, 0, 1000, 1000);          // 6 ctx.drawImage(img,x,y,width,height);  
  console.log("this ran.");                       //ctx.drawImage(image, 200, 440, 1000, 1000); 
                                                   // ctx.drawImage(image, 200, 440, 100, 100);  

  saveLayer(canvas);                              //9 here is passing a global canvas that pas in line 4
};

drawLayer();                                      //7
