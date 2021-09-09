  // this config file is doing setup our project and reuseable of our code
const fs = require("fs");                            //8
const width = 1000;                                  //6
const height = 1000;
const dir = __dirname;                                //2
//console.log(dir);
const rarity = [                                      //10
  { key: "", val: "original" },
  { key: "_r", val: "rare" },
  { key: "_sr", val: "super rare" },
];

const addRarity = (_str) => {                        //14
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });
  return itemRarity;
};

const cleanName = (_str) => {                
  let name = _str.slice(0, -4);                 //  9  slice cut (.png) last  4  characters
  rarity.forEach((r) => {                       //  10 then in rarity check r.key value and replace in to empty string eg, ""
    name = name.replace(r.key, "");
  });
  return name;                                   //11 this give a simple name of the fileName without _r and _sr
};

const getElements = (path) => {                   //7 this function is used for get the elements in ther folders(eg: ./input/background) and populate in the ##layer element
  return fs                                        //8
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),                       //12 name of the filename
        fileName: i,                              //13  filename
        rarity: addRarity(i),                     //14 add rarity
      };
    });
};

const layers = [                                   //1   make layer in a array json
  {
    id: 1,                                         //1
    name: "background",
    location: `${dir}/background/`,                //3
    elements: getElements(`${dir}/background/`),   //4
    position: { x: 0, y: 0 },                      //5
    size: { width: width, height: height },        //6
  },
  {
    id: 2,
    name: "ball",
    location: `${dir}/ball/`,
    elements: getElements(`${dir}/ball/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 3,
    name: "eye color",
    location: `${dir}/eye color/`,
    elements: getElements(`${dir}/eye color/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 4,
    name: "iris",
    location: `${dir}/iris/`,
    elements: getElements(`${dir}/iris/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 5,
    name: "shine",
    location: `${dir}/shine/`,
    elements: getElements(`${dir}/shine/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 6,
    name: "bottom lid",
    location: `${dir}/bottom lid/`,
    elements: getElements(`${dir}/bottom lid/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 7,
    name: "top lid",
    location: `${dir}/top lid/`,
    elements: getElements(`${dir}/top lid/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
];


//console.log(layers);
//console.log(layers[1].elements);                   //13

module.exports = { layers, width, height };