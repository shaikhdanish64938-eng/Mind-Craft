/* global THREE */

// ==========================================
// BLOCK WORLD SURVIVAL
// PC + MOBILE
// ==========================================


const threeScript =
    document.createElement("script");


threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";


threeScript.onload =
    startGame;


document.head.appendChild(
    threeScript
);


// ==========================================
// GAME
// ==========================================

function startGame() {


    const game =
        document.getElementById(
            "game"
        );


    // ======================================
    // SCENE
    // ======================================

    const scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x87ceeb
        );


    scene.fog =
        new THREE.Fog(
            0x87ceeb,
            25,
            130
        );


    // ======================================
    // CAMERA
    // ======================================

    const camera =
        new THREE.PerspectiveCamera(
            75,
            window.innerWidth /
            window.innerHeight,
            0.1,
            300
        );


    camera.position.set(
        0,
        2.3,
        8
    );


    // ======================================
    // RENDERER
    // ======================================

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.shadowMap.enabled =
        true;


    renderer.domElement.style.position =
        "absolute";


    renderer.domElement.style.left =
        "0";


    renderer.domElement.style.top =
        "0";


    renderer.domElement.style.width =
        "100%";


    renderer.domElement.style.height =
        "100%";


    renderer.domElement.style.zIndex =
        "5";


    game.appendChild(
        renderer.domElement
    );


    // ======================================
    // LIGHT
    // ======================================

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.75
        );


    scene.add(
        ambient
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


    sun.castShadow =
        true;


    scene.add(
        sun
    );


    // ======================================
    // MATERIALS
    // ======================================

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
                color: 0x228b22
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


    const blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    // ======================================
    // WORLD DATA
    // ======================================

    const blocks = [];


    const blockMap =
        new Map();


    const generatedChunks =
        new Set();


    const CHUNK_SIZE =
        12;


    // ======================================
    // INVENTORY
    // ======================================

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


    // ======================================
    // SELECTED BLOCK
    // ======================================

    let selectedBlock =
        "grass";


    // ======================================
    // BLOCK KEY
    // ======================================

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


    // ======================================
    // CREATE BLOCK
    // ======================================

    function createBlock(
        x,
        y,
        z,
        type
    ) {


        const key =
            blockKey(
                x,
                y,
                z
            );


        if (
            blockMap.has(
                key
            )
        ) {

            return;
        }


        if (
            !materials[type]
        ) {

            return;
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


        block.userData.type =
            type;


        block.castShadow =
            true;


        block.receiveShadow =
            true;


        scene.add(
            block
        );


        blocks.push(
            block
        );


        blockMap.set(
            key,
            block
        );
    }


    // ======================================
    // TERRAIN
    // ======================================

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
                (x + z) *
                0.05
            );


        if (
            n > 1.5
        ) {

            return 2;
        }


        if (
            n > 0.7
        ) {

            return 1;
        }


        if (
            n < -1.5
        ) {

            return -1;
        }


        return 0;
    }


    // ======================================
    // RANDOM
    // ======================================

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
            Math.floor(
                value
            )
        );
    }


    // ======================================
    // TREE
    // ======================================

    function createTree(
        x,
        z,
        ground
    ) {


        for (
            let y =
                ground + 1;

            y <=
                ground + 4;

            y++
        ) {


            createBlock(
                x,
                y,
                z,
                "wood"
            );
        }


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
                    let dy =
                        ground + 4;

                    dy <=
                        ground + 6;

                    dy++
                ) {


                    if (
                        Math.abs(dx) +
                        Math.abs(dz) <
                        4
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


    // ======================================
    // GENERATE CHUNK
    // ======================================

    function generateChunk(
        chunkX,
        chunkZ
    ) {


        const id =
            chunkX +
            "," +
            chunkZ;


        if (
            generatedChunks.has(
                id
            )
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
            let x =
                startX;

            x <
                startX +
                CHUNK_SIZE;

            x++
        ) {


            for (
                let z =
                    startZ;

                z <
                    startZ +
                    CHUNK_SIZE;

                z++
            ) {


                const ground =
                    terrainHeight(
                        x,
                        z
                    );


                // Grass

                createBlock(
                    x,
                    ground,
                    z,
                    "grass"
                );


                // Dirt

                for (
                    let y =
                        ground - 1;

                    y >=
                        ground - 3;

                    y--
                ) {


                    createBlock(
                        x,
                        y,
                        z,
                        "dirt"
                    );
                }


                // Stone

                for (
                    let y =
                        ground - 4;

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


                // Coal

                for (
                    let y =
                        ground - 4;

                    y >= -7;

                    y--
                ) {


                    const chance =
                        randomValue(
                            x * 17 + y,
                            z * 31
                        );


                    if (
                        chance >
                        0.93
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

                            scene.remove(
                                existing
                            );


                            const index =
                                blocks.indexOf(
                                    existing
                                );


                            if (
                                index !==
                                -1
                            ) {

                                blocks.splice(
                                    index,
                                    1
                                );
                            }


                            blockMap.delete(
                                key
                            );
                        }


                        createBlock(
                            x,
                            y,
                            z,
                            "coal"
                        );
                    }
                }


                // Trees

                const treeChance =
                    randomValue(
                        x * 5,
                        z * 7
                    );


                if (
                    treeChance >
                    0.975 &&
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


    // ======================================
    // INITIAL WORLD
    // ======================================

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


    // ======================================
    // PLAYER
    // ======================================

    const player = {


        speed: 0.14,


        sprintSpeed: 0.22,


        velocityY: 0,


        onGround: true,


        health: 100,


        hunger: 100
    };


    let yaw = 0;


    let pitch = 0;


    const keys = {};


    // ======================================
    // KEYBOARD
    // ======================================

    document.addEventListener(
        "keydown",
        function(event) {


            keys[
                event.code
            ] = true;


            // Hotbar 1-9

            if (
                event.code
                .startsWith(
                    "Digit"
                )
            ) {


                const number =
                    parseInt(
                        event.code.replace(
                            "Digit",
                            ""
                        )
                    );


                selectHotbar(
                    number
                );
            }


            // Inventory

            if (
                event.code ===
                "KeyE"
            ) {


                openInventory();
            }


            // Crafting

            if (
                event.code ===
                "KeyC"
            ) {


                openCrafting();
            }


            // Escape

            if (
                event.code ===
                "Escape"
            ) {


                closePanels();
            }


            // Jump

            if (
                event.code ===
                "Space" &&

                player.onGround
            ) {


                player.velocityY =
                    0.18;


                player.onGround =
                    false;
            }
        }
    );


    document.addEventListener(
        "keyup",
        function(event) {


            keys[
                event.code
            ] = false;
        }
    );


    // ======================================
    // HOTBAR SELECT
    // ======================================

    function selectHotbar(
        number
    ) {


        const slot =
            document.querySelector(
                `.slot[data-key="${number}"]`
            );


        if (!slot) {
            return;
        }


        document
            .querySelectorAll(
                ".slot"
            )
            .forEach(
                function(s) {

                    s.classList.remove(
                        "selected"
                    );
                }
            );


        slot.classList.add(
            "selected"
        );


        selectedBlock =
            slot.dataset.block;
    }


    document
        .querySelectorAll(
            ".slot"
        )
        .forEach(
            function(slot) {


                slot.addEventListener(
                    "click",
                    function() {


                        selectHotbar(
                            Number(
                                slot.dataset.key
                            )
                        );
                    }
                );
            }
        );


    // ======================================
    // INVENTORY UPDATE
    // ======================================

    function updateInventory() {


        const container =
            document.getElementById(
                "inventoryItems"
            );


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
                    " : " +
                    inventory[item];


                container.appendChild(
                    div
                );
            }
        );


        updateHotbar();
    }


    // ======================================
    // HOTBAR UPDATE
    // ======================================

    function updateHotbar() {


        const hotbarItems = [

            "grass",
            "dirt",
            "stone",
            "wood",
            "leaves",
            "coal",
            "craftingTable"

        ];


        hotbarItems.forEach(
            function(item) {


                const count =
                    document.getElementById(
                        "count-" +
                        item
                    );


                if (
                    count
                ) {


                    count.textContent =
                        inventory[item];
                }
            }
        );
    }


    // ======================================
    // PANELS
    // ======================================

    function closePanels() {


        document.getElementById(
            "inventory"
        ).style.display =
            "none";


        document.getElementById(
            "crafting"
        ).style.display =
            "none";
    }


    function openInventory() {


        closePanels();


        document.getElementById(
            "inventory"
        ).style.display =
            "block";


        updateInventory();
    }


    function openCrafting() {


        closePanels();


        document.getElementById(
            "crafting"
        ).style.display =
            "block";
    }


    document.getElementById(
        "closeInventory"
    ).onclick =
        closePanels;


    document.getElementById(
        "closeCrafting"
    ).onclick =
        closePanels;


    // ======================================
    // CRAFTING
    // ======================================

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


    function craft(
        recipe
    ) {


        const msg =
            document.getElementById(
                "craftMessage"
            );


        if (
            recipe ===
            "planks"
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


        else if (
            recipe ===
            "sticks"
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


        else if (
            recipe ===
            "craftingTable"
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


        else if (
            recipe ===
            "woodPickaxe"
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


        else if (
            recipe ===
            "stonePickaxe"
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


    // ======================================
    // MOUSE LOOK
    // ======================================

    renderer.domElement.addEventListener(
        "click",
        function() {


            if (
                !isPanelOpen()
            ) {


                renderer.domElement
                    .requestPointerLock();
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


    // ======================================
    // RAYCASTER
    // ======================================

    const raycaster =
        new THREE.Raycaster();


    const center =
        new THREE.Vector2(
            0,
            0
        );


    // ======================================
    // MINE
    // ======================================

    function mineBlock() {


        if (
            isPanelOpen()
        ) {


            return;
        }


        raycaster.setFromCamera(
            center,
            camera
        );


        const hits =
            raycaster.intersectObjects(
                blocks
            );


        if (
            hits.length === 0
        ) {


            return;
        }


        const block =
            hits[0].object;


        const type =
            block.userData.type;


        // Coal

        if (
            type === "coal"
        ) {


            inventory.coal++;


            showMessage(
                "⚫ Coal collected"
            );
        }


        else {


            if (
                inventory[type] !==
                undefined
            ) {


                inventory[type]++;


                showMessage(
                    "+1 " + type
                );
            }
        }


        const key =
            blockKey(
                block.position.x,
                block.position.y,
                block.position.z
            );


        scene.remove(
            block
        );


        const index =
            blocks.indexOf(
                block
            );


        if (
            index !== -1
        ) {


            blocks.splice(
                index,
                1
            );
        }


        blockMap.delete(
            key
        );


        updateInventory();
    }


    // ======================================
    // PLACE
    // ======================================

    function placeBlock() {


        if (
            isPanelOpen()
        ) {


            return;
        }


        if (
            inventory[selectedBlock] <= 0
        ) {


            showMessage(
                "❌ You don't have this block"
            );


            return;
        }


        raycaster.setFromCamera(
            center,
            camera
        );


        const hits =
            raycaster.intersectObjects(
                blocks
            );


        if (
            hits.length === 0
        ) {


            return;
        }


        const hit =
            hits[0];


        const position =
            hit.object.position
                .clone();


        position.add(
            hit.face.normal
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


        const key =
            blockKey(
                x,
                y,
                z
            );


        if (
            blockMap.has(
                key
            )
        ) {


            return;
        }


        createBlock(
            x,
            y,
            z,
            selectedBlock
        );


        inventory[
            selectedBlock
        ]--;


        updateInventory();
    }


    // ======================================
    // PC MOUSE BUTTONS
    // ======================================

    renderer.domElement.addEventListener(
        "contextmenu",
        function(event) {


            event.preventDefault();
        }
    );


    renderer.domElement.addEventListener(
        "mousedown",
        function(event) {


            if (
                document.pointerLockElement !==
                renderer.domElement
            ) {


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


    // ======================================
    // MOBILE JOYSTICK
    // ======================================

    const joystick =
        document.getElementById(
            "joystick"
        );


    const knob =
        document.getElementById(
            "joystickKnob"
        );


    let joystickActive =
        false;


    let joystickX = 0;

    let joystickY = 0;


    joystick.addEventListener(
        "touchstart",
        function(event) {


            joystickActive =
                true;


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    joystick.addEventListener(
        "touchmove",
        function(event) {


            if (
                !joystickActive
            ) {


                return;
            }


            const touch =
                event.touches[0];


            const rect =
                joystick.getBoundingClientRect();


            let x =
                touch.clientX -
                (
                    rect.left +
                    rect.width / 2
                );


            let y =
                touch.clientY -
                (
                    rect.top +
                    rect.height / 2
                );


            const max =
                45;


            const distance =
                Math.sqrt(
                    x * x +
                    y * y
                );


            if (
                distance > max
            ) {


                x =
                    x /
                    distance *
                    max;


                y =
                    y /
                    distance *
                    max;
            }


            joystickX =
                x / max;


            joystickY =
                y / max;


            knob.style.transform =
                `translate(${x}px, ${y}px)`;


            event.preventDefault();
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


            joystickX = 0;

            joystickY = 0;


            knob.style.transform =
                "translate(0,0)";
        }
    );


    // ======================================
    // MOBILE LOOK
    // ======================================

    const lookArea =
        document.getElementById(
            "lookArea"
        );


    let lastTouchX = 0;

    let lastTouchY = 0;

    let lookActive = false;


    lookArea.addEventListener(
        "touchstart",
        function(event) {


            const touch =
                event.touches[0];


            lastTouchX =
                touch.clientX;


            lastTouchY =
                touch.clientY;


            lookActive =
                true;


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    lookArea.addEventListener(
        "touchmove",
        function(event) {


            if (
                !lookActive
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
                dx * 0.006;


            pitch -=
                dy * 0.006;


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


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    lookArea.addEventListener(
        "touchend",
        function() {


            lookActive =
                false;
        }
    );


    // ======================================
    // MOBILE BUTTONS
    // ======================================

    document.getElementById(
        "jumpBtn"
    ).addEventListener(
        "touchstart",
        function(event) {


            if (
                player.onGround
            ) {


                player.velocityY =
                    0.18;


                player.onGround =
                    false;
            }


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    document.getElementById(
        "mineBtn"
    ).addEventListener(
        "touchstart",
        function(event) {


            mineBlock();


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    document.getElementById(
        "placeBtn"
    ).addEventListener(
        "touchstart",
        function(event) {


            placeBlock();


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    document.getElementById(
        "inventoryBtn"
    ).addEventListener(
        "touchstart",
        function(event) {


            openInventory();


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    document.getElementById(
        "craftBtn"
    ).addEventListener(
        "touchstart",
        function(event) {


            openCrafting();


            event.preventDefault();
        },
        {
            passive: false
        }
    );


    // ======================================
    // PANEL CHECK
    // ======================================

    function isPanelOpen() {


        return (
            document.getElementById(
                "inventory"
            ).style.display ===
            "block" ||

            document.getElementById(
                "crafting"
            ).style.display ===
            "block"
        );
    }


    // ======================================
    // PLAYER MOVEMENT
    // ======================================

    function updatePlayer() {


        if (
            isPanelOpen()
        ) {


            return;
        }


        let forward =
            0;


        let right =
            0;


        // PC

      // PC / Laptop Arrow Keys

if (keys["ArrowUp"]) {
    forward += 1;
}

if (keys["ArrowDown"]) {
    forward -= 1;
}

if (keys["ArrowRight"]) {
    right += 1;
}

if (keys["ArrowLeft"]) {
    right -= 1;
}

        // Mobile

        if (
            Math.abs(
                joystickY
            ) > 0.05
        ) {


            forward =
                -joystickY;
        }


        if (
            Math.abs(
                joystickX
            ) > 0.05
        ) {


            right =
                joystickX;
        }


        // Movement

        if (
            forward !== 0 ||
            right !== 0
        ) {


            const length =
                Math.sqrt(
                    forward *
                    forward +

                    right *
                    right
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


            direction.y =
                0;


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


            camera.position.addScaledVector(
                direction,
                forward * speed
            );


            camera.position.addScaledVector(
                rightVector,
                right * speed
            );
        }


        // Gravity

        player.velocityY -=
            0.008;


        camera.position.y +=
            player.velocityY;


        // Ground

        if (
            camera.position.y <= 2.3
        ) {


            camera.position.y =
                2.3;


            player.velocityY =
                0;


            player.onGround =
                true;
        }


        // Infinite chunks

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
                    chunkX + x,
                    chunkZ + z
                );
            }
        }
    }


    // ======================================
    // HEALTH + HUNGER
    // ======================================

    let hungerTimer =
        0;


    function updateSurvival() {


        hungerTimer++;


        if (
            hungerTimer >
            900
        ) {


            hungerTimer =
                0;


            if (
                player.hunger > 0
            ) {


                player.hunger--;
            }
        }


        document.getElementById(
            "health"
        ).textContent =
            player.health;


        document.getElementById(
            "hunger"
        ).textContent =
            player.hunger;
    }


    // ======================================
    // MESSAGE
    // ======================================

    function showMessage(
        text
    ) {


        const message =
            document.getElementById(
                "message"
            );


        message.textContent =
            text;


        message.style.opacity =
            "1";


        setTimeout(
            function() {


                message.style.opacity =
                    "0";


            },
            1200
        );
    }


    // ======================================
    // RESIZE
    // ======================================

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


    // ======================================
    // START
    // ======================================

    updateInventory();


    // ======================================
    // GAME LOOP
    // ======================================

    function animate() {


        requestAnimationFrame(
            animate
        );


        updatePlayer();


        updateSurvival();


        renderer.render(
            scene,
            camera
        );
    }


    animate();
}