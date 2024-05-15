// const dataTypes = ['VAR CHAR', 'DATE', 'INT', 'BIGINT']

// export const dataTypesJson = Object.keys(json1).reduce((acc:Record<string, string>, key) =>  {
//     const datatype = Math.floor(Math.random() * dataTypes.length);
//     acc[key] = dataTypes[datatype];
//     return acc;
// },{} as Record<string, string>);


export default class HandleDataTypes {


    transformDataType(data:string, translateObj?:Record<string, any>) {
        const translateObject = {
            'date':'timestamp',
        }
    
        const obj:Record<string, any> = {...translateObject, ...(translateObj ?? {})};
    
    
        const isString = /char/i.test(data);

        const hasNumber = /number/i.test(data);
        const hasComma = /,/i.test(data);

        const isInteger = hasNumber && !hasComma;
        const isDecimal = hasNumber && hasComma;
        
        return isString ? (translateObj?.string ?? 'string') : (isInteger ? (translateObj?.int ?? 'int') : (isDecimal ? {type:'decimal', precision:data.split('(')[1].split(',')[0], scale:data.split('(')[1].split(',')[1].split(')')[0]} : obj[data]));
    
    };

    migrate({ mainDict, dataTypesDict, translateObj }:{ mainDict:Record<string, string>, dataTypesDict:Record<string, string>, translateObj?:Record<string, string> }) {
    
        const dataTypesDictLower = Object.entries(dataTypesDict).reduce((acc2:Record<string, string>, entry) => {
            acc2[(entry[0].toLowerCase())] = entry[1] as string;
            return acc2
        }, {} as Record<string, string>);
    
        const migrated = Object.keys(mainDict).reduce((acc:Record<string, string>, key) => {
            const keyLower = key.toLowerCase();
    
            if(!!dataTypesDictLower[keyLower]) {
                acc[key] = this.transformDataType(dataTypesDictLower[keyLower], translateObj);
            }
    
            return acc;
        }, {} as Record<string, string>);
    
        return migrated;
    
    };

};

