/* Prateek Srivastava */

var uniqueUserIDCheck = function(userID, callback){
    $.ajax({
        "url": "/api/uniqueid?userId="+userID,
        "type": "GET",
        "success": function(data){
            if (typeof data === "boolean") {
                if (typeof callback === "function") {
                    activateSession(userID, callback);
                }
            }
        },
        "error": function (err) {
            console.log("Error", err);
            if (typeof callback === "function") {
                callback(err, null);
            }
        }
    })
}


var activateSession = function (userId, callback) {
    $.ajax({
        "url": "/api/activeSession?userId=" + userId + "&v=" + new Date().getTime(),
        "type": "GET",
        "success": function (data) {
            if (typeof data === "string") {
                if (typeof callback === "function") {
                    callback(null, data);
                }
                return;
            }

            callback("Error setting SessionId", null);
        },
        "error":  function (err) {
            console.log("Error", err);
            if (typeof callback === "function") {
                callback("Error setting SessionId", null);
            }
        }
    });
};

var updateScores = function (options, callback) {
    var url = "/api/updateScores?userId=" + options.userId + "&sessionId=" + options.sessionId + "&score=" + options.score + "&v=" + new Date().getTime();
    if (!options.userId || !options.sessionId || !options.score) {
        if (typeof callback === "function") {
            callback("Error updating Score", null);
        }
        return;
    }
    $.ajax({
        "url": url,
        "type": "GET",
        "success": function (data) {
            if (typeof data === "string") {
                if (typeof callback === "function") {
                    callback(null, data);
                }
                return;
            }

            if (typeof callback === "function") {
                callback("Error updating Score", null);
            }
        },
        "error":  function (err) {
            console.log("Error", err);
            if (typeof callback === "function") {
                callback("Error updating Score", null);
            }
        }
    });
};

var getScores = function (userId, callback) {
    var url = "/api/leaderboard?userId="+userId;
    $.ajax({
        "url": url,
        "type": "GET",
        "success": function (data) {
            if (data) {
                if (typeof callback === "function") {
                    callback(null, data);
                }
                return;
            }

            if (typeof callback === "function") {
                callback("Error fetching Score", null);
            }
        },
        "error":  function (err) {
            console.log("Error", err);
            if (typeof callback === "function") {
                callback("Error fetching Score", null);
            }
        }
    });
};

$(function() {

    // Set the session ID for Game
    var userId = "";
    var sessionID = "";
    // activateSession(userId, function (err, sID) {
    //     if (!err && sID) {
    //         sessionID = sID;
    //     } else {
    //         sessionID = "";
    //     }
    // });

    var anim_id;

    //saving dom objects to variables
    var container = $('#container');
    var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var car_4 = $('#car_4');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');
    var smileyImgObj = $('#smileyImg');
    var restartTextObj = $('#restart_text');

    var audio = new Audio('./audio/engine.mp3');
    var high_score = localStorage.getItem('high_score');
    $('#high_score').text(high_score);

    //saving some initial setup
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());

    //some other declarations
    var game_over = false;

    var score_counter = 1;

    var speed = 2;
    var line_speed = 5;

    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;
    /**
     * on username submit
     */
    if (localStorage.getItem("__@RB_name")) {
        $('.overlay_input_container')[0].classList.add('hidden');
        $('#main_container')[0].classList.remove('hidden');

        userId = localStorage.getItem("__@RB_name");
        sessionID = localStorage.getItem("__@RB_ssId");
    }

    $('#submit').on('click', function(){
        userId = document.getElementById('userID').value;
        uniqueUserIDCheck(userId, function(error, data){
            if (error) {
                $('.error')[0].classList.remove('hidden');
            } else if (data) {
                localStorage.setItem("__@RB_name", userId);
                localStorage.setItem("__@RB_ssId", data);
                sessionID = data;
                $('.overlay_input_container')[0].classList.add('hidden');
                $('#main_container')[0].classList.remove('hidden');
                anim_id = requestAnimationFrame(repeat);
            }
        })
    });
    /**
     * ===========end here=============
     */

    /**
     * on click leadership board
     */
    $("#closeBoard").on('click', function(){
        $(".leadership")[0].classList.add('hidden');
    });

    $('#board').on('click', function(){
        $('#closeNav').click();
        getScores(userId, function(error, data){
            if(!error && data){
                let board = `<div class="row header"><span></span><span>LEADERBOARD</span></div>`;
                for(let i = 0; i < data.toppers.length; i++){
                    board += `<div class="row ${data.toppers[i].userId === userId ? 'current_user' : ''}">
                                <span class="profile"></span>
                                <span class="userId">${data.toppers[i].userId}</span>
                                <span class="score">${data.toppers[i].totalScore}</span>
                            </div>`
                }
                $(".boardScore").html(board);
            }else{
                $(".boardScore").html(`<div><span class="no_data"></span>
                                         <span>Data is not available currently</span>
                                        </div>`);
            }
            $(".leadership")[0].classList.remove('hidden');

        })
    });
    /**
     * ============end here ===============
     */

    /**
     * On click of Hamburger Icon
     */
    $('#openNav').on('click',function(){
        document.getElementById("mySidenav").style.width = "250px";
    });

    $('#closeNav').on('click', function(){
        document.getElementById("mySidenav").style.width = "0";        
    });

    $('#offer').on('click',function(){
        $('.offer_container')[0].classList.remove('hide');
        // location.href = '/offer.html';
        $('#closeNav').click();
        // document.getElementsByClassName('offer_container')[0].classList.remove('hide');
        // $.ajax( "/api/board" )
        //     .done(function(res) {
        //         console.log(res);
        //     })
        //     .fail(function() {
        //         console.log('error')
        //     })
    });

    $("#closeCard").on('click', function(){
        $('.offer_container')[0].classList.add('hide');
    });

    /* Move the cars */
    $(document).on('keydown', function(e) {
        keyDownFunc(e);
    });

    $('.top_arrow_btn').on('click',function(){
        pressButton({keyCode:38});
    });

    $('.right_arrow_btn').on('click',function(){
        pressButton({keyCode:39});
    });

    $('.bottom_arrow_btn').on('click',function(){
        pressButton({keyCode:40});
    });

    $('.left_arrow_btn').on('click',function(){
        pressButton({keyCode:37});
    });

    function pressButton(e){
        let timerKey;
        keyDownFunc(e);
        timerKey = setTimeout(function(){
            keyUpFunc(e);
        },200); 
    }

    function keyDownFunc(e){
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    }

    function keyUpFunc(e){
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    }

    $(document).on('keyup', function(e) {
        keyUpFunc(e);
    });

    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    /* Move the cars and lines */
    if(userId && sessionID){
        anim_id = requestAnimationFrame(repeat);
    }

    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3) || collision(car,car_4)) {
            stop_the_game();
            audio.pause();
            return;
        }

        score_counter++;
        audio.muted = false;
        audio.play();

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        
        if (score_counter % 500 == 0) {
            speed++;
            if(speed>5){
                audio.src = './audio/carAccelaratingAudio.mp3';
            }else if(speed>=2 && speed<=3){
                audio.src = './audio/bus.mp3';
            }
            line_speed++;
        }

        car_down(car_1);
        car_down(car_2);
        car_down(car_3);
        car_down(car_4);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        anim_id = requestAnimationFrame(repeat);
    }

    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }

    restart_btn.click(function() {
        location.reload();
    });

    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restart_div.slideDown();
        restart_btn.focus();
        
        var options = {
            "userId": userId,
            "sessionId": sessionID,
            "score": parseInt(score.text())
        };
        updateScores(options);
        setHighScore();
        var counter = 0;
        var faceStr = "smiling";
        setInterval(function(){
            if(counter==3) counter=0;
            
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
            counter++;
        },1000);
        var xxx_score = parseInt(score.text());
        if(xxx_score<20){
            restartTextObj.text("That so Poor of You!");
            faceStr = "sad";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=20 && xxx_score<30){
            restartTextObj.text("That was Bad");
            faceStr = "sad";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=30 && xxx_score<60){
            restartTextObj.text("Good , You can do Better");
            faceStr = "smiling";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=60 && xxx_score<90){
            restartTextObj.text("Great! Marching towards the Peak");
            faceStr = "smiling";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=90 && xxx_score<120){
            restartTextObj.text("Voilla!!Race for more ");
            faceStr = "happy";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=120 && xxx_score<150){
            restartTextObj.text("Superb !Awesome! ");
            faceStr = "happy";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
        else if(xxx_score>=150){
            restartTextObj.text("Fantabulous !Outstanding! ");
            faceStr = "happy";
            smileyImgObj.attr("src", "./svg/"+faceStr+counter+".svg");
        }
    }

    function setHighScore() {
        if (high_score < parseInt(score.text())) {
            high_score = parseInt(score.text());
            localStorage.setItem('high_score', parseInt(score.text()));
        }
        $('#high_score').text(high_score);
    }

    /* ------------------------------GAME CODE ENDS HERE------------------------------------------- */


    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
        


        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    
});