$(function() {
    
    var ambient = new Howl({
        src: ['sound/silence.mp3'],
        autoplay: false,
        loop: true,
        volume: 0,
    });
    
    var ambientSFX = ambient.play();
    ambient.fade(0,1,3000,ambientSFX);
    
    var flicker = new Howl({
        src: ['sound/flicker.mp3'],
        autoplay: false,
        loop: false,
        volume: 0.2,
    });
    
    var cursor = {
        x: 0,
        y: 0,
        down: false
    }
    
    var orbit = {
        x: 0,
        y: 0,
        xdir: "",
        ydir: "",
        hdeg: 0,
        vdeg: 0,
        hspeed: 0,
        vspeed: 0,
        sensitivity: 0.5,
        drag: 1,
        zoom: 0.6
    }
    
    $("#about").click(function() {
        $("#info").fadeToggle(100);
        $(this).toggleClass("active");
    })
    
    $("#audio").click(function() {
        if( ambient.volume() > 0 ) {
            flicker.volume(0);
            ambient.volume(0);
            $(this).find("i").removeClass("fa-volume-off");
            $(this).find("i").addClass("fa-volume-up");
        } else {
            flicker.volume(0.2);
            ambient.volume(1);
            $(this).find("i").removeClass("fa-volume-up");
            $(this).find("i").addClass("fa-volume-off");
        }
    })
    
    $("#center").click(function() {
        orbit.vdeg = 0;
        orbit.hdeg = 0;
    })
    
    $(document).mousewheel(function(e) {
        console.log(e.deltaY);
        var delta = (e.deltaY / 100);
        orbit.zoom += delta;
    })
    
    $(document).mousedown(function() {
        cursor.down = true;
    })

    $(document).mouseup(function() {
        cursor.down = false;
    })
    
    $("body").mousemove(function(e) {

        var relX = e.pageX;
        var relY = e.pageY;

        if( cursor.down ) {
            
            if( relX > orbit.x ) {
                orbit.xdir = "+";
            } else if( relX < orbit.x ){
                orbit.xdir = "-";
            }

            if( relY > orbit.y ) {
                orbit.ydir = "-";
            } else if( relY < orbit.y ){
                orbit.ydir = "+";
            }

            orbit.hspeed = Math.abs(relX - orbit.x);
            orbit.vspeed = Math.abs(relY - orbit.y);
        }
        
        orbit.x = relX;
        orbit.y = relY;
    })
    
    var currentTime = updateTime();
    
    function onChange() {
        if(currentTime != updateTime()) {
            flicker.play();  
        }
        currentTime = updateTime();
    }
    
    $("body").keypress(function(e) {
        if( false ) {
            var tube = "#tube" + (Math.floor(Math.random() * 6) + 1);
            var numberKey = e.keyCode - 48;
            if( numberKey >= 0 && numberKey <= 9 ) {
                $(tube + " .glow").each(function() {
                    $(this).css("background-image", "url(img/" + $(this).attr("data-num") + ".png)");
                })
                $(tube + " .number").removeClass("glow");
                $(tube + " ._" + numberKey).addClass("glow");
                $(tube + " ._" + numberKey).css("background-image", "url(img/" + numberKey + "-lit.png)");
            }
        }  
    })
    
    function updateTube(tube, value) {
        $(tube + " .glow").each(function() {
            $(this).css("background-image", "url(img/" + $(this).attr("data-num") + ".png)");
        })
        $(tube + " .number").removeClass("glow");
        $(tube + " ._" + value).addClass("glow");
        $(tube + " ._" + value).css("background-image", "url(img/" + value + "-lit.png)");
    }    
    
    function updateTime() {
        var time = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        //$("#day").text( days[time.getDay()] );
        
        //var formattedDate = mons[time.getMonth()] + " " + time.getDate() + ", " + time.getFullYear();
        
        //$("#date").text(formattedDate);
        
        var hour = time.getHours();
        var period = "AM";
        
        if ( hour >= 12 ) {
            period = "PM";
            if (hour > 12) {
                hour = hour - 12;
            }    
        } else if ( hour == 0 ) {
            hour = 12;
            period = "AM";
        }
        
        var minutes = time.getMinutes();
        
        if(minutes.toString().length < 2) {
            minutes = "0" + minutes;
        }
        
        if(hour.toString().length < 2) {
            hour = "0" + hour;
        }
        
        var seconds = time.getSeconds();
        
        if(seconds.toString().length < 2) {
            seconds = "0" + seconds;
        }
        
        return(hour + "" + minutes + "" + seconds);
    }
    
    // Game update
    setInterval(update, 33.33);

    function update() {    
        
        //updateTime();
        
        updateTube("#tube1", updateTime().charAt(0));
        updateTube("#tube2", updateTime().charAt(1));
        
        updateTube("#tube3", updateTime().charAt(2));
        updateTube("#tube4", updateTime().charAt(3));
        
        updateTube("#tube5", updateTime().charAt(4));
        updateTube("#tube6", updateTime().charAt(5));
        
        onChange();

        if( !cursor.down ) {
            orbit.hspeed -= orbit.drag;
            orbit.vspeed -= orbit.drag;
        }
        
        if( orbit.hspeed < 0 ) {
            orbit.hspeed = 0;
        }
        
        if( orbit.vspeed < 0 ) {
            orbit.vspeed = 0;
        }

        if( true ) {
            if( orbit.xdir == "+" ) {
                orbit.hdeg += orbit.hspeed*orbit.sensitivity;
            } else if( orbit.xdir == "-" ) {
                orbit.hdeg -= orbit.hspeed*orbit.sensitivity;
            }

            if( orbit.ydir == "+" ) {
                orbit.vdeg += orbit.vspeed*orbit.sensitivity;
            } else if( orbit.ydir == "-" ) {
                orbit.vdeg -= orbit.vspeed*orbit.sensitivity;
            }
        }
        
        // Orbit clamps
        
        if( orbit.hdeg > 70) {
            orbit.hdeg = 70;
        } else if( orbit.hdeg < -70 ) {
            orbit.hdeg = -70;
        }
        
        if( orbit.vdeg > 45) {
            orbit.vdeg = 45;
        } else if( orbit.vdeg < -45 ) {
            orbit.vdeg = -45;
        }
        
        if( orbit.zoom > 2) {
            orbit.zoom = 2;
        } else if( orbit.zoom < 0.1 ) {
            orbit.zoom = 0.1;
        }
        
        $("#wrap").css("transform", "scale(" + orbit.zoom + ")");
        
        $("#plane").css("transform", "rotateX(" + orbit.vdeg + "deg) rotateY(" + orbit.hdeg + "deg)");
    }
    
})