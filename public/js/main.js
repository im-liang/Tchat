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
  var obj = { "content": content, "parent": parent};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/additem",
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

function search() {
  var timestamp = $('#timestamp').val();
  var limit = $('#limit').val();
  var obj = { "timestamp": timestamp, "limit":limit};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/search",
    data: formData,
    success: function(data){
      if(data.status == 'OK') {
        alert(data.items);
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
  var username = $('#username').val();
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

function addmedia() {
  var content = $('#media')[0].files[0];
  var obj = {"content": content};
  var formData = JSON.stringify(obj);
  $.ajax({
    type: "POST",
    url: "/deposit",
    data: formData,
    enctype: 'multipart/form-data',
    success: function(data){
      alert("good");
    },
    error: function(ts) {
      console.log(ts.responseText);
    },
    dataType: "json",
    contentType : "application/json"
  });
}
