# Tank Battle Game

A modern web-based tank battle game built with HTML5 Canvas, JavaScript, and CSS. Fight off waves of enemy tanks in this action-packed arcade-style game!

## 🎮 Features

- **Smooth Tank Movement**: WASD controls for precise tank movement
- **Mouse Aiming**: Point and click shooting mechanics
- **Enemy AI**: Intelligent enemies that chase and shoot at the player
- **Power-ups**: Collect health, speed, and damage boosters
- **Progressive Difficulty**: Enemies get stronger as you level up
- **Visual Effects**: Explosions, particles, and smooth animations
- **Health System**: Manage your tank's health to survive
- **Score System**: Compete for high scores
- **Responsive Design**: Works on desktop and mobile devices

## 🎯 Game Controls

- **W, A, S, D** - Move tank (forward, left, backward, right)
- **Mouse** - Aim tank cannon
- **Left Click** - Shoot
- **Spacebar** - Pause/Resume game
- **Start Button** - Begin new game
- **Pause Button** - Pause current game
- **Restart Button** - Reset game

## 🚀 How to Play

1. **Start the Game**: Click the "Start Game" button
2. **Move Your Tank**: Use WASD keys to navigate around the battlefield
3. **Aim and Shoot**: Move your mouse to aim, click to fire at enemies
4. **Survive**: Avoid enemy bullets and destroy all enemy tanks
5. **Collect Power-ups**: Grab health (♥), speed (⚡), and damage (⚔) boosters
6. **Level Up**: Every 10 enemy kills increases the difficulty level

## 🎨 Game Elements

### Player Tank
- **Color**: Teal (#4ecdc4)
- **Health**: 100 HP
- **Movement**: Smooth WASD controls
- **Shooting**: Mouse-aimed rapid fire

### Enemy Tanks
- **Colors**: Random bright colors
- **Behavior**: Chase and shoot at player
- **Health**: Increases with level (30 + level × 10)
- **AI**: Intelligent targeting and movement

### Power-ups
- **Health (♥)**: Restores 30 HP
- **Speed (⚡)**: Increases movement speed for 10 seconds
- **Damage (⚔)**: Increases bullet damage for 8 seconds

### Visual Effects
- **Explosions**: Radial gradient effects when tanks are destroyed
- **Particles**: Debris animation for explosions
- **Health Bars**: Visual health indicators for all tanks
- **Grid Background**: Tactical battlefield appearance

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas**: For smooth 2D graphics rendering
- **Vanilla JavaScript**: ES6+ classes and modern syntax
- **CSS3**: Modern styling with gradients and animations
- **Responsive Design**: Mobile-friendly interface

### Game Engine Features
- **60 FPS Game Loop**: Smooth animation using requestAnimationFrame
- **Collision Detection**: Precise rectangle-based collision system
- **Particle System**: Dynamic explosion effects
- **State Management**: Clean game state handling
- **Input Handling**: Keyboard and mouse event management

## 📁 File Structure

```
Tank/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── game.js         # Main game logic and engine
└── README.md       # This file
```

## 🚀 How to Run

1. **Download/Clone** the project files
2. **Open** `index.html` in a modern web browser
3. **Click** "Start Game" to begin playing
4. **Enjoy** the tank battle action!

### Browser Requirements
- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- Recommended: Chrome, Firefox, Safari, or Edge

## 🎯 Game Objectives

- **Survive**: Don't let your health reach zero
- **Score Points**: Destroy enemies to earn points (100 per kill)
- **Level Up**: Progress through increasingly difficult levels
- **Beat Your High Score**: Try to achieve the highest score possible

## 🔧 Customization

The game is easily customizable:

- **Colors**: Modify CSS variables for different color schemes
- **Difficulty**: Adjust enemy spawn rates and health in `game.js`
- **Power-ups**: Add new power-up types or modify existing ones
- **Graphics**: Replace canvas drawing with sprite-based graphics
- **Sound**: Add audio effects and background music

## 🐛 Known Issues

- Game is optimized for desktop play (mobile controls may need adjustment)
- No sound effects (can be added for enhanced experience)
- No save/load functionality (scores are not persistent)

## 🤝 Contributing

Feel free to fork this project and add your own features:
- Sound effects and music
- Different tank types
- Multiplayer support
- Level-based progression
- Boss battles
- Weapon upgrades

## 📄 License

This project is open source and available under the MIT License.

---

**Have fun playing Tank Battle!** 🎮💥 