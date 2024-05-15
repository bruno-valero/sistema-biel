import Tables from '@/src/tables';


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

const translationJson1 = {
    param_1:'param_1',
    param_2:'param_2',
    param_3:'param_3',
    param_4:'param_4k',
    param_5:'param_5',
    param_6:'param_6h',
    param_7:'param_7',
    param_8:'param_8',
    param_9:'param_9h',
    param_10:'param_10',
    param_11:'param_11h',
    param_12:'param_12h',
    param_13:'param_13',
};


const dataTypesDict = {        
    "param_1": "NUMBER(10)",     
    "param_2": "NUMBER(22,7)",  
    "param_3": "NUMBER(10)",  
    "param_4": "NUMBER(10)",     
    "param_5": "CHAR(155BYTE)",
    "param_6": "CHAR(2CHAR)",
    "param_7": "CHAR(155BYTE)",
    "param_8": "VARCHAR()",
    "param_9": "DATE",
    "param_10": "NUMBER(10)",
    "param_11": "DATE",
    "param_12": "DATE",
    "param_13": "NUMBER(15,3)"
};

const table = new Tables();


// table.load({ id:'s_src', data:json1, tranlationDict:translationJson1, dataTypesDict });

table.getDateTypes({ id:'json1' })
console.log(table.dataTypes)





