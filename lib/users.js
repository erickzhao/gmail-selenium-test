const Credentials = {
  email: 'sobbingrabbit@gmail.com',
  password: 'ecse428winter2019',
};

const Users = {
  CurrentUser: Credentials.email,
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
