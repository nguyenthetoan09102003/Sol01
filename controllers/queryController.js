exports.getQueryPage = (req, res) => {
  res.render('query', 
    { user: res.locals.user,
      activeNav: 'query'
     });
};
