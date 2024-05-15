import fs from 'fs';
import { resolve } from 'path';
import HandleDataTypes from './migrate';


export default class Tables {

    protected _table:null | Record<string, any> = null;
    protected _translateDict:null | Record<string, any> = null;
    protected _handleDataTypes = new HandleDataTypes();
    protected _dataTypes:Record<string, any> | null = null;

    get table() {
        return this._table;
    }

    get translateDict() {
        return this._translateDict;
    }

    get dataTypes() {
        return this._dataTypes;
    }

    setOriginalData({ id, data }:{ id:string, data:Record<string, any> }) {

        const dbDirectory = resolve(__dirname, 'db', id);
        const dbPath = resolve(dbDirectory, 'originalData.json');
        this.save({ dbDirectory, dbPath, data })
        this._table = data;
    };

    save({ dbDirectory, dbPath, data }:{ dbDirectory:string, dbPath:string, data:Record<string, any> }) {
        const exists = fs.existsSync(dbDirectory);
        if (!exists) {
            fs.mkdirSync(dbDirectory, { recursive:true })
        }
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));        
    }

    getTable({ id }:{ id:string }) {

        const jsonPth = resolve(__dirname, 'db', id, 'originalData.json');
        const exists = fs.existsSync(jsonPth);
        if (exists) {
            const json = fs.readFileSync(jsonPth, 'utf-8');
            this._table = JSON.parse(json);
            return json;
        }
        return null;
    };

    protected translateWithKeyReplace({ data, tranlationDict }:{ data:Record<string, any>, tranlationDict:Record<string, string> }) {
        const replaceKey = Object.keys(data).reduce((acc:Record<string, string>, key) => {
            const newKey = tranlationDict[key];
            acc[newKey ?? key] = data[key];
            return acc;
        },{} as Record<string, string>);

        return replaceKey
    }

    protected translateWithTranslationOnValue({ data, tranlationDict }:{ data:Record<string, any>, tranlationDict:Record<string, string> }) {
        const oldKeyAndNewKey = Object.keys(data).reduce((acc:Record<string, string>, key) => {
            acc[key] = tranlationDict[key];
            return acc;
        }, {} as Record<string, string>);

        return oldKeyAndNewKey
    }

    translate({ data, tranlationDict, dictId }:{ data:Record<string, any>, tranlationDict:Record<string, string>, dictId:string }) {


        const replaceKey = this.translateWithKeyReplace({ data, tranlationDict });

        const oldKeyAndNewKey = this.translateWithTranslationOnValue({ data, tranlationDict });

        const dbDirectory = resolve(__dirname, 'db', dictId);
        const replaceKeyDirectory = resolve(dbDirectory, 'replaceKey.json');
        const oldKeyAndNewKeyDirectory = resolve(dbDirectory, 'oldKeyAndNewKey.json');

        this.save({ dbDirectory, dbPath:replaceKeyDirectory, data:replaceKey });
        this.save({ dbDirectory, dbPath:oldKeyAndNewKeyDirectory, data:oldKeyAndNewKey });

        this._translateDict = oldKeyAndNewKey;
    
        return { replaceKey, oldKeyAndNewKey };
    
    }

    getTranslateDict({ id }:{ id:string }) {
        const jsonPth = resolve(__dirname, 'db', id, 'oldKeyAndNewKey.json');
        const exists = fs.existsSync(jsonPth);
        if (exists) {
            const json = fs.readFileSync(jsonPth, 'utf-8');
            const data = JSON.parse(json) as Record<string, string>;
            this._translateDict = data;
            return data;
        }
        return null;
    };

    handleDataTypes({ mainDict, dataTypesDict, translateObj, dictId }:{ mainDict:Record<string, any>, dataTypesDict:Record<string, any>, translateObj?:Record<string, string>, dictId:string }) {
        const hd = this._handleDataTypes;
        const transformedData = hd.migrate({ mainDict, dataTypesDict, translateObj });

        const translatedDict = this.getTranslateDict({ id:dictId });
         if (translatedDict) {
            const translated = this.translateWithKeyReplace({ data:transformedData, tranlationDict:translatedDict });
            
            const dbDirectory = resolve(__dirname, 'db', dictId);
            const dbPath = resolve(dbDirectory, 'dataTypes.json');
            this.save({ dbDirectory, dbPath, data:translated })
            this._dataTypes = translated
         };
    };

    getDateTypes({ id }:{ id:string }) {
        const jsonPth = resolve(__dirname, 'db', id, 'dataTypes.json');
        const exists = fs.existsSync(jsonPth);
        if (exists) {
            const json = fs.readFileSync(jsonPth, 'utf-8');
            const data = JSON.parse(json) as Record<string, string>;
            this._dataTypes = data;
            return data;
        }
        return null;
    }
    

    load({ id, data, tranlationDict, dataTypesDict, translateObj }: { id: string, data: Record<string, any>, tranlationDict:Record<string, string>, dataTypesDict:Record<string, any>, translateObj?:Record<string, string> }) {
        this.setOriginalData({ id, data });
        
        this.translate({ data, tranlationDict, dictId:id });

        this.handleDataTypes({ mainDict:data, dataTypesDict, translateObj, dictId:id })

        console.log(`table -->  ${JSON.stringify(this.table, null, 4)}`)
        console.log(`translateDict -->  ${JSON.stringify(this.translateDict, null, 4)}`)
        console.log(`dataTypes -->  ${JSON.stringify(this.dataTypes, null, 4)}`)
    }

    delete({ id }:{ id:string }) {
        const jsonPth = resolve(__dirname, 'db', id);
        const exists = fs.existsSync(jsonPth);
        if (exists) {
            fs.rmSync(jsonPth, { recursive:true });
            console.log(`table ${id} deleted!`)
            return;
        }
        console.log(`table not found.`)
    }

}