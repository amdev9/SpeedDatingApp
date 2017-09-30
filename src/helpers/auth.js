import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

export const onSignIn = (user) => {
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const onSignOut = () => {
  return AsyncStorage.removeItem(USER_KEY);
}

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        res = JSON.parse(res);
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

