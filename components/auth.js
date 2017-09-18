import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

export const onSignIn = (user) => {
  console.log('onSignIn');
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const onSignOut = () => {
  console.log('onSignOut')
  return AsyncStorage.removeItem(USER_KEY);
}

export const isSignedIn = () => {
  console.log('isSignedIn');
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        res = JSON.parse(res);
        // console.log(res);
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

