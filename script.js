/* global THREE */

// ======================================================
// MIND CRAFT - PART 1/3
// WORLD + BLOCKS + TERRAIN + PLAYER SETUP
// ======================================================

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = startGame;

document.head.appendChild(threeScript);


// ======================================================
// MAIN GAME
// ======================================================

function startGame() {

    const game = document.getElementById("game");

    if (!game) {
        console.error("Game container not found.");
        return;
    }


    // ==================================================
    // SCENE
    // ==================================================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    scene.fog = new THREE.Fog(
        0x87ceeb,
        25,
        130
    );


    // ==================================================
    // CAMERA
    // ==================================================

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        300
    );

    camera.position.set(
        0,
        3,
        8
    );

    camera.rotation.order = "YXZ";


    // ==================================================
    // RENDERER
    // ==================================================

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );

    renderer.shadowMap.enabled = true;

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "5";

    game.appendChild(
        renderer.domElement
    );


    // ==================================================
    // LIGHTING
    // ==================================================

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.75
        );

    scene.add(
        ambientLight
    );


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1
        );

    sun.position.set(
        40,
        60,
        20
    );

    sun.castShadow = true;

    scene.add(
        sun
    );


    // ==================================================
    // BLOCK MATERIALS
    // ==================================================

    const materials = {

        grass:
            new THREE.MeshLambertMaterial({
                color: 0x4caf50
            }),

        dirt:
            new THREE.MeshLambertMaterial({
                color: 0x8b5a2b
            }),

        stone:
            new THREE.MeshLambertMaterial({
                color: 0x777777
            }),

        wood:
            new THREE.MeshLambertMaterial({
                color: 0x8b4513
            }),

        leaves:
            new THREE.MeshLambertMaterial({
                color: 0x228b22,
                transparent: true,
                opacity: 0.92
            }),

        coal:
            new THREE.MeshLambertMaterial({
                color: 0x202020
            }),

        craftingTable:
            new THREE.MeshLambertMaterial({
                color: 0xa0522d
            })
    };


    // ==================================================
    // BLOCK GEOMETRY
    // ==================================================

    const blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    // ==================================================
    // WORLD DATA
    // ==================================================

    const worldGroup =
        new THREE.Group();

    scene.add(
        worldGroup
    );


    const blockMap =
        new Map();

    const blocks = [];

    const generatedChunks =
        new Set();

    const CHUNK_SIZE = 12;


    // ==================================================
    // INVENTORY
    // ==================================================

    const inventory = {

        grass: 10,

        dirt: 10,

        stone: 0,

        wood: 0,

        leaves: 0,

        coal: 0,

        planks: 0,

        sticks: 0,

        craftingTable: 0,

        woodenPickaxe: 0,

        stonePickaxe: 0
    };


    // ==================================================
    // SELECTED BLOCK
    // ==================================================

    let selectedBlock = "grass";


    // ==================================================
    // BLOCK KEY
    // ==================================================

    function blockKey(
        x,
        y,
        z
    ) {

        return (
            Math.round(x) +
            "," +
            Math.round(y) +
            "," +
            Math.round(z)
        );
    }


    // ==================================================
    // CREATE BLOCK
    // ==================================================

    function createBlock(
        type,
        x,
        y,
        z
    ) {

        const key =
            blockKey(
                x,
                y,
                z
            );

        if (
            blockMap.has(key)
        ) {
            return null;
        }

        if (
            !materials[type]
        ) {
            return null;
        }


        const block =
            new THREE.Mesh(
                blockGeometry,
                materials[type]
            );


        block.position.set(
            x,
            y,
            z
        );


        block.userData.block =
            type;

        block.userData.type =
            type;


        block.castShadow =
            true;

        block.receiveShadow =
            true;


        worldGroup.add(
            block
        );

        blocks.push(
            block
        );

        blockMap.set(
            key,
            block
        );


        return block;
    }


    // ==================================================
    // REMOVE BLOCK
    // ==================================================

    function removeBlock(
        block
    ) {

        if (!block) {
            return;
        }


        const x =
            Math.round(
                block.position.x
            );

        const y =
            Math.round(
                block.position.y
            );

        const z =
            Math.round(
                block.position.z
            );


        const key =
            blockKey(
                x,
                y,
                z
            );


        blockMap.delete(
            key
        );


        const index =
            blocks.indexOf(
                block
            );

        if (index !== -1) {
            blocks.splice(
                index,
                1
            );
        }


        worldGroup.remove(
            block
        );
    }


    // ==================================================
    // TERRAIN HEIGHT
    // ==================================================

    function terrainHeight(
        x,
        z
    ) {

        const noise =
            Math.sin(
                x * 0.13
            ) +
            Math.cos(
                z * 0.12
            ) +
            Math.sin(
                (x + z) * 0.05
            );


        if (
            noise > 1.5
        ) {
            return 2;
        }


        if (
            noise > 0.7
        ) {
            return 1;
        }


        if (
            noise < -1.5
        ) {
            return -1;
        }


        return 0;
    }


    // ==================================================
    // RANDOM VALUE
    // ==================================================

    function randomValue(
        x,
        z
    ) {

        const value =
            Math.sin(
                x * 12.9898 +
                z * 78.233
            ) *
            43758.5453;


        return (
            value -
            Math.floor(value)
        );
    }


    // ==================================================
    // TREE
    // ==================================================

    function createTree(
        x,
        z,
        ground
    ) {


        // TREE TRUNK

        for (
            let y = ground + 1;
            y <= ground + 4;
            y++
        ) {

            createBlock(
                "wood",
                x,
                y,
                z
            );
        }


        // LEAVES

        for (
            let dx = -2;
            dx <= 2;
            dx++
        ) {

            for (
                let dz = -2;
                dz <= 2;
                dz++
            ) {

                for (
                    let dy = ground + 4;
                    dy <= ground + 6;
                    dy++
                ) {

                    if (
                        Math.abs(dx) +
                        Math.abs(dz) <
                        4
                    ) {

                        createBlock(
                            "leaves",
                            x + dx,
                            dy,
                            z + dz
                        );
                    }
                }
            }
        }


        // TOP LEAVES

        createBlock(
            "leaves",
            x,
            ground + 7,
            z
        );
    }


    // ==================================================
    // GENERATE CHUNK
    // ==================================================

    function generateChunk(
        chunkX,
        chunkZ
    ) {

        const id =
            chunkX +
            "," +
            chunkZ;


        if (
            generatedChunks.has(id)
        ) {
            return;
        }


        generatedChunks.add(
            id
        );


        const startX =
            chunkX *
            CHUNK_SIZE;

        const startZ =
            chunkZ *
            CHUNK_SIZE;


        for (
            let x = startX;
            x < startX + CHUNK_SIZE;
            x++
        ) {

            for (
                let z = startZ;
                z < startZ + CHUNK_SIZE;
                z++
            ) {


                const ground =
                    terrainHeight(
                        x,
                        z
                    );


                // ==========================
                // GRASS
                // ==========================

                createBlock(
                    "grass",
                    x,
                    ground,
                    z
                );


                // ==========================
                // DIRT
                // ==========================

                for (
                    let y = ground - 1;
                    y >= ground - 3;
                    y--
                ) {

                    createBlock(
                        "dirt",
                        x,
                        y,
                        z
                    );
                }


                // ==========================
                // STONE
                // ==========================

                for (
                    let y = ground - 4;
                    y >= -8;
                    y--
                ) {

                    createBlock(
                        "stone",
                        x,
                        y,
                        z
                    );
                }


                // ==========================
                // COAL
                // ==========================

                for (
                    let y = ground - 4;
                    y >= -7;
                    y--
                ) {

                    const chance =
                        randomValue(
                            x * 17 + y,
                            z * 31
                        );


                    if (
                        chance > 0.93
                    ) {

                        const key =
                            blockKey(
                                x,
                                y,
                                z
                            );


                        const existing =
                            blockMap.get(
                                key
                            );


                        if (
                            existing
                        ) {

                            removeBlock(
                                existing
                            );
                        }


                        createBlock(
                            "coal",
                            x,
                            y,
                            z
                        );
                    }
                }


                // ==========================
                // TREES
                // ==========================

                const treeChance =
                    randomValue(
                        x * 5,
                        z * 7
                    );


                if (
                    treeChance > 0.975 &&
                    Math.abs(x) > 3 &&
                    Math.abs(z) > 3
                ) {

                    createTree(
                        x,
                        z,
                        ground
                    );
                }
            }
        }
    }


    // ==================================================
    // INITIAL WORLD
    // ==================================================

    for (
        let x = -2;
        x <= 2;
        x++
    ) {

        for (
            let z = -2;
            z <= 2;
            z++
        ) {

            generateChunk(
                x,
                z
            );
        }
    }


    // ==================================================
    // PLAYER
    // ==================================================

    const player = {

        velocityY: 0,

        speed: 0.09,

        sprintSpeed: 0.16,

        onGround: false,

        health: 100,

        hunger: 100
    };


    // ==================================================
    // CAMERA ROTATION
    // ==================================================

    let yaw = 0;

    let pitch = 0;


    // ==================================================
    // KEYBOARD
    // ==================================================

    const keys = {};


    document.addEventListener(
        "keydown",
        function(event) {

            keys[event.code] =
                true;


            // SPACE JUMP

            if (
                event.code === "Space" &&
                player.onGround
            ) {

                player.velocityY =
                    0.18;

                player.onGround =
                    false;
            }


            // HOTBAR 1-9

            if (
                event.code >= "Digit1" &&
                event.code <= "Digit9"
            ) {

                const number =
                    Number(
                        event.code.replace(
                            "Digit",
                            ""
                        )
                    );

                selectHotbar(
                    number - 1
                );
            }
        }
    );


    document.addEventListener(
        "keyup",
        function(event) {

            keys[event.code] =
                false;
        }
    );


    // ==================================================
    // GET GROUND HEIGHT
    // ==================================================

    function getGroundHeight(
        x,
        z
    ) {

        const gx =
            Math.round(x);

        const gz =
            Math.round(z);


        let highest = -20;


        for (
            let y = 20;
            y >= -20;
            y--
        ) {

            const key =
                blockKey(
                    gx,
                    y,
                    gz
                );


            const block =
                blockMap.get(
                    key
                );


            if (
                block &&
                block.userData.block !==
                "leaves"
            ) {

                highest = y;

                break;
            }
        }


        return highest;
    }


    // ==================================================
    // LOAD NEARBY CHUNKS
    // ==================================================

    function updateChunks() {

        const playerChunkX =
            Math.floor(
                camera.position.x /
                CHUNK_SIZE
            );

        const playerChunkZ =
            Math.floor(
                camera.position.z /
                CHUNK_SIZE
            );


        for (
            let dx = -1;
            dx <= 1;
            dx++
        ) {

            for (
                let dz = -1;
                dz <= 1;
                dz++
            ) {

                generateChunk(
                    playerChunkX + dx,
                    playerChunkZ + dz
                );
            }
        }
    }


    // ==================================================
    // PLAYER MOVEMENT
    // ==================================================

    function updatePlayer() {

        let forward = 0;

        let right = 0;


        if (
            keys["ArrowUp"] ||
            keys["KeyW"]
        ) {

            forward = 1;
        }


        if (
            keys["ArrowDown"] ||
            keys["KeyS"]
        ) {

            forward = -1;
        }


        if (
            keys["ArrowRight"] ||
            keys["KeyD"]
        ) {

            right = 1;
        }


        if (
            keys["ArrowLeft"] ||
            keys["KeyA"]
        ) {

            right = -1;
        }


        // Mobile joystick values
        // will be added in PART 3


        if (
            forward !== 0 ||
            right !== 0
        ) {

            const length =
                Math.sqrt(
                    forward * forward +
                    right * right
                );


            forward /=
                length;

            right /=
                length;


            const direction =
                new THREE.Vector3();


            camera.getWorldDirection(
                direction
            );


            direction.y = 0;

            direction.normalize();


            const rightVector =
                new THREE.Vector3();


            rightVector.crossVectors(
                direction,
                camera.up
            );


            rightVector.normalize();


            let speed =
                player.speed;


            if (
                keys["ShiftLeft"] ||
                keys["ShiftRight"]
            ) {

                speed =
                    player.sprintSpeed;
            }


            const movement =
                new THREE.Vector3();


            movement.addScaledVector(
                direction,
                forward * speed
            );


            movement.addScaledVector(
                rightVector,
                right * speed
            );


            camera.position.add(
                movement
            );
        }


        // ==============================
        // GRAVITY
        // ==============================

        player.velocityY -=
            0.01;


        camera.position.y +=
            player.velocityY;


        const groundHeight =
            getGroundHeight(
                camera.position.x,
                camera.position.z
            );


        const playerGround =
            groundHeight + 1.7;


        if (
            camera.position.y <=
            playerGround
        ) {

            camera.position.y =
                playerGround;

            player.velocityY =
                0;

            player.onGround =
                true;

        } else {

            player.onGround =
                false;
        }


        // ==============================
        // LOAD WORLD
        // ==============================

        updateChunks();
    }


    // ==================================================
    // PART 1 READY
    // ==================================================

    console.log(
        "Mind Craft Part 1 loaded."
    );

    // ==================================================
    // PART 2 CODE WILL CONTINUE HERE
    // ==================================================
// ======================================================
// MIND CRAFT - PART 2/3
// INVENTORY + HOTBAR + CRAFTING + MINING + PLACING
// ======================================================


// ======================================================
// INVENTORY UI
// ======================================================

function updateInventory() {

    const inventoryItems =
        document.getElementById("inventoryItems");

    if (!inventoryItems) {
        return;
    }

    inventoryItems.innerHTML = "";

    for (const item in inventory) {

        const amount =
            inventory[item];

        if (amount <= 0) {
            continue;
        }

        const itemBox =
            document.createElement("div");

        itemBox.className =
            "inventory-item";

        itemBox.innerHTML = `
            <span>${formatItemName(item)}</span>
            <b>${amount}</b>
        `;

        inventoryItems.appendChild(
            itemBox
        );
    }
}


// ======================================================
// ITEM NAME
// ======================================================

function formatItemName(item) {

    return item
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function(char) {
            return char.toUpperCase();
        });
}


// ======================================================
// HOTBAR
// ======================================================

const hotbarItems = [

    "grass",
    "dirt",
    "stone",
    "wood",
    "leaves",
    "coal",
    "planks",
    "sticks",
    "craftingTable"
];


let selectedHotbarIndex = 0;


function updateHotbarCounts() {

    const slots =
        document.querySelectorAll(
            "#hotbar .slot, #hotbar .hotbar-slot"
        );


    slots.forEach(
        function(slot, index) {

            const item =
                hotbarItems[index];

            if (!item) {
                return;
            }


            const amount =
                inventory[item] || 0;


            const count =
                slot.querySelector(
                    ".count"
                );


            if (count) {

                count.textContent =
                    amount > 0
                        ? amount
                        : "";
            }


            slot.classList.toggle(
                "selected",
                index === selectedHotbarIndex
            );
        }
    );
}


// ======================================================
// COMPATIBILITY FUNCTION
// ======================================================

function updateHotbar() {

    updateHotbarCounts();
}


// ======================================================
// SELECT HOTBAR
// ======================================================

function selectHotbar(index) {

    if (
        index < 0 ||
        index >= hotbarItems.length
    ) {
        return;
    }


    selectedHotbarIndex =
        index;


    selectedBlock =
        hotbarItems[index];


    updateHotbarCounts();


    showMessage(
        formatItemName(
            selectedBlock
        )
    );
}


// ======================================================
// INVENTORY OPEN / CLOSE
// ======================================================

function openInventory() {

    const inventoryPanel =
        document.getElementById(
            "inventory"
        );

    if (inventoryPanel) {

        inventoryPanel.style.display =
            "flex";
    }


    updateInventory();
}


function closeInventory() {

    const inventoryPanel =
        document.getElementById(
            "inventory"
        );

    if (inventoryPanel) {

        inventoryPanel.style.display =
            "none";
    }
}


// ======================================================
// INVENTORY KEY
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "KeyE"
        ) {

            const panel =
                document.getElementById(
                    "inventory"
                );


            if (
                panel &&
                panel.style.display === "flex"
            ) {

                closeInventory();

            } else {

                openInventory();
            }
        }
    }
);


// ======================================================
// CRAFTING
// ======================================================

const recipes = {

    planks: {

        name: "Wood Planks",

        input: {
            wood: 1
        },

        output: {
            planks: 4
        }
    },


    sticks: {

        name: "Sticks",

        input: {
            planks: 2
        },

        output: {
            sticks: 4
        }
    },


    craftingTable: {

        name: "Crafting Table",

        input: {
            planks: 4
        },

        output: {
            craftingTable: 1
        }
    },


    woodenPickaxe: {

        name: "Wooden Pickaxe",

        input: {
            planks: 3,
            sticks: 2
        },

        output: {
            woodenPickaxe: 1
        }
    },


    stonePickaxe: {

        name: "Stone Pickaxe",

        input: {
            stone: 3,
            sticks: 2
        },

        output: {
            stonePickaxe: 1
        }
    }
};


// ======================================================
// CHECK RECIPE
// ======================================================

function canCraft(recipe) {

    for (
        const item in recipe.input
    ) {

        const needed =
            recipe.input[item];

        const available =
            inventory[item] || 0;


        if (
            available < needed
        ) {

            return false;
        }
    }


    return true;
}


// ======================================================
// CRAFT
// ======================================================

function craftItem(recipeName) {

    const recipe =
        recipes[recipeName];


    if (!recipe) {
        return;
    }


    if (
        !canCraft(recipe)
    ) {

        showCraftMessage(
            "Not enough items!"
        );

        return;
    }


    // REMOVE INPUT

    for (
        const item in recipe.input
    ) {

        inventory[item] -=
            recipe.input[item];
    }


    // ADD OUTPUT

    for (
        const item in recipe.output
    ) {

        if (
            inventory[item] === undefined
        ) {

            inventory[item] = 0;
        }


        inventory[item] +=
            recipe.output[item];
    }


    updateInventory();

    updateHotbar();


    showCraftMessage(
        recipe.name +
        " crafted!"
    );
}


// ======================================================
// CRAFT BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".craft-btn"
            );


        if (!button) {
            return;
        }


        const recipeName =
            button.dataset.recipe ||
            button.dataset.item ||
            button.id;


        craftItem(
            recipeName
        );
    }
);


// ======================================================
// CRAFTING PANEL
// ======================================================

function openCrafting() {

    const crafting =
        document.getElementById(
            "crafting"
        );


    if (crafting) {

        crafting.style.display =
            "flex";
    }
}


function closeCrafting() {

    const crafting =
        document.getElementById(
            "crafting"
        );


    if (crafting) {

        crafting.style.display =
            "none";
    }
}


// ======================================================
// CRAFTING KEY
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "KeyC"
        ) {

            const crafting =
                document.getElementById(
                    "crafting"
                );


            if (
                crafting &&
                crafting.style.display === "flex"
            ) {

                closeCrafting();

            } else {

                openCrafting();
            }
        }
    }
);


// ======================================================
// CLOSE BUTTONS
// ======================================================

const closeInventoryButton =
    document.getElementById(
        "closeInventory"
    );


if (closeInventoryButton) {

    closeInventoryButton.addEventListener(
        "click",
        closeInventory
    );
}


const closeCraftingButton =
    document.getElementById(
        "closeCrafting"
    );


if (closeCraftingButton) {

    closeCraftingButton.addEventListener(
        "click",
        closeCrafting
    );
}


// ======================================================
// CRAFT MESSAGE
// ======================================================

function showCraftMessage(
    text
) {

    const message =
        document.getElementById(
            "craftMessage"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.style.display =
        "block";


    clearTimeout(
        showCraftMessage.timer
    );


    showCraftMessage.timer =
        setTimeout(
            function() {

                message.style.display =
                    "none";

            },
            1800
        );
}


// ======================================================
// RAYCASTER
// ======================================================

const raycaster =
    new THREE.Raycaster();


const rayDirection =
    new THREE.Vector2(
        0,
        0
    );


// ======================================================
// GET TARGET BLOCK
// ======================================================

function getTargetBlock() {

    raycaster.setFromCamera(
        rayDirection,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            blocks,
            false
        );


    if (
        hits.length === 0
    ) {

        return null;
    }


    return hits[0];
}


// ======================================================
// MINE BLOCK
// ======================================================

function mineBlock() {

    if (!gameStarted) {
        return;
    }


    const hit =
        getTargetBlock();


    if (!hit) {
        return;
    }


    const block =
        hit.object;


    const type =
        block.userData.block;


    if (!type) {
        return;
    }


    // Do not allow removing leaves
    // as the first block under player

    if (
        type === "grass" ||
        type === "dirt" ||
        type === "stone" ||
        type === "wood" ||
        type === "leaves" ||
        type === "coal" ||
        type === "craftingTable"
    ) {

        removeBlock(
            block
        );


        if (
            inventory[type] === undefined
        ) {

            inventory[type] = 0;
        }


        inventory[type]++;


        updateInventory();

        updateHotbar();


        showMessage(
            "+" +
            formatItemName(type)
        );
    }
}


// ======================================================
// PLACE BLOCK
// ======================================================

function placeBlock() {

    if (!gameStarted) {
        return;
    }


    const amount =
        inventory[selectedBlock] || 0;


    if (
        amount <= 0
    ) {

        showMessage(
            "No " +
            formatItemName(
                selectedBlock
            )
        );

        return;
    }


    const hit =
        getTargetBlock();


    if (!hit) {
        return;
    }


    const normal =
        hit.face.normal;


    const position =
        hit.object.position.clone();


    position.add(
        normal
    );


    // Prevent placing directly inside camera

    const distance =
        position.distanceTo(
            camera.position
        );


    if (
        distance < 1.5
    ) {

        return;
    }


    const x =
        Math.round(
            position.x
        );

    const y =
        Math.round(
            position.y
        );

    const z =
        Math.round(
            position.z
        );


    const key =
        blockKey(
            x,
            y,
            z
        );


    if (
        blockMap.has(key)
    ) {

        return;
    }


    createBlock(
        selectedBlock,
        x,
        y,
        z
    );


    inventory[selectedBlock]--;


    updateInventory();

    updateHotbar();
}


// ======================================================
// MOUSE MINE
// ======================================================

renderer.domElement.addEventListener(
    "mousedown",
    function(event) {

        if (!gameStarted) {
            return;
        }


        if (
            event.button === 0
        ) {

            mineBlock();
        }


        if (
            event.button === 2
        ) {

            placeBlock();
        }
    }
);


// ======================================================
// RIGHT CLICK BLOCK MENU
// ======================================================

renderer.domElement.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();
    }
);


// ======================================================
// MOUSE LOOK
// ======================================================

let mouseLocked = false;


renderer.domElement.addEventListener(
    "click",
    function() {

        if (
            !gameStarted
        ) {
            return;
        }


        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {

            renderer.domElement.requestPointerLock();
        }
    }
);


document.addEventListener(
    "pointerlockchange",
    function() {

        mouseLocked =
            document.pointerLockElement ===
            renderer.domElement;
    }
);


document.addEventListener(
    "mousemove",
    function(event) {

        if (
            !mouseLocked
        ) {
            return;
        }


        yaw -=
            event.movementX *
            0.002;


        pitch -=
            event.movementY *
            0.002;


        const limit =
            Math.PI / 2 - 0.05;


        pitch =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    pitch
                )
            );


        camera.rotation.y =
            yaw;


        camera.rotation.x =
            pitch;
    }
);


// ======================================================
// TOUCH LOOK VARIABLES
// ======================================================

let touchLookActive = false;

let lastTouchX = 0;

let lastTouchY = 0;


// ======================================================
// TOUCH LOOK
// ======================================================

renderer.domElement.addEventListener(
    "touchstart",
    function(event) {

        if (
            event.touches.length !== 1
        ) {
            return;
        }


        touchLookActive =
            true;


        lastTouchX =
            event.touches[0].clientX;


        lastTouchY =
            event.touches[0].clientY;
    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchmove",
    function(event) {

        if (
            !touchLookActive ||
            event.touches.length !== 1
        ) {
            return;
        }


        const touch =
            event.touches[0];


        const dx =
            touch.clientX -
            lastTouchX;


        const dy =
            touch.clientY -
            lastTouchY;


        lastTouchX =
            touch.clientX;


        lastTouchY =
            touch.clientY;


        yaw -=
            dx * 0.004;


        pitch -=
            dy * 0.004;


        const limit =
            Math.PI / 2 - 0.05;


        pitch =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    pitch
                )
            );


        camera.rotation.y =
            yaw;


        camera.rotation.x =
            pitch;
    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchend",
    function() {

        touchLookActive =
            false;
    }
);


// ======================================================
// PART 2 READY
// ======================================================

console.log(
    "Mind Craft Part 2 loaded."
);


// ======================================================
// PART 3 CODE WILL CONTINUE HERE
// ======================================================
// ======================================================
// MIND CRAFT - PART 3/3
// HOME + PLAYER NAME + KIT + CLOTHES + MOBILE
// SURVIVAL + ANIMATION + FINAL SETUP
// ======================================================


// ======================================================
// GAME STATE
// ======================================================

let gameStarted = false;

let joystickX = 0;
let joystickY = 0;

let mobileLookX = 0;
let mobileLookY = 0;


// ======================================================
// PLAYER NAME
// ======================================================

let playerName =
    localStorage.getItem(
        "mindCraftPlayerName"
    ) || "Player";


const playerNameInput =
    document.getElementById(
        "playerNameInput"
    );


const playerNameHud =
    document.getElementById(
        "playerNameHud"
    );


const homePlayerName =
    document.getElementById(
        "homePlayerName"
    );


const profileName =
    document.getElementById(
        "profileName"
    );


function updatePlayerName() {

    if (playerNameInput) {
        playerNameInput.value =
            playerName;
    }


    if (playerNameHud) {
        playerNameHud.textContent =
            playerName;
    }


    if (homePlayerName) {
        homePlayerName.textContent =
            playerName;
    }


    if (profileName) {
        profileName.value =
            playerName;
    }
}


updatePlayerName();


// ======================================================
// SAVE PLAYER NAME
// ======================================================

function savePlayerName() {

    if (!playerNameInput) {
        return;
    }


    const value =
        playerNameInput.value.trim();


    if (value.length > 0) {

        playerName =
            value.substring(
                0,
                16
            );


        localStorage.setItem(
            "mindCraftPlayerName",
            playerName
        );
    }


    updatePlayerName();
}


// ======================================================
// NAME ENTER
// ======================================================

if (playerNameInput) {

    playerNameInput.addEventListener(
        "change",
        savePlayerName
    );


    playerNameInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                savePlayerName();

                playerNameInput.blur();
            }
        }
    );
}


// ======================================================
// APPEARANCE
// ======================================================

const appearance = {

    head:
        localStorage.getItem(
            "mindCraftHead"
        ) || "normal",

    shirt:
        localStorage.getItem(
            "mindCraftShirt"
        ) || "blue",

    pants:
        localStorage.getItem(
            "mindCraftPants"
        ) || "black",

    shoes:
        localStorage.getItem(
            "mindCraftShoes"
        ) || "white"
};


function saveAppearance() {

    localStorage.setItem(
        "mindCraftHead",
        appearance.head
    );


    localStorage.setItem(
        "mindCraftShirt",
        appearance.shirt
    );


    localStorage.setItem(
        "mindCraftPants",
        appearance.pants
    );


    localStorage.setItem(
        "mindCraftShoes",
        appearance.shoes
    );
}


// ======================================================
// KIT DATA
// ======================================================

const kits = {

    starter: {

        name: "Starter Kit",

        items: {

            wood: 5,

            dirt: 10,

            grass: 10,

            stone: 5,

            planks: 4,

            sticks: 4
        }
    },


    builder: {

        name: "Builder Kit",

        items: {

            wood: 10,

            dirt: 20,

            stone: 20,

            planks: 12,

            sticks: 8,

            craftingTable: 1
        }
    },


    explorer: {

        name: "Explorer Kit",

        items: {

            wood: 8,

            stone: 15,

            coal: 10,

            planks: 8,

            sticks: 8,

            woodenPickaxe: 1
        }
    }
};


let selectedKit =
    localStorage.getItem(
        "mindCraftSelectedKit"
    ) || "starter";


// ======================================================
// EQUIP KIT
// ======================================================

function equipKit(
    kitName
) {

    if (
        !kits[kitName]
    ) {
        return;
    }


    selectedKit =
        kitName;


    localStorage.setItem(
        "mindCraftSelectedKit",
        selectedKit
    );


    const kit =
        kits[kitName];


    for (
        const item in kit.items
    ) {

        if (
            inventory[item] === undefined
        ) {

            inventory[item] = 0;
        }


        inventory[item] +=
            kit.items[item];
    }


    updateInventory();

    updateHotbar();


    showMessage(
        kit.name +
        " equipped!"
    );


    updateHomeSelection();
}


// ======================================================
// KIT BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const kitButton =
            event.target.closest(
                "[data-kit]"
            );


        if (!kitButton) {
            return;
        }


        const kitName =
            kitButton.dataset.kit;


        if (
            kits[kitName]
        ) {

            equipKit(
                kitName
            );
        }
    }
);


// ======================================================
// CLOTHES
// ======================================================

function selectClothes(
    category,
    value
) {

    if (
        !appearance.hasOwnProperty(
            category
        )
    ) {
        return;
    }


    appearance[category] =
        value;


    saveAppearance();

    updateClothesPreview();

    applyAppearanceToPlayer();
}


// ======================================================
// CLOTHES BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-clothes]"
            );


        if (!button) {
            return;
        }


        const category =
            button.dataset.clothes;


        const value =
            button.dataset.value;


        if (
            category &&
            value
        ) {

            selectClothes(
                category,
                value
            );
        }
    }
);


// ======================================================
// PLAYER AVATAR
// ======================================================

const avatar =
    new THREE.Group();


avatar.position.set(
    0,
    -100,
    0
);


scene.add(
    avatar
);


// ======================================================
// AVATAR MATERIALS
// ======================================================

const avatarMaterials = {

    skin:
        new THREE.MeshLambertMaterial({
            color: 0xd69b72
        }),

    blue:
        new THREE.MeshLambertMaterial({
            color: 0x2474d8
        }),

    red:
        new THREE.MeshLambertMaterial({
            color: 0xd83b3b
        }),

    green:
        new THREE.MeshLambertMaterial({
            color: 0x35a853
        }),

    black:
        new THREE.MeshLambertMaterial({
            color: 0x171717
        }),

    bluePants:
        new THREE.MeshLambertMaterial({
            color: 0x263f9c
        }),

    white:
        new THREE.MeshLambertMaterial({
            color: 0xffffff
        }),

    brown:
        new THREE.MeshLambertMaterial({
            color: 0x70452a
        })
};


// ======================================================
// AVATAR PARTS
// ======================================================

const avatarGeometry =
    new THREE.BoxGeometry(
        0.55,
        0.55,
        0.55
    );


const avatarBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.75,
            0.9,
            0.45
        ),
        avatarMaterials.blue
    );


avatarBody.position.y =
    1.35;


avatar.add(
    avatarBody
);


const avatarHead =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.65,
            0.65,
            0.65
        ),
        avatarMaterials.skin
    );


avatarHead.position.y =
    2.15;


avatar.add(
    avatarHead
);


const avatarLeftLeg =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.28,
            0.75,
            0.38
        ),
        avatarMaterials.black
    );


avatarLeftLeg.position.set(
    -0.2,
    0.52,
    0
);


avatar.add(
    avatarLeftLeg
);


const avatarRightLeg =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.28,
            0.75,
            0.38
        ),
        avatarMaterials.black
    );


avatarRightLeg.position.set(
    0.2,
    0.52,
    0
);


avatar.add(
    avatarRightLeg
);


const avatarLeftShoe =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.32,
            0.18,
            0.5
        ),
        avatarMaterials.white
    );


avatarLeftShoe.position.set(
    -0.2,
    0.1,
    -0.05
);


avatar.add(
    avatarLeftShoe
);


const avatarRightShoe =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.32,
            0.18,
            0.5
        ),
        avatarMaterials.white
    );


avatarRightShoe.position.set(
    0.2,
    0.1,
    -0.05
);


avatar.add(
    avatarRightShoe
);


// ======================================================
// HAT
// ======================================================

const avatarHat =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.76,
            0.18,
            0.76
        ),
        avatarMaterials.black
    );


avatarHat.position.y =
    2.52;


avatar.add(
    avatarHat
);


// ======================================================
// APPLY CLOTHES
// ======================================================

function applyAppearanceToPlayer() {

    if (
        !avatarBody ||
        !avatarLeftLeg ||
        !avatarRightLeg
    ) {
        return;
    }


    // SHIRT

    if (
        appearance.shirt === "red"
    ) {

        avatarBody.material =
            avatarMaterials.red;

    } else if (
        appearance.shirt === "green"
    ) {

        avatarBody.material =
            avatarMaterials.green;

    } else {

        avatarBody.material =
            avatarMaterials.blue;
    }


    // PANTS

    if (
        appearance.pants === "blue"
    ) {

        avatarLeftLeg.material =
            avatarMaterials.bluePants;

        avatarRightLeg.material =
            avatarMaterials.bluePants;

    } else {

        avatarLeftLeg.material =
            avatarMaterials.black;

        avatarRightLeg.material =
            avatarMaterials.black;
    }


    // SHOES

    if (
        appearance.shoes === "brown"
    ) {

        avatarLeftShoe.material =
            avatarMaterials.brown;

        avatarRightShoe.material =
            avatarMaterials.brown;

    } else {

        avatarLeftShoe.material =
            avatarMaterials.white;

        avatarRightShoe.material =
            avatarMaterials.white;
    }


    // HAT

    avatarHat.visible =
        appearance.head !== "normal";
}


// ======================================================
// CLOTHES PREVIEW
// ======================================================

function updateClothesPreview() {

    const buttons =
        document.querySelectorAll(
            "[data-clothes]"
        );


    buttons.forEach(
        function(button) {

            const category =
                button.dataset.clothes;

            const value =
                button.dataset.value;


            button.classList.toggle(
                "selected",
                appearance[category] ===
                value
            );
        }
    );
}


// ======================================================
// HOME SCREEN
// ======================================================

const homeScreen =
    document.getElementById(
        "homeScreen"
    );


const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


function closeHomePanels() {

    const panels =
        document.querySelectorAll(
            ".home-panel, .panel"
        );


    panels.forEach(
        function(panel) {

            panel.classList.remove(
                "active"
            );


            panel.style.display =
                "none";
        }
    );
}


// ======================================================
// OPEN HOME PANEL
// ======================================================

function openHomePanel(
    panelId
) {

    closeHomePanels();


    const panel =
        document.getElementById(
            panelId
        );


    if (!panel) {
        return;
    }


    panel.classList.add(
        "active"
    );


    panel.style.display =
        "flex";


    updateClothesPreview();

    updateHomeSelection();
}


// ======================================================
// HOME SELECTION
// ======================================================

function updateHomeSelection() {

    const kitButtons =
        document.querySelectorAll(
            "[data-kit]"
        );


    kitButtons.forEach(
        function(button) {

            button.classList.toggle(
                "selected",
                button.dataset.kit ===
                selectedKit
            );
        }
    );
}


// ======================================================
// HOME TOAST
// ======================================================

function showHomeToast(
    text
) {

    let toast =
        document.getElementById(
            "homeToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "homeToast";


        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "30px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "9999";

        toast.style.padding =
            "12px 22px";

        toast.style.borderRadius =
            "12px";

        toast.style.background =
            "rgba(0,0,0,0.8)";

        toast.style.color =
            "white";

        toast.style.fontWeight =
            "bold";


        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        text;


    toast.style.display =
        "block";


    clearTimeout(
        showHomeToast.timer
    );


    showHomeToast.timer =
        setTimeout(
            function() {

                toast.style.display =
                    "none";

            },
            1800
        );
}


// ======================================================
// START GAME FROM HOME
// ======================================================

function startFromHome() {

    savePlayerName();

    gameStarted =
        true;


    closeHomePanels();


    if (homeScreen) {

        homeScreen.classList.add(
            "hidden"
        );

        homeScreen.style.display =
            "none";
    }


    if (loadingScreen) {

        loadingScreen.style.display =
            "none";
    }


    if (game) {

        game.classList.remove(
            "hidden"
        );

        game.style.display =
            "block";
    }


    applyAppearanceToPlayer();

    updateInventory();

    updateHotbar();


    showMessage(
        "Welcome, " +
        playerName +
        "!"
    );
}


// ======================================================
// START GAME BUTTON
// ======================================================

const startGameButton =
    document.getElementById(
        "startGameBtn"
    );


if (startGameButton) {

    startGameButton.addEventListener(
        "click",
        startFromHome
    );
}


// ======================================================
// HOME MENU BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-panel]"
            );


        if (!button) {
            return;
        }


        const panel =
            button.dataset.panel;


        if (panel) {

            openHomePanel(
                panel
            );
        }
    }
);


// ======================================================
// CLOSE HOME PANEL
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.matches(
                ".close-panel, .panel-close"
            )
        ) {

            closeHomePanels();
        }
    }
);


// ======================================================
// MOBILE JOYSTICK
// ======================================================

const joystick =
    document.getElementById(
        "joystick"
    );


const joystickKnob =
    document.getElementById(
        "joystickKnob"
    );


if (
    joystick &&
    joystickKnob
) {

    let joystickActive =
        false;


    let joystickCenterX =
        0;

    let joystickCenterY =
        0;


    function moveJoystick(
        clientX,
        clientY
    ) {

        let dx =
            clientX -
            joystickCenterX;


        let dy =
            clientY -
            joystickCenterY;


        const maxDistance =
            45;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance > maxDistance
        ) {

            dx =
                dx /
                distance *
                maxDistance;

            dy =
                dy /
                distance *
                maxDistance;
        }


        joystickX =
            dx /
            maxDistance;


        joystickY =
            -dy /
            maxDistance;


        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;
    }


    joystick.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();


            const rect =
                joystick.getBoundingClientRect();


            joystickCenterX =
                rect.left +
                rect.width / 2;


            joystickCenterY =
                rect.top +
                rect.height / 2;


            joystickActive =
                true;


            const touch =
                event.touches[0];


            moveJoystick(
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: false
        }
    );


    joystick.addEventListener(
        "touchmove",
        function(event) {

            event.preventDefault();


            if (
                !joystickActive
            ) {
                return;
            }


            const touch =
                event.touches[0];


            moveJoystick(
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: false
        }
    );


    joystick.addEventListener(
        "touchend",
        function() {

            joystickActive =
                false;


            joystickX =
                0;

            joystickY =
                0;


            joystickKnob.style.transform =
                "translate(0, 0)";
        }
    );
}


// ======================================================
// MOBILE BUTTON HELPERS
// ======================================================

function bindButton(
    id,
    action
) {

    const button =
        document.getElementById(
            id
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            action();
        }
    );


    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            action();
        },
        {
            passive: false
        }
    );
}


// ======================================================
// MOBILE JUMP
// ======================================================

bindButton(
    "jumpBtn",
    function() {

        if (
            player.onGround
        ) {

            player.velocityY =
                0.18;

            player.onGround =
                false;
        }
    }
);


// ======================================================
// MOBILE MINE
// ======================================================

bindButton(
    "mineBtn",
    function() {

        mineBlock();
    }
);


// ======================================================
// MOBILE PLACE
// ======================================================

bindButton(
    "placeBtn",
    function() {

        placeBlock();
    }
);


// ======================================================
// MOBILE INVENTORY
// ======================================================

bindButton(
    "inventoryBtn",
    function() {

        openInventory();
    }
);


// ======================================================
// MOBILE CRAFTING
// ======================================================

bindButton(
    "craftBtn",
    function() {

        openCrafting();
    }
);


// ======================================================
// MOBILE LOOK AREA
// ======================================================

const lookArea =
    document.getElementById(
        "lookArea"
    );


if (lookArea) {

    lookArea.addEventListener(
        "touchmove",
        function(event) {

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            const touch =
                event.touches[0];


            if (
                !lookArea._lastX
            ) {

                lookArea._lastX =
                    touch.clientX;

                lookArea._lastY =
                    touch.clientY;

                return;
            }


            const dx =
                touch.clientX -
                lookArea._lastX;


            const dy =
                touch.clientY -
                lookArea._lastY;


            lookArea._lastX =
                touch.clientX;


            lookArea._lastY =
                touch.clientY;


            yaw -=
                dx * 0.004;


            pitch -=
                dy * 0.004;


            const limit =
                Math.PI / 2 -
                0.05;


            pitch =
                Math.max(
                    -limit,
                    Math.min(
                        limit,
                        pitch
                    )
                );


            camera.rotation.y =
                yaw;


            camera.rotation.x =
                pitch;

        },
        {
            passive: true
        }
    );


    lookArea.addEventListener(
        "touchend",
        function() {

            delete lookArea._lastX;
            delete lookArea._lastY;
        }
    );
}


// ======================================================
// SURVIVAL HUD
// ======================================================

function updateSurvivalHUD() {

    const health =
        document.getElementById(
            "health"
        );


    const hunger =
        document.getElementById(
            "hunger"
        );


    if (health) {

        health.textContent =
            Math.max(
                0,
                Math.floor(
                    player.health
                )
            );
    }


    if (hunger) {

        hunger.textContent =
            Math.max(
                0,
                Math.floor(
                    player.hunger
                )
            );
    }
}


// ======================================================
// SURVIVAL TIMER
// ======================================================

setInterval(
    function() {

        if (!gameStarted) {
            return;
        }


        player.hunger -=
            0.02;


        if (
            player.hunger < 0
        ) {

            player.hunger = 0;
        }


        if (
            player.hunger <= 0
        ) {

            player.health -=
                0.03;
        }


        if (
            player.health < 0
        ) {

            player.health = 0;
        }


        updateSurvivalHUD();

    },
    1000
);


// ======================================================
// MESSAGE
// ======================================================

let messageTimer;


function showMessage(
    text
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.style.display =
        "block";


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function() {

                message.style.display =
                    "none";

            },
            1600
        );
}


// ======================================================
// HOTBAR INITIALIZATION
// ======================================================

updateHotbar();

updateInventory();

updateSurvivalHUD();

applyAppearanceToPlayer();

updateClothesPreview();

updateHomeSelection();


// ======================================================
// RESIZE
// ======================================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


// ======================================================
// ANIMATION
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (gameStarted) {

        updatePlayer();

        updateSurvivalHUD();
    }


    renderer.render(
        scene,
        camera
    );
}


// ======================================================
// INITIAL SCREEN
// ======================================================

if (game) {

    game.style.display =
        "block";
}


// ======================================================
// LOADING SCREEN
// ======================================================

if (loadingScreen) {

    loadingScreen.style.display =
        "flex";
}


if (homeScreen) {

    homeScreen.style.display =
        "flex";

    homeScreen.classList.remove(
        "hidden"
    );
}


gameStarted =
    false;


// ======================================================
// PREVENT RIGHT CLICK
// ======================================================

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();
    }
);


// ======================================================
// PREVENT MOBILE PAGE SCROLL
// ======================================================

document.addEventListener(
    "touchmove",
    function(event) {

        if (
            gameStarted
        ) {

            event.preventDefault();
        }
    },
    {
        passive: false
    }
);


// ======================================================
// START ANIMATION
// ======================================================

animate();


console.log(
    "Mind Craft Part 3 loaded successfully."
);


// ======================================================
// FINAL STARTUP
// ======================================================

setTimeout(
    function() {

        if (loadingScreen) {

            loadingScreen.style.display =
                "none";
        }

        if (homeScreen) {

            homeScreen.style.display =
                "flex";
        }

    },
    1200
);


// ======================================================
// FINAL BRACE
// ======================================================

}
