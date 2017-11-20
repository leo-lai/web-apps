import config from '../config'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { storage, utils } from 'assets/js/utils'
import { Message } from 'element-ui'

// 模拟接口列表
import UserApi from './user'

let apis = {...UserApi}

// 创建axios实例
export const service = axios.create({
  baseURL: config.api.baseURL,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  let userinfo = storage.local.get('userinfo')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['token'] = userinfo && userinfo.token ? userinfo.token : ''
  config.headers['uid'] = userinfo && userinfo.id ? userinfo.id : ''
  config.transformRequest = [function(data) {
    let ret = []
    for (let key in data) {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return ret.join('&')
  }]
  return config
}, error => {
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  let data = response.data
  switch(data.code) {
    case 200:
      return data
  }
  return Promise.reject(data)
}, error => {
  return Promise.reject(error)
})

export const mockFetch = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    return new Promise((resolve, reject) => {
      // let userinfo = storage.local.get('userinfo')
      // data.uid = userinfo && userinfo.id ? userinfo.id : ''
      service({
        url, method, data
      }).then(resolve).catch(error => {
        error && error.message && Message({
          type: 'error',
          message: error.message
        })
        reject(error)
      })
    })
  },
  get(url, data) {
    return this.ajax(url, data)
  },
  post(url, data) {
    return this.ajax(url, data, 'POST')
  }
}

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(service, { delayResponse: 1000 })

    // mock success request
    // mock.onGet('/success').reply(200, {
    //   msg: 'success'
    // })

    // mock error request
    // mock.onGet('/error').reply(500, {
    //   msg: 'failure'
    // })

    Object.keys(apis).forEach(key => {
      mock.onPost(key).reply(config => {
        config.params = utils.url.getArgs(config.baseURL + config.url + '?' + config.data)
        return new Promise((resolve, reject) => {
          resolve([200, {
            code: 200,
            data: apis[key](config),
            msg: '请求成功'
          }])
        })
      })
    })

    //登录
    // mock.onPost('/login').reply(config => {
    //   let { username, password } = JSON.parse(config.data);
    //   return new Promise((resolve, reject) => {
    //     let user = null;
    //     setTimeout(() => {
    //       let hasUser = LoginUsers.some(u => {
    //         if (u.username === username && u.password === password) {
    //           user = JSON.parse(JSON.stringify(u));
    //           user.password = undefined;
    //           return true;
    //         }
    //       });

    //       if (hasUser) {
    //         resolve([200, { code: 200, msg: '请求成功', user }]);
    //       } else {
    //         resolve([200, { code: 500, msg: '账号或密码错误' }]);
    //       }
    //     }, 1000);
    //   });
    // });

    //获取用户列表
    // mock.onGet('/user/list').reply(config => {
    //   let { name } = config.params;
    //   let mockUsers = _Users.filter(user => {
    //     if (name && user.name.indexOf(name) == -1) return false;
    //     return true;
    //   });
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         users: mockUsers
    //       }]);
    //     }, 1000);
    //   });
    // });

    //获取用户列表（分页）
    // mock.onGet('/user/listpage').reply(config => {
    //   let { page, name } = config.params;
    //   let mockUsers = _Users.filter(user => {
    //     if (name && user.name.indexOf(name) == -1) return false;
    //     return true;
    //   });
    //   let total = mockUsers.length;
    //   mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         total: total,
    //         users: mockUsers
    //       }]);
    //     }, 1000);
    //   });
    // });

    //删除用户
    // mock.onGet('/user/remove').reply(config => {
    //   let { id } = config.params;
    //   _Users = _Users.filter(u => u.id !== id);
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         code: 200,
    //         msg: '删除成功'
    //       }]);
    //     }, 500);
    //   });
    // });

    //批量删除用户
    // mock.onGet('/user/batchremove').reply(config => {
    //   let { ids } = config.params;
    //   ids = ids.split(',');
    //   _Users = _Users.filter(u => !ids.includes(u.id));
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         code: 200,
    //         msg: '删除成功'
    //       }]);
    //     }, 500);
    //   });
    // });

    //编辑用户
    // mock.onGet('/user/edit').reply(config => {
    //   let { id, name, addr, age, birth, sex } = config.params;
    //   _Users.some(u => {
    //     if (u.id === id) {
    //       u.name = name;
    //       u.addr = addr;
    //       u.age = age;
    //       u.birth = birth;
    //       u.sex = sex;
    //       return true;
    //     }
    //   });
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         code: 200,
    //         msg: '编辑成功'
    //       }]);
    //     }, 500);
    //   });
    // });

    //新增用户
    // mock.onGet('/user/add').reply(config => {
    //   let { name, addr, age, birth, sex } = config.params;
    //   _Users.push({
    //     name: name,
    //     addr: addr,
    //     age: age,
    //     birth: birth,
    //     sex: sex
    //   });
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         code: 200,
    //         msg: '新增成功'
    //       }]);
    //     }, 500);
    //   });
    // });

  }
}
