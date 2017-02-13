// YOUR CODE HERE:


/* format for 

  var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};*/


// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });

var app = {};

app.init = function () {
  //do something
};

app.send = function (message) {

  // here we need to somehow validate message is a string and not code.
    //throw error if it is not a string

    
  $.ajax(
    {url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
     type: 'POST', 
     data: JSON.stringify(message),
     contentType: 'application/json',
     success: function (data) {
       console.log('chatterbox: Message sent');
     },
     error: function (data) {
       console.error('chatterbox: Failed to send message', data);
     }
   });
  //somehow send message
};
