var countDown;

new Vue({
    el: '#app',
    data: {
        stage: 0,
        lives: 4,
        score: 0,
        time: 0,
        color: 'blue',
        archery: [400, 200],     // x, y cordinates
        crosshair: [450, 250],     // x, y cordinates
        activity: 0,
        shootImg: 0,
        addPoint: false,
        points: 0,
        infoPanel: false,
        gameOver: false,
        isStart: false,
        isStop: false,
        //--------------------------------------Sounds--------------------------------------------------------

        slip: new Audio('./assets/sound/slip.mp3'),
        shoot: new Audio('./assets/sound/shoot.mp3'),
        startingMusic: new Audio('./assets/sound/starting.mp3'),
        failMusic: new Audio('./assets/sound/fail.wav'),
        successMusic: new Audio('./assets/sound/success.mp3')
    },
    created() {
      window.addEventListener('keydown', (e) => {
        if(this.isStart)
        {
          switch(e.keyCode)
          {
            case 32:
              // Shoot Bullet
              this.shootBullet();
              break;

            case 27:
              this.stop();
              break;
          }
        }
        else if (this.isStop)
        {
          switch(e.keyCode)
          {
            case 13:
              this.start();
              break;
          }
        }
      });
      window.addEventListener('mousemove', (e) => {
        if(this.isStart)
        {
          this.crosshair[0] = e.pageX - 300;            // 1000 - 200
          this.crosshair[1] = e.pageY - 150;
          this.$refs.crosshair.style.left = (e.pageX - 300 )+'px';
          this.$refs.crosshair.style.top = (e.pageY - 150 )+'px';
          if(e.pageX <= 280 ){
            this.$refs.crosshair.style.left = -18 +'px'
          }
          if(e.pageX >= 1217 ){
            this.$refs.crosshair.style.left = 918 +'px'
          }
          if(e.pageY <= 130 ){
            this.$refs.crosshair.style.top = -18 +'px'
          }
          if(e.pageY >= 670 ){
            this.$refs.crosshair.style.top = 518 +'px'
          }
        }
      });
      window.addEventListener('mouseup', (e) => {
        if(this.isStart)
        { // Shoot Bullet
          this.shootBullet();
        }
      });

    },
    methods:
    {
        shootBullet:function()
        {
          // Shoot Bullet
          this.shootImg = 1;
          this.shoot.play();
          let distance = this.calDistance();
          if(distance < 100)        // true when target is under range of archery
          {
              this.points = Math.round(100 - distance) + (this.time * 2)     // 1 second == 2 points
              this.addPoint = true;

              setTimeout(()=>{
                  this.score += this.points;
                  this.addPoint = false;
                  this.points = 0;
                  this.nextStage(true);
              }, 1000)
          }
          else                                // shoot outside the archery
          {
              this.nextStage(false);
          }
        },
        start:function()
        {
          document.getElementsByClassName('start')[0].style.display  = 'none';           // 600 - 200          // 600 - 200
          this.activity++;

          if(this.isStop == false)
          {
            if(!this.isStart)
            {
                this.isStart = true;

                if(this.stage < 10)
                {
                    this.time = 30 + ( 30 - this.stage * 5);        // each stage time will start with -5s
                }
                else
                {
                    this.time = 15;
                }
                this.stage++;
                this.startingMusic.play();
                    countDown = setInterval(()=>{
                    this.time--;
                    if(this.time == 1)
                    {
                        this.nextStage(false);
                    }
                }, 1000)
                this.archery[0] = Math.floor((Math.random() * 800));            // 1000 - 200
                this.archery[1] = Math.floor((Math.random() * 400));            // 600 - 200

                this.crosshair[0] = Math.floor((Math.random() * 900));            // 1000 - 200
                this.crosshair[1] = Math.floor((Math.random() * 500));
            }
          }else {
            this.isStart = true;
            this.isStop  = false
            this.startingMusic.play();
                countDown = setInterval(()=>{
                this.time--;
                if(this.time == 1)
                {
                    this.nextStage(false);
                }
            }, 1000)
          }
        },
        stop:function ()
        {
          this.isStart = false;
          this.isStop  = true;
          document.getElementsByClassName('start')[0].style.display  = 'block';           // 600 - 200
          this.startingMusic.pause();
          clearInterval(countDown);
        },
        restart:function ()
        {
          if(this.gameOver)
          {
              document.getElementsByClassName('start')[0].style.display  = 'block';           // 600 - 200
              clearInterval(countDown);
              this.stage= 0;
              this.lives= 4;
              this.score= 0;
              this.time= 0;
              this.color= 'blue';
              this.archery= [400, 200];   // x, y cordinate;
              this.crosshair= [450, 250];     // x, y cordinate;
              this.activity= 0;
              this.shootImg= 0;
              this.addPoint= false;
              this.points= 0;
              this.infoPanel= false;
              this.gameOver= false;
              this.isStart= false;
              this.isStop= false;
          }
        },
        calDistance: function(e)
        {
            let distance = [Math.abs(this.archery[0] - this.crosshair[0] + 50),         // +50 because archery image 200x200 and crosshair image 100x100
                            Math.abs(this.archery[1] - this.crosshair[1]  + 50)];

            actualDistance = Math.sqrt((distance[0] * distance[0]) + (distance[1] * distance[1]))       // Pythagoras Theory
            return actualDistance;
        },
        nextStage: function(success)
        {
            this.shootImg = 0;
            if(this.lives < 1)
            {
                clearInterval(countDown);
                this.time = 0;
                this.gameOver = true;
            }
            else
            {
                if(success)
                {
                    this.stage++;
                    this.startingMusic.play();
                }
                else
                {
                    this.lives--;
                    this.failMusic.play();
                }

                if(this.stage < 9)
                {
                    this.time = 30 + ( 30 - this.stage * 5);   // each stage time will start with -5s
                }
                else
                {
                    this.time = 15;
                }

                this.archery[0] = Math.floor((Math.random() * 400));            // 1000 - 200
                this.archery[1] = Math.floor((Math.random() * 400));            // 600 - 200
            }
        }
    }
});
