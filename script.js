/* =========================================================
   BLOCK WORLD SURVIVAL
   CLEAN SCRIPT.JS
   ========================================================= */

/* global THREE */


/* =========================================================
   THREE.JS LOAD
   ========================================================= */

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = function () {
    startGame();
};

threeScript.onerror = function () {
    alert("Three.js load nahi ho paaya. Internet connection check karo.");
};

document.head.appendChild(threeScript);


/* =========================================================
   MAIN
   ========================================================= */

function startGame() {

    /* =====================================================
       BASIC ELEMENTS
       ===================================================== */

    const loadingScreen = document.getElementById("loadingScreen");
    const homeScreen = document.getElementById("homeScreen");
    const game = document.getElementById("game");

    const playerNameInput =
        document.getElementById("playerNameInput");

    const homePlayerName =
        document.getElementById("homePlayerName");

    const profileName =
        document.getElementById("profileName");

    const playerNameHud =
        document.getElementById("playerNameHud");

    const startGameBtn =
        document.getElementById("startGameBtn");

    const homeToast =
        document.getElementById("homeToast");


    /* =====================================================
       GAME STATE
       ===================================================== */

    let gameStarted = false;
    let initialized = false;

    let playerName = "Player";

    let selectedKit = "starter";

    let appearance = {
        head: "none",
        shirt: "green",
        pants: "blue",
        shoes: "white"
    };


    /* =====================================================
       SAFE STORAGE
       ===================================================== */

    function saveData() {

        try {

            localStorage.setItem(
                "blockWorldName",
                playerName
            );

            localStorage.setItem(
                "blockWorldKit",
                selectedKit
            );

            localStorage.setItem(
                "blockWorldAppearance",
                JSON.stringify(appearance)
            );

        } catch (error) {

            console.log("Storage unavailable.");

        }

    }


    function loadData() {

        try {

            const savedName =
                localStorage.getItem("blockWorldName");

            const savedKit =
                localStorage.getItem("blockWorldKit");

            const savedAppearance =
                localStorage.getItem("blockWorldAppearance");


            if (savedName) {
                playerName = savedName;
            }


            if (savedKit) {
                selectedKit = savedKit;
            }


            if (savedAppearance) {

                const data =
                    JSON.parse(savedAppearance);

                if (data) {
                    appearance = {
                        ...appearance,
                        ...data
                    };
                }

            }

        } catch (error) {

            console.log("Could not load saved data.");

        }

    }


    loadData();


    /* =====================================================
       HOME NAME
       ===================================================== */

    if (playerNameInput) {
        playerNameInput.value =
            playerName === "Player" ? "" : playerName;
    }


    function updatePlayerNameUI() {

        if (homePlayerName) {
            homePlayerName.textContent = playerName;
        }

        if (profileName) {
            profileName.textContent = playerName;
        }

        if (playerNameHud) {
            playerNameHud.textContent = playerName;
        }

    }


    updatePlayerNameUI();


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer = null;

    function showHomeToast(text) {

        if (!homeToast) return;

        homeToast.textContent = text;
        homeToast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {

            homeToast.classList.remove("show");

        }, 1800);

    }


    /* =====================================================
       HOME PANELS
       ===================================================== */

    const homePanels = document.querySelectorAll(
        ".home-subpanel"
    );

    const homeMenuButtons = document.querySelectorAll(
        "[data-home-panel]"
    );

    const homeBackButtons = document.querySelectorAll(
        ".home-back"
    );


    function closeHomePanels() {

        homePanels.forEach(function (panel) {

            panel.classList.add("hidden");

        });

    }


    homeMenuButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const panelId =
                button.getAttribute("data-home-panel");

            const panel =
                document.getElementById(panelId);

            if (!panel) return;

            closeHomePanels();

            panel.classList.remove("hidden");

        });

    });


    homeBackButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            closeHomePanels();

        });

    });


    /* =====================================================
       KIT SYSTEM
       ===================================================== */

    const kitOptions =
        document.querySelectorAll(".kit-option");

    const selectedKitName =
        document.getElementById("selectedKitName");

    const kitEquipButton =
        document.querySelector(".kit-equip");


    function updateKitUI() {

        kitOptions.forEach(function (option) {

            const kit =
                option.getAttribute("data-kit");

            if (kit === selectedKit) {
                option.classList.add("selected");
            } else {
                option.classList.remove("selected");
            }

        });


        if (selectedKitName) {

            const names = {
                starter: "STARTER",
                builder: "BUILDER",
                explorer: "EXPLORER"
            };

            selectedKitName.textContent =
                names[selectedKit] || "STARTER";

        }

    }


    kitOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            const kit =
                option.getAttribute("data-kit");

            if (!kit) return;

            selectedKit = kit;

            updateKitUI();

            showHomeToast(
                "Kit selected: " +
                kit.toUpperCase()
            );

        });

    });


    if (kitEquipButton) {

        kitEquipButton.addEventListener(
            "click",
            function () {

                saveData();

                closeHomePanels();

                showHomeToast(
                    "✓ " +
                    selectedKit.toUpperCase() +
                    " KIT EQUIPPED"
                );

            }
        );

    }


    updateKitUI();


    /* =====================================================
       CLOTHES SYSTEM
       ===================================================== */

    const clothOptions =
        document.querySelectorAll(".cloth-option");


    const previewHat =
        document.getElementById("previewHat");

    const previewShirt =
        document.getElementById("previewShirt");

    const previewPants =
        document.getElementById("previewPants");

    const previewShoes =
        document.getElementById("previewShoes");


    function updateClothesButtons() {

        clothOptions.forEach(function (button) {

            const category =
                button.getAttribute("data-category");

            const value =
                button.getAttribute("data-value");


            if (
                appearance[category] === value
            ) {

                button.classList.add("selected");

            } else {

                button.classList.remove("selected");

            }

        });

    }


    function updateClothesPreview() {

        if (previewHat) {

            const hats = {

                none: "",
                cap: "🧢",
                helmet: "⛑️"

            };

            previewHat.textContent =
                hats[appearance.head] || "";

        }


        if (previewShirt) {

            const shirtColors = {

                green: "#32a852",
                blue: "#2f73c8",
                red: "#d84242"

            };

            previewShirt.style.background =
                shirtColors[appearance.shirt] ||
                "#32a852";

        }


        if (previewPants) {

            const pantsColors = {

                blue: "#315d9d",
                black: "#151515",
                brown: "#71482e"

            };

            previewPants.style.background =
                pantsColors[appearance.pants] ||
                "#315d9d";

        }


        if (previewShoes) {

            const shoesColors = {

                white: "#ffffff",
                black: "#111111"

            };

            previewShoes.style.background =
                shoesColors[appearance.shoes] ||
                "#ffffff";

        }


        updateClothesButtons();

    }


    clothOptions.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const category =
                    button.getAttribute(
                        "data-category"
                    );

                const value =
                    button.getAttribute(
                        "data-value"
                    );


                if (!category || !value) {
                    return;
                }


                appearance[category] = value;

                updateClothesPreview();

                saveData();

                showHomeToast(
                    category.toUpperCase() +
                    " changed"
                );

            }
        );

    });


    updateClothesPreview();


    /* =====================================================
       THREE.JS VARIABLES
       ===================================================== */

    let scene;
    let camera;
    let renderer;

    let clock;

    let player;

    let yaw = 0;
    let pitch = 0;

    let velocityY = 0;

    let canJump = true;

    let selectedSlot = 1;

    let healthValue = 100;
    let hungerValue = 100;

    let messageTimer = null;


    /* =====================================================
       WORLD
       ===================================================== */

    const blocks = [];
    const blockMap = new Map();

    const worldSize = 32;
    const blockSize = 1;


    /* =====================================================
       BLOCK TYPES
       ===================================================== */

    const blockTypes = {

        grass: {
            name: "Grass",
            emoji: "🌿",
            color: 0x4caf50
        },

        dirt: {
            name: "Dirt",
            emoji: "🟫",
            color: 0x79502e
        },

        stone: {
            name: "Stone",
            emoji: "🪨",
            color: 0x858585
        },

        wood: {
            name: "Wood",
            emoji: "🪵",
            color: 0x8a5a32
        },

        leaves: {
            name: "Leaves",
            emoji: "🍃",
            color: 0x258a45
        },

        coal: {
            name: "Coal",
            emoji: "⚫",
            color: 0x202020
        },

        craftingTable: {
            name: "Crafting Table",
            emoji: "🧱",
            color: 0x9b6237
        },

        planks: {
            name: "Planks",
            emoji: "🪵",
            color: 0xb47743
        },

        sticks: {
            name: "Sticks",
            emoji: "🪄",
            color: 0xa86d3c
        },

        woodenPickaxe: {
            name: "Wooden Pickaxe",
            emoji: "⛏️",
            color: 0x9b673d
        },

        stonePickaxe: {
            name: "Stone Pickaxe",
            emoji: "⛏️",
            color: 0x7d858b
        }

    };


    /* =====================================================
       INVENTORY
       ===================================================== */

    const inventory = {

        grass: 0,
        dirt: 0,
        stone: 0,
        wood: 3,
        leaves: 0,
        coal: 0,
        craftingTable: 0,
        planks: 0,
        sticks: 0,
        woodenPickaxe: 0,
        stonePickaxe: 0

    };


    /* =====================================================
       HOTBAR TYPES
       ===================================================== */

    const hotbarItems = {

        1: "grass",
        2: "dirt",
        3: "stone",
        4: "wood",
        5: "leaves",
        6: "coal",
        7: "craftingTable",
        8: "woodenPickaxe",
        9: "stonePickaxe"

    };


    /* =====================================================
       INIT THREE.JS
       ===================================================== */

    function initializeGame() {

        if (initialized) return;

        initialized = true;


        scene = new THREE.Scene();

        scene.background =
            new THREE.Color(0x79b7df);


        scene.fog =
            new THREE.Fog(0x79b7df, 20, 75);


        camera =
            new THREE.PerspectiveCamera(
                75,
                window.innerWidth /
                window.innerHeight,
                0.1,
                150
            );


        camera.position.set(
            0,
            4,
            6
        );


        renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });


        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.shadowMap.enabled = true;

        renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        game.insertBefore(
            renderer.domElement,
            game.firstChild
        );


        clock = new THREE.Clock();


        /* =================================================
           LIGHTS
           ================================================= */

        const ambient =
            new THREE.HemisphereLight(
                0xffffff,
                0x35513d,
                1.3
            );

        scene.add(ambient);


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                1.5
            );

        sun.position.set(
            30,
            50,
            20
        );

        sun.castShadow = true;

        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;

        scene.add(sun);


        /* =================================================
           WORLD
           ================================================= */

        generateWorld();


        /* =================================================
           PLAYER
           ================================================= */

        createPlayer();


        /* =================================================
           CONTROLS
           ================================================= */
       setupControls();

updateInventory();

updateHotbar();

updateSurvivalUI();

       /* setupControls();

        updateInventory();

        setupCrafting();

        setupMobileControls();

        setupHotbar();*///
      


        window.addEventListener(
            "resize",
            onResize
        );


        animate();

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

        const key =
            x + "|" + y + "|" + z;


        if (blockMap.has(key)) {
            return null;
        }


        const data =
            blockTypes[type];

        if (!data) return null;


        const geometry =
            new THREE.BoxGeometry(
                blockSize,
                blockSize,
                blockSize
            );


        const material =
            new THREE.MeshLambertMaterial({
                color: data.color
            });


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        mesh.position.set(
            x,
            y,
            z
        );


        mesh.castShadow = true;
        mesh.receiveShadow = true;


        mesh.userData.blockType = type;
        mesh.userData.x = x;
        mesh.userData.y = y;
        mesh.userData.z = z;


        scene.add(mesh);


        blocks.push(mesh);

        blockMap.set(key, mesh);


        return mesh;

    }


    /* =====================================================
       REMOVE BLOCK
       ===================================================== */

    function removeBlock(mesh) {

        if (!mesh) return;


        const type =
            mesh.userData.blockType;

        const x =
            mesh.userData.x;

        const y =
            mesh.userData.y;

        const z =
            mesh.userData.z;


        const key =
            x + "|" + y + "|" + z;


        scene.remove(mesh);

        blockMap.delete(key);


        const index =
            blocks.indexOf(mesh);

        if (index !== -1) {
            blocks.splice(index, 1);
        }


        if (mesh.geometry) {
            mesh.geometry.dispose();
        }

        if (mesh.material) {
            mesh.material.dispose();
        }


        if (inventory[type] !== undefined) {

            inventory[type]++;

        }


        updateInventory();

        updateHotbar();

    }


    /* =====================================================
       WORLD GENERATION
       ===================================================== */
   function generateWorld() {

    const renderDistance = 5;

    for (let cx = -renderDistance; cx <= renderDistance; cx++) {

        for (let cz = -renderDistance; cz <= renderDistance; cz++) {

            generateChunk(cx, cz);

        }

    }

}
   const CHUNK_SIZE = 16;
const generatedChunks = new Set();

function generateChunk(chunkX, chunkZ) {

    const chunkKey =
        chunkX + "|" + chunkZ;

    if (generatedChunks.has(chunkKey)) {
        return;
    }

    generatedChunks.add(chunkKey);

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

            let height =
                1 +
                Math.floor(
                    Math.sin(x * 0.15) * 1.5 +
                    Math.cos(z * 0.15) * 1.5
                );

            height =
                Math.max(
                    0,
                    Math.min(4, height)
                );


            for (
                let y = 0;
                y <= height;
                y++
            ) {

                let type = "stone";


                if (y === height) {

                    type = "grass";

                }
                else if (
                    y >= height - 2
                ) {

                    type = "dirt";

                }


                /* COAL */

                if (
                    type === "stone" &&
                    y <= 1 &&
                    Math.random() < 0.08
                ) {

                    type = "coal";

                }


                createBlock(
                    type,
                    x,
                    y,
                    z
                );

            }


            /* TREES */

            const treeChance =
                Math.random();


            if (
                treeChance < 0.045 &&
                Math.abs(x) > 3 &&
                Math.abs(z) > 3 &&
                height >= 2
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

   /* function generateWorld() {

        const half =
            Math.floor(worldSize / 2);


        for (
            let x = -half;
            x <= half;
            x++
        ) {

            for (
                let z = -half;
                z <= half;
                z++
            ) {

                const distance =
                    Math.sqrt(
                        x * x + z * z
                    );


                let height =
                    1 +
                    Math.floor(
                        Math.sin(x * 0.35) * 1.2 +
                        Math.cos(z * 0.28) * 1.2
                    );


                height =
                    Math.max(
                        0,
                        Math.min(3, height)
                    );


                for (
                    let y = 0;
                    y <= height;
                    y++
                ) {

                    let type = "stone";


                    if (y === height) {
                        type = "grass";
                    }
                    else if (y >= height - 2) {
                        type = "dirt";
                    }


                    createBlock(
                        type,
                        x,
                        y,
                        z
                    );


                    /* COAL */

                    if (
                        type === "stone" &&
                        y <= 1 &&
                        Math.random() < 0.08
                    ) {

                        removeGeneratedBlock(
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


                /* TREES */

                if (
                    Math.abs(x) > 2 &&
                    Math.abs(z) > 2 &&
                    distance < half - 3 &&
                    Math.random() < 0.045
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


    function removeGeneratedBlock(
        x,
        y,
        z
    ) {

        const key =
            x + "|" + y + "|" + z;

        const mesh =
            blockMap.get(key);

        if (!mesh) return;

        scene.remove(mesh);

        blockMap.delete(key);

        const index =
            blocks.indexOf(mesh);

        if (index !== -1) {
            blocks.splice(index, 1);
        }

        mesh.geometry.dispose();
        mesh.material.dispose();

    }*/


    /* =====================================================
       TREE
       ===================================================== */

    function createTree(
        x,
        baseY,
        z
    ) {

        for (
            let y = baseY;
            y < baseY + 4;
            y++
        ) {

            createBlock(
                "wood",
                x,
                y,
                z
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
                    let dy = 2;
                    dy <= 4;
                    dy++
                ) {

                    const distance =
                        Math.abs(dx) +
                        Math.abs(dz);


                    if (
                        distance < 3 &&
                        Math.random() > 0.12
                    ) {

                        createBlock(
                            "leaves",
                            x + dx,
                            baseY + dy,
                            z + dz
                        );

                    }

                }

            }

        }

    }


    /* =====================================================
       PLAYER
       ===================================================== */

    function createPlayer() {

        player =
            new THREE.Group();


        const body =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.65,
                    1.05,
                    0.4
                ),
                new THREE.MeshLambertMaterial({
                    color: 0x32a852
                })
            );


        body.position.y = 0;

        body.castShadow = true;

        player.add(body);


        player.userData.body =
            body;


        scene.add(player);


        player.position.set(
            0,
            3,
            5
        );


        applyAppearanceToPlayer();

    }


    /* =====================================================
       PLAYER CLOTHES
       ===================================================== */

    function applyAppearanceToPlayer() {

        if (!player) return;


        const body =
            player.userData.body;

        if (!body) return;


        const shirtColors = {

            green: 0x32a852,
            blue: 0x3175c6,
            red: 0xd84242

        };


        body.material.color.setHex(
            shirtColors[
                appearance.shirt
            ] || shirtColors.green
        );


        /* STORE APPEARANCE */

        player.userData.appearance =
            {
                ...appearance
            };

    }


    /* =====================================================
       MOVEMENT
       ===================================================== */

    const keys = {

        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,

        w: false,
        a: false,
        s: false,
        d: false,

        Shift: false

    };


    let joystickX = 0;
    let joystickY = 0;


    function setupControls() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    keys.hasOwnProperty(
                        event.key
                    )
                ) {

                    keys[event.key] = true;

                }


                if (event.key === " ") {

                    event.preventDefault();

                    jump();

                }


                if (
                    event.key === "e" ||
                    event.key === "E"
                ) {

                    toggleInventory();

                }


                if (
                    event.key === "c" ||
                    event.key === "C"
                ) {

                    toggleCrafting();

                }


                if (
                    event.key >= "1" &&
                    event.key <= "9"
                ) {

                    selectHotbar(
                        Number(event.key)
                    );

                }

            }
        );


        document.addEventListener(
            "keyup",
            function (event) {

                if (
                    keys.hasOwnProperty(
                        event.key
                    )
                ) {

                    keys[event.key] = false;

                }

            }
        );


        /* MOUSE */

        document.addEventListener(
            "mousemove",
            function (event) {

                if (!gameStarted) return;

                if (
                    document.pointerLockElement ===
                    renderer.domElement
                ) {

                    yaw -=
                        event.movementX *
                        0.002;

                    pitch -=
                        event.movementY *
                        0.002;


                    pitch =
                        Math.max(
                            -1.45,
                            Math.min(
                                1.45,
                                pitch
                            )
                        );

                }

            }
        );


        renderer.domElement.addEventListener(
            "click",
            function () {

                if (!gameStarted) return;

                renderer.domElement.requestPointerLock();

            }
        );


        /* LEFT CLICK */

        renderer.domElement.addEventListener(
            "mousedown",
            function (event) {

                if (!gameStarted) return;

                if (event.button === 0) {

                    mineBlock();

                }

            }
        );


        /* RIGHT CLICK */

        renderer.domElement.addEventListener(
            "contextmenu",
            function (event) {

                event.preventDefault();

                if (!gameStarted) return;

                placeBlock();

            }
        );

    }


    /* =====================================================
       JUMP
       ===================================================== */

    function jump() {

        if (!gameStarted) return;

        if (!canJump) return;

        velocityY = 7;

        canJump = false;

    }


    /* =====================================================
       PLAYER UPDATE
       ===================================================== */

    function updatePlayer(delta) {

        if (!player || !camera) return;

        if (!gameStarted) return;


        const speed =
            keys.Shift ? 8 : 4.5;


        let forward = 0;
        let side = 0;


        if (
            keys.ArrowUp ||
            keys.w
        ) {
            forward += 1;
        }


        if (
            keys.ArrowDown ||
            keys.s
        ) {
            forward -= 1;
        }


        if (
            keys.ArrowRight ||
            keys.d
        ) {
            side += 1;
        }


        if (
            keys.ArrowLeft ||
            keys.a
        ) {
            side -= 1;
        }


        forward += -joystickY;
        side += joystickX;


        const length =
            Math.sqrt(
                forward * forward +
                side * side
            );


        if (length > 1) {

            forward /= length;
            side /= length;

        }


        /* CAMERA DIRECTION */

        const direction =
            new THREE.Vector3(
                Math.sin(yaw),
                0,
                Math.cos(yaw)
            );


        const right =
            new THREE.Vector3(
                Math.cos(yaw),
                0,
                -Math.sin(yaw)
            );


        player.position.x +=
            (
                direction.x * forward +
                right.x * side
            ) *
            speed *
            delta;


        player.position.z +=
            (
                direction.z * forward +
                right.z * side
            ) *
            speed *
            delta;


        /* GRAVITY */

        velocityY -=
            18 * delta;


        player.position.y +=
            velocityY * delta;


        const groundY = 2.0;


        if (player.position.y <= groundY) {

            player.position.y =
                groundY;

            velocityY = 0;

            canJump = true;

        }


        /* CAMERA */

        camera.position.x =
            player.position.x;


        camera.position.y =
            player.position.y + 1.25;


        camera.position.z =
            player.position.z;


        camera.rotation.order =
            "YXZ";


        camera.rotation.y =
            yaw;


        camera.rotation.x =
            pitch;

    }


    /* =====================================================
       MINE
       ===================================================== */

    const raycaster =
        new THREE.Raycaster();


    function getCenterRay() {

        if (!camera) return null;


        raycaster.setFromCamera(
            new THREE.Vector2(0, 0),
            camera
        );


        return raycaster.intersectObjects(
            blocks,
            false
        );

    }


    function mineBlock() {

        const hits =
            getCenterRay();


        if (!hits || hits.length === 0) {

            showMessage(
                "Koi block target nahi mila."
            );

            return;

        }


        const hit =
            hits[0];


        if (
            hit.distance > 6
        ) {

            showMessage(
                "Block bahut door hai."
            );

            return;

        }


        const mesh =
            hit.object;


        removeBlock(mesh);


        showMessage(
            "+" +
            blockTypes[
                mesh.userData.blockType
            ].name
        );

    }


    /* =====================================================
       PLACE
       ===================================================== */

    function placeBlock() {

        const type =
            hotbarItems[selectedSlot];


        if (!type) return;


        if (
            !inventory[type] ||
            inventory[type] <= 0
        ) {

            showMessage(
                "Inventory mein " +
                blockTypes[type].name +
                " nahi hai."
            );

            return;

        }


        const hits =
            getCenterRay();


        if (!hits || hits.length === 0) {

            showMessage(
                "Place karne ke liye block select karo."
            );

            return;

        }


        const hit =
            hits[0];


        if (hit.distance > 6) {

            showMessage(
                "Block bahut door hai."
            );

            return;

        }


        const normal =
            hit.face.normal.clone();


        const point =
            hit.object.position.clone();


        point.add(normal);


        const x =
            Math.round(point.x);

        const y =
            Math.round(point.y);

        const z =
            Math.round(point.z);


        const key =
            x + "|" + y + "|" + z;


        if (blockMap.has(key)) {
            return;
        }


        createBlock(
            type,
            x,
            y,
            z
        );


        inventory[type]--;


        updateInventory();
        updateHotbar();


        showMessage(
            "Block placed"
        );

    }


    /* =====================================================
       INVENTORY
       ===================================================== */

    const inventoryPanel =
        document.getElementById(
            "inventoryPanel"
        );

    const inventoryItems =
        document.getElementById(
            "inventoryItems"
        );

    const closeInventory =
        document.getElementById(
            "closeInventory"
        );


    function updateInventory() {

        if (!inventoryItems) return;


        inventoryItems.innerHTML = "";


        Object.keys(inventory).forEach(
            function (type) {

                const amount =
                    inventory[type];


                const data =
                    blockTypes[type];


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "inventory-item";


                item.innerHTML = `
                    <div>
                        <strong>
                            ${data.emoji} ${data.name}
                        </strong>
                    </div>

                    <span>
                        ${amount}
                    </span>
                `;


                inventoryItems.appendChild(
                    item
                );

            }
        );

    }


    function toggleInventory() {

        if (!inventoryPanel) return;

        if (
            inventoryPanel.classList.contains(
                "hidden"
            )
        ) {

            closeCraftingPanel();

            inventoryPanel.classList.remove(
                "hidden"
            );

            updateInventory();

        } else {

            inventoryPanel.classList.add(
                "hidden"
            );

        }

    }


    if (closeInventory) {

        closeInventory.addEventListener(
            "click",
            function () {

                inventoryPanel.classList.add(
                    "hidden"
                );

            }
        );

    }


    updateInventory();


    /* =====================================================
       CRAFTING
       ===================================================== */

    const craftingPanel =
        document.getElementById(
            "craftingPanel"
        );

    const closeCrafting =
        document.getElementById(
            "closeCrafting"
        );

    const craftButtons =
        document.querySelectorAll(
            ".craft-button"
        );


    const recipes = {

        planks: {
            need: {
                wood: 1
            },
            give: {
                planks: 4
            }
        },

        sticks: {
            need: {
                planks: 2
            },
            give: {
                sticks: 4
            }
        },

        craftingTable: {
            need: {
                planks: 4
            },
            give: {
                craftingTable: 1
            }
        },

        woodenPickaxe: {
            need: {
                planks: 3,
                sticks: 2
            },
            give: {
                woodenPickaxe: 1
            }
        },

        stonePickaxe: {
            need: {
                stone: 3,
                sticks: 2
            },
            give: {
                stonePickaxe: 1
            }
        }

    };


    function closeCraftingPanel() {

        if (!craftingPanel) return;

        craftingPanel.classList.add(
            "hidden"
        );

    }


    function toggleCrafting() {

        if (!craftingPanel) return;


        if (
            craftingPanel.classList.contains(
                "hidden"
            )
        ) {

            if (inventoryPanel) {

                inventoryPanel.classList.add(
                    "hidden"
                );

            }

            craftingPanel.classList.remove(
                "hidden"
            );

        } else {

            craftingPanel.classList.add(
                "hidden"
            );

        }

    }


    function craft(recipeName) {

        const recipe =
            recipes[recipeName];


        if (!recipe) return;


        /* CHECK */

        for (
            const item in recipe.need
        ) {

            if (
                (inventory[item] || 0) <
                recipe.need[item]
            ) {

                showMessage(
                    "Resources kam hain."
                );

                return;

            }

        }


        /* REMOVE */

        for (
            const item in recipe.need
        ) {

            inventory[item] -=
                recipe.need[item];

        }


        /* GIVE */

        for (
            const item in recipe.give
        ) {

            inventory[item] =
                (inventory[item] || 0) +
                recipe.give[item];

        }


        updateInventory();
        updateHotbar();


        const outputName =
            Object.keys(recipe.give)[0];


        showMessage(
            "Crafted: " +
            blockTypes[
                outputName
            ].name
        );

    }


    craftButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const recipe =
                        button.getAttribute(
                            "data-recipe"
                        );

                    craft(recipe);

                }
            );

        }
    );


    if (closeCrafting) {

        closeCrafting.addEventListener(
            "click",
            closeCraftingPanel
        );

    }


    /* =====================================================
       HOTBAR
       ===================================================== */

    const hotbarSlots =
        document.querySelectorAll(
            ".hotbar-slot"
        );


    function selectHotbar(slot) {

        if (
            slot < 1 ||
            slot > 9
        ) return;


        selectedSlot = slot;


        hotbarSlots.forEach(
            function (element) {

                const number =
                    Number(
                        element.getAttribute(
                            "data-slot"
                        )
                    );


                if (
                    number === selectedSlot
                ) {

                    element.classList.add(
                        "selected"
                    );

                } else {

                    element.classList.remove(
                        "selected"
                    );

                }

            }
        );


        updateHotbar();

    }


    function updateHotbar() {

        hotbarSlots.forEach(
            function (slot) {

                const number =
                    Number(
                        slot.getAttribute(
                            "data-slot"
                        )
                    );


                const type =
                    hotbarItems[number];


                if (!type) return;


                const data =
                    blockTypes[type];


                slot.innerHTML = `
                    <span>${number}</span>
                    ${data.emoji}
                    <small class="hotbar-count">
                        ${inventory[type] || 0}
                    </small>
                `;


                if (
                    number === selectedSlot
                ) {

                    slot.classList.add(
                        "selected"
                    );

                }

            }
        );

    }


    hotbarSlots.forEach(
        function (slot) {

            slot.addEventListener(
                "click",
                function () {

                    const number =
                        Number(
                            slot.getAttribute(
                                "data-slot"
                            )
                        );

                    selectHotbar(number);

                }
            );

        }
    );


    updateHotbar();


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    const joystick =
        document.getElementById(
            "joystick"
        );

    const joystickKnob =
        document.getElementById(
            "joystickKnob"
        );

    const lookArea =
        document.getElementById(
            "lookArea"
        );


    let joystickActive = false;


    if (joystick) {

        joystick.addEventListener(
            "pointerdown",
            function (event) {

                joystickActive = true;

                joystick.setPointerCapture(
                    event.pointerId
                );

                updateJoystick(event);

            }
        );


        joystick.addEventListener(
            "pointermove",
            function (event) {

                if (!joystickActive) return;

                updateJoystick(event);

            }
        );


        joystick.addEventListener(
            "pointerup",
            resetJoystick
        );


        joystick.addEventListener(
            "pointercancel",
            resetJoystick
        );

    }


    function updateJoystick(event) {

        if (!joystick || !joystickKnob) {
            return;
        }


        const rect =
            joystick.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;


        const centerY =
            rect.top +
            rect.height / 2;


        let x =
            event.clientX -
            centerX;


        let y =
            event.clientY -
            centerY;


        const max =
            rect.width / 2 -
            joystickKnob.offsetWidth / 2;


        const distance =
            Math.sqrt(
                x * x + y * y
            );


        if (distance > max) {

            x =
                x / distance * max;

            y =
                y / distance * max;

        }


        joystickKnob.style.transform =
            `translate(${x}px, ${y}px)`;


        joystickX =
            x / max;

        joystickY =
            y / max;

    }


    function resetJoystick() {

        joystickActive = false;

        joystickX = 0;
        joystickY = 0;


        if (joystickKnob) {

            joystickKnob.style.transform =
                "translate(0, 0)";

        }

    }


    /* MOBILE LOOK */

    let lastTouchX = 0;
    let lastTouchY = 0;
    let looking = false;


    if (lookArea) {

        lookArea.addEventListener(
            "pointerdown",
            function (event) {

                looking = true;

                lastTouchX =
                    event.clientX;

                lastTouchY =
                    event.clientY;

                lookArea.setPointerCapture(
                    event.pointerId
                );

            }
        );


        lookArea.addEventListener(
            "pointermove",
            function (event) {

                if (!looking) return;


                const dx =
                    event.clientX -
                    lastTouchX;

                const dy =
                    event.clientY -
                    lastTouchY;


                lastTouchX =
                    event.clientX;

                lastTouchY =
                    event.clientY;


                yaw -= dx * 0.008;

                pitch -= dy * 0.008;


                pitch =
                    Math.max(
                        -1.45,
                        Math.min(
                            1.45,
                            pitch
                        )
                    );

            }
        );


        lookArea.addEventListener(
            "pointerup",
            function () {

                looking = false;

            }
        );


        lookArea.addEventListener(
            "pointercancel",
            function () {

                looking = false;

            }
        );

    }


    /* =====================================================
       MOBILE BUTTONS
       ===================================================== */

    const jumpBtn =
        document.getElementById(
            "jumpBtn"
        );

    const mineBtn =
        document.getElementById(
            "mineBtn"
        );

    const placeBtn =
        document.getElementById(
            "placeBtn"
        );

    const inventoryBtn =
        document.getElementById(
            "inventoryBtn"
        );

    const craftingBtn =
        document.getElementById(
            "craftingBtn"
        );


    if (jumpBtn) {

        jumpBtn.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                jump();

            }
        );

    }


    if (mineBtn) {

        mineBtn.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                mineBlock();

            }
        );

    }


    if (placeBtn) {

        placeBtn.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                placeBlock();

            }
        );

    }


    if (inventoryBtn) {

        inventoryBtn.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                toggleInventory();

            }
        );

    }


    if (craftingBtn) {

        craftingBtn.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                toggleCrafting();

            }
        );

    }


    /* =====================================================
       SURVIVAL
       ===================================================== */

    let survivalTimer = 0;


    function updateSurvival(delta) {

        if (!gameStarted) return;


        survivalTimer += delta;


        if (survivalTimer < 10) {
            return;
        }


        survivalTimer = 0;


        hungerValue =
            Math.max(
                0,
                hungerValue - 1
            );


        if (hungerValue <= 0) {

            healthValue =
                Math.max(
                    0,
                    healthValue - 1
                );

        }


        updateSurvivalUI();


        if (healthValue <= 0) {

            showMessage(
                "You need food and rest!"
            );

            healthValue = 100;
            hungerValue = 100;

            player.position.set(
                0,
                3,
                5
            );

        }

    }


    function updateSurvivalUI() {

        const health =
            document.getElementById(
                "health"
            );

        const hunger =
            document.getElementById(
                "hunger"
            );


        if (health) {

            health.style.width =
                healthValue + "%";

        }


        if (hunger) {

            hunger.style.width =
                hungerValue + "%";

        }

    }


    updateSurvivalUI();


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(text) {

        const message =
            document.getElementById(
                "message"
            );


        if (!message) return;


        message.textContent = text;

        message.classList.add("show");


        clearTimeout(messageTimer);


        messageTimer =
            setTimeout(
                function () {

                    message.classList.remove(
                        "show"
                    );

                },
                1300
            );

    }


    /* =====================================================
       START GAME FROM HOME
       ===================================================== */

    function startFromHome() {

        if (gameStarted) return;


        if (playerNameInput) {

            const enteredName =
                playerNameInput.value.trim();


            if (enteredName.length > 0) {

                playerName =
                    enteredName.substring(
                        0,
                        16
                    );

            } else {

                playerName = "Player";

            }

        }


        updatePlayerNameUI();

        saveData();


        if (!initialized) {
            initializeGame();
        }


        gameStarted = true;


        if (homeScreen) {

            homeScreen.classList.add(
                "hidden"
            );

        }


        if (game) {

            game.classList.remove(
                "hidden"
            );

        }


        if (player) {

            player.visible = true;

        }


        showMessage(
            "Welcome " +
            playerName +
            "!"
        );

    }


    if (startGameBtn) {

        startGameBtn.addEventListener(
            "click",
            startFromHome
        );

    }


    if (playerNameInput) {

        playerNameInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    startFromHome();

                }

            }
        );

    }


    /* =====================================================
       ESC = CLOSE PANELS
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (inventoryPanel) {

                inventoryPanel.classList.add(
                    "hidden"
                );

            }


            if (craftingPanel) {

                craftingPanel.classList.add(
                    "hidden"
                );

            }

        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    function onResize() {

        if (!camera || !renderer) {
            return;
        }


        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }

function loadNearbyChunks() {

    if (!player) return;

    const chunkX =
        Math.floor(
            player.position.x / CHUNK_SIZE
        );

    const chunkZ =
        Math.floor(
            player.position.z / CHUNK_SIZE
        );

    const renderDistance = 2;


    for (
        let cx = chunkX - renderDistance;
        cx <= chunkX + renderDistance;
        cx++
    ) {

        for (
            let cz = chunkZ - renderDistance;
            cz <= chunkZ + renderDistance;
            cz++
        ) {

            generateChunk(cx, cz);

        }

    }

}


    /* =====================================================
       GAME LOOP
       ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        if (!clock) return;


        const delta =
            Math.min(
                clock.getDelta(),
                0.05
            );


        updatePlayer(delta);
       loadNearbyChunks();

        updateSurvival(delta);


        if (renderer && scene && camera) {

            renderer.render(
                scene,
                camera
            );

        }

    }


    /* =====================================================
       LOADING -> HOME
       ===================================================== */

    if (loadingScreen) {

        loadingScreen.classList.remove(
            "hidden"
        );

    }


    if (homeScreen) {

        homeScreen.classList.add(
            "hidden"
        );

    }


    if (game) {

        game.classList.add(
            "hidden"
        );

    }


    setTimeout(
        function () {

            if (loadingScreen) {

                loadingScreen.classList.add(
                    "hidden"
                );

            }


            if (homeScreen) {

                homeScreen.classList.remove(
                    "hidden"
                );

            }

        },
        1500
    );
/* =====================================================
   LOADING -> HOME
   ===================================================== */

if (loadingScreen) {
    loadingScreen.classList.remove("hidden");
}

if (homeScreen) {
    homeScreen.classList.add("hidden");
}

if (game) {
    game.classList.add("hidden");
}

setTimeout(function () {

    if (loadingScreen) {
        loadingScreen.classList.add("hidden");
    }

    if (homeScreen) {
        homeScreen.classList.remove("hidden");
    }

}, 1500);

}
