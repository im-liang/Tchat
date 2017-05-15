function adduser() {
  var username = $('#username').val();
  var email = $('#useremail').val();
  var userpass = $('#userpass').val();
  var obj = {"username": username, "password": userpass, "email": email};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/adduser",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        window.location.href = window.location.origin +'/login';
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}
function login() {
  var username = $('#login_name').val();
  var userpass = $('#login_pass').val();
  var obj = { "username": username, "password": userpass};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/login",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        console.log(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function logout() {
  $.ajax({
    type: "POST",
    url: "/logout",
    success: function(data){
      if(data.status == 'OK') {

        window.location.href = window.location.origin +'/login';
      }else if(data.status == 'error') {
        console.log(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function add_item() {
  var content = $('#item_content').val();
  var parent = $("#item_parent").val();
  var media = $("#item_media").val();
  var obj = { "content": content, "parent": parent, "media": media};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/additem",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert(data.id);
        console.log(data.id);
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function delete_item() {
  var id = $("#item_id").val();
  $.ajax({
    type: "DELETE",
    url: "/item/"+id,
    success: function(data){
      if(data.status == 'OK') {
        alert('successfully deleted the tweet');
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function search() {
  var timestamp = $('#timestamp').val();
  var limit = $('#limit').val();
  var q = $('#q').val();
  var username = $('#username').val();
  var following = $('#following').val();
  var rank = $('#rank').val();
  var parent = $('#parent').val();
  var obj = { "timestamp": timestamp, "limit":limit, "q":q, "username": username, "following": following, "rank": rank, "parent": parent};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/search",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        var items = [];
        data.items.forEach(function(item) {
          items.push(item.content);
        });
        alert(items);
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function verify() {
  var email = $('#email').val();
  var key = $('#key').val();
  var obj = { "email": email, "key":key};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/verify",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert('good');
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function follow() {
  var username = $('#follow-username').val();
  var follow = $('#follow').val();
  var obj = { "username": username, "follow":follow};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/follow",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert('good');
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function like() {
  var like = $("#like").val();
  var id = $("#like-id").val();
  var obj = { "like": like};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/item/"+id+"/like",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert('good');
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function following() {
 var limit = $('#follow-limit').val();
 var username = $('#following-username').val();
 var obj = {"limit": limit};
 var formData = JSON.stringify(obj);
 $.ajax({
   type: "GET",
   url: "/user/"+username+"/following",
   data: formData,
   success: function(data){
     if(data.status == 'OK') {
       alert(data.users);
       window.location.href = window.location.origin;
     }else if(data.status == 'error') {
       alert(data.error);
       window.location.href = window.location.origin;
     }
   },
   error: function(ts) {
     console.log(ts.responseText);
   },
   dataType: "json",
   contentType : "application/json"
 });
}
function follower() {
  var limit = $('#follower-limit').val();
  var username = $('#follower-username').val();
  var obj = {"limit": limit};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "GET",
    url: "/user/"+username+"/followers",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert(data.users);
        window.location.href = window.location.origin;
      }else if(data.status == 'error') {
        alert(data.error);
        window.location.href = window.location.origin;
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}

function addmedia() {
  var content = document.getElementById("media").files[0];
  var formData = new FormData();
  formData.append('content', content);
  $.ajax({
    type: "POST",
    url: "/addmedia",
    data: formData,
    contentType: false,
    processData: false,
    success: function(data){
      alert(data.id);
      console.log(data.id);
    },
    error: function(ts) {
      console.log(ts.responseText);
    }
  });
}
