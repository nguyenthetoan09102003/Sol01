
exports.getDashboard = (req, res) => {
  res.render('dashboard', 
    { user: res.locals.user,
      activeNav: 'dashboard',
      title: 'Dashboard'
     });
};

