/* global THREE */

// =====================================================
// MIND CRAFT - BLOCK WORLD SURVIVAL
// COMPLETE JAVASCRIPT
// PART 1 / 3
// =====================================================


// =====================================================
// LOAD THREE.JS
// =====================================================

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = startGame;

document.head.appendChild(threeScript);


// =====================================================
// MAIN GAME FUNCTION
// =====================================================

function startGame() {

    // -------------------------------------------------
    // BASIC DOM
    // -------------------------------------------------

    const game = document.getElementById("game");

    if (!game) {
        console.error("Game container not found.");
        return;
    }


    // =================================================
    // GAME STATE
    // =================================================

    let gameStarted = false;


    // =================================================
    // SCENE
    // =================================================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    scene.fog = new THREE.Fog(
        0x87ceeb,
        25,
        140
    );


    // =================================================
    // CAMERA
    // =================================================

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        300
    );

    camera.position.set(
        0,
        4,
        8
    );


    // =================================================
    // RENDERER
    // =================================================

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

    game.appendChild(renderer.domElement);


    // =================================================
    // LIGHTING
    // =================================================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        0.75
    );

    scene.add(ambientLight);


    const sun = new THREE.DirectionalLight(
        0xffffff,
        1
    );

    sun.position.set(
        40,
        60,
        20
    );

    sun.castShadow = true;

    scene.add(sun);


    // =================================================
    // WORLD GROUP
    // =================================================

    const worldGroup = new THREE.Group();

    scene.add(worldGroup);


    // =================================================
    // BLOCK MATERIALS
    // =================================================

    const materials = {

        grass: new THREE.MeshLambertMaterial({
            color: 0x4caf50
        }),

        dirt: new THREE.MeshLambertMaterial({
            color: 0x8b5a2b
        }),

        stone: new THREE.MeshLambertMaterial({
            color: 0x777777
        }),

        wood: new THREE.MeshLambertMaterial({
            color: 0x8b4513
        }),

        leaves: new THREE.MeshLambertMaterial({
            color: 0x228b22
        }),

        coal: new THREE.MeshLambertMaterial({
            color: 0x202020
        }),

        craftingTable: new THREE.MeshLambertMaterial({
            color: 0xa0522d
        })
    };


    // =================================================
    // BLOCK GEOMETRY
    // =================================================

    const blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    // =================================================
    // WORLD DATA
    // =================================================

    const blocks = [];

    const blockMap = new Map();

    const generatedChunks = new Set();

    const CHUNK_SIZE = 12;


    // =================================================
    // INVENTORY
    // =================================================

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


    // =================================================
    // SELECTED BLOCK
    // =================================================

    let selectedBlock = "grass";


    // =================================================
    // BLOCK KEY
    // =================================================

    function blockKey(x, y, z) {

        return (
            Math.round(x) +
            "," +
            Math.round(y) +
            "," +
            Math.round(z)
        );
    }


    // =================================================
    // CREATE BLOCK
    // =================================================

    function createBlock(
        x,
        y,
        z,
        type
    ) {

        const key = blockKey(
            x,
            y,
            z
        );


        // Don't create duplicate block
        if (blockMap.has(key)) {
            return null;
        }


        // Check material
        if (!materials[type]) {
            console.warn(
                "Unknown block type:",
                type
            );

            return null;
        }


        const block = new THREE.Mesh(
            blockGeometry,
            materials[type]
        );


        block.position.set(
            x,
            y,
            z
        );


        // IMPORTANT:
        // Keep the same property everywhere
        block.userData.block = type;


        block.castShadow = true;
        block.receiveShadow = true;


        worldGroup.add(block);

        blocks.push(block);

        blockMap.set(
            key,
            block
        );


        return block;
    }


    // =================================================
    // REMOVE BLOCK
    // =================================================

    function removeBlock(block) {

        if (!block) {
            return;
        }


        const position =
            block.position;


        const key = blockKey(
            position.x,
            position.y,
            position.z
        );


        worldGroup.remove(block);

        blockMap.delete(key);


        const index =
            blocks.indexOf(block);


        if (index !== -1) {
            blocks.splice(
                index,
                1
            );
        }
    }


    // =================================================
    // TERRAIN HEIGHT
    // =================================================

    function terrainHeight(
        x,
        z
    ) {

        const n =
            Math.sin(
                x * 0.13
            ) +

            Math.cos(
                z * 0.12
            ) +

            Math.sin(
                (x + z) * 0.05
            );


        if (n > 1.5) {
            return 2;
        }


        if (n > 0.7) {
            return 1;
        }


        if (n < -1.5) {
            return -1;
        }


        return 0;
    }


    // =================================================
    // RANDOM VALUE
    // =================================================

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


    // =================================================
    // TREE
    // =================================================

    function createTree(
        x,
        z,
        ground
    ) {

        // Tree trunk
        for (
            let y = ground + 1;
            y <= ground + 4;
            y++
        ) {

            createBlock(
                x,
                y,
                z,
                "wood"
            );
        }


        // Leaves
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
                        Math.abs(dz) < 4
                    ) {

                        createBlock(
                            x + dx,
                            dy,
                            z + dz,
                            "leaves"
                        );
                    }
                }
            }
        }
    }


    // =================================================
    // GENERATE CHUNK
    // =================================================

    function generateChunk(
        chunkX,
        chunkZ
    ) {

        const id =
            chunkX +
            "," +
            chunkZ;


        // Already generated
        if (
            generatedChunks.has(id)
        ) {
            return;
        }


        generatedChunks.add(id);


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


                // -------------------------------------
                // GRASS
                // -------------------------------------

                createBlock(
                    x,
                    ground,
                    z,
                    "grass"
                );


                // -------------------------------------
                // DIRT
                // -------------------------------------

                for (
                    let y = ground - 1;
                    y >= ground - 3;
                    y--
                ) {

                    createBlock(
                        x,
                        y,
                        z,
                        "dirt"
                    );
                }


                // -------------------------------------
                // STONE
                // -------------------------------------

                for (
                    let y = ground - 4;
                    y >= -8;
                    y--
                ) {

                    createBlock(
                        x,
                        y,
                        z,
                        "stone"
                    );
                }


                // -------------------------------------
                // COAL
                // -------------------------------------

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


                    if (chance > 0.93) {

                        const key =
                            blockKey(
                                x,
                                y,
                                z
                            );


                        const existing =
                            blockMap.get(key);


                        if (existing) {
                            removeBlock(existing);
                        }


                        createBlock(
                            x,
                            y,
                            z,
                            "coal"
                        );
                    }
                }


                // -------------------------------------
                // TREES
                // -------------------------------------

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


    // =================================================
    // INITIAL WORLD
    // =================================================

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


    // =================================================
    // GET GROUND HEIGHT
    // =================================================

    function getGroundHeight(
        x,
        z
    ) {

        const bx =
            Math.round(x);

        const bz =
            Math.round(z);


        let highest =
            -20;


        for (
            let y = -10;
            y <= 10;
            y++
        ) {

            const key =
                blockKey(
                    bx,
                    y,
                    bz
                );


            if (
                blockMap.has(key)
            ) {

                highest =
                    Math.max(
                        highest,
                        y
                    );
            }
        }


        return highest;
    }


    // =================================================
    // PLAYER
    // =================================================

    const player = {

        speed: 0.10,

        sprintSpeed: 0.17,

        velocityY: 0,

        onGround: false,

        health: 100,

        hunger: 100
    };


    // =================================================
    // KEYBOARD
    // =================================================

    const keys = {};


    document.addEventListener(
        "keydown",
        function(event) {

            keys[event.code] = true;


            // Prevent browser scrolling
            if (
                [
                    "ArrowUp",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowRight",
                    "Space"
                ].includes(event.code)
            ) {

                event.preventDefault();
            }


            // -----------------------------------------
            // JUMP
            // -----------------------------------------

            if (
                event.code === "Space" &&
                player.onGround &&
                !isPanelOpen()
            ) {

                player.velocityY =
                    0.18;

                player.onGround =
                    false;
            }


            // -----------------------------------------
            // INVENTORY
            // -----------------------------------------

            if (
                event.code === "KeyE"
            ) {

                toggleInventory();
            }


            // -----------------------------------------
            // CRAFTING
            // -----------------------------------------

            if (
                event.code === "KeyC"
            ) {

                toggleCrafting();
            }


            // -----------------------------------------
            // HOTBAR 1-9
            // -----------------------------------------

            const number =
                parseInt(
                    event.key
                );


            if (
                number >= 1 &&
                number <= 9
            ) {

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


    // =================================================
    // CAMERA ROTATION
    // =================================================

    let yaw = 0;

    let pitch = 0;


    // =================================================
    // JOYSTICK
    // =================================================

    let joystickX = 0;

    let joystickY = 0;


    // =================================================
    // PART 1 COMPLETE
    // =================================================

    console.log(
        "Mind Craft Part 1 loaded."
    );


    // =================================================
    // PART 2 WILL CONTINUE HERE
    // =================================================

    // IMPORTANT:
    // Part 2 ko isi line ke neeche paste karna hai.
// =====================================================
// MIND CRAFT - PART 2 / 3
// MOVEMENT + INVENTORY + CRAFTING + MINING + PLACING
// =====================================================


// =====================================================
// PLAYER MOVEMENT
// =====================================================

function updatePlayer() {

    let forward = 0;
    let right = 0;


    // -----------------------------------------------
    // ARROW KEY MOVEMENT
    // -----------------------------------------------

    if (keys["ArrowUp"]) {
        forward = 1;
    }

    if (keys["ArrowDown"]) {
        forward = -1;
    }

    if (keys["ArrowLeft"]) {
        right = -1;
    }

    if (keys["ArrowRight"]) {
        right = 1;
    }


    // -----------------------------------------------
    // MOBILE JOYSTICK
    // -----------------------------------------------

    if (Math.abs(joystickY) > 0.05) {
        forward = -joystickY;
    }

    if (Math.abs(joystickX) > 0.05) {
        right = joystickX;
    }


    // -----------------------------------------------
    // MOVEMENT
    // -----------------------------------------------

    if (
        forward !== 0 ||
        right !== 0
    ) {

        const length =
            Math.sqrt(
                forward * forward +
                right * right
            );


        forward /= length;
        right /= length;


        // Camera forward direction
        const direction =
            new THREE.Vector3();


        camera.getWorldDirection(
            direction
        );


        direction.y = 0;

        direction.normalize();


        // Camera right direction
        const rightVector =
            new THREE.Vector3();


        rightVector.crossVectors(
            direction,
            camera.up
        );


        rightVector.normalize();


        // Sprint
        let speed =
            player.speed;


        if (
            keys["ShiftLeft"] ||
            keys["ShiftRight"]
        ) {

            speed =
                player.sprintSpeed;
        }


        // Final movement
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


    // -----------------------------------------------
    // GRAVITY
    // -----------------------------------------------

    player.velocityY -= 0.01;


    camera.position.y +=
        player.velocityY;


    // -----------------------------------------------
    // GROUND
    // -----------------------------------------------

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


    // -----------------------------------------------
    // INFINITE WORLD
    // -----------------------------------------------

    const chunkX =
        Math.floor(
            camera.position.x /
            CHUNK_SIZE
        );


    const chunkZ =
        Math.floor(
            camera.position.z /
            CHUNK_SIZE
        );


    // Generate nearby chunks
    for (
        let x = -1;
        x <= 1;
        x++
    ) {

        for (
            let z = -1;
            z <= 1;
            z++
        ) {

            generateChunk(
                chunkX + x,
                chunkZ + z
            );
        }
    }
}


// =====================================================
// INVENTORY
// =====================================================

function openInventory() {

    const panel =
        document.getElementById(
            "inventory"
        );


    if (!panel) {
        return;
    }


    updateInventory();


    panel.style.display =
        "block";
}


function closeInventory() {

    const panel =
        document.getElementById(
            "inventory"
        );


    if (panel) {

        panel.style.display =
            "none";
    }
}


function toggleInventory() {

    const panel =
        document.getElementById(
            "inventory"
        );


    if (!panel) {
        return;
    }


    if (
        panel.style.display ===
        "block"
    ) {

        closeInventory();

    } else {

        closeCrafting();

        openInventory();
    }
}


// =====================================================
// INVENTORY CLOSE BUTTON
// =====================================================

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


// =====================================================
// UPDATE INVENTORY
// =====================================================

function updateInventory() {

    const container =
        document.getElementById(
            "inventoryItems"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    Object.keys(
        inventory
    ).forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "inventory-item";


            div.textContent =
                item +
                " × " +
                inventory[item];


            container.appendChild(
                div
            );
        }
    );


    updateHotbarCounts();
}


// =====================================================
// HOTBAR
// =====================================================

function updateHotbarCounts() {

    document
        .querySelectorAll(
            ".slot"
        )
        .forEach(
            function(slot) {

                const block =
                    slot.dataset.block;


                const count =
                    slot.querySelector(
                        ".count"
                    );


                if (
                    count &&
                    inventory[block] !==
                    undefined
                ) {

                    count.textContent =
                        inventory[block];
                }
            }
        );
}


// =====================================================
// HOTBAR SELECT
// =====================================================

function selectHotbar(index) {

    const slots =
        document.querySelectorAll(
            ".slot"
        );


    if (
        index < 0 ||
        index >= slots.length
    ) {
        return;
    }


    slots.forEach(
        function(slot) {

            slot.classList.remove(
                "selected"
            );
        }
    );


    const selected =
        slots[index];


    selected.classList.add(
        "selected"
    );


    if (
        selected.dataset.block
    ) {

        selectedBlock =
            selected.dataset.block;
    }


    showMessage(
        "Selected: " +
        selectedBlock
    );
}


// =====================================================
// HOTBAR CLICK
// =====================================================

document
    .querySelectorAll(
        ".slot"
    )
    .forEach(
        function(slot, index) {

            slot.addEventListener(
                "click",
                function() {

                    selectHotbar(
                        index
                    );
                }
            );
        }
    );


// =====================================================
// CRAFTING PANEL
// =====================================================

function openCrafting() {

    const panel =
        document.getElementById(
            "crafting"
        );


    if (!panel) {
        return;
    }


    closeInventory();


    panel.style.display =
        "block";


    updateInventory();
}


function closeCrafting() {

    const panel =
        document.getElementById(
            "crafting"
        );


    if (panel) {

        panel.style.display =
            "none";
    }
}


function toggleCrafting() {

    const panel =
        document.getElementById(
            "crafting"
        );


    if (!panel) {
        return;
    }


    if (
        panel.style.display ===
        "block"
    ) {

        closeCrafting();

    } else {

        openCrafting();
    }
}


// =====================================================
// CRAFTING CLOSE BUTTON
// =====================================================

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


// =====================================================
// CRAFT BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".craft-btn"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    craft(
                        button.dataset.recipe
                    );
                }
            );
        }
    );


// =====================================================
// CRAFTING SYSTEM
// =====================================================

function craft(recipe) {

    const msg =
        document.getElementById(
            "craftMessage"
        );


    if (!msg) {
        return;
    }


    // -----------------------------------------------
    // WOOD → PLANKS
    // -----------------------------------------------

    if (
        recipe === "planks"
    ) {

        if (
            inventory.wood >= 1
        ) {

            inventory.wood--;

            inventory.planks += 4;


            msg.textContent =
                "✅ 4 Planks crafted";

        } else {

            msg.textContent =
                "❌ Need 1 Wood";
        }
    }


    // -----------------------------------------------
    // PLANKS → STICKS
    // -----------------------------------------------

    else if (
        recipe === "sticks"
    ) {

        if (
            inventory.planks >= 2
        ) {

            inventory.planks -= 2;

            inventory.sticks += 4;


            msg.textContent =
                "✅ 4 Sticks crafted";

        } else {

            msg.textContent =
                "❌ Need 2 Planks";
        }
    }


    // -----------------------------------------------
    // CRAFTING TABLE
    // -----------------------------------------------

    else if (
        recipe === "craftingTable"
    ) {

        if (
            inventory.planks >= 4
        ) {

            inventory.planks -= 4;

            inventory.craftingTable++;


            msg.textContent =
                "✅ Crafting Table crafted";

        } else {

            msg.textContent =
                "❌ Need 4 Planks";
        }
    }


    // -----------------------------------------------
    // WOODEN PICKAXE
    // -----------------------------------------------

    else if (
        recipe === "woodPickaxe"
    ) {

        if (
            inventory.planks >= 3 &&
            inventory.sticks >= 2
        ) {

            inventory.planks -= 3;

            inventory.sticks -= 2;

            inventory.woodenPickaxe++;


            msg.textContent =
                "✅ Wooden Pickaxe crafted";

        } else {

            msg.textContent =
                "❌ Need 3 Planks + 2 Sticks";
        }
    }


    // -----------------------------------------------
    // STONE PICKAXE
    // -----------------------------------------------

    else if (
        recipe === "stonePickaxe"
    ) {

        if (
            inventory.stone >= 3 &&
            inventory.sticks >= 2
        ) {

            inventory.stone -= 3;

            inventory.sticks -= 2;

            inventory.stonePickaxe++;


            msg.textContent =
                "✅ Stone Pickaxe crafted";

        } else {

            msg.textContent =
                "❌ Need 3 Stone + 2 Sticks";
        }
    }


    updateInventory();
}


// =====================================================
// PANEL CHECK
// =====================================================

function isPanelOpen() {

    const inventoryPanel =
        document.getElementById(
            "inventory"
        );


    const craftingPanel =
        document.getElementById(
            "crafting"
        );


    return (

        (
            inventoryPanel &&
            inventoryPanel.style.display ===
            "block"
        )

        ||

        (
            craftingPanel &&
            craftingPanel.style.display ===
            "block"
        )
    );
}


// =====================================================
// CLOSE ALL PANELS
// =====================================================

function closePanels() {

    closeInventory();

    closeCrafting();
}


// =====================================================
// RAYCASTER
// =====================================================

const raycaster =
    new THREE.Raycaster();


const center =
    new THREE.Vector2(
        0,
        0
    );


// =====================================================
// GET TARGET BLOCK
// =====================================================

function getTargetBlock() {

    raycaster.setFromCamera(
        center,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            worldGroup.children,
            false
        );


    if (
        hits.length === 0
    ) {

        return null;
    }


    return hits[0];
}


// =====================================================
// MINE BLOCK
// =====================================================

function mineBlock() {

    if (
        isPanelOpen()
    ) {
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


    // -----------------------------------------------
    // ADD TO INVENTORY
    // -----------------------------------------------

    if (
        inventory[type] !==
        undefined
    ) {

        inventory[type]++;
    }


    // Grass gives dirt too
    if (
        type === "grass"
    ) {

        inventory.dirt++;
    }


    // -----------------------------------------------
    // REMOVE BLOCK
    // -----------------------------------------------

    removeBlock(
        block
    );


    updateInventory();


    showMessage(
        "Collected " +
        type
    );
}


// =====================================================
// PLACE BLOCK
// =====================================================

function placeBlock() {

    if (
        isPanelOpen()
    ) {
        return;
    }


    if (
        !inventory[selectedBlock] ||
        inventory[selectedBlock] <= 0
    ) {

        showMessage(
            "No " +
            selectedBlock +
            " available"
        );

        return;
    }


    const hit =
        getTargetBlock();


    if (!hit) {
        return;
    }


    const normal =
        hit.face.normal
            .clone()
            .transformDirection(
                hit.object.matrixWorld
            );


    const position =
        hit.object.position
            .clone();


    position.add(
        normal
    );


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


    // Don't place inside player
    const distance =
        camera.position.distanceTo(
            new THREE.Vector3(
                x,
                y,
                z
            )
        );


    if (
        distance < 1.5
    ) {

        showMessage(
            "❌ Too close"
        );

        return;
    }


    const created =
        createBlock(
            x,
            y,
            z,
            selectedBlock
        );


    // Only remove inventory if block
    // was actually created
    if (created) {

        inventory[selectedBlock]--;

        updateInventory();

        showMessage(
            "Placed " +
            selectedBlock
        );
    }
}


// =====================================================
// MOUSE LOOK
// =====================================================

renderer.domElement.addEventListener(
    "click",
    function() {

        if (
            !isPanelOpen()
        ) {

            if (
                renderer.domElement
                    .requestPointerLock
            ) {

                renderer.domElement
                    .requestPointerLock();
            }
        }
    }
);


document.addEventListener(
    "mousemove",
    function(event) {

        if (
            document.pointerLockElement !==
            renderer.domElement
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


        camera.rotation.order =
            "YXZ";


        camera.rotation.y =
            yaw;


        camera.rotation.x =
            pitch;
    }
);


// =====================================================
// RIGHT CLICK = PLACE
// =====================================================

renderer.domElement.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

        placeBlock();
    }
);


// =====================================================
// LEFT CLICK = MINE
// =====================================================

renderer.domElement.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.button === 0 &&
            !isPanelOpen()
        ) {

            mineBlock();
        }
    }
);


// =====================================================
// INITIAL INVENTORY UPDATE
// =====================================================

updateInventory();


// =====================================================
// PART 2 COMPLETE
// =====================================================

console.log(
    "Mind Craft Part 2 loaded."
);


// =====================================================
// PART 3 WILL CONTINUE BELOW
// =====================================================

// Part 3 mein:
// Mobile controls
// Home screen
// Player name
// Kit
// Clothes
// Loading screen
// Health / Hunger
// Animation
// Resize
// Final startup
// add hoga.
// ===============================
// PART 3 - MOBILE + PLAYER + HOME
// ===============================

// ---------- MOBILE JOYSTICK ----------
const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystickKnob");

if (joystick && joystickKnob) {
    let joystickActive = false;

    function updateJoystick(clientX, clientY) {
        const rect = joystick.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const maxDistance = rect.width * 0.32;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDistance) {
            dx = (dx / distance) * maxDistance;
            dy = (dy / distance) * maxDistance;
        }

        joystickX = dx / maxDistance;
        joystickY = dy / maxDistance;

        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;
    }

    function resetJoystick() {
        joystickX = 0;
        joystickY = 0;

        joystickKnob.style.transform =
            "translate(0px, 0px)";

        joystickActive = false;
    }

    joystick.addEventListener("touchstart", function (e) {
        e.preventDefault();
        joystickActive = true;

        const touch = e.touches[0];
        updateJoystick(touch.clientX, touch.clientY);
    }, { passive: false });

    joystick.addEventListener("touchmove", function (e) {
        e.preventDefault();

        if (!joystickActive) return;

        const touch = e.touches[0];
        updateJoystick(touch.clientX, touch.clientY);
    }, { passive: false });

    joystick.addEventListener("touchend", function (e) {
        e.preventDefault();
        resetJoystick();
    }, { passive: false });
}


// ---------- MOBILE LOOK ----------
const lookArea = document.getElementById("lookArea");

if (lookArea) {
    let lookTouch = null;
    let lastLookX = 0;
    let lastLookY = 0;

    lookArea.addEventListener("touchstart", function (e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];

        lookTouch = touch.identifier;
        lastLookX = touch.clientX;
        lastLookY = touch.clientY;
    }, { passive: false });

    lookArea.addEventListener("touchmove", function (e) {
        e.preventDefault();

        for (const touch of e.touches) {
            if (touch.identifier !== lookTouch) continue;

            const dx = touch.clientX - lastLookX;
            const dy = touch.clientY - lastLookY;

            yaw -= dx * 0.006;
            pitch -= dy * 0.006;

            const maxPitch = Math.PI / 2 - 0.1;

            pitch = Math.max(
                -maxPitch,
                Math.min(maxPitch, pitch)
            );

            lastLookX = touch.clientX;
            lastLookY = touch.clientY;
        }
    }, { passive: false });

    lookArea.addEventListener("touchend", function () {
        lookTouch = null;
    });
}


// ---------- MOBILE BUTTONS ----------
const jumpBtn = document.getElementById("jumpBtn");
const mineBtn = document.getElementById("mineBtn");
const placeBtn = document.getElementById("placeBtn");
const inventoryBtn = document.getElementById("inventoryBtn");
const craftBtn = document.getElementById("craftBtn");

if (jumpBtn) {
    jumpBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();

        if (player.onGround) {
            player.velocityY = 0.23;
            player.onGround = false;
        }
    }, { passive: false });
}

if (mineBtn) {
    mineBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        mineBlock();
    }, { passive: false });
}

if (placeBtn) {
    placeBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        placeBlock();
    }, { passive: false });
}

if (inventoryBtn) {
    inventoryBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        toggleInventory();
    }, { passive: false });
}

if (craftBtn) {
    craftBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        toggleCrafting();
    }, { passive: false });
}


// ---------- SURVIVAL SYSTEM ----------
let survivalTimer = 0;

function updateSurvival(delta) {
    if (!gameStarted) return;

    survivalTimer += delta;

    if (survivalTimer >= 8) {
        survivalTimer = 0;

        if (player.hunger > 0) {
            player.hunger -= 1;
        } else {
            player.health -= 1;
        }

        player.hunger = Math.max(0, player.hunger);
        player.health = Math.max(0, player.health);

        updateSurvivalHud();

        if (player.health <= 0) {
            player.health = 100;
            player.hunger = 100;

            camera.position.set(0, 3, 5);

            showMessage("You respawned!");
        }
    }
}

function updateSurvivalHud() {
    const healthEl = document.getElementById("health");
    const hungerEl = document.getElementById("hunger");

    if (healthEl) {
        healthEl.textContent =
            "❤️ " + Math.max(0, Math.floor(player.health));
    }

    if (hungerEl) {
        hungerEl.textContent =
            "🍗 " + Math.max(0, Math.floor(player.hunger));
    }
}


// ---------- MESSAGE ----------
let messageTimer = null;

function showMessage(text) {
    const message = document.getElementById("message");

    if (!message) return;

    message.textContent = text;
    message.classList.add("show");

    clearTimeout(messageTimer);

    messageTimer = setTimeout(function () {
        message.classList.remove("show");
    }, 2200);
}


// ---------- HOME PAGE ----------
const homeScreen = document.getElementById("homeScreen");
const loadingScreen = document.getElementById("loadingScreen");

const playerNameInput =
    document.getElementById("playerNameInput");

const playerNameHud =
    document.getElementById("playerNameHud");

const homePlayerName =
    document.getElementById("homePlayerName");

const profileName =
    document.getElementById("profileName");

const startGameBtn =
    document.getElementById("startGameBtn");


// ---------- PLAYER NAME ----------
let savedPlayerName =
    localStorage.getItem("mindCraftPlayerName") || "Player";

if (playerNameInput) {
    playerNameInput.value = savedPlayerName;
}

if (homePlayerName) {
    homePlayerName.textContent = savedPlayerName;
}

if (profileName) {
    profileName.textContent = savedPlayerName;
}

if (playerNameHud) {
    playerNameHud.textContent = savedPlayerName;
}

function savePlayerName() {
    if (!playerNameInput) return;

    let name = playerNameInput.value.trim();

    if (!name) {
        name = "Player";
    }

    name = name.substring(0, 16);

    localStorage.setItem(
        "mindCraftPlayerName",
        name
    );

    savedPlayerName = name;

    if (homePlayerName) {
        homePlayerName.textContent = name;
    }

    if (profileName) {
        profileName.textContent = name;
    }

    if (playerNameHud) {
        playerNameHud.textContent = name;
    }
}

if (playerNameInput) {
    playerNameInput.addEventListener("input", savePlayerName);

    playerNameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            savePlayerName();
        }
    });
}


// ---------- APPEARANCE ----------
let appearance = {
    head: "none",
    shirt: "blue",
    pants: "dark",
    shoes: "white"
};

try {
    const savedAppearance =
        JSON.parse(
            localStorage.getItem("mindCraftAppearance")
        );

    if (savedAppearance) {
        appearance = {
            ...appearance,
            ...savedAppearance
        };
    }
} catch (error) {
    console.log("Appearance data not found.");
}

function saveAppearance() {
    localStorage.setItem(
        "mindCraftAppearance",
        JSON.stringify(appearance)
    );
}


// ---------- KIT ----------
let selectedKit = "starter";

const kits = {
    starter: {
        name: "Starter Kit",
        items: {
            grass: 20,
            dirt: 20,
            wood: 5
        }
    },

    builder: {
        name: "Builder Kit",
        items: {
            grass: 40,
            dirt: 40,
            stone: 30,
            wood: 10,
            planks: 20
        }
    },

    explorer: {
        name: "Explorer Kit",
        items: {
            wood: 15,
            stone: 30,
            coal: 10,
            sticks: 10
        }
    }
};

function equipKit(kitName) {
    if (!kits[kitName]) return;

    selectedKit = kitName;

    const kit = kits[kitName];

    for (const item in kit.items) {
        if (inventory[item] === undefined) {
            inventory[item] = 0;
        }

        inventory[item] += kit.items[item];
    }

    updateInventory();
    updateHotbar();

    showMessage(kit.name + " equipped!");
}


// ---------- CLOTHES ----------
function updateClothesPreview() {
    const preview =
        document.getElementById("clothesPreview");

    if (!preview) return;

    preview.dataset.shirt = appearance.shirt;
    preview.dataset.pants = appearance.pants;
    preview.dataset.shoes = appearance.shoes;
    preview.dataset.head = appearance.head;
}

function updateHomeSelection() {
    document.querySelectorAll(
        "[data-shirt], [data-pants], [data-shoes], [data-head]"
    ).forEach(function (element) {

        const shirt = element.dataset.shirt;
        const pants = element.dataset.pants;
        const shoes = element.dataset.shoes;
        const head = element.dataset.head;

        let selected = false;

        if (shirt && shirt === appearance.shirt) {
            selected = true;
        }

        if (pants && pants === appearance.pants) {
            selected = true;
        }

        if (shoes && shoes === appearance.shoes) {
            selected = true;
        }

        if (head && head === appearance.head) {
            selected = true;
        }

        element.classList.toggle("selected", selected);
    });
}

document.querySelectorAll("[data-shirt]").forEach(function (item) {
    item.addEventListener("click", function () {
        appearance.shirt = item.dataset.shirt;

        saveAppearance();
        updateHomeSelection();
        updateClothesPreview();
        applyAppearanceToPlayer();

        showMessage("Shirt changed!");
    });
});

document.querySelectorAll("[data-pants]").forEach(function (item) {
    item.addEventListener("click", function () {
        appearance.pants = item.dataset.pants;

        saveAppearance();
        updateHomeSelection();
        updateClothesPreview();
        applyAppearanceToPlayer();

        showMessage("Pants changed!");
    });
});

document.querySelectorAll("[data-shoes]").forEach(function (item) {
    item.addEventListener("click", function () {
        appearance.shoes = item.dataset.shoes;

        saveAppearance();
        updateHomeSelection();
        updateClothesPreview();
        applyAppearanceToPlayer();

        showMessage("Shoes changed!");
    });
});

document.querySelectorAll("[data-head]").forEach(function (item) {
    item.addEventListener("click", function () {
        appearance.head = item.dataset.head;

        saveAppearance();
        updateHomeSelection();
        updateClothesPreview();
        applyAppearanceToPlayer();

        showMessage("Head item changed!");
    });
});


// ---------- PLAYER AVATAR ----------
let avatar = null;

function createPlayerAvatar() {
    if (avatar) return;

    avatar = new THREE.Group();

    const skinMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xd6a477
        });

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2980d9
        });

    const pantsMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x20242b
        });

    const shoesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const headGeometry =
        new THREE.BoxGeometry(0.7, 0.7, 0.7);

    const bodyGeometry =
        new THREE.BoxGeometry(0.75, 1, 0.4);

    const legGeometry =
        new THREE.BoxGeometry(0.3, 0.7, 0.4);

    const shoeGeometry =
        new THREE.BoxGeometry(0.34, 0.18, 0.48);

    const head =
        new THREE.Mesh(
            headGeometry,
            skinMaterial
        );

    head.position.y = 2.15;

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1.35;

    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            pantsMaterial
        );

    leftLeg.position.set(-0.2, 0.5, 0);

    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            pantsMaterial
        );

    rightLeg.position.set(0.2, 0.5, 0);

    const leftShoe =
        new THREE.Mesh(
            shoeGeometry,
            shoesMaterial
        );

    leftShoe.position.set(
        -0.2,
        0.05,
        -0.05
    );

    const rightShoe =
        new THREE.Mesh(
            shoeGeometry,
            shoesMaterial
        );

    rightShoe.position.set(
        0.2,
        0.05,
        -0.05
    );

    avatar.add(head);
    avatar.add(body);
    avatar.add(leftLeg);
    avatar.add(rightLeg);
    avatar.add(leftShoe);
    avatar.add(rightShoe);

    avatar.userData.head = head;
    avatar.userData.body = body;
    avatar.userData.leftLeg = leftLeg;
    avatar.userData.rightLeg = rightLeg;
    avatar.userData.leftShoe = leftShoe;
    avatar.userData.rightShoe = rightShoe;

    scene.add(avatar);
}


// ---------- APPLY CLOTHES ----------
function applyAppearanceToPlayer() {
    if (!avatar) return;

    const shirtColors = {
        blue: 0x2980d9,
        red: 0xd93636,
        green: 0x28a745,
        black: 0x171717,
        white: 0xffffff
    };

    const pantsColors = {
        dark: 0x20242b,
        blue: 0x2455a4,
        black: 0x111111,
        brown: 0x654321,
        gray: 0x777777
    };

    const shoesColors = {
        white: 0xffffff,
        black: 0x111111,
        red: 0xd93636,
        brown: 0x654321
    };

    avatar.userData.body.material.color.setHex(
        shirtColors[appearance.shirt] ||
        shirtColors.blue
    );

    avatar.userData.leftLeg.material.color.setHex(
        pantsColors[appearance.pants] ||
        pantsColors.dark
    );

    avatar.userData.rightLeg.material.color.setHex(
        pantsColors[appearance.pants] ||
        pantsColors.dark
    );

    avatar.userData.leftShoe.material.color.setHex(
        shoesColors[appearance.shoes] ||
        shoesColors.white
    );

    avatar.userData.rightShoe.material.color.setHex(
        shoesColors[appearance.shoes] ||
        shoesColors.white
    );

    // Simple head items
    if (appearance.head === "none") {
        if (avatar.userData.hat) {
            avatar.remove(avatar.userData.hat);
            avatar.userData.hat = null;
        }
    } else {
        if (!avatar.userData.hat) {
            const hatMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0x222222
                });

            const hat =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        0.78,
                        0.18,
                        0.78
                    ),
                    hatMaterial
                );

            hat.position.y = 2.58;

            avatar.add(hat);

            avatar.userData.hat = hat;
        }

        if (appearance.head === "red") {
            avatar.userData.hat.material.color.setHex(
                0xd93636
            );
        }

        if (appearance.head === "black") {
            avatar.userData.hat.material.color.setHex(
                0x111111
            );
        }

        if (appearance.head === "green") {
            avatar.userData.hat.material.color.setHex(
                0x239b56
            );
        }
    }
}


// ---------- HOME PANELS ----------
function closeHomePanels() {
    document.querySelectorAll(
        ".home-panel"
    ).forEach(function (panel) {
        panel.classList.remove("active");
    });
}

function openHomePanel(id) {
    closeHomePanels();

    const panel =
        document.getElementById(id);

    if (panel) {
        panel.classList.add("active");
    }
}

document.querySelectorAll(
    "[data-home-panel]"
).forEach(function (button) {
    button.addEventListener("click", function () {
        openHomePanel(
            button.dataset.homePanel
        );
    });
});

document.querySelectorAll(
    ".close-home-panel"
).forEach(function (button) {
    button.addEventListener("click", function () {
        closeHomePanels();
    });
});


// ---------- KIT BUTTONS ----------
document.querySelectorAll(
    "[data-kit]"
).forEach(function (button) {

    button.addEventListener("click", function () {
        selectedKit = button.dataset.kit;

        document.querySelectorAll(
            "[data-kit]"
        ).forEach(function (item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});

const equipKitBtn =
    document.getElementById("equipKitBtn");

if (equipKitBtn) {
    equipKitBtn.addEventListener(
        "click",
        function () {
            equipKit(selectedKit);
        }
    );
}


// ---------- HOME TOAST ----------
function showHomeToast(text) {
    showMessage(text);
}


// ---------- START GAME ----------
function startFromHome() {
    savePlayerName();
    saveAppearance();

    if (homeScreen) {
        homeScreen.classList.add("hidden");
        homeScreen.style.display = "none";
    }

    closeHomePanels();

    gameStarted = true;

    const gameScreen =
        document.getElementById("game");

    if (gameScreen) {
        gameScreen.classList.remove("hidden");
        gameScreen.style.display = "block";
    }

    createPlayerAvatar();
    applyAppearanceToPlayer();

    showMessage(
        "Welcome, " + savedPlayerName + "!"
    );

    updateInventory();
    updateHotbar();
    updateSurvivalHud();

    if (loadingScreen) {
        loadingScreen.classList.remove("hidden");

        setTimeout(function () {
            loadingScreen.classList.add("hidden");
        }, 900);
    }
}

if (startGameBtn) {
    startGameBtn.addEventListener(
        "click",
        startFromHome
    );
}


// ---------- INITIAL SETUP ----------
createPlayerAvatar();
applyAppearanceToPlayer();

updateHomeSelection();
updateClothesPreview();

updateInventory();
updateHotbar();
updateSurvivalHud();


// ---------- RESIZE ----------
window.addEventListener("resize", function () {
    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


// ---------- ANIMATION ----------
let lastTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();

    const delta =
        Math.min(
            0.05,
            (now - lastTime) / 1000
        );

    lastTime = now;

    if (gameStarted) {
        updatePlayer();
        updateSurvival(delta);

        // Camera follows player position
        if (avatar) {
            avatar.position.set(
                camera.position.x,
                camera.position.y - 2.1,
                camera.position.z
            );

            avatar.rotation.y = yaw;
        }
    }

    renderer.render(scene, camera);
}

animate();

console.log(
    "Mind Craft - Part 3 loaded successfully."
);
