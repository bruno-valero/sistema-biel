
const json1 = {
    param_1:'',
    param_2:'',
    param_3:'',
    param_4:'',
    param_5:'',
    param_6:'',
    param_7:'',
    param_8:'',
    param_9:'',
    param_10:'',
    param_11:'',
    param_12:'',
    param_13:'',
};

function shuffleArray(array:string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export const tranlationDict = Object.keys(json1).reduce((acc:Record<string, string>, key) =>  {
    
    acc[key] = shuffleArray(key.split('')).join('');
    return acc;
},{} as Record<string, string>);




export function translate(json:string, tranlationDict:Record<string, string>) {

    const parsed = JSON.parse(json);
    const resp = Object.keys(parsed).reduce((acc:Record<string, string>, key) => {
        const newKey = tranlationDict[key];
        acc[newKey ?? key] = parsed[key];
        return acc;
    },{} as Record<string, string>)

    return resp;

}

const translated = translate(JSON.stringify(json1), tranlationDict);