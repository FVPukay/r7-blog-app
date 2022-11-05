# RESTful 7 Blog - Built with [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), and [Semantic UI](https://semantic-ui.com/)
* See [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js) to get a sense of the overall app design at a glance

## App Design
* RESTful 7 API - IN Computer Science Edit Update Destroy - Index, New, Create, Show, Edit, Update, Destroy
    * See [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js)
    * See [routes](https://github.com/FVPukay/r7-blog-app/tree/main/routes)
* Passport.js authentication
    * See [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js) line 89 for Passport configuration
    * See [routes/index.js](https://github.com/FVPukay/r7-blog-app/blob/main/routes/index.js) for Passport Authentication logic
    * See [middleware/index.js](https://github.com/FVPukay/r7-blog-app/blob/main/middleware/index.js) to check if users are logged
* Middleware to check post/comment ownership and to check if users are logged in
    * See [middleware/index.js](https://github.com/FVPukay/r7-blog-app/blob/main/middleware/index.js)
* [MongoDB Atlas](https://www.mongodb.com/atlas) AND [Mongoose ODM](https://mongoosejs.com/)
    * See [models](https://github.com/FVPukay/r7-blog-app/tree/main/models)
        * See [models/comment.js](https://github.com/FVPukay/r7-blog-app/blob/main/models/comment.js)
        * See [models/post.js](https://github.com/FVPukay/r7-blog-app/blob/main/models/post.js)
        * See [models/user.js](https://github.com/FVPukay/r7-blog-app/blob/main/models/user.js)
    * See [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js)
* Express.js
    * See [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js)
* Embedded JavaScript Templates (EJS)
* Security
    * In [app.js](https://github.com/FVPukay/r7-blog-app/blob/main/app.js) see:
        * [Helmet](https://helmetjs.github.io/) - Secures Express apps by setting various HTTP headers
        * [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) - Sanitizes user-supplied data to prevent MongoDB Operator Injection
        * [express-sanitizer](https://www.npmjs.com/package/express-sanitizer) - sanitizes certain tags e.g. script and anchor
        
