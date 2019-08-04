$(document).ready(function(){
  getLocation();
})
function openFileUploadWindow() {
  document.getElementById('fileUpload').click();
}
function enterManually(){
  document.getElementById("enterManInfo").style.display = "block";
  document.getElementById("uploadImgOpt").style.display = "none";
  document.getElementById("enterManSucc").style.display = "inline-block";
  document.getElementById("enterManBtn").disabled = true;
  $('html, body').animate({ scrollTop: $('#enterManInfo').offset().top }, 'slow');
}
function confirmAndBookImg(){
  var licenseNum = $("#licenseNumImg").html();
  confirmAndBookGen(licenseNum);

}
function confirmAndBookMan(){
  var licenseNum = document.getElementById("licenseNumMan").value;
  confirmAndBookGen(licenseNum);

}
function confirmAndBookGen(licenseNum){
  // lat = window.devicePosition.coords.latitude;
  // long = window.devicePosition.coords.longitude;
  $.ajax({
        url: "http://18.221.95.123:3050/scooter/"+licenseNum,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
          var statusMsg;
          var header = document.getElementById("modalHeader").innerHTML;
            if(res.in_trip ==true){
              header = "<img style='display:inline-block' src='http://18.221.95.123:3050/public/error.png' width=20 height=20 />" +
                        " <h4 style='display:inline-block' class='modal-title'>Ride Details</h4>";
              statusMsg = "Oops! The bike is already in a ride!"
            }
            else if(res.fuel < 5){
              header = "<img style='display:inline-block' src='http://18.221.95.123:3050/public/error.png' width=20 height=20 />" +
                        " <h4 style='display:inline-block' class='modal-title'>Ride Details</h4>";
              statusMsg = "Low Fuel! Ride cannot be started!"
            }
            else{
              header = "<img style='display:inline-block' src='http://18.221.95.123:3050/public/checkmark-24.ico' width=20 height=20 />" +
                        " <h4 style='display:inline-block' class='modal-title'>Ride Details</h4>";
              statusMsg = "Ride confirmed! OTP for the ride is <span style='color:green;font-size:18px;font-weight:bold'>#" + res.next_pin + "</span>";

              $.ajax({
            url: 'http://18.221.95.123:3050/scooter/'+licenseNum,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log("Success!")
            },
            data: {}
        });
            }
            document.getElementById("modalHeader").innerHTML = header;
            document.getElementById("modalBody").innerHTML = statusMsg;
            $('#myModal').modal('show');
            startOver();

        }
    });
}

function startOver(){
  document.getElementById("enterManBtn").disabled = false;
  document.getElementById("uploadImgOpt").style.display = "block";
  document.getElementById("enterManSucc").style.display = "none";
  document.getElementById("enterMan").style.display = "block";
  document.getElementById("uploadedSucc").style.display = "none";
  document.getElementById("uploadSpan").innerText = "UPLOAD IMAGE";
  document.getElementById("uploadBtn").disabled = false;
  document.getElementById("imageInfo").style.display = "none";
  document.getElementById("enterManInfo").style.display = "none";
  document.getElementById("licenseNumMan").value = "";

  $('html, body').animate({ scrollTop: $('#topDiv').offset().top }, 'slow');
}
function readURL(input) {

          document.getElementById("uploadSpan").innerText = "UPLOADING";
          document.getElementById("loaderIcon").style.display = "inline-block";
          document.getElementById("enterMan").style.display = "none";
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#uploadedImage')
                    .attr('src', e.target.result)

            };

            reader.readAsDataURL(input.files[0]);
        }
        var data = new FormData();
        data.append('avatar', input.files[0]);

        $.ajax({
           url: "http://18.221.95.123:3050/images",
           enctype: 'multipart/form-data',
           type: 'POST',
           processData: false,
           contentType: false,
           data: data,
           cache: false,
           xhr: function() {
       var xhr = $.ajaxSettings.xhr();
       xhr.upload.onprogress = function(e) {
           var progress = Math.floor(e.loaded / e.total *100);
          // console.log(progress)
             if(progress>=50){
               document.getElementById("uploadSpan").innerText = "PROCESSING";
             }
       };
       return xhr;
   },

            success: function(data, status) {
             console.log(data);
             console.log("success!!!")
             if(data.status){
             document.getElementById("licenseNumImg").innerText = data.number;
           }
             $('#fileUpload').val("");
             document.getElementById("uploadBtn").disabled = true;
             document.getElementById("uploadSpan").innerText = "UPLOADED";
             document.getElementById("loaderIcon").style.display = "none";
             document.getElementById("uploadedSucc").style.display = "inline-block";
             document.getElementById("imageInfo").style.display = "block";

             $('html, body').animate({ scrollTop: $('#imageInfo').offset().top }, 'slow');
           }
         });
    }
  function getLocation() {
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition,errorHandler,{timeout:10000});

  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  window.devicePosition = position;
  console.log(window.devicePosition)

}
function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            } else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
 var R = 6371; // Radius of the earth in km
 var dLat = deg2rad(lat2-lat1);  // deg2rad below
 var dLon = deg2rad(lon2-lon1);
 var a =
   Math.sin(dLat/2) * Math.sin(dLat/2) +
   Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
   Math.sin(dLon/2) * Math.sin(dLon/2)
   ;
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 var d = R * c; // Distance in km
 return d;
}

function deg2rad(deg) {
 return deg * (Math.PI/180)
}
