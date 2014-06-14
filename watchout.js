var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameBoard = d3.select(".container").append("svg")
            .attr("width", gameOptions.width)
            .attr("height", gameOptions.height)
            .attr("class", "board");

var Player = function() {
  this.x = gameOptions.width * 0.5;
  this.y = gameOptions.height * 0.5;
  this.rad = 15;
  this.drag = d3.behavior.drag()
    .on('drag', function() {
      this.x += d3.event.dx;
      this.y += d3.event.dy;
      this.d3Node.attr('cx', this.x).attr('cy', this.y);
    }.bind(this));

  this.d3Node = gameBoard.append('svg:circle')
                         .attr('class', 'player')
                         .attr('cx', this.x)
                         .attr('cy', this.y)
                         .attr('r', this.rad)
                         .attr('fill', 'blue')
                         .call(this.drag);
};

Player.prototype.render = function() {
  gameBoard.select('circle.player')
               .attr('class', 'enemy')
               .attr('cx', this.x)
               .attr('cy', this.y)
               .attr('r', this.rad)
               .attr('fill', 'blue')
               .call(this.drag);
};

Player.prototype.makeDraggable = function() {
  d3.behavior.drag().on('drag', function() {
    console.log("player drag called");
    this.x += d3.event.dx;
    this.y += d3.event.dy;
  });
};

var Enemy = function() {
  this.move();
  this.rad = 10;
  this.d3node = gameBoard.selectAll("circle").data([[this.x, this.y]], function(datum) {return datum;})
          .enter().append('svg:circle')
          .attr('class', 'enemy')
          .attr('cx', this.x)
          .attr('cy', this.y)
          .attr('r', this.rad)
          .attr('fill', 'red');
};

Enemy.prototype.move = function() {
  this.x = Math.random() * gameOptions.width;
  this.y = Math.random() * gameOptions.height;
};

Enemy.prototype.render = function() {
  this.d3node.transition().duration(2000).attr("cx", this.x)
                 .attr("cy", this.y)
                 .attr("r", this.rad)
                 .attr("fill", "red");
};

var Game = function(numEnemies) {
  this.enemies = [];
  for (var i = 0; i < numEnemies; i++) {
    var newEnemy = new Enemy();
    this.enemies.push(newEnemy);
  }
  this.player = new Player();
  this.step();
};


Game.prototype.step = function() {

  setInterval(function() {
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].move();
      this.enemies[i].render();

    }
  }.bind(this), 2000);
};
