import Mock from 'mockjs';

export let Users = []

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

let UserApi = {
  '/user/list': config => {
    let { per_page, page_number } = config.params

    per_page = Number(per_page)
    page_number = Number(page_number)

    let total = Users.length
    let returnList = []
    // 列表筛选
    returnList = Users.filter(user => { 
      return true
    })
    // 分页
    // returnList = returnList.filter((user, index) => {
    //   return index < per_page * page_number && index >= per_page * (page_number - 1)
    // })

    return {
      count: total,
      per_page,
      page_number,
      list: returnList
    }
  },
  '/user/add': config => {
    
  }
}

export default UserApi
