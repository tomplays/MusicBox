'use strict';


exports.welcome = function (req, res) {
    res.render('welcome', {
        doc_title : 'welcome mb syst.',
        raw_content : '',
        doc_thumbnail : '',
        doc_excerpt: '',
        doc_slug_discret : '',
        doc_include_js : '',
        doc_include_css : 'css/min/welcome.css' 
      });   
  }