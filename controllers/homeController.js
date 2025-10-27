
exports.getHome = (req, res) => {
  res.render('home', 
    { user: res.locals.user,
      activeNav: 'home'
     });
};

