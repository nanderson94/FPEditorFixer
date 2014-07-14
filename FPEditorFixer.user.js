// ==UserScript==
// @name        Facepunch Editor Fixer
// @namespace   https://nanderson.me/
// @version     0.5
// @description Unicode have you feeling down? Not anymore!
// @match       http://*facepunch.com/editpost.php*
// @match       http://*facepunch.com/showthread.php*
// @updateURL   https://raw.githubusercontent.com/nanderson94/FPEditorFixer/master/FPEditorFixer.user.js
// @downloadURL https://raw.githubusercontent.com/nanderson94/FPEditorFixer/master/FPEditorFixer.user.js
// @run-at      document-end
// @copyright   2014, deadeye536
// @license     WTFPL
// ==/UserScript==

// Begin terrible userscript
$(function() {
  // Intesting problem, since LabPunch can't grab posts by id, I gotta
  // hack my way around needing that information.

  // My approach is to check for the editor on each page load, and if we 
  // can find it, populate it from localStorage, otherwise, delete item
  // from localStorage.

  // Additionally, we capture the .editpost click to store details about
  // the post that we need, but can only get on the listing page.
  $(".editpost").click(function(e) {
    localStorage['FP_EditFix'] = $(e.target).parents('.postcontainer').find('.nodecontrols > a[href^=showthread.php]').text().match(/[0-9]+/);
    // Let the redirection to editpost happen.
    return true;
  });
  // We are on the editor page, did we get here from a .editpost?
  if (window.location.href.match('editpost') && localStorage['FP_EditFix']) {
    var postNum = parseInt(localStorage['FP_EditFix'], 10),
      LPPPP = 30, // LabPunch Posts Per Page
      lpPage = Math.floor( postNum / LPPPP ),
      threadId = $('.navbit:last > a').attr('href').match(/t=([0-9]+)/)[1],
      postId = postId window.location.href.match(/[0-9]+/);
    // Double check the editor, is it empty?
    if ($('#vB_Editor_001_editor').text().length == 0) {
      // So we probably encountered the unicode problem, let's fix it!
      $.get('http://lab.facepunch.com/api/post/list/', {
        threadid: threadId,
        page: lpPage
      }, function(data) {
        for (var i=0,len=data['data']['posts'].length;i<len;i++) {
          if (data['data']['posts'][i]['postid'] == postId) {
            // Alright, we finally found the post!
            CKEDITOR.instances['vB_Editor_001_editor'].setData(data['data']['posts'][i]['pagetext']);
            break;
          }
        }
      });
    }
  }
});