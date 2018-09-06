

# File Upload Using Multer Middleware 
Source code of the blog post.

#### N.B. No Client side is provided; Use postMan to check the API;

## Setup
- Create a databases myproject
  open new terminal tab
  write `mongo` then `use myproject`
- Navigate to the root directory
- `npm install` to install project dependencies
- `nodemon` to run the app

## Server Side File Structure
```bash
├── app/
│   └── routes/
│       └── users
│           └── index.js
├── public
│   └── images # Database configaration
│       └── uploads
├── package.json
├── server.js
 ```

## API
### files 
    return array of all upload objects in the database [http://localhost:8080/user/files](http://localhost:8080/user/files)
![](https://github.com/dimohamdy/File-Upload-Using-Multer/blob/master/photos/photo1.png)
### fileUpload
    upload an image and return the created object for this image [http://192.168.1.4:8080/user/fileUpload](http://192.168.1.4:8080/user/fileUpload)
![](https://github.com/dimohamdy/File-Upload-Using-Multer/blob/master/photos/photo2.png)

# License
This project is licensed under the MIT license.

If you have any questions or comments, please create an issue.
