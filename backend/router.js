import express, { Router } from 'express';

import { 
   // list, 
    create, 
    post, 
    manage,
    approve 
} from './controllers/events';

import { update_user } from './controllers/auth';

import multer from 'multer';

import Image from './models/image';

// Initialize the router
const router = Router();
 

router.getImages = function(callback, limit) {
    Image.find(callback).limit(limit);
}
router.getImageById = function(id, callback) { 
    Image.findById(id, callback);
}
router.addImage = function(image, callback) {
    Image.create(image, callback);
}
 
var upload = multer({dest:'./uploads/'});

router.post('/', upload.any(), function(req, res, next) {
    var images = [];
    req.files.forEach( (img, i) => {         
        var path = img.path;
        var imageName = img.originalname;
        var imagepath = {};
        imagepath['path'] = path;
        imagepath['originalname'] = imageName;
        router.addImage(imagepath, function(err, result) {    
            images.push(result._id);
            if ( i == req.files.length - 1) {
                res.send({
                    images: images.join(',')
                });
            }
        });
    });
});


// router.route('/events').put(create);
//   .get(list)  // 

router.route('/events/:eventId/manage')
  .put(manage); // стать организатором

// router.route('/events/:eventId/:decision/:manageQueueId')
//   .post(approve);


// router.route('/likes')
//   .put(post);

router.route('/user') // edit screen - update user info
  .put(update_user);

export default router;

