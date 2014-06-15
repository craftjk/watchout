var gameOptions = {
  height: 550,
  width: 1000,
  nEnemies: 30,
  padding: 20,
  highScore: 0
};

var gameBoard = d3.select(".container").append("svg")
            .attr("width", gameOptions.width)
            .attr("height", gameOptions.height)
            .attr("class", "board");

var Player = function() {
  this.x = gameOptions.width * 0.25;
  this.y = gameOptions.height * 0.5;
  this.dim = 88;
  this.drag = d3.behavior.drag()
    .on('drag', function() {
      this.x += d3.event.dx;
      this.y += d3.event.dy;
      if (this.x > gameOptions.width - this.dim) {
        this.x = gameOptions.width - this.dim;
      } else if (this.x < 0) {
        this.x = 0;
      } else if (this.y > gameOptions.height - this.dim) {
        this.y = gameOptions.height - this.dim;
      } else if (this.y < 0) {
        this.y = 0;
      }
      this.d3Node.attr('x', this.x).attr('y', this.y);
    }.bind(this));

  this.d3Node = gameBoard.append('svg:image')
          .attr('class', 'player')
          .attr('x', this.x)
          .attr('y', this.y)
          .attr('width', this.dim / 1.3)
          .attr('height', this.dim)
          .attr('xlink:href','ninja.png');
};

Player.prototype.render = function() {
  gameBoard.select('.player')
               .attr('x', this.x)
               .attr('y', this.y)
               .call(this.drag);
};

var Prize = function() {
  this.x = gameOptions.width * 0.75;
  this.y = gameOptions.height * 0.5;
  this.dim = 44;
  this.fruits = ['watermelon.png', 'apple.png', 'pear.png', 'strawberry.png'];
  this.fruit = this.fruits[Math.floor(Math.random() * this.fruits.length)];
  this.d3Node = gameBoard.append('svg:image')
          .attr('class', 'prize')
          .attr('x', this.x)
          .attr('y', this.y)
          .attr('width', this.dim)
          .attr('height', this.dim)
          .attr('xlink:href', this.fruit);
};

var Enemy = function() {
  this.dim = 30;
  this.move();
  this.d3Node = gameBoard.selectAll("image").data([[this.x, this.y]], function(datum) {return datum;})
          .enter().append('svg:image')
          .attr('class', 'star')
          .attr('x', this.x)
          .attr('y', this.y)
          .attr('width', this.dim)
          .attr('height', this.dim)
          .attr('xlink:href','star.png');
};

Enemy.prototype.move = function() {
  this.x = Math.random() * gameOptions.width * (1 - this.dim / (gameOptions.width));
  this.y = Math.random() * gameOptions.height * (1 - this.dim / (gameOptions.height));
};



Enemy.prototype.render = function() {
  this.d3Node.transition()
                .duration(2000)
                .attr('x', this.x)
                .attr('y', this.y)
};

var Game = function(numEnemies) {
  this.enemies = [];
  for (var i = 0; i < numEnemies; i++) {
    var newEnemy = new Enemy();
    this.enemies.push(newEnemy);
  }
  this.player = new Player();
  this.prize = new Prize();
  this.player.render();
  this.step();
};


Game.prototype.step = function() {
  var currentScore = 0;
  setInterval(function() {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.checkCollisions(this.player, this.enemies[i])) {
        if (currentScore > gameOptions.highScore) {
          gameOptions.highScore = currentScore;
          document.getElementById("high").innerHTML = currentScore;
        }
        currentScore = 0;
      }
    }

    if (this.checkCollisions(this.player, this.prize)) {
      currentScore += 100;
      var fruit = this.prize.fruits[Math.floor(Math.random() * this.prize.fruits.length)];
      gameBoard.select(".prize")
                .attr('x', Math.random() * gameOptions.width * (1 - this.prize.dim / gameOptions.width))
                .attr('y', Math.random() * gameOptions.height * (1 - this.prize.dim / gameOptions.width))
                .attr('xlink:href', fruit);
    }
    document.getElementById("current").innerHTML = currentScore;
    currentScore++;
  }.bind(this), 100);

  setInterval(function() {
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].move();
      this.enemies[i].render();

    }
  }.bind(this), 2000);
};

Game.prototype.checkCollisions = function(player, enemy) {
  var dx = (parseInt(player.d3Node.attr('x')) + player.dim / 2) - (parseInt(enemy.d3Node.attr('x')) + enemy.dim / 2);
  var dy = (parseInt(player.d3Node.attr('y')) + player.dim / 2) - (parseInt(enemy.d3Node.attr('y')) + enemy.dim / 2);
  var distance = Math.sqrt(dx*dx + dy*dy);

  return distance < (player.dim/2 + enemy.dim/2);
};
