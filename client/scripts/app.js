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

var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  lastMessageID: 0,
  friends: {}
};

app.init = function () {
  //do something
  app.username = window.location.search.slice(10);

  app.$message = $('#currentMessage');
  app.$chats = $('#chats');
  app.$send = $('#send');
  app.$roomSelect = $('#roomSelect');

  app.$chats.on('click', '.username', app.handleUsernameClick);
  app.$send.on('submit', app.handleSubmit);
  app.$roomSelect.on('change', app.handleRoomChange);

  app.fetch();

  setInterval(function() {
    app.fetch();
  }, 3000);
};

app.send = function (message) {
  $.ajax(
    {url: app.server,
     type: 'POST', 
     data: JSON.stringify(message),
     contentType: 'application/json',
     success: function (data) {
       app.$message.val('');
       app.fetch();
     },
     error: function (data) {
       console.error('chatterbox: Failed to send message', data);
     }
   });
};


app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt',
    success: function (data) {
      if (!data.results || !data.results.length) {
        return;
      }


      app.messages = data.results;

      var mostRecentMessage = data.results[data.results.length - 1];
      

      if (mostRecentMessage.objectId !== app.lastMessageId) {
        app.renderRoomList(data.results);
        app.renderMessages(data.results);
        app.lastMessageId = mostRecentMessage.objectId;
      }
      
    },
    error: function (data) {
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.renderMessages = function (messages) {
  app.clearMessages();

  if (Array.isArray(messages)) {
    messages.filter(function(message) {
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    })
    .forEach(app.renderMessage);  
  }
};

app.renderMessage = function(message) {
  if (!message.roomnname) {
    message.roomname = 'lobby';
  }

  var $chat = $('<div class="chat"/>');
  var $username = $('<span class="username"/>');
  $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

  if (app.friends[message.username] === true) {
    $username.addClass('friend');
  }

  var $message = $('<br><span/>');
  $message.text(message.text).appendTo($chat);

  app.$chats.append($chat);
};

app.renderRoomList = function(messages) {
  app.$roomSelect.html('<option value="__newRoom">Create new room</option>');

  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        app.renderRoom(roomname);
        rooms[roomname] = true;
      }
    });
  }
};

app.renderRoom = function (room) {
  var $option = $('<option/>').val(room).text(room);

  app.$roomSelect.append($option);
};

app.handleUsernameClick = function (event) {
  var username = $(event.target).data('username');

  if (username !== undefined) {
    app.friends[username] = !app.friends[username];

    var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

    var $usernames = $(selector).toggleClass('friend');
  }
};

app.handleRoomChange = function(event) {
  var selectIndex = app.$roomSelect.prop('selectedIndex');

  if (selectIndex === 0) {
    var roomname = prompt('Enter new room name');
    if (roomname) {
      app.roomname = roomname;

      app.renderRoom(roomname);

      app.$roomSelect.val(roomname);
    }
  } else {
    app.roomname = app.$roomSelect.val();
  }

  app.renderMessages(app.messages);
};
  
app.handleSubmit = function(event) {
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };

  app.send(message);

  event.preventDefault();
};


