const Credentials = {
  email: 'sobbingrabbit@gmail.com',
  password: 'ecse428',
};

const Users = {
  CurrentUser: 'sobbingrabbit@gmail.com',
  OtherUser: [
    'erick@mailinator.com',
    'zhao@mailinator.com',
    'erickzhao@mailinator.com',
    'erick.zhao@mailinator.com',
    'erick-zhao@mailinator.com',
  ],
  InvalidUser: [
    'erick@',
    'mailinator',
    '@@@@@@@@@@@@',
    'erick@@@mailinator.com',
    'erick@mailnator...com',
  ],
};

module.exports = { Credentials, Users };
