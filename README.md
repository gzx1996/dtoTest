# dtoTest
js用于校验dto的模块
使用方法:
```
npm install -s @norman1996/dto4js
```
这只是我在开发中的具体需求的实现，可能不符合所有需求场景.
注意！在这个模块里面，undefined, null, 空（字符串，数组，obj） 是三种不同的东西，都有单独判断的。
以后可能会改用check模块改写。看心情了

dto的例子
./dto/user/create.dto.js
```
const request = {
    username: {
        required: true,
        type: 'string',
        maxLength: 20,
        minLength: 2,
        allowEmpty: false,
    },
    age: {
        required: true,
        type: 'number',
        allowNull: false,
        max: 100,
        min: 18,
        enums: [18,19,20,21]
    },
    enums: { //这个类型主要适用于子项类型不一致的枚举，感觉没啥用，考虑的不是很周到，建议使用上面age里面的enums属性来控制枚举
        type: 'enum',
        values: [1,2,3],
        allowNull: false
    },
    phone: {
        required: true,
        type: 'string',
        allowEmpty: false,
        regexp: /^(?:(?:\+|00)86)?1\d{10}$/   // 可以自定义正则
    },
    isDelete: {
        type: 'boolean'
    },
    list: {
        type: 'array',
        allowEmpty: false,
        maxLength: 10,
        minLength: 2
    },
    obj: {
        type: 'object',
        allowEmpty: false,
        value: {
            a: {
                required: true,
                type: 'number',  
            },
            b: {
                type: 'object',
                allowEmpty: false,
                value: {
                    c: {
                        required: true,
                        type: 'number',
                        enums: [1,2,3,4,5]  
                    },
                    d: {
                        required: true,
                        type: 'array',  
                    },
                }
                
            }
        }
    }
}

const response = {
    code: {
        type: 'number',
        enums: [0, 1],
        required: true
    },
    message: {
        type: 'string',
        required: true
    },
    data: {
        type: 'object'
    }
}
module.exports = {
    request,
    response
}
```
自动生成指定目录下dto对象的代码：
```
const fs = require('fs');
const Path = require('path');
const basePath = Path.join(__dirname, '../dto'); // 这个目录可以自定义
const dtos = {};
/** dto文件建议定义成 xxx.dto.js
 ** 比如 ./dto/user/create.dto.js
 ** 生成的dto对象 
 ** dto: { user: { create: require('./dto/user/create.dto.js')} }
 */
const init = (path = basePath, parent = dtos) => {
    try {
        const files = fs.readdirSync(path);
        files.forEach(file => {
            let fpath = Path.join(path, file);
            let fileStat = fs.statSync(fpath);
            if (fileStat.isFile()) {
                const name = file.split('.')[0]
                if(name !== 'index') {
                    parent.__defineGetter__(name, () => {
                        return require(fpath)
                    })
                }
            } else if (fileStat.isDirectory()) {
                if (!parent[file]) parent[file] = {}
                init(fpath, parent[file])
            }
        })
    } catch(e) {
        throw e
    }
}
init();

module.exports = dtos
```
