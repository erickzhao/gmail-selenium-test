const { Users } = require('./users');

const getUserEmail = (user) => {
  const [userType, userNumber] = user.split('-');
  let email;

  if (!userNumber) {
    email = Users[userType];
  } else {
    email = Users[userType][userNumber - 1];
  }

  return email;
};

const isLoggedOut = url => url.startsWith('https://accounts.google.com/signin/');

module.exports = {
  getUserEmail,
  isLoggedOut,
};
