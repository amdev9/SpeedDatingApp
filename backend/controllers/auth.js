import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import VkontakteStrategyObj from 'passport-vkontakte';
const VKontakteStrategy = VkontakteStrategyObj.Strategy;


import Person from '../models/person';
// Import Facebook and Google OAuth apps configs
import { facebook, google, vkontakte } from '../config';

////
import request from 'request-promise';  
////


// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile, work, university) => {
  // console.log(profile);
  
  return ({
    oauth_id: profile.id,
    name: profile.first_name,  
    avatar: profile.picture.data.url,
    gender: (profile.gender == 'female') ? 1 : 2,
    work: work,
    university: university
  });
}

// Transform Vkontakte profile into user object 
const transformVKontakteProfile = (profile, work, university) => {
  
  // console.log(profile)
  return ({
    oauth_id: profile.id,
    name: profile.first_name,
    avatar: profile.photo,
    gender: profile.sex,  
    work: work,
    university: university
  });
}
 

// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
  // Gets called when user authorizes access to their profile
  async (accessToken, refreshToken, profile, done)
    // Return done callback and pass transformed user object
    => {
      // console.log(accessToken)

      // app.get('/facebook-search/:id', (req, res) => {
    
      // you need permission for most of these fields
      const userFieldSet = 'id, work, education';//name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
      const options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v2.10/1359694324147112`, //${req.params.id} //'https://graph.facebook.com/me', //
        qs: {
          access_token: accessToken, //user_access_token,
          fields: userFieldSet
        }
      };
      var fbRes = await request(options);
      var w = JSON.parse(fbRes);
      var employer_name = w.work[0].employer.name;
      var position_name = w.work[0].position.name;
      var school_name = w.education[0].school.name;
      var education_type = w.education[0].type;
            
      var work = {
        "employer_name": employer_name,
        "position_name": position_name
      };
      var university = {
        "school_name": school_name,
        "education_type": education_type
      };  

      // console.log(employer_name, position_name, school_name, education_type);
      
      done(null, await createOrGetUserFromDatabase(transformFacebookProfile(profile._json, work, university)))
    }
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
      // console.log(accessToken)
      // console.log(params)  // email is undefined if phone is used

      const userFieldSet = 'bdate, career, education';//name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
      const options = {
        method: 'GET',
        uri: `https://api.vk.com/method/users.get?user_ids=${params.user_id}`, //${req.params.id} //'https://graph.facebook.com/me', //
        qs: { // &fields=bdate&v=5.68
          access_token: accessToken, //user_access_token,s
          fields: userFieldSet,
          v: '5.68'
        }
      };
      var fbRes = await request(options);
      var w = JSON.parse(fbRes);
      console.log(fbRes);
      var employer_name = w.response[0].career[0].company;
      var position_name = w.response[0].career[0].position; 
      var school_name = w.response[0].university_name;
      var education_type = w.response[0].faculty_name; 
      // console.log(career_company, company_position, university_name, faculty_name); // 
      
      var work = {
        "employer_name": employer_name,
        "position_name": position_name
      };
      var university = {
        "school_name": school_name,
        "education_type": education_type
      };  

      
      done(null, await createOrGetUserFromDatabase(transformVKontakteProfile(profile._json, work, university)))
    }      
));
  
const createOrGetUserFromDatabase = async (userProfile) => {

  let user = await Person.findOne({ 'oauth_id': userProfile.oauth_id }).exec();
  if (!user) {
    user = new Person({
      oauth_id: userProfile.oauth_id,
      name: userProfile.name,
      avatar: userProfile.avatar,
      gender: userProfile.gender,
      work: userProfile.work,
      university: userProfile.university
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
 
// vk
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