import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import VkontakteStrategyObj from 'passport-vkontakte';
const VKontakteStrategy = VkontakteStrategyObj.Strategy;


import Person from '../models/person';
// Import Facebook and Google OAuth apps configs
import { facebook, google, vkontakte } from '../config';

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile) => {
  console.log(profile);
  
  return ({
    oauth_id: profile.id,
    name: profile.first_name,  
    avatar: profile.picture.data.url,
    gender: (profile.gender == 'female') ? 1 : 2,
  });
}

// Transform Vkontakte profile into user object 
const transformVKontakteProfile = (profile) => {
  
  console.log(profile)
  return ({
    oauth_id: profile.id,
    name: profile.first_name,
    avatar: profile.photo,
    gender: profile.sex,  
  });
}

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  oauth_id: profile.id,
  name: profile.displayName,
  avatar: profile.image.url,
});


// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
  // Gets called when user authorizes access to their profile
  async (accessToken, refreshToken, profile, done)
    // Return done callback and pass transformed user object
    => done(null, await createOrGetUserFromDatabase(transformFacebookProfile(profile._json)))
));

// Register Google Passport strategy
passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done)
    => done(null, await createOrGetUserFromDatabase(transformGoogleProfile(profile._json)))
));

// Register vk Passport strategy
passport.use(new VKontakteStrategy(vkontakte,
  // {
  //   // clientID: ..., clientSecret: ..., callbackURL: ...,
  //   scope: ['email' /* ... and others, if needed */],
  //   profileFields: ['email', 'city', 'bdate']
  // },
  async (accessToken, refreshToken, params, profile, done)
    => {
      console.log(params)  // email is undefined if phone is used
      done(null, await createOrGetUserFromDatabase(transformVKontakteProfile(profile._json)))
    }      
));
  
const createOrGetUserFromDatabase = async (userProfile) => {
  
  let user = await Person.findOne({ 'oauth_id': userProfile.oauth_id }).exec();
  if (!user) {
    user = new Person({
      oauth_id: userProfile.oauth_id,
      name: userProfile.name,
      avatar: userProfile.avatar,
      gender: userProfile.gender
    });
    await user.save();
  }
  return user;
};

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Facebook
export const facebookLogin = passport.authenticate('facebook', {scope: ['public_profile', 'user_friends', 'user_education_history', 'email', 'user_about_me', 'user_work_history'], authType: 'rerequest'});
export const facebookMiddleware = passport.authenticate('facebook', { failureRedirect: '/auth/facebook' });

// Google
export const googleLogin = passport.authenticate('google', { scope: ['profile'] });
export const googleMiddleware = passport.authenticate('google', { failureRedirect: '/auth/google' });

// Google
export const vkontakteLogin = passport.authenticate('vkontakte',  { scope: ['status', 'email', 'friends', 'notify'] } );
export const vkontakteMiddleware = passport.authenticate('vkontakte', { failureRedirect: '/auth/vkontakte' });

// Callback
export const oauthCallback = async (req, res) => {
  res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
};

// update user info
export const update_user = async (req, res) => {
  // 1. find user by id  
  // 2. update user info
  // 3. user.save();

  const { user } = req.body;
  Person.findById(user._id, function (err, person) {
    if (err) {
      console.log(err);
    }
    
    person.current_work = user.current_work;
    person.about = user.about;
    person.age = user.age;
    person.avatar = user.avatar;
    
    person.save(function (err, updatedPerson) {
      if (err) {
        console.log(err);
      }
      res.send(updatedPerson);
    });
  });



}