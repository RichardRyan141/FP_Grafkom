document.getElementById('tombol-informasi').addEventListener('click', function() {
    var modal = document.getElementById('custom-popup');
    modal.style.display = "block";

    var closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
});

let startTime;

let mazeWidth = 0;
let mazeHeight = 0;

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const restartButton = document.getElementById('restart-button');
const mazeContainer = document.getElementById('maze-container');
const mazeWidthInput = document.getElementById('maze-width');
const mazeHeightInput = document.getElementById('maze-height');
const startButton = document.getElementById('start-button');
 
// Mengubah tampilan CSS elemen menggunakan kode JavaScript
mazeWidthInput.style.padding = '10px';
mazeWidthInput.style.border = '1px solid #ccc';
mazeWidthInput.style.borderRadius = '5px';
mazeWidthInput.style.fontSize = '16px';
mazeWidthInput.style.marginBottom = '10px';
mazeWidthInput.style.textAlign = 'center';

mazeHeightInput.style.padding = '10px';
mazeHeightInput.style.border = '1px solid #ccc';
mazeHeightInput.style.borderRadius = '5px';
mazeHeightInput.style.fontSize = '16px';
mazeHeightInput.style.marginBottom = '10px';
mazeHeightInput.style.textAlign = 'center';

const lobbyAudio = document.getElementById('lobby');
const audioLogoImg = document.getElementById('audio-logo-img');

var audioLobbyPlay = true;
var audioBgmPlay = false;

function playBackgroundMusic() {
    //console.log("Bgm : ", audioBgmPlay);
    if (!audioBgmPlay) {
        const backgroundMusic = document.getElementById('bgm');
        backgroundMusic.play();
        audioBgmPlay = true;
        stopLobbyMusic();
    } 
    else {
        stopBackgroundMusic();
    }
}

function stopBackgroundMusic() {

    const backgroundMusic = document.getElementById('bgm');
    backgroundMusic.pause();
    audioBgmPlay = false;
}

// Function to play the lobby music
function playLobbyMusic() {
    console.log("Lobby : ", audioLobbyPlay);
    if (!audioLobbyPlay) {
        lobbyAudio.play();
        audioLobbyPlay = true;
        stopBackgroundMusic();
        audioLogoImg.src = 'assets/img/audio.png';
    } 
    else {
        stopLobbyMusic();
    }
}

// Function to stop the lobby music
function stopLobbyMusic() {
    console.log("Lobby : ", audioLobbyPlay);

    lobbyAudio.pause();
    lobbyAudio.currentTime = 0;
    audioLobbyPlay = false;
    audioLogoImg.src = 'assets/img/disable-audio.png';
}

document.addEventListener('DOMContentLoaded', playLobbyMusic);

startButton.addEventListener('click', () => {
    mazeWidth = parseInt(mazeWidthInput.value);
    mazeHeight = parseInt(mazeHeightInput.value);
    startScreen.style.display = 'none';
    mazeContainer.style.display = 'block';
    initializeMaze();
    stopBackgroundMusic();
    document.getElementById('bgm').play(); //BGM
});


const gameOver = () => {
    document.getElementById('bgm').pause(); //BGM
    document.getElementById('lobby').play(); //BGM
    const timeTaken = calculateTimeTaken();
    gameOverText.textContent = `Congratulations!\nYou took ${timeTaken} seconds to clear the maze`;
    gameOverText.style.fontFamily = 'Nunito, sans-serif'; // Set the font family to Nunito
    gameOverScreen.style.display = 'flex';
    mazeContainer.style.pointerEvents = 'none';
};

const calculateTimeTaken = () => {
    const currentTime = new Date();
    const timeDiff = Math.round((currentTime - startTime) / 1000);
    return timeDiff;
};

restartButton.addEventListener("click", () => {
    location.reload();
});

function randomizeDimensions() {
    mazeWidth = Math.floor(Math.random() * 22) + 8;
    mazeHeight = Math.floor(Math.random() * 22) + 8;
    startScreen.style.display = 'none';
    mazeContainer.style.display = 'block';
    initializeMaze();
}

function initializeMaze() {
    startTime = Date.now();
    const cellSize = 50;

    let portalRow, portalCol;

    const maze = generateRandomMaze(mazeWidth, mazeHeight);
    console.log(maze);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    document.getElementById('maze-container').appendChild(renderer.domElement);

    const groundTexture = new THREE.TextureLoader().load('assets/textures/sml.jpg');
    const wallTexture = new THREE.TextureLoader().load('assets/textures/brick.jpeg');
    const ceilingTexture = new THREE.TextureLoader().load('assets/textures/ceilings.jpg');
    const portalTexture = new THREE.TextureLoader().load('assets/textures/door.jpg');

    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
    const floorMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
    const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });
    const portalMaterial = new THREE.MeshBasicMaterial({ map: portalTexture });

    for (let row = 0; row < mazeHeight; row++) {
        for (let col = 0; col < mazeWidth; col++) {
            const cell = maze[row][col];
            if (cell === 1) {
                const wall = new THREE.BoxGeometry(cellSize, cellSize * 2, cellSize);
                const wallMesh = new THREE.Mesh(wall, wallMaterial);
                wallMesh.position.x = col * cellSize - (mazeWidth / 2) * cellSize + cellSize / 2;
                wallMesh.position.y = cellSize;
                wallMesh.position.z = row * cellSize - (mazeHeight / 2) * cellSize + cellSize / 2;
                wallMesh.mazeWall = true;
                scene.add(wallMesh);
            } 
            
            else {
                const floor = new THREE.PlaneGeometry(cellSize, cellSize);
                const floorMesh = new THREE.Mesh(floor, floorMaterial);
                floorMesh.position.x = col * cellSize - (mazeWidth / 2) * cellSize + cellSize / 2;
                floorMesh.position.y = 0;
                floorMesh.position.z = row * cellSize - (mazeHeight / 2) * cellSize + cellSize / 2;
                floorMesh.rotation.x = -Math.PI / 2;
                scene.add(floorMesh);

                const ceiling = new THREE.PlaneGeometry(cellSize, cellSize);
                const ceilingMesh = new THREE.Mesh(ceiling, ceilingMaterial);
                ceilingMesh.position.x = col * cellSize - (mazeWidth / 2) * cellSize + cellSize / 2;
                ceilingMesh.position.y = cellSize * 2;
                ceilingMesh.position.z = row * cellSize - (mazeHeight / 2) * cellSize + cellSize / 2;
                ceilingMesh.rotation.x = Math.PI / 2;
                scene.add(ceilingMesh);

                if (cell == 2) {
                camera.position.set(floorMesh.position.x, cellSize / 2, floorMesh.position.z );
                }

                if (cell == 3) {
                const portal = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                const portalMesh = new THREE.Mesh(portal, portalMaterial);
                portalMesh.position.x = col * cellSize - (mazeWidth / 2) * cellSize + cellSize / 2;
                portalMesh.position.y = cellSize/2;
                portalMesh.position.z = row * cellSize - (mazeHeight / 2) * cellSize + cellSize / 2;
                portalMesh.mazePortal = true;
                scene.add(portalMesh);
                portalRow = row;
                portalCol = col;
                }
            }
        }
    }

    const playerControls = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
    };

    let isMousePressed = false;
    let previousMouseX = 0;

    document.addEventListener('keydown', (event) => {
        handlePlayerControls(event.keyCode, true);
    });

    document.addEventListener('keyup', (event) => {
        handlePlayerControls(event.keyCode, false);
    });

    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
        isMousePressed = true;
        previousMouseX = event.clientX;
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            isMousePressed = false;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isMousePressed) {
            const mouseDeltaX = event.clientX - previousMouseX;
            previousMouseX = event.clientX;
            rotateCameraX(mouseDeltaX);
        }
    });

    function handlePlayerControls(keyCode, isPressed) {
        switch (keyCode) {
        case 87: // W key
        case 38: // Arrow up
            playerControls.moveForward = isPressed;
            break;
        case 83: // S key
        case 40: // Arrow down
            playerControls.moveBackward = isPressed;
            break;
        case 65: // A key
        case 37: // Arrow left
            playerControls.moveLeft = isPressed;
            break;
        case 68: // D key
        case 39: // Arrow right
            playerControls.moveRight = isPressed;
            break;
        default:
            break;
        }
    }
    
    function checkCollision(position) {
        const cameraPosition = position.clone();

        for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];

        if (object.mazeWall) {
            const wallBoundingBox = new THREE.Box3().setFromObject(object);

            if (wallBoundingBox.containsPoint(cameraPosition)) {
            return true;
            }
        }
        }

        return false;
    }

    let isGameOver = false;

    function checkCollisionPortal(position) {
        const cameraPosition = position.clone();

        for (let i = 0; i < scene.children.length; i++) {
            const object = scene.children[i];

            if (object.mazePortal) {
                const portalBoundingBox = new THREE.Box3().setFromObject(object);

                if (portalBoundingBox.containsPoint(cameraPosition)) {
                gameOver();
                return true;
                }
            }
        }

        return false;
    }

    function moveBackToPreviousPosition() {
        const moveSpeed = 0.5;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const backwardMovement = direction.clone().negate().multiplyScalar(moveSpeed);
        const newPosition = camera.position.clone().add(backwardMovement);

        if (!checkCollision(newPosition)) {
            camera.position.copy(newPosition);
        }
    }

    function rotateCameraX(deltaX) {
        const rotationSpeed = 0.01;
        camera.rotation.y -= deltaX * rotationSpeed;
    }

    function showCompletedScreen() {
        const currentTime = Date.now();
        const duration = Math.floor((currentTime - startTime) / 1000);

        const gameOverScreen = document.getElementById('game-over');
        gameOverScreen.style.display = 'block';

        const gameOverTitle = document.createElement('h1');
        gameOverTitle.innerText = 'Congratulations';
        gameOverScreen.appendChild(gameOverTitle);

        const gameOverText = document.createElement('p');
        gameOverText.innerText = `You took ${duration} seconds to clear the maze.`;
        gameOverScreen.appendChild(gameOverText);

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Play Again';
        restartButton.addEventListener('click', restartGame);
        gameOverScreen.appendChild(restartButton);

        playerControls.moveForward = false;
        playerControls.moveBackward = false;
        playerControls.moveLeft = false;
        playerControls.moveRight = false;

        isGameOver = true;
    }

    function restartGame() {
        location.reload();
    }


    const minimapContainer = document.getElementById('minimap-grid');
    const minimapCells = [];

    function initializeMinimap() {
        const cellWidth = 100 / mazeWidth;
        const cellHeight = 100 / mazeHeight;

        for (let row = 0; row < mazeHeight; row++) {
            for (let col = 0; col < mazeWidth; col++) {
                const cell = document.createElement('div');
                cell.className = 'minimap-cell';
                cell.style.width = cellWidth + '%';
                cell.style.height = cellHeight + '%';
                minimapContainer.appendChild(cell);
                minimapCells.push(cell);
            }
        }

        const pos = camera.position.clone();
        const col = Math.floor((pos.x + (mazeWidth / 2) * cellSize - cellSize / 2) / cellSize);
        const row = Math.floor((pos.z + (mazeHeight / 2) * cellSize - cellSize / 2) / cellSize);
        const posIndex = row * mazeWidth + col;
        minimapCells[posIndex].classList.add('player');
        minimapCells[posIndex].classList.add('visited');

        //const portalIndex = portalRow * mazeWidth + portalCol;
        //minimapCells[portalIndex].classList.add('portal');
    }

    initializeMinimap();

    function checkGrid(oldPos, newPos) {
        const oldCol = Math.floor((oldPos.x + (mazeWidth / 2) * cellSize) / cellSize);
        const oldRow = Math.floor((oldPos.z + (mazeHeight / 2) * cellSize) / cellSize);

        const newCol = Math.floor((newPos.x + (mazeWidth / 2) * cellSize) / cellSize);
        const newRow = Math.floor((newPos.z + (mazeHeight / 2) * cellSize) / cellSize);
        if (((oldCol != newCol) || (oldRow != newRow)) && maze[newRow][newCol] != 1) {
            const oldCellIndex = oldRow * mazeWidth + oldCol;
            const newCellIndex = newRow * mazeWidth + newCol;

            if (minimapCells[oldCellIndex]) {
                minimapCells[oldCellIndex].classList.remove('player');
            }
            
            if (minimapCells[newCellIndex]) {
                minimapCells[newCellIndex].classList.add('player');
                minimapCells[newCellIndex].classList.add('visited');
            }
        }
    }

    const audioButton = document.createElement('button');
    audioButton.style.position = 'absolute';
    audioButton.style.bottom = '20px';
    audioButton.style.left = '95%';
    audioButton.style.transform = 'translateX(-50%)';
    audioButton.style.cursor = 'pointer';

    const audioButtonImage = document.querySelector('#audio-logo img');
    playBackgroundMusic();
    audioButtonImage.src = 'assets/img/disable-audio.png';

    audioButtonImage.style.width = '50px';
    audioButtonImage.style.height = '50px';

    audioButton.appendChild(audioButtonImage);
    audioButton.appendChild(document.createTextNode('Background Music'));

    function updateBgmLogo() {
        if (audioBgmPlay) {
            audioButtonImage.src = 'assets/img/audio.png';
        } 
        else {
            audioButtonImage.src = 'assets/img/disable-audio.png';
        }
    }

    audioButton.addEventListener('click', () => {
        playBackgroundMusic();
        updateBgmLogo();
    });

    document.body.appendChild(audioButton);

    function update() {
        if (isGameOver) {
            return;
        }
        const moveSpeed = 0.5;

        if (playerControls.moveForward) {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const newPosition = camera.position.clone().addScaledVector(direction, moveSpeed);
            const oldPosition = camera.position.clone();

            if (!checkCollision(newPosition)) {
                camera.position.copy(newPosition);
                checkCollisionPortal(newPosition);
                checkGrid(oldPosition, newPosition);
            } 
            else {
                playerControls.moveForward = false;
                moveBackToPreviousPosition();
            }
        }

        if (playerControls.moveBackward) {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const newPosition = camera.position.clone().addScaledVector(direction, -moveSpeed);
            const oldPosition = camera.position.clone();

            if (!checkCollision(newPosition)) {
                camera.position.copy(newPosition);
                checkCollisionPortal(newPosition);
                checkGrid(oldPosition, newPosition);
            } 
            else {
                playerControls.moveBackward = false;
                moveBackToPreviousPosition();
            }
        }

        if (playerControls.moveLeft) {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const perpendicular = new THREE.Vector3(direction.z, 0, -direction.x);
            const newPosition = camera.position.clone().addScaledVector(perpendicular, moveSpeed);
            const oldPosition = camera.position.clone();

            if (!checkCollision(newPosition)) {
                camera.position.copy(newPosition);
                checkCollisionPortal(newPosition);
                checkGrid(oldPosition, newPosition);
            } 
            else {
                playerControls.moveLeft = false;
                moveBackToPreviousPosition();
            }
        }

        if (playerControls.moveRight) {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
            const newPosition = camera.position.clone().addScaledVector(perpendicular, moveSpeed);
            const oldPosition = camera.position.clone();

            if (!checkCollision(newPosition)) {
                camera.position.copy(newPosition);
                checkCollisionPortal(newPosition);
                checkGrid(oldPosition, newPosition);
            } 
            else {
                playerControls.moveRight = false;
                moveBackToPreviousPosition();
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        update();
        renderer.render(scene, camera);
    }

    animate();

    function generateRandomMaze(width, height) {
        var maze = [];
        while(1) {
        maze = [];

        for (let row = 0; row < height; row++) {
            const mazeRow = [];
            for (let col = 0; col < width; col++) {
                mazeRow.push(1);
            }
            maze.push(mazeRow);
        }

        let startX = Math.floor(Math.random() * (width - 2)) + 1;
        let startY = Math.floor(Math.random() * (height - 2)) + 1;

        const stack = [];
        stack.push({ x: startX, y: startY });

        while (stack.length > 0) {
            const current = stack.pop();
            const { x, y } = current;

            maze[y][x] = 0;

            const neighbors = [];

            if (y - 2 >= 1) neighbors.push({ x: x, y: y - 2 }); // Top
            if (y + 2 < height - 1) neighbors.push({ x: x, y: y + 2 }); // Bottom
            if (x - 2 >= 1) neighbors.push({ x: x - 2, y: y }); // Left
            if (x + 2 < width - 1) neighbors.push({ x: x + 2, y: y }); // Right

            for (let i = neighbors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
            }

            for (const neighbor of neighbors) {
                const { x: nx, y: ny } = neighbor;

                if (maze[ny][nx] === 1) {
                    maze[y + (ny - y) / 2][x + (nx - x) / 2] = 0;

                    maze[ny][nx] = 0;

                    stack.push({ x: nx, y: ny });
                }
            }
        }

        maze[startY][startX] = 2;

        const minDistance = Math.floor(2 / 3 * Math.max(width, height));
        console.log("Min distance : ", minDistance);
        let targetX = -1, targetY = -1;
        let counter = 0;
        do {
            targetX = Math.floor(Math.random() * (width - 2)) + 1;
            targetY = Math.floor(Math.random() * (height - 2)) + 1;
            counter++;
            if (counter > 10) {
                break;
            }
        } 
        while ((Math.abs(targetX - startX) + Math.abs(targetY - startY) < minDistance) || maze[targetX][targetY] != 0);
            if ((targetX != -1) && (targetY != -1)) {
                maze[targetY][targetX] = 3;
                break;
            }
        }
        return maze;
    }

}