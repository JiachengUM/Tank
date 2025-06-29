class TankBattleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.enemiesKilled = 0;
        
        // Player tank
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            width: 40,
            height: 40,
            speed: 3,
            health: 100,
            maxHealth: 100,
            angle: 0,
            bullets: [],
            lastShot: 0,
            shotCooldown: 300
        };
        
        // Game objects
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        
        // Timing
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.spawnInitialEnemies();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning && !this.gamePaused) {
                this.shoot();
            }
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.enemiesKilled = 0;
        this.player.health = this.player.maxHealth;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.particles = [];
        this.spawnInitialEnemies();
        this.updateUI();
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        }
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('pauseBtn').textContent = 'Pause';
        this.startGame();
    }
    
    spawnInitialEnemies() {
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
    }
    
    spawnEnemy() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
            case 0: // Top
                x = Math.random() * this.width;
                y = -50;
                break;
            case 1: // Right
                x = this.width + 50;
                y = Math.random() * this.height;
                break;
            case 2: // Bottom
                x = Math.random() * this.width;
                y = this.height + 50;
                break;
            case 3: // Left
                x = -50;
                y = Math.random() * this.height;
                break;
        }
        
        this.enemies.push({
            x: x,
            y: y,
            width: 35,
            height: 35,
            speed: 1 + Math.random() * 2,
            health: 30 + this.level * 10,
            maxHealth: 30 + this.level * 10,
            angle: 0,
            lastShot: 0,
            shotCooldown: 1000 + Math.random() * 1000,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
    
    spawnPowerUp() {
        const types = ['health', 'speed', 'damage'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: Math.random() * (this.width - 30),
            y: Math.random() * (this.height - 30),
            width: 25,
            height: 25,
            type: type,
            color: type === 'health' ? '#ff6b6b' : type === 'speed' ? '#4ecdc4' : '#ffd93d'
        });
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.player.lastShot < this.player.shotCooldown) return;
        
        this.player.lastShot = now;
        
        const bulletSpeed = 8;
        const bulletX = this.player.x + Math.cos(this.player.angle) * 25;
        const bulletY = this.player.y + Math.sin(this.player.angle) * 25;
        
        this.bullets.push({
            x: bulletX,
            y: bulletY,
            vx: Math.cos(this.player.angle) * bulletSpeed,
            vy: Math.sin(this.player.angle) * bulletSpeed,
            width: 4,
            height: 4,
            damage: 25
        });
    }
    
    enemyShoot(enemy) {
        const now = Date.now();
        if (now - enemy.lastShot < enemy.shotCooldown) return;
        
        enemy.lastShot = now;
        
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            const angle = Math.atan2(dy, dx);
            const bulletSpeed = 5;
            
            this.bullets.push({
                x: enemy.x + Math.cos(angle) * 20,
                y: enemy.y + Math.sin(angle) * 20,
                vx: Math.cos(angle) * bulletSpeed,
                vy: Math.sin(angle) * bulletSpeed,
                width: 4,
                height: 4,
                damage: 15,
                isEnemy: true
            });
        }
    }
    
    updatePlayer(deltaTime) {
        // Movement
        let dx = 0, dy = 0;
        
        if (this.keys['w']) dy -= this.player.speed;
        if (this.keys['s']) dy += this.player.speed;
        if (this.keys['a']) dx -= this.player.speed;
        if (this.keys['d']) dx += this.player.speed;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Update position with bounds checking
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        if (newX >= this.player.width/2 && newX <= this.width - this.player.width/2) {
            this.player.x = newX;
        }
        if (newY >= this.player.height/2 && newY <= this.height - this.player.height/2) {
            this.player.y = newY;
        }
        
        // Aiming
        const dx2 = this.mouse.x - this.player.x;
        const dy2 = this.mouse.y - this.player.y;
        this.player.angle = Math.atan2(dy2, dx2);
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move towards player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
                enemy.angle = Math.atan2(dy, dx);
            }
            
            // Shoot at player
            this.enemyShoot(enemy);
            
            // Remove if off screen
            if (enemy.x < -100 || enemy.x > this.width + 100 || 
                enemy.y < -100 || enemy.y > this.height + 100) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Remove if off screen
            if (bullet.x < 0 || bullet.x > this.width || 
                bullet.y < 0 || bullet.y > this.height) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check collision with enemies
            if (!bullet.isEnemy) {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    if (this.checkCollision(bullet, enemy)) {
                        enemy.health -= bullet.damage;
                        this.bullets.splice(i, 1);
                        
                        if (enemy.health <= 0) {
                            this.enemies.splice(j, 1);
                            this.score += 100;
                            this.enemiesKilled++;
                            this.createExplosion(enemy.x, enemy.y);
                            
                            // Level up every 10 kills
                            if (this.enemiesKilled % 10 === 0) {
                                this.level++;
                            }
                        }
                        break;
                    }
                }
            } else {
                // Check collision with player
                if (this.checkCollision(bullet, this.player)) {
                    this.player.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    this.createExplosion(bullet.x, bullet.y);
                    
                    if (this.player.health <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
    }
    
    updatePowerUps(deltaTime) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (this.checkCollision(this.player, powerUp)) {
                this.applyPowerUp(powerUp.type);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
                break;
            case 'speed':
                this.player.speed += 0.5;
                setTimeout(() => this.player.speed -= 0.5, 10000);
                break;
            case 'damage':
                // Increase bullet damage temporarily
                const originalDamage = 25;
                this.bullets.forEach(bullet => {
                    if (!bullet.isEnemy) bullet.damage = 40;
                });
                setTimeout(() => {
                    this.bullets.forEach(bullet => {
                        if (!bullet.isEnemy) bullet.damage = originalDamage;
                    });
                }, 8000);
                break;
        }
    }
    
    updateExplosions(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.life -= deltaTime;
            
            if (explosion.life <= 0) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    createExplosion(x, y) {
        this.explosions.push({
            x: x,
            y: y,
            radius: 30,
            life: 500,
            maxLife: 500
        });
        
        // Create particles
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1000,
                maxLife: 1000,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`
            });
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    updateUI() {
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.rotate(this.player.angle);
        
        // Tank body
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(-this.player.width/2, -this.player.height/2, 
                         this.player.width, this.player.height);
        
        // Tank tracks
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(-this.player.width/2 - 5, -this.player.height/2, 
                         5, this.player.height);
        this.ctx.fillRect(this.player.width/2, -this.player.height/2, 
                         5, this.player.height);
        
        // Tank cannon
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, -3, 25, 6);
        
        this.ctx.restore();
        
        // Health bar
        this.drawHealthBar(this.player.x, this.player.y - 30, 
                          this.player.health, this.player.maxHealth);
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            this.ctx.rotate(enemy.angle);
            
            // Enemy body
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(-enemy.width/2, -enemy.height/2, 
                             enemy.width, enemy.height);
            
            // Enemy cannon
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.fillRect(0, -2, 20, 4);
            
            this.ctx.restore();
            
            // Health bar
            this.drawHealthBar(enemy.x, enemy.y - 25, 
                              enemy.health, enemy.maxHealth);
        });
    }
    
    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.isEnemy ? '#e74c3c' : '#f39c12';
            this.ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, 
                             bullet.width, bullet.height);
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
            
            // Power-up symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            const symbol = powerUp.type === 'health' ? '♥' : 
                          powerUp.type === 'speed' ? '⚡' : '⚔';
            this.ctx.fillText(symbol, powerUp.x + powerUp.width/2, 
                             powerUp.y + powerUp.height/2 + 5);
        });
    }
    
    drawExplosions() {
        this.explosions.forEach(explosion => {
            const alpha = explosion.life / explosion.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            const gradient = this.ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.radius
            );
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            this.ctx.restore();
        });
    }
    
    drawHealthBar(x, y, health, maxHealth) {
        const barWidth = 40;
        const barHeight = 4;
        const healthPercent = health / maxHealth;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x - barWidth/2, y, barWidth, barHeight);
        
        // Health fill
        this.ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : 
                             healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        this.ctx.fillRect(x - barWidth/2, y, barWidth * healthPercent, barHeight);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        
        // Draw game objects
        this.drawPowerUps();
        this.drawEnemies();
        this.drawBullets();
        this.drawPlayer();
        this.drawExplosions();
        this.drawParticles();
        
        // Draw crosshair
        if (this.gameRunning && !this.gamePaused) {
            this.ctx.strokeStyle = '#4ecdc4';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouse.x - 10, this.mouse.y);
            this.ctx.lineTo(this.mouse.x + 10, this.mouse.y);
            this.ctx.moveTo(this.mouse.x, this.mouse.y - 10);
            this.ctx.lineTo(this.mouse.x, this.mouse.y + 10);
            this.ctx.stroke();
        }
    }
    
    update(deltaTime) {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateBullets(deltaTime);
        this.updatePowerUps(deltaTime);
        this.updateExplosions(deltaTime);
        this.updateParticles(deltaTime);
        
        // Spawn enemies
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > 2000) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // Spawn power-ups
        this.powerUpSpawnTimer += deltaTime;
        if (this.powerUpSpawnTimer > 10000) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 0;
        }
        
        this.updateUI();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new TankBattleGame();
}); 