const checkDto = require('./util/checkDto')

const test = () => {
    const dto = require('./dto/user/create.dto').request
    let testData = {
        username: 'test',
        phone: 17855830799,
        age: 100,
        isDelete: false,
        list: [1,2,3],
        obj: {
            a: 1,
            b: {
                c: 1,
                d: [1,2,3]
            }
        }
    }
    checkDto(dto, testData, 'request');
    console.log(testData)
}
test()
