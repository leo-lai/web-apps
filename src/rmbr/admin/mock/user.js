import Mock from 'mockjs';

const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    avatar: 'http://wx.qlogo.cn/mmopen/dH8QVxmk2IXng0nWB8nL5J6Zwjc9bwssPvNVSaVoiasImTl8y5hGeAqzaDluCmICf0vlgiaFEicH9wSupsfXM2LfGIibpshjxnde/64',
    name: '赖国聪'
  }
];

const Users = [];

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

export { LoginUsers, Users };
