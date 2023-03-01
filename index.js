const canvas = document.querySelector("#GameScreen");
const c = canvas.getContext("2d");

var gravity = 9.81/75;
var gravitySpeedMax = 500
var object_list = []

class planet {
    constructor({ pos, size, html }) {
        this.pos = pos
        this.size = size
        this.html = html
    }
    draw() {
        //! HTML
        const htmlEle = document.getElementById(this.html)
        htmlEle.style.width = this.size*2+'px'
        htmlEle.style.height = this.size*2+'px'
        htmlEle.style.left = this.pos.x+canvas.offsetLeft-this.size+1+'px'
        htmlEle.style.top = this.pos.y+canvas.offsetTop-this.size+1+'px'
        c.strokeStyle = 'rgb(255, 187, 0)'
        c.fillStyle = 'rgb(255, 187, 0)';
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        c.stroke();
        c.fill()
        //! Linia kierunku
        c.strokeStyle = 'red'
        c.beginPath();
        c.moveTo(this.pos.x, this.pos.y);
        c.lineTo(this.pos.x+this.size, this.pos.y);
        c.stroke();
    }
    update() {
        this.draw()
    }
}

function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

class mini_planet {
constructor({ pos, size, target, vel, html, color }) {
    this.pos = pos;
    this.size = size;
    this.target = target;
    this.vel = vel;
    this.speed = 0;
    this.html = html;
    this.color = color;
    this.htmlEle = document.getElementById(this.html);
    this.ctx = canvas.getContext('2d');
}
draw() {
    const { pos, size, color, ctx } = this;

    // HTML
    this.htmlEle.style.width = size * 2 + 'px';
    this.htmlEle.style.height = size * 2 + 'px';
    this.htmlEle.style.left = pos.x + canvas.offsetLeft - size + 1 + 'px';
    this.htmlEle.style.top = pos.y + canvas.offsetTop - size + 1 + 'px';

    // Wygląd
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // Linia kierunku
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + size, pos.y);
    ctx.stroke();

    // Linia do grawitacji
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(this.target.pos.x, this.target.pos.y);
    ctx.stroke();
}
move() {
    const { pos, target, vel } = this;
    // aktualizacja pozycji
    const dis = distance(target.pos, pos);
    const x = canvas.width / 2 + dis * Math.cos(this.speed);
    const y = canvas.height / 2 + dis * Math.sin(this.speed);

    pos.x = x;
    pos.y = y;

    const test = document.getElementById(`${this.html}_speed`).value / 100;
    // zwiększenie prędkości ruchu
    this.speed += vel + parseFloat(test);
}
update() {
    this.move();
    this.draw();
}
}
class mini_planet2 {
    constructor({ pos, size, target, vel, html, color }) {
        this.pos = pos;
        this.size = size;
        this.target = target;
        this.vel = vel;
        this.speed = 0;
        this.html = html;
        this.color = color;
        this.htmlEle = document.getElementById(this.html);
        this.ctx = canvas.getContext('2d');
    }

    draw() {
        const { pos, size, color, ctx } = this;

        // HTML
        this.htmlEle.style.width = size * 2 + 'px';
        this.htmlEle.style.height = size * 2 + 'px';
        this.htmlEle.style.left = pos.x + canvas.offsetLeft - size + 1 + 'px';
        this.htmlEle.style.top = pos.y + canvas.offsetTop - size + 1 + 'px';

        // Wygląd
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        // Linia kierunku
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + size, pos.y);
        ctx.stroke();

        // Linia do grawitacji
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(this.target.pos.x, this.target.pos.y);
        ctx.stroke();
    }

    move() {
        const { pos, target, vel } = this;
        // aktualizacja pozycji
        const dis = distance(target.pos, this.pos);
        // const x = target.pos.x + dis * Math.cos(this.speed) / 2;
        // const y = target.pos.y + dis * Math.sin(this.speed) / 2;
        const x = target.pos.x + Math.cos(this.speed)
        const y = target.pos.y + Math.sin(this.speed)

        // przesunięcie pozycji w okół aktualnej pozycji
        const moveX = Math.cos(this.speed) * this.target.size * 2;
        const moveY = Math.sin(this.speed) * this.target.size * 2;
        pos.x = x + moveX;
        pos.y = y + moveY;

        const test = document.getElementById(`${this.html}_speed`).value / 100;
        // zwiększenie prędkości ruchu
        this.speed += vel + parseFloat(test);
    }

    update() {
        this.move();
        this.draw();
    }
}

class box {
    constructor({ pos, size, gravityLocal, id}) {
        this.pos = pos
        this.size = size
        this.gravitySpeed = 0
        this.gravityLocal = gravityLocal
        this.speedX = 0
        this.speedY = 0
        this.id = id
        this.onGround = false
        this.hitGround = function() {
            var floor = canvas.height - this.size.y;
            if (this.pos.y > floor) {
                this.pos.y = floor;
                this.onGround = true
            }
            //!
            object_list.forEach((e, index) => {
                if (this.id != e.id) {
                    var bad = false
                    var colision = e.pos.y - this.size.y
                    if(this.pos.x+this.size.x <= e.pos.x+this.size.x && this.pos.x+this.size.x >= e.pos.x) {
                        bad = true
                    }
                    if(this.pos.x > e.pos.x && this.pos.x < e.pos.x+e.size.x) {
                        bad = true
                    }    
                    if(bad == true) {
                        if(this.pos.y > colision && this.pos.y+this.gravityLocal <= colision+e.size.y+this.gravitySpeed) {
                            this.pos.y = colision
                            this.onGround = true
                        }
                    }
                }
            })
            //!
            // if (this.id == 0) {
            //     var bad = false
            //     var colision = box2.pos.y - this.size.y
            //     // PRAWA STRONA
            //     if(this.pos.x+this.size.x <= box2.pos.x+this.size.x && this.pos.x+this.size.x >= box2.pos.x) {
            //         // LEWA STRONA
            //         bad = true
            //     }
            //     if(this.pos.x > box2.pos.x && this.pos.x < box2.pos.x+box2.size.x) {
            //         bad = true
            //     }    
            //     if(bad == true) {
            //         if(this.pos.y > colision) {
            //             this.onGround = true
            //             this.pos.y = colision
            //         }
            //     }
            // }
        }
    }

    draw() {
        c.fillStyle = 'red'
        c.strokeStyle = 'white'
        c.lineWidth = 1;
        // c.fillRect(this.pos.x,this.pos.y, 50, 50)
        c.strokeRect(this.pos.x,this.pos.y, this.size.x, this.size.y);
        c.beginPath();
        c.strokeStyle = 'red'
        c.moveTo(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2); //stawiamy piórko w punkcie x: 20 y: 20
        c.lineTo(this.pos.x + this.size.x, this.pos.y + this.size.y/2); //zaczynamy rysować niewidzialną linię do x : 30, y: 40
        c.stroke(); //po zakończeniu rysowania obrysowujemy linię
    }
    update() {
        this.onGround = false
        this.hitGround()
        this.draw()
        if(this.onGround == false) {
            if (this.gravitySpeed < gravitySpeedMax) {
                this.gravitySpeed += this.gravityLocal;
            }
            this.pos.y += this.speedY + this.gravitySpeed;
        } else {
            this.gravitySpeed = 0
        }
    }
}

const sun = new planet({
    pos: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    size: 50,
    html: 'sun'
})
const earth = new mini_planet({
    pos: {
        x: 125,
        y: canvas.height / 2
    },
    size: 15,
    target: sun,
    vel: 0,
    html: 'earth',
    color: 'green'
})
const moon = new mini_planet2({
    pos: {
        x: earth.pos.x,
        y: earth.pos.y
    },
    size: 7.5,
    target: earth,
    vel: 0,
    html: 'moon',
    color: 'blue'
})
object_list.push(earth)
object_list.push(moon)
// object_list.push(box2)

function clear() {
    c.fillStyle = '#1f2335'
    c.fillRect(0, 0, canvas.width, canvas.height)
}

function animate() {
    requestAnimationFrame(animate)
    clear()
    sun.update()
    earth.update()
    moon.update()
}
animate()

let mouseX, mouseY
let hoverObject = undefined
let clicked = false

document.addEventListener('mousemove', function(event) {
    mouseX = event.pageX - canvas.offsetLeft
    mouseY = event.pageY - canvas.offsetTop

    for (let i = 0; i < object_list.length; i++) {
        let e = object_list[i]
        if (mouseX >= e.pos.x - e.size && mouseX <= e.pos.x - e.size + e.size * 2 &&
            mouseY >= e.pos.y - e.size && mouseY <= e.pos.y - e.size + e.size * 2) {
            hoverObject = e
        }
    }

    if (hoverObject != undefined && clicked == true) {
        hoverObject.pos.x = mouseX
        hoverObject.pos.y = mouseY
    }
})

document.addEventListener('mousedown', function(event) {
    clicked = true
})

document.addEventListener('mouseup', function(event) {
    clicked = false
})