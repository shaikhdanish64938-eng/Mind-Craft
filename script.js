/* global THREE */

/* =========================================================
   MIND CRAFT — PART 1/3
   Scene + World + Blocks + Player
   ========================================================= */

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = startGame;

document.head.appendChild(threeScript);


/* =========================================================
   MAIN GAME
   ========================================================= */

function startGame() {

    console.log("Mind Craft Part 1 loaded.");


    /* =====================================================
       HTML ELEMENTS
       ===================================================== */

    const game = document.getElementById("game");

    if (!game) {
        console.error("Game container #game not found.");
        return;
    }


    /* =====================================================
       SCENE
       ===================================================== */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    scene.fog = new THREE.Fog(
        0x87ceeb,
        25,
        90
    );


    /* =====================================================
       CAMERA
       ===================================================== */

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );

    camera.position.set(
        0,
        5,
        8
    );


    /* =====================================================
       RENDERER
       ===================================================== */

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    game.appendChild(renderer.domElement);


    /* =====================================================
       LIGHTING
       ===================================================== */

    const ambientLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x446644,
            1.2
        );

    scene.add(ambientLight);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1.4
        );

    sun.position.set(
        30,
        50,
        20
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;

    scene.add(sun);


    /* =====================================================
       WORLD GROUP
       ===================================================== */

    const worldGroup =
        new THREE.Group();

    scene.add(worldGroup);


    /* =====================================================
       BLOCK DATA
       ===================================================== */

    const blocks = new Map();

    const generatedChunks = new Set();

    const CHUNK_SIZE = 16;

    const RENDER_DISTANCE = 3;


    /* =====================================================
       BLOCK GEOMETRY
       ===================================================== */

    const blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    /* =====================================================
       BLOCK MATERIALS
       ===================================================== */

    const materials = {

        grass: new THREE.MeshLambertMaterial({
            color: 0x55aa32
        }),

        dirt: new THREE.MeshLambertMaterial({
            color: 0x8b5a2b
        }),

        stone: new THREE.MeshLambertMaterial({
            color: 0x777777
        }),

        coal: new THREE.MeshLambertMaterial({
            color: 0x202020
        }),

        wood: new THREE.MeshLambertMaterial({
            color: 0x8b5a2b
        }),

        leaves: new THREE.MeshLambertMaterial({
            color: 0x238b32,
            transparent: true,
            opacity: 0.92
        }),

        craftingTable:
            new THREE.MeshLambertMaterial({
                color: 0x9b642f
            })
    };


    /* =====================================================
       INVENTORY
       ===================================================== */

    const inventory = {

        grass: 0,
        dirt: 0,
        stone: 0,
        coal: 0,
        wood: 0,
        leaves: 0,
        planks: 0,
        sticks: 0,
        craftingTable: 0,
        woodPickaxe: 0,
        stonePickaxe: 0
    };


    let selectedBlock = "dirt";


    /* =====================================================
       BLOCK KEY
       ===================================================== */

    function blockKey(x, y, z) {

        return (
            Math.round(x) +
            "," +
            Math.round(y) +
            "," +
            Math.round(z)
        );
    }


    /* =====================================================
       CREATE BLOCK
       ===================================================== */

    function createBlock(
        type,
        x,
        y,
        z
    ) {

        if (!materials[type]) {
            return null;
        }

        const key =
            blockKey(x, y, z);

        if (blocks.has(key)) {
            return blocks.get(key);
        }

        const mesh =
            new THREE.Mesh(
                blockGeometry,
                materials[type]
            );

        mesh.position.set(
            x,
            y,
            z
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData.type = type;

        mesh.userData.x = x;
        mesh.userData.y = y;
        mesh.userData.z = z;

        worldGroup.add(mesh);

        blocks.set(
            key,
            mesh
        );

        return mesh;
    }


    /* =====================================================
       REMOVE BLOCK
       ===================================================== */

    function removeBlock(
        x,
        y,
        z
    ) {

        const key =
            blockKey(x, y, z);

        const block =
            blocks.get(key);

        if (!block) {
            return null;
        }

        worldGroup.remove(block);

        blocks.delete(key);

        return block;
    }


    /* =====================================================
       TERRAIN HEIGHT
       ===================================================== */

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

        return value -
            Math.floor(value);
    }


    function terrainHeight(
        x,
        z
    ) {

        const wave1 =
            Math.sin(x * 0.08) * 2;

        const wave2 =
            Math.cos(z * 0.07) * 2;

        const wave3 =
            Math.sin(
                (x + z) * 0.035
            ) * 3;

        const noise =
            (
                randomValue(
                    Math.floor(x),
                    Math.floor(z)
                ) - 0.5
            ) * 1.5;

        return Math.floor(
            3 +
            wave1 +
            wave2 +
            wave3 +
            noise
        );
    }


    /* =====================================================
       CREATE TREE
       ===================================================== */

    function createTree(
        x,
        y,
        z
    ) {

        const trunkHeight = 4;


        /* TRUNK */

        for (
            let i = 0;
            i < trunkHeight;
            i++
        ) {

            createBlock(
                "wood",
                x,
                y + i,
                z
            );
        }


        /* LEAVES */

        const top =
            y + trunkHeight;


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
                    let dy = 0;
                    dy <= 2;
                    dy++
                ) {

                    const distance =
                        Math.abs(dx) +
                        Math.abs(dz);

                    if (
                        distance <= 3
                    ) {

                        createBlock(
                            "leaves",
                            x + dx,
                            top + dy,
                            z + dz
                        );
                    }
                }
            }
        }


        createBlock(
            "leaves",
            x,
            top + 3,
            z
        );
    }


    /* =====================================================
       GENERATE CHUNK
       ===================================================== */

    function generateChunk(
        chunkX,
        chunkZ
    ) {

        const chunkKey =
            chunkX +
            "," +
            chunkZ;

        if (
            generatedChunks.has(
                chunkKey
            )
        ) {
            return;
        }

        generatedChunks.add(
            chunkKey
        );


        const startX =
            chunkX * CHUNK_SIZE;

        const startZ =
            chunkZ * CHUNK_SIZE;


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

                const height =
                    terrainHeight(
                        x,
                        z
                    );


                /* =========================
                   STONE
                   ========================= */

                for (
                    let y = -4;
                    y < height - 2;
                    y++
                ) {

                    createBlock(
                        "stone",
                        x,
                        y,
                        z
                    );


                    /* COAL ORE */

                    if (
                        y < height - 3 &&
                        randomValue(
                            x + y * 2,
                            z - y
                        ) > 0.92
                    ) {

                        removeBlock(
                            x,
                            y,
                            z
                        );

                        createBlock(
                            "coal",
                            x,
                            y,
                            z
                        );
                    }
                }


                /* =========================
                   DIRT
                   ========================= */

                for (
                    let y = height - 2;
                    y < height;
                    y++
                ) {

                    createBlock(
                        "dirt",
                        x,
                        y,
                        z
                    );
                }


                /* =========================
                   GRASS
                   ========================= */

                createBlock(
                    "grass",
                    x,
                    height,
                    z
                );


                /* =========================
                   TREES
                   ========================= */

                const treeChance =
                    randomValue(
                        x * 2.3,
                        z * 4.7
                    );

                if (
                    treeChance > 0.965 &&
                    Math.abs(x) > 3 &&
                    Math.abs(z) > 3
                ) {

                    createTree(
                        x,
                        height + 1,
                        z
                    );
                }
            }
        }
    }


    /* =====================================================
       INITIAL WORLD
       ===================================================== */

    for (
        let cx = -RENDER_DISTANCE;
        cx <= RENDER_DISTANCE;
        cx++
    ) {

        for (
            let cz = -RENDER_DISTANCE;
            cz <= RENDER_DISTANCE;
            cz++
        ) {

            generateChunk(
                cx,
                cz
            );
        }
    }


    /* =====================================================
       PLAYER
       ===================================================== */

    const player = {

        position:
            new THREE.Vector3(
                0,
                terrainHeight(0, 0) + 2.2,
                0
            ),

        velocity:
            new THREE.Vector3(),

        height: 1.8,

        speed: 5.5,

        sprintSpeed: 8.5,

        jumpPower: 8.5,

        onGround: false
    };


    /* =====================================================
       CAMERA ROTATION
       ===================================================== */

    let yaw = 0;
    let pitch = 0;


    /* =====================================================
       KEYBOARD
       ===================================================== */

    const keys = {};


    window.addEventListener(
        "keydown",
        function (event) {

            keys[event.code] = true;


            /* PREVENT PAGE SCROLL */

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


            /* JUMP */

            if (
                event.code === "Space" &&
                player.onGround
            ) {

                player.velocity.y =
                    player.jumpPower;

                player.onGround = false;
            }
        }
    );


    window.addEventListener(
        "keyup",
        function (event) {

            keys[event.code] = false;
        }
    );


    /* =====================================================
       GROUND HEIGHT
       ===================================================== */

    function getGroundHeight(
        x,
        z
    ) {

        const gx =
            Math.floor(x);

        const gz =
            Math.floor(z);


        let highest = -100;


        for (
            let y = -4;
            y < 30;
            y++
        ) {

            const key =
                blockKey(
                    gx,
                    y,
                    gz
                );

            const block =
                blocks.get(key);

            if (block) {
                highest =
                    Math.max(
                        highest,
                        y + 0.5
                    );
            }
        }


        return highest;
    }


    /* =====================================================
       UPDATE CHUNKS
       ===================================================== */

    function updateChunks() {

        const chunkX =
            Math.floor(
                player.position.x /
                CHUNK_SIZE
            );

        const chunkZ =
            Math.floor(
                player.position.z /
                CHUNK_SIZE
            );


        for (
            let dx = -RENDER_DISTANCE;
            dx <= RENDER_DISTANCE;
            dx++
        ) {

            for (
                let dz = -RENDER_DISTANCE;
                dz <= RENDER_DISTANCE;
                dz++
            ) {

                generateChunk(
                    chunkX + dx,
                    chunkZ + dz
                );
            }
        }
    }


    /* =====================================================
       UPDATE PLAYER
       ===================================================== */

    function updatePlayer(
        delta
    ) {

        let forward = 0;
        let right = 0;


        /* FORWARD / BACK */

        if (
            keys["ArrowUp"] ||
            keys["KeyW"]
        ) {

            forward += 1;
        }

        if (
            keys["ArrowDown"] ||
            keys["KeyS"]
        ) {

            forward -= 1;
        }


        /* LEFT / RIGHT */

        if (
            keys["ArrowRight"] ||
            keys["KeyD"]
        ) {

            right += 1;
        }

        if (
            keys["ArrowLeft"] ||
            keys["KeyA"]
        ) {

            right -= 1;
        }


        const move =
            new THREE.Vector3();


        const forwardVector =
            new THREE.Vector3(
                -Math.sin(yaw),
                0,
                -Math.cos(yaw)
            );


        const rightVector =
            new THREE.Vector3(
                Math.cos(yaw),
                0,
                -Math.sin(yaw)
            );


        move.addScaledVector(
            forwardVector,
            forward
        );

        move.addScaledVector(
            rightVector,
            right
        );


        if (
            move.lengthSq() > 0
        ) {

            move.normalize();

            const speed =
                keys["ShiftLeft"] ||
                keys["ShiftRight"]
                    ? player.sprintSpeed
                    : player.speed;

            player.velocity.x =
                move.x * speed;

            player.velocity.z =
                move.z * speed;

        } else {

            player.velocity.x *= 0.75;
            player.velocity.z *= 0.75;
        }


        /* GRAVITY */

        player.velocity.y -=
            20 * delta;


        /* POSITION */

        player.position.x +=
            player.velocity.x * delta;

        player.position.z +=
            player.velocity.z * delta;

        player.position.y +=
            player.velocity.y * delta;


        /* GROUND */

        const ground =
            getGroundHeight(
                player.position.x,
                player.position.z
            );


        if (
            player.position.y <
            ground + player.height / 2
        ) {

            player.position.y =
                ground +
                player.height / 2;

            player.velocity.y = 0;

            player.onGround = true;

        } else {

            player.onGround = false;
        }


        /* CAMERA */

        camera.position.copy(
            player.position
        );

        camera.position.y +=
            0.55;


        camera.rotation.order =
            "YXZ";

        camera.rotation.y =
            yaw;

        camera.rotation.x =
            pitch;


        updateChunks();
    }


    /* =====================================================
       PART 1 COMPLETE
       ===================================================== */

    console.log(
        "Mind Craft Part 1/3 ready."
    );


    /* =====================================================
       PART 2 WILL CONTINUE BELOW
       ===================================================== */
    /* =====================================================
       PART 2/3
       INVENTORY + HOTBAR + CRAFTING + MINING + PLACING
       ===================================================== */


    /* =====================================================
       INVENTORY ELEMENTS
       ===================================================== */

    const inventoryPanel =
        document.getElementById("inventoryPanel");

    const inventoryItems =
        document.getElementById("inventoryItems");

    const closeInventory =
        document.getElementById("closeInventory");


    /* =====================================================
       UPDATE INVENTORY
       ===================================================== */

    function formatItemName(name) {

        return name
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (char) {
                return char.toUpperCase();
            });
    }


    function updateInventory() {

        if (!inventoryItems) {
            return;
        }

        inventoryItems.innerHTML = "";


        for (const item in inventory) {

            const amount =
                inventory[item];


            const itemBox =
                document.createElement("div");

            itemBox.className =
                "inventory-item";


            itemBox.innerHTML = `
                <div class="inventory-item-name">
                    ${formatItemName(item)}
                </div>

                <div class="inventory-item-count">
                    ${amount}
                </div>
            `;


            inventoryItems.appendChild(
                itemBox
            );
        }
    }


    /* =====================================================
       HOTBAR
       ===================================================== */

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


    let selectedHotbarIndex = 1;


    function updateHotbarCounts() {

        const slots =
            document.querySelectorAll(
                ".hotbar-slot"
            );


        slots.forEach(
            function (slot, index) {

                const item =
                    hotbarItems[index];


                const countElement =
                    slot.querySelector(
                        ".slot-count"
                    );


                if (
                    countElement &&
                    item
                ) {

                    countElement.textContent =
                        inventory[item] || 0;
                }


                if (
                    index ===
                    selectedHotbarIndex
                ) {

                    slot.classList.add(
                        "selected"
                    );

                } else {

                    slot.classList.remove(
                        "selected"
                    );
                }
            }
        );
    }


    /* =====================================================
       COMPATIBILITY FUNCTION
       ===================================================== */

    function updateHotbar() {

        updateHotbarCounts();
    }


    /* =====================================================
       SELECT HOTBAR
       ===================================================== */

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


        updateHotbar();
    }


    /* =====================================================
       HOTBAR CLICK
       ===================================================== */

    document
        .querySelectorAll(
            ".hotbar-slot"
        )
        .forEach(
            function (slot, index) {

                slot.addEventListener(
                    "click",
                    function () {

                        selectHotbar(
                            index
                        );
                    }
                );
            }
        );


    /* =====================================================
       NUMBER KEYS
       ===================================================== */

    window.addEventListener(
        "keydown",
        function (event) {

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


    /* =====================================================
       INVENTORY OPEN / CLOSE
       ===================================================== */

    function openInventory() {

        if (!inventoryPanel) {
            return;
        }


        updateInventory();

        inventoryPanel.classList.remove(
            "hidden"
        );

        inventoryPanel.style.display =
            "flex";
    }


    function closeInventoryPanel() {

        if (!inventoryPanel) {
            return;
        }


        inventoryPanel.classList.add(
            "hidden"
        );

        inventoryPanel.style.display =
            "none";
    }


    if (closeInventory) {

        closeInventory.addEventListener(
            "click",
            closeInventoryPanel
        );
    }


    /* =====================================================
       E = INVENTORY
       ===================================================== */

    window.addEventListener(
        "keydown",
        function (event) {

            if (
                event.code === "KeyE"
            ) {

                if (
                    inventoryPanel &&
                    inventoryPanel.classList.contains(
                        "hidden"
                    )
                ) {

                    openInventory();

                } else {

                    closeInventoryPanel();
                }
            }
        }
    );


    /* =====================================================
       CRAFTING
       ===================================================== */

    const craftingPanel =
        document.getElementById(
            "craftingPanel"
        );


    const craftingItems =
        document.getElementById(
            "craftingItems"
        );


    const closeCrafting =
        document.getElementById(
            "closeCrafting"
        );


    /* =====================================================
       RECIPES
       ===================================================== */

    const recipes = {

        planks: {

            name: "Wood Planks",

            needs: {
                wood: 1
            },

            gives: {
                planks: 4
            }
        },


        sticks: {

            name: "Sticks",

            needs: {
                planks: 2
            },

            gives: {
                sticks: 4
            }
        },


        craftingTable: {

            name: "Crafting Table",

            needs: {
                planks: 4
            },

            gives: {
                craftingTable: 1
            }
        },


        woodPickaxe: {

            name: "Wooden Pickaxe",

            needs: {
                planks: 3,
                sticks: 2
            },

            gives: {
                woodPickaxe: 1
            }
        },


        stonePickaxe: {

            name: "Stone Pickaxe",

            needs: {
                stone: 3,
                sticks: 2
            },

            gives: {
                stonePickaxe: 1
            }
        }
    };


    /* =====================================================
       CAN CRAFT
       ===================================================== */

    function canCraft(
        recipe
    ) {

        for (
            const item in recipe.needs
        ) {

            if (
                (inventory[item] || 0) <
                recipe.needs[item]
            ) {

                return false;
            }
        }


        return true;
    }


    /* =====================================================
       CRAFT ITEM
       ===================================================== */

    function craftItem(
        recipeName
    ) {

        const recipe =
            recipes[recipeName];


        if (!recipe) {
            return;
        }


        if (
            !canCraft(recipe)
        ) {

            showCraftMessage(
                "Not enough materials!"
            );

            return;
        }


        /* REMOVE MATERIALS */

        for (
            const item in recipe.needs
        ) {

            inventory[item] -=
                recipe.needs[item];
        }


        /* GIVE RESULT */

        for (
            const item in recipe.gives
        ) {

            if (
                inventory[item] ===
                undefined
            ) {

                inventory[item] = 0;
            }


            inventory[item] +=
                recipe.gives[item];
        }


        updateInventory();

        updateHotbar();


        showCraftMessage(
            recipe.name +
            " crafted!"
        );
    }


    /* =====================================================
       CRAFT BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            ".craft-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const recipeName =
                            button.dataset.recipe;


                        craftItem(
                            recipeName
                        );
                    }
                );
            }
        );


    /* =====================================================
       OPEN / CLOSE CRAFTING
       ===================================================== */

    function openCrafting() {

        if (!craftingPanel) {
            return;
        }


        craftingPanel.classList.remove(
            "hidden"
        );

        craftingPanel.style.display =
            "flex";
    }


    function closeCraftingPanel() {

        if (!craftingPanel) {
            return;
        }


        craftingPanel.classList.add(
            "hidden"
        );

        craftingPanel.style.display =
            "none";
    }


    if (closeCrafting) {

        closeCrafting.addEventListener(
            "click",
            closeCraftingPanel
        );
    }


    /* =====================================================
       C = CRAFTING
       ===================================================== */

    window.addEventListener(
        "keydown",
        function (event) {

            if (
                event.code === "KeyC"
            ) {

                if (
                    craftingPanel &&
                    craftingPanel.classList.contains(
                        "hidden"
                    )
                ) {

                    openCrafting();

                } else {

                    closeCraftingPanel();
                }
            }
        }
    );


    /* =====================================================
       CRAFT MESSAGE
       ===================================================== */

    function showCraftMessage(
        text
    ) {

        let message =
            document.getElementById(
                "craftMessage"
            );


        if (!message) {

            message =
                document.createElement(
                    "div"
                );

            message.id =
                "craftMessage";

            document.body.appendChild(
                message
            );
        }


        message.textContent =
            text;


        message.classList.add(
            "show"
        );


        setTimeout(
            function () {

                message.classList.remove(
                    "show"
                );

            },
            1800
        );
    }


    /* =====================================================
       RAYCASTER
       ===================================================== */

    const raycaster =
        new THREE.Raycaster();


    const rayDirection =
        new THREE.Vector3();


    function getTargetBlock() {

        camera.getWorldDirection(
            rayDirection
        );


        raycaster.set(
            camera.position,
            rayDirection
        );


        const objects =
            Array.from(
                blocks.values()
            );


        const hits =
            raycaster.intersectObjects(
                objects,
                false
            );


        if (
            hits.length === 0
        ) {

            return null;
        }


        return hits[0];
    }


    /* =====================================================
       MINE BLOCK
       ===================================================== */

    function mineBlock() {

        const hit =
            getTargetBlock();


        if (!hit) {
            return;
        }


        const block =
            hit.object;


        if (!block.userData.type) {
            return;
        }


        const type =
            block.userData.type;


        const x =
            block.userData.x;

        const y =
            block.userData.y;

        const z =
            block.userData.z;


        /* DON'T MINE TOO FAR */

        const distance =
            camera.position.distanceTo(
                block.position
            );


        if (
            distance > 6
        ) {

            showMessage(
                "Too far!"
            );

            return;
        }


        /* REMOVE */

        removeBlock(
            x,
            y,
            z
        );


        /* ADD INVENTORY */

        if (
            inventory[type] ===
            undefined
        ) {

            inventory[type] = 0;
        }


        inventory[type]++;


        updateInventory();

        updateHotbar();


        showMessage(
            formatItemName(type) +
            " collected!"
        );
    }


    /* =====================================================
       PLACE BLOCK
       ===================================================== */

    function placeBlock() {

        if (
            !selectedBlock
        ) {
            return;
        }


        if (
            (inventory[selectedBlock] || 0) <= 0
        ) {

            showMessage(
                "You don't have " +
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


        const block =
            hit.object;


        const distance =
            camera.position.distanceTo(
                block.position
            );


        if (
            distance > 6
        ) {

            showMessage(
                "Too far!"
            );

            return;
        }


        const normal =
            hit.face.normal.clone();


        const position =
            block.position.clone();


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


        /* DON'T PLACE INSIDE PLAYER */

        const playerDistance =
            new THREE.Vector3(
                x,
                y,
                z
            ).distanceTo(
                player.position
            );


        if (
            playerDistance < 1.5
        ) {

            return;
        }


        const key =
            blockKey(
                x,
                y,
                z
            );


        if (
            blocks.has(key)
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


    /* =====================================================
       MOUSE MINING
       ===================================================== */

    renderer.domElement.addEventListener(
        "mousedown",
        function (event) {

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


    /* =====================================================
       RIGHT CLICK MENU OFF
       ===================================================== */

    renderer.domElement.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();
        }
    );


    /* =====================================================
       MOUSE LOOK
       ===================================================== */

    let pointerLocked = false;


    renderer.domElement.addEventListener(
        "click",
        function () {

            if (
                window.innerWidth > 800
            ) {

                renderer.domElement.requestPointerLock();
            }
        }
    );


    document.addEventListener(
        "pointerlockchange",
        function () {

            pointerLocked =
                document.pointerLockElement ===
                renderer.domElement;
        }
    );


    document.addEventListener(
        "mousemove",
        function (event) {

            if (!pointerLocked) {
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
        }
    );


    /* =====================================================
       TOUCH LOOK
       ===================================================== */

    let touchLooking = false;

    let lastTouchX = 0;
    let lastTouchY = 0;


    game.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            const touch =
                event.touches[0];


            if (
                touch.target.closest(
                    "#mobileControls"
                )
            ) {
                return;
            }


            touchLooking = true;


            lastTouchX =
                touch.clientX;

            lastTouchY =
                touch.clientY;
        },
        {
            passive: true
        }
    );


    game.addEventListener(
        "touchmove",
        function (event) {

            if (
                !touchLooking ||
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
                dx * 0.005;


            pitch -=
                dy * 0.005;


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
        },
        {
            passive: true
        }
    );


    game.addEventListener(
        "touchend",
        function () {

            touchLooking = false;
        },
        {
            passive: true
        }
    );


    /* =====================================================
       INITIAL UPDATE
       ===================================================== */

    updateInventory();

    updateHotbar();


    console.log(
        "Mind Craft Part 2/3 ready."
    );


    /* =====================================================
       PART 3 WILL CONTINUE BELOW
       ===================================================== */
    /* =====================================================
       PART 3/3
       HOME + PLAYER NAME + KIT + CLOTHES
       MOBILE CONTROLS + SURVIVAL + ANIMATION
       ===================================================== */


    /* =====================================================
       GAME STATE
       ===================================================== */

    let gameStarted = false;


    /* =====================================================
       PLAYER NAME
       ===================================================== */

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


    let playerName =
        localStorage.getItem(
            "mindCraftPlayerName"
        ) || "Player";


    if (playerNameInput) {

        playerNameInput.value =
            playerName;
    }


    function updatePlayerName() {

        if (
            playerNameInput &&
            playerNameInput.value.trim()
        ) {

            playerName =
                playerNameInput.value.trim();
        }


        if (!playerName) {

            playerName =
                "Player";
        }


        localStorage.setItem(
            "mindCraftPlayerName",
            playerName
        );


        if (playerNameHud) {

            playerNameHud.textContent =
                playerName;
        }


        if (homePlayerName) {

            homePlayerName.textContent =
                playerName;
        }
    }


    updatePlayerName();


    /* =====================================================
       APPEARANCE
       ===================================================== */

    const appearance = {

        head:
            localStorage.getItem(
                "mindCraftHead"
            ) || "default",

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


    /* =====================================================
       PLAYER AVATAR
       ===================================================== */

    const avatar =
        new THREE.Group();


    const avatarBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                1,
                0.4
            ),
            new THREE.MeshLambertMaterial({
                color: 0x2277cc
            })
        );


    const avatarHead =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                0.7,
                0.7
            ),
            new THREE.MeshLambertMaterial({
                color: 0xffcc99
            })
        );


    const avatarLegs =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                0.9,
                0.4
            ),
            new THREE.MeshLambertMaterial({
                color: 0x222222
            })
        );


    const avatarShoes =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.75,
                0.2,
                0.5
            ),
            new THREE.MeshLambertMaterial({
                color: 0xffffff
            })
        );


    avatarHead.position.y =
        1.45;

    avatarBody.position.y =
        0.65;

    avatarLegs.position.y =
        -0.3;

    avatarShoes.position.y =
        -0.85;


    avatar.add(
        avatarHead
    );

    avatar.add(
        avatarBody
    );

    avatar.add(
        avatarLegs
    );

    avatar.add(
        avatarShoes
    );


    avatar.visible = false;

    scene.add(
        avatar
    );


    /* =====================================================
       APPEARANCE COLORS
       ===================================================== */

    const shirtColors = {

        blue: 0x2474d2,
        red: 0xc93636,
        green: 0x2e9b52,
        black: 0x222222,
        white: 0xf2f2f2
    };


    const pantsColors = {

        black: 0x202020,
        blue: 0x244a80,
        grey: 0x777777,
        white: 0xe8e8e8
    };


    const shoeColors = {

        white: 0xffffff,
        black: 0x202020,
        red: 0xb83232
    };


    function applyAppearanceToPlayer() {

        if (
            shirtColors[
                appearance.shirt
            ]
        ) {

            avatarBody.material.color.setHex(
                shirtColors[
                    appearance.shirt
                ]
            );
        }


        if (
            pantsColors[
                appearance.pants
            ]
        ) {

            avatarLegs.material.color.setHex(
                pantsColors[
                    appearance.pants
                ]
            );
        }


        if (
            shoeColors[
                appearance.shoes
            ]
        ) {

            avatarShoes.material.color.setHex(
                shoeColors[
                    appearance.shoes
                ]
            );
        }


        if (
            appearance.head ===
            "red"
        ) {

            avatarHead.material.color.setHex(
                0xff7777
            );

        } else if (
            appearance.head ===
            "dark"
        ) {

            avatarHead.material.color.setHex(
                0x8d5a45
            );

        } else {

            avatarHead.material.color.setHex(
                0xffcc99
            );
        }
    }


    applyAppearanceToPlayer();


    /* =====================================================
       CLOTHES PREVIEW
       ===================================================== */

    function updateClothesPreview() {

        const previewHat =
            document.getElementById(
                "previewHat"
            );

        const previewShirt =
            document.getElementById(
                "previewShirt"
            );

        const previewPants =
            document.getElementById(
                "previewPants"
            );

        const previewShoes =
            document.getElementById(
                "previewShoes"
            );


        if (previewHat) {

            previewHat.dataset.value =
                appearance.head;
        }


        if (previewShirt) {

            previewShirt.dataset.value =
                appearance.shirt;
        }


        if (previewPants) {

            previewPants.dataset.value =
                appearance.pants;
        }


        if (previewShoes) {

            previewShoes.dataset.value =
                appearance.shoes;
        }
    }


    /* =====================================================
       CLOTHES OPTIONS
       ===================================================== */

    document
        .querySelectorAll(
            ".cloth-option"
        )
        .forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function () {

                        const category =
                            option.dataset.category;

                        const value =
                            option.dataset.value;


                        if (
                            !category ||
                            !value
                        ) {
                            return;
                        }


                        if (
                            category ===
                            "head"
                        ) {

                            appearance.head =
                                value;
                        }


                        if (
                            category ===
                            "shirt"
                        ) {

                            appearance.shirt =
                                value;
                        }


                        if (
                            category ===
                            "pants"
                        ) {

                            appearance.pants =
                                value;
                        }


                        if (
                            category ===
                            "shoes"
                        ) {

                            appearance.shoes =
                                value;
                        }


                        saveAppearance();

                        applyAppearanceToPlayer();

                        updateClothesPreview();


                        document
                            .querySelectorAll(
                                `.cloth-option[data-category="${category}"]`
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );
                                }
                            );


                        option.classList.add(
                            "selected"
                        );


                        showHomeToast(
                            "Appearance updated!"
                        );
                    }
                );
            }
        );


    updateClothesPreview();


    /* =====================================================
       KITS
       ===================================================== */

    const kits = {

        starter: {

            name: "Starter Kit",

            items: {

                wood: 5,
                dirt: 10,
                stone: 5
            }
        },


        builder: {

            name: "Builder Kit",

            items: {

                wood: 10,
                dirt: 20,
                stone: 20,
                planks: 10
            }
        },


        explorer: {

            name: "Explorer Kit",

            items: {

                wood: 8,
                stone: 15,
                coal: 10,
                sticks: 6
            }
        }
    };


    let selectedKit =
        "starter";


    /* =====================================================
       EQUIP KIT
       ===================================================== */

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


        const kit =
            kits[kitName];


        for (
            const item in kit.items
        ) {

            if (
                inventory[item] ===
                undefined
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
    }


    /* =====================================================
       KIT OPTIONS
       ===================================================== */

    document
        .querySelectorAll(
            ".kit-option"
        )
        .forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function () {

                        const kitName =
                            option.dataset.kit;


                        if (
                            !kits[kitName]
                        ) {
                            return;
                        }


                        selectedKit =
                            kitName;


                        document
                            .querySelectorAll(
                                ".kit-option"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );
                                }
                            );


                        option.classList.add(
                            "selected"
                        );


                        const selectedKitName =
                            document.getElementById(
                                "selectedKitName"
                            );


                        if (
                            selectedKitName
                        ) {

                            selectedKitName.textContent =
                                kits[
                                    kitName
                                ].name;
                        }
                    }
                );
            }
        );


    /* =====================================================
       KIT EQUIP BUTTON
       ===================================================== */

    document
        .querySelectorAll(
            ".kit-equip"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        equipKit(
                            selectedKit
                        );
                    }
                );
            }
        );


    /* =====================================================
       HOME ELEMENTS
       ===================================================== */

    const homeScreen =
        document.getElementById(
            "homeScreen"
        );


    const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );


    const startGameBtn =
        document.getElementById(
            "startGameBtn"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            playerName;
    }


    /* =====================================================
       HOME PANELS
       ===================================================== */

    function closeHomePanels() {

        document
            .querySelectorAll(
                ".home-subpanel"
            )
            .forEach(
                function (panel) {

                    panel.classList.remove(
                        "active"
                    );

                    panel.style.display =
                        "none";
                }
            );
    }


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
    }


    /* =====================================================
       HOME MENU BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            "[data-panel]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const panel =
                            button.dataset.panel;


                        if (
                            panel
                        ) {

                            openHomePanel(
                                panel
                            );
                        }
                    }
                );
            }
        );


    /* =====================================================
       HOME BACK BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            ".home-back"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        closeHomePanels();
                    }
                );
            }
        );


    /* =====================================================
       HOME TOAST
       ===================================================== */

    function showHomeToast(
        text
    ) {

        const toast =
            document.getElementById(
                "homeToast"
            );


        if (!toast) {
            return;
        }


        toast.textContent =
            text;


        toast.classList.add(
            "show"
        );


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );
    }


    /* =====================================================
       START FROM HOME
       ===================================================== */

    function startFromHome() {

        updatePlayerName();


        gameStarted =
            true;


        closeHomePanels();


        if (loadingScreen) {

            loadingScreen.style.display =
                "none";
        }


        if (homeScreen) {

            homeScreen.classList.add(
                "hidden"
            );

            homeScreen.style.display =
                "none";
        }


        game.classList.remove(
            "hidden"
        );


        game.style.display =
            "block";


        avatar.visible = false;


        applyAppearanceToPlayer();


        showMessage(
            "Welcome, " +
            playerName +
            "!"
        );
    }


    /* =====================================================
       START BUTTON
       ===================================================== */

    if (startGameBtn) {

        startGameBtn.addEventListener(
            "click",
            startFromHome
        );
    }


    /* =====================================================
       ENTER = START
       ===================================================== */

    if (playerNameInput) {

        playerNameInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    startFromHome();
                }
            }
        );
    }


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    const mobileControls =
        document.getElementById(
            "mobileControls"
        );


    const joystick =
        document.getElementById(
            "joystick"
        );


    const joystickKnob =
        document.getElementById(
            "joystickKnob"
        );


    let joystickX = 0;
    let joystickY = 0;

    let joystickActive = false;


    /* =====================================================
       JOYSTICK
       ===================================================== */

    if (
        joystick &&
        joystickKnob
    ) {

        joystick.addEventListener(
            "touchstart",
            function (event) {

                event.preventDefault();

                joystickActive =
                    true;
            },
            {
                passive: false
            }
        );


        joystick.addEventListener(
            "touchmove",
            function (event) {

                event.preventDefault();


                if (
                    !joystickActive
                ) {
                    return;
                }


                const touch =
                    event.touches[0];


                const rect =
                    joystick.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                let dx =
                    touch.clientX -
                    centerX;


                let dy =
                    touch.clientY -
                    centerY;


                const max =
                    rect.width / 2 -
                    20;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance > max
                ) {

                    dx =
                        dx / distance *
                        max;

                    dy =
                        dy / distance *
                        max;
                }


                joystickX =
                    dx / max;

                joystickY =
                    dy / max;


                joystickKnob.style.transform =
                    `translate(${dx}px, ${dy}px)`;
            },
            {
                passive: false
            }
        );


        joystick.addEventListener(
            "touchend",
            function () {

                joystickActive =
                    false;

                joystickX = 0;
                joystickY = 0;


                joystickKnob.style.transform =
                    "translate(0, 0)";
            }
        );
    }


    /* =====================================================
       ADD JOYSTICK MOVEMENT
       ===================================================== */

    const originalUpdatePlayer =
        updatePlayer;


    function updatePlayerWithJoystick(
        delta
    ) {

        originalUpdatePlayer(
            delta
        );


        if (
            !joystickActive
        ) {
            return;
        }


        const move =
            new THREE.Vector3();


        const forwardVector =
            new THREE.Vector3(
                -Math.sin(yaw),
                0,
                -Math.cos(yaw)
            );


        const rightVector =
            new THREE.Vector3(
                Math.cos(yaw),
                0,
                -Math.sin(yaw)
            );


        move.addScaledVector(
            forwardVector,
            -joystickY
        );


        move.addScaledVector(
            rightVector,
            joystickX
        );


        if (
            move.lengthSq() > 0
        ) {

            move.normalize();


            player.velocity.x =
                move.x *
                player.speed;


            player.velocity.z =
                move.z *
                player.speed;
        }
    }


    /* =====================================================
       MOBILE BUTTON HELPER
       ===================================================== */

    function bindButton(
        id,
        callback
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
            function (event) {

                event.preventDefault();

                callback();
            }
        );


        button.addEventListener(
            "touchstart",
            function (event) {

                event.preventDefault();

                callback();
            },
            {
                passive: false
            }
        );
    }


    /* =====================================================
       MOBILE JUMP
       ===================================================== */

    bindButton(
        "jumpBtn",
        function () {

            if (
                player.onGround
            ) {

                player.velocity.y =
                    player.jumpPower;

                player.onGround =
                    false;
            }
        }
    );


    /* =====================================================
       MOBILE MINE
       ===================================================== */

    bindButton(
        "mineBtn",
        function () {

            mineBlock();
        }
    );


    /* =====================================================
       MOBILE PLACE
       ===================================================== */

    bindButton(
        "placeBtn",
        function () {

            placeBlock();
        }
    );


    /* =====================================================
       MOBILE INVENTORY
       ===================================================== */

    bindButton(
        "inventoryBtn",
        function () {

            if (
                inventoryPanel &&
                inventoryPanel.classList.contains(
                    "hidden"
                )
            ) {

                openInventory();

            } else {

                closeInventoryPanel();
            }
        }
    );


    /* =====================================================
       MOBILE CRAFTING
       ===================================================== */

    bindButton(
        "craftingBtn",
        function () {

            if (
                craftingPanel &&
                craftingPanel.classList.contains(
                    "hidden"
                )
            ) {

                openCrafting();

            } else {

                closeCraftingPanel();
            }
        }
    );


    /* =====================================================
       SURVIVAL
       ===================================================== */

    let health = 100;
    let hunger = 100;


    const healthElement =
        document.getElementById(
            "health"
        );


    const hungerElement =
        document.getElementById(
            "hunger"
        );


    function updateSurvivalHUD() {

        if (healthElement) {

            healthElement.textContent =
                Math.max(
                    0,
                    Math.floor(health)
                );
        }


        if (hungerElement) {

            hungerElement.textContent =
                Math.max(
                    0,
                    Math.floor(hunger)
                );
        }
    }


    updateSurvivalHUD();


    let survivalTimer = 0;


    /* =====================================================
       MESSAGE
       ===================================================== */

    const messageElement =
        document.getElementById(
            "message"
        );


    function showMessage(
        text
    ) {

        if (!messageElement) {
            return;
        }


        messageElement.textContent =
            text;


        messageElement.classList.add(
            "show"
        );


        clearTimeout(
            showMessage.timer
        );


        showMessage.timer =
            setTimeout(
                function () {

                    messageElement.classList.remove(
                        "show"
                    );

                },
                1800
            );
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        function () {

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


    /* =====================================================
       PREVENT CONTEXT MENU
       ===================================================== */

    document.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();
        }
    );


    /* =====================================================
       PREVENT MOBILE PAGE SCROLL
       ===================================================== */

    document.addEventListener(
        "touchmove",
        function (event) {

            if (
                event.target.closest(
                    "#game"
                )
            ) {

                event.preventDefault();
            }
        },
        {
            passive: false
        }
    );


    /* =====================================================
       ANIMATION
       ===================================================== */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const delta =
            Math.min(
                clock.getDelta(),
                0.05
            );


        if (gameStarted) {

            updatePlayerWithJoystick(
                delta
            );


            /* SURVIVAL */

            survivalTimer +=
                delta;


            if (
                survivalTimer >= 10
            ) {

                survivalTimer = 0;


                hunger =
                    Math.max(
                        0,
                        hunger - 1
                    );


                if (
                    hunger === 0
                ) {

                    health =
                        Math.max(
                            0,
                            health - 1
                        );
                }


                updateSurvivalHUD();
            }
        }


        renderer.render(
            scene,
            camera
        );
    }


    /* =====================================================
       INITIAL GAME STATE
       ===================================================== */

    if (game) {

        game.classList.add(
            "hidden"
        );

        game.style.display =
            "none";
    }


    closeHomePanels();


    updatePlayerName();

    updateInventory();

    updateHotbar();

    applyAppearanceToPlayer();


    /* =====================================================
       LOADING SCREEN
       ===================================================== */

    if (loadingScreen) {

        loadingScreen.style.display =
            "flex";
    }


    setTimeout(
        function () {

            if (loadingScreen) {

                loadingScreen.style.display =
                    "none";
            }

        },
        1500
    );


    /* =====================================================
       START ANIMATION
       ===================================================== */

    animate();


    console.log(
        "Mind Craft Part 3 loaded successfully."
    );

}
