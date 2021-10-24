const express          = require('express'),
      app              = express();

app.set('view engine', 'ejs');

app.use(express.static('semantic'));
app.use(express.static('public'));

const indexRoutes   = require('./routes/index'),
      postRoutes    = require('./routes/posts');
    //   userRoutes    = require('./routes/users');
//       commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
// app.use('/users', userRoutes);
// app.use('/posts/:id/comments', commentRoutes);

module.exports = app;
