/* global THREE */

/* =========================================================
   MIND CRAFT - COMPLETE GAME SCRIPT
   ========================================================= */

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = startGame;

document.head.appendChild(threeScript);


/* =========================================================
   MAIN START
   ========================================================= */

function startGame() {

    let gameStarted = false;
    let gameInitialized = false;

    /* =====================================================
       HTML ELEMENTS
       ===================================================== */

    const loadingScreen =
        document.getElementById("loadingScreen");

    const homeScreen =
        document.getElementById("homeScreen");

    const game =
        document.getElementById("game");

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

    const inventoryPanel =
        document.getElementById("inventoryPanel");

    const craftingPanel =
        document.getElementById("craftingPanel");

    const inventoryItems =
        document.getElementById("inventoryItems");

    const craftingItems =
        document.getElementById("craftingItems");

    const closeInventory =
        document.getElementById("closeInventory");

    const closeCrafting =
        document.getElementById("closeCrafting");

    const mobileControls =
        document.getElementById("mobileControls");

    const joystick =
        document.getElementById("joystick");

    const joystickKnob =
        document.getElementById("joystickKnob");

    const jumpBtn =
        document.getElementById("jumpBtn");

    const mineBtn =
        document.getElementById("mineBtn");

    const placeBtn =
        document.getElementById("placeBtn");

    const inventoryBtn =
        document.getElementById("inventoryBtn");

    const craftingBtn =
        document.getElementById("craftingBtn");

    const rotateScreen =
        document.getElementById("rotateScreen");

    const health =
        document.getElementById("health");

    const hunger =
        document.getElementById("hunger");

    const message =
        document.getElementById("message");

    const pcHelp =
        document.getElementById("pcHelp");


    /* =====================================================
       HOME DATA
       ===================================================== */

    let playerName =
        localStorage.getItem("mindCraftPlayerName") ||
        "PLAYER";

    let selectedKit =
        localStorage.getItem("mindCraftKit") ||
        "starter";

    let appearance = {

        hat:
            localStorage.getItem("mindCraftHat") ||
            "none",

        shirt:
            localStorage.getItem("mindCraftShirt") ||
            "blue",

        pants:
            localStorage.getItem("mindCraftPants") ||
            "dark",

        shoes:
            localStorage.getItem("mindCraftShoes") ||
            "white"
    };


    /* =====================================================
       KITS
       ===================================================== */

    const kits = {

        starter: {

            name: "STARTER KIT",

            items: {

                grass: 10,
                dirt: 10,
                wood: 4,
                stone: 4
            }
        },

        builder: {

            name: "BUILDER KIT",

            items: {

                grass: 20,
                dirt: 20,
                stone: 20,
                wood: 10
            }
        },

        explorer: {

            name: "EXPLORER KIT",

            items: {

                grass: 8,
                dirt: 8,
                stone: 12,
                wood: 12,
                coal: 6
            }
        }
    };


    /* =====================================================
       UPDATE HOME
       ===================================================== */

    function updateHomeName() {

        if (!playerNameInput) return;

        const value =
            playerNameInput.value.trim();

        if (value.length > 0) {

            playerName = value;

        }

        if (homePlayerName) {

            homePlayerName.textContent =
                playerName;
        }

        if (profileName) {

            profileName.textContent =
                playerName;
        }

        if (playerNameHud) {

            playerNameHud.textContent =
                playerName;
        }

        localStorage.setItem(
            "mindCraftPlayerName",
            playerName
        );
    }


    if (playerNameInput) {

        playerNameInput.value =
            playerName;

        playerNameInput.addEventListener(
            "input",
            updateHomeName
        );
    }


    /* =====================================================
       HOME TOAST
       ===================================================== */

    function showHomeToast(text) {

        if (!homeToast) return;

        homeToast.textContent = text;

        homeToast.classList.remove("hidden");

        clearTimeout(
            showHomeToast.timer
        );

        showHomeToast.timer =
            setTimeout(function () {

                homeToast.classList.add("hidden");

            }, 1800);
    }


    /* =====================================================
       HOME PANELS
       ===================================================== */

    function closeHomePanels() {

        const panels = document.querySelectorAll(
            ".home-subpanel"
        );

        panels.forEach(function (panel) {

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

        button.addEventListener(
            "click",
            function () {

                openHomePanel(
                    button.dataset.homePanel
                );

            }
        );

    });


    document.querySelectorAll(
        ".home-back, .close-home"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            closeHomePanels
        );

    });


    /* =====================================================
       KIT SELECTION
       ===================================================== */

    const selectedKitName =
        document.getElementById("selectedKitName");


    function updateKitUI() {

        document.querySelectorAll(
            ".kit-option"
        ).forEach(function (option) {

            option.classList.remove("selected");

            if (
                option.dataset.kit ===
                selectedKit
            ) {

                option.classList.add("selected");

            }

        });

        if (selectedKitName) {

            selectedKitName.textContent =
                kits[selectedKit]
                    ? kits[selectedKit].name
                    : "STARTER KIT";
        }
    }


    document.querySelectorAll(
        ".kit-option"
    ).forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                const kit =
                    option.dataset.kit;

                if (!kits[kit]) return;

                selectedKit = kit;

                localStorage.setItem(
                    "mindCraftKit",
                    selectedKit
                );

                updateKitUI();

                showHomeToast(
                    kits[kit].name +
                    " selected"
                );
            }
        );

    });


    document.querySelectorAll(
        ".kit-equip"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const parent =
                    button.closest(".kit-option");

                if (!parent) return;

                const kit =
                    parent.dataset.kit;

                if (!kits[kit]) return;

                selectedKit = kit;

                localStorage.setItem(
                    "mindCraftKit",
                    selectedKit
                );

                updateKitUI();

                showHomeToast(
                    kits[kit].name +
                    " equipped"
                );
            }
        );

    });


    updateKitUI();


    /* =====================================================
       CLOTHES
       ===================================================== */

    function updateClothesUI() {

        document.querySelectorAll(
            ".cloth-option"
        ).forEach(function (option) {

            option.classList.remove("selected");

            const category =
                option.dataset.category;

            const value =
                option.dataset.value;

            if (
                appearance[category] ===
                value
            ) {

                option.classList.add(
                    "selected"
                );
            }
        });

        updateClothesPreview();
    }


    function updateClothesPreview() {

        const hat =
            document.getElementById("previewHat");

        const shirt =
            document.getElementById("previewShirt");

        const pants =
            document.getElementById("previewPants");

        const shoes =
            document.getElementById("previewShoes");


        if (hat) {

            hat.textContent =
                appearance.hat === "none"
                    ? "🙂"
                    : "🧢";
        }


        if (shirt) {

            shirt.textContent =
                appearance.shirt === "red"
                    ? "👕"
                    : appearance.shirt === "green"
                    ? "🟢"
                    : "🔵";
        }


        if (pants) {

            pants.textContent =
                appearance.pants === "light"
                    ? "👖"
                    : "🖤";
        }


        if (shoes) {

            shoes.textContent =
                appearance.shoes === "black"
                    ? "👞"
                    : "👟";
        }
    }


    document.querySelectorAll(
        ".cloth-option"
    ).forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                const category =
                    option.dataset.category;

                const value =
                    option.dataset.value;

                if (!category || !value) {
                    return;
                }

                appearance[category] =
                    value;

                localStorage.setItem(
                    "mindCraft" +
                    category.charAt(0).toUpperCase() +
                    category.slice(1),
                    value
                );

                updateClothesUI();

                showHomeToast(
                    "Clothes updated"
                );

                if (player) {

                    applyAppearanceToPlayer();

                }
            }
        );

    });


    updateClothesUI();


    /* =====================================================
       THREE.JS VARIABLES
       ===================================================== */

    let scene;
    let camera;
    let renderer;
    let player;

    let clock =
        new THREE.Clock();


    /* =====================================================
       WORLD VARIABLES
       ===================================================== */

    const CHUNK_SIZE = 16;

    const RENDER_DISTANCE = 5;

    const generatedChunks =
        new Set();

    const blockMap =
        new Map();

    const worldGroup =
        new THREE.Group();

    const raycaster =
        new THREE.Raycaster();

    const mouse =
        new THREE.Vector2();


    /* =====================================================
       BLOCK SETTINGS
       ===================================================== */

    const BLOCK_SIZE = 1;


    const blockColors = {

        grass: 0x4caf50,

        dirt: 0x795548,

        stone: 0x777777,

        wood: 0x8d5a32,

        leaves: 0x2e7d32,

        coal: 0x202020,

        craftingTable: 0xa66a3f
    };


    const inventory = {

        grass: 10,

        dirt: 10,

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
       GAME STATE
       ===================================================== */

    let healthValue = 100;

    let hungerValue = 100;

    let verticalVelocity = 0;

    let onGround = false;

    let canJump = true;

    let yaw = 0;

    let pitch = 0;

    let mouseLocked = false;

    let selectedHotbarSlot = 0;

    let lastChunkX = null;

    let lastChunkZ = null;

    let survivalTimer = 0;

    let messageTimer = 0;

    let kitApplied = false;


    /* =====================================================
       KEY STATE
       ===================================================== */

    const keys = {};


    /* =====================================================
       APPEARANCE PLAYER PARTS
       ===================================================== */

    let playerHead;
    let playerBody;
    let playerLeftLeg;
    let playerRightLeg;
    let playerHat;
    let playerLeftShoe;
    let playerRightShoe;


    /* =====================================================
       TERRAIN HEIGHT
       ===================================================== */

    function getTerrainHeight(x, z) {

        let height =
            1 +
            Math.floor(
                Math.sin(x * 0.15) * 1.5 +
                Math.cos(z * 0.15) * 1.5
            );

        return Math.max(
            0,
            Math.min(4, height)
        );
    }


    /* =====================================================
       BLOCK KEY
       ===================================================== */

    function getBlockKey(x, y, z) {

        return (
            x +
            "|" +
            y +
            "|" +
            z
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

        const key =
            getBlockKey(x, y, z);

        if (blockMap.has(key)) {

            return blockMap.get(key);
        }


        const geometry =
            new THREE.BoxGeometry(
                BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );


        const material =
            new THREE.MeshLambertMaterial({

                color:
                    blockColors[type] ||
                    0xffffff
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


        mesh.userData.blockType =
            type;

        mesh.userData.blockX =
            x;

        mesh.userData.blockY =
            y;

        mesh.userData.blockZ =
            z;


        worldGroup.add(mesh);

        blockMap.set(
            key,
            mesh
        );


        return mesh;
    }


    /* =====================================================
       REMOVE BLOCK
       ===================================================== */

    function removeBlock(mesh) {

        if (!mesh) return;


        const x =
            mesh.userData.blockX;

        const y =
            mesh.userData.blockY;

        const z =
            mesh.userData.blockZ;

        const type =
            mesh.userData.blockType;


        const key =
            getBlockKey(
                x,
                y,
                z
            );


        blockMap.delete(key);

        worldGroup.remove(mesh);


        if (mesh.geometry) {

            mesh.geometry.dispose();

        }

        if (mesh.material) {

            mesh.material.dispose();

        }


        if (
            inventory[type] !==
            undefined
        ) {

            inventory[type]++;

        } else {

            inventory[type] = 1;

        }


        updateInventory();

        showMessage(
            "+" +
            type
        );
    }


    /* =====================================================
       TREE
       ===================================================== */

    function createTree(
        x,
        y,
        z
    ) {

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            createBlock(
                "wood",
                x,
                y + i,
                z
            );
        }


        for (
            let lx = -2;
            lx <= 2;
            lx++
        ) {

            for (
                let lz = -2;
                lz <= 2;
                lz++
            ) {

                for (
                    let ly = 2;
                    ly <= 4;
                    ly++
                ) {

                    if (
                        Math.abs(lx) +
                        Math.abs(lz) <= 3
                    ) {

                        createBlock(
                            "leaves",
                            x + lx,
                            y + ly,
                            z + lz
                        );
                    }
                }
            }
        }
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
            "|" +
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

                const height =
                    getTerrainHeight(
                        x,
                        z
                    );


                for (
                    let y = 0;
                    y <= height;
                    y++
                ) {

                    let type =
                        "stone";


                    if (
                        y === height
                    ) {

                        type =
                            "grass";

                    } else if (
                        y >= height - 2
                    ) {

                        type =
                            "dirt";
                    }


                    const coalChance =
                        (
                            Math.sin(
                                x * 7.13 +
                                z * 3.71 +
                                y * 2.17
                            ) + 1
                        ) / 2;


                    if (
                        type === "stone" &&
                        y <= 1 &&
                        coalChance < 0.09
                    ) {

                        type =
                            "coal";
                    }


                    createBlock(
                        type,
                        x,
                        y,
                        z
                    );
                }


                const treeChance =
                    (
                        Math.sin(
                            x * 12.73 +
                            z * 8.31
                        ) + 1
                    ) / 2;


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


    /* =====================================================
       GENERATE INITIAL WORLD
       ===================================================== */

    function generateWorld() {

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
    }


    /* =====================================================
       LOAD NEARBY CHUNKS
       ===================================================== */

    function loadNearbyChunks() {

        if (!player) return;


        const currentChunkX =
            Math.floor(
                player.position.x /
                CHUNK_SIZE
            );

        const currentChunkZ =
            Math.floor(
                player.position.z /
                CHUNK_SIZE
            );


        if (
            currentChunkX ===
            lastChunkX &&
            currentChunkZ ===
            lastChunkZ
        ) {

            return;
        }


        lastChunkX =
            currentChunkX;

        lastChunkZ =
            currentChunkZ;


        for (
            let cx =
                currentChunkX -
                2;

            cx <=
                currentChunkX +
                2;

            cx++
        ) {

            for (
                let cz =
                    currentChunkZ -
                    2;

                cz <=
                    currentChunkZ +
                    2;

                cz++
            ) {

                generateChunk(
                    cx,
                    cz
                );
            }
        }
    }


    /* =====================================================
       CREATE PLAYER
       ===================================================== */

    function createPlayer() {

        player =
            new THREE.Group();


        /* HEAD */

        const headGeometry =
            new THREE.BoxGeometry(
                0.7,
                0.7,
                0.7
            );

        const headMaterial =
            new THREE.MeshLambertMaterial({
                color: 0xf1c7a8
            });

        playerHead =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );

        playerHead.position.y =
            1.35;

        player.add(
            playerHead
        );


        /* BODY */

        const bodyGeometry =
            new THREE.BoxGeometry(
                0.8,
                1,
                0.45
            );

        const bodyMaterial =
            new THREE.MeshLambertMaterial({
                color: 0x2874d0
            });

        playerBody =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        playerBody.position.y =
            0.55;

        player.add(
            playerBody
        );


        /* LEFT LEG */

        const legGeometry =
            new THREE.BoxGeometry(
                0.32,
                0.75,
                0.4
            );

        const legMaterial =
            new THREE.MeshLambertMaterial({
                color: 0x202020
            });


        playerLeftLeg =
            new THREE.Mesh(
                legGeometry,
                legMaterial
            );

        playerLeftLeg.position.set(
            -0.2,
            -0.3,
            0
        );

        player.add(
            playerLeftLeg
        );


        /* RIGHT LEG */

        playerRightLeg =
            new THREE.Mesh(
                legGeometry,
                legMaterial.clone()
            );

        playerRightLeg.position.set(
            0.2,
            -0.3,
            0
        );

        player.add(
            playerRightLeg
        );


        /* SHOES */

        const shoeGeometry =
            new THREE.BoxGeometry(
                0.36,
                0.18,
                0.48
            );

        const shoeMaterial =
            new THREE.MeshLambertMaterial({
                color: 0xffffff
            });


        playerLeftShoe =
            new THREE.Mesh(
                shoeGeometry,
                shoeMaterial
            );

        playerLeftShoe.position.set(
            -0.2,
            -0.72,
            -0.04
        );

        player.add(
            playerLeftShoe
        );


        playerRightShoe =
            new THREE.Mesh(
                shoeGeometry,
                shoeMaterial.clone()
            );

        playerRightShoe.position.set(
            0.2,
            -0.72,
            -0.04
        );

        player.add(
            playerRightShoe
        );


        /* HAT */

        const hatGeometry =
            new THREE.BoxGeometry(
                0.82,
                0.2,
                0.82
            );

        const hatMaterial =
            new THREE.MeshLambertMaterial({
                color: 0x222222
            });

        playerHat =
            new THREE.Mesh(
                hatGeometry,
                hatMaterial
            );

        playerHat.position.y =
            1.78;

        player.add(
            playerHat
        );


        player.position.set(
            0,
            getTerrainHeight(0, 0) + 1.03,
            0
        );


        scene.add(player);


        applyAppearanceToPlayer();
    }


    /* =====================================================
       APPLY CLOTHES
       ===================================================== */

    function applyAppearanceToPlayer() {

        if (!player) return;


        /* SHIRT */

        if (playerBody) {

            let shirtColor =
                0x2874d0;


            if (
                appearance.shirt ===
                "red"
            ) {

                shirtColor =
                    0xc62828;

            } else if (
                appearance.shirt ===
                "green"
            ) {

                shirtColor =
                    0x2e7d32;
            }


            playerBody.material.color.setHex(
                shirtColor
            );
        }


        /* PANTS */

        if (
            playerLeftLeg &&
            playerRightLeg
        ) {

            let pantsColor =
                0x202020;


            if (
                appearance.pants ===
                "light"
            ) {

                pantsColor =
                    0x9e9e9e;
            }


            playerLeftLeg.material.color.setHex(
                pantsColor
            );

            playerRightLeg.material.color.setHex(
                pantsColor
            );
        }


        /* SHOES */

        if (
            playerLeftShoe &&
            playerRightShoe
        ) {

            const shoeColor =
                appearance.shoes ===
                "black"
                    ? 0x111111
                    : 0xffffff;


            playerLeftShoe.material.color.setHex(
                shoeColor
            );

            playerRightShoe.material.color.setHex(
                shoeColor
            );
        }


        /* HAT */

        if (playerHat) {

            playerHat.visible =
                appearance.hat !==
                "none";
        }
    }


    /* =====================================================
       KIT APPLY
       ===================================================== */

    function applyKit() {

        if (kitApplied) return;

        const kit =
            kits[selectedKit];

        if (!kit) return;


        Object.keys(
            kit.items
        ).forEach(function (item) {

            if (
                inventory[item] ===
                undefined
            ) {

                inventory[item] = 0;
            }

            inventory[item] +=
                kit.items[item];

        });


        kitApplied = true;

        updateInventory();

        showMessage(
            kit.name +
            " ready"
        );
    }


    /* =====================================================
       CREATE SCENE
       ===================================================== */

    function createScene() {

        scene =
            new THREE.Scene();


        scene.background =
            new THREE.Color(
                0x07131b
            );


        scene.fog =
            new THREE.Fog(
                0x07131b,
                35,
                150
            );


        /* LIGHT */

        const ambientLight =
            new THREE.HemisphereLight(
                0x9bdcff,
                0x304020,
                1.15
            );

        scene.add(
            ambientLight
        );


        const directionalLight =
            new THREE.DirectionalLight(
                0xffffff,
                1.2
            );

        directionalLight.position.set(
            40,
            80,
            20
        );

        scene.add(
            directionalLight
        );


        scene.add(
            worldGroup
        );
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    function createCamera() {

        camera =
            new THREE.PerspectiveCamera(
                75,
                window.innerWidth /
                window.innerHeight,
                0.1,
                300
            );


        camera.position.set(
            0,
            4,
            5
        );
    }


    /* =====================================================
       RENDERER
       ===================================================== */

    function createRenderer() {

        renderer =
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


        if (game) {

            game.appendChild(
                renderer.domElement
            );
        }
    }


    /* =====================================================
       MOUSE LOOK
       ===================================================== */

    function setupMouseLook() {

        if (!renderer) return;


        renderer.domElement.addEventListener(
            "click",
            function () {

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
            function () {

                mouseLocked =
                    document.pointerLockElement ===
                    renderer.domElement;

            }
        );


        document.addEventListener(
            "mousemove",
            function (event) {

                if (!mouseLocked) {
                    return;
                }


                yaw -=
                    event.movementX *
                    0.0025;


                pitch -=
                    event.movementY *
                    0.0025;


                const maxPitch =
                    Math.PI / 2 -
                    0.08;


                pitch =
                    Math.max(
                        -maxPitch,
                        Math.min(
                            maxPitch,
                            pitch
                        )
                    );
            }
        );


        renderer.domElement.addEventListener(
            "mousedown",
            function (event) {

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


        renderer.domElement.addEventListener(
            "contextmenu",
            function (event) {

                event.preventDefault();

            }
        );
    }


    /* =====================================================
       CONTROLS
       ===================================================== */

    function setupControls() {

        document.addEventListener(
            "keydown",
            function (event) {

                keys[
                    event.key.toLowerCase()
                ] = true;


                if (
                    event.code ===
                    "Space"
                ) {

                    keys.space = true;

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

                    selectedHotbarSlot =
                        Number(event.key) - 1;

                    updateHotbar();
                }


                if (
                    event.key ===
                    "Shift"
                ) {

                    keys.shift = true;
                }
            }
        );


        document.addEventListener(
            "keyup",
            function (event) {

                keys[
                    event.key.toLowerCase()
                ] = false;


                if (
                    event.code ===
                    "Space"
                ) {

                    keys.space = false;
                }


                if (
                    event.key ===
                    "Shift"
                ) {

                    keys.shift = false;
                }
            }
        );
    }


    /* =====================================================
       JUMP
       ===================================================== */

    function jump() {

        if (!gameStarted) return;

        if (!onGround) return;

        if (!canJump) return;


        verticalVelocity =
            7.5;

        onGround =
            false;

        canJump =
            false;


        setTimeout(
            function () {

                canJump =
                    true;

            },
            180
        );
    }


    /* =====================================================
       PLAYER MOVEMENT
       ===================================================== */

    function updatePlayer(delta) {

        if (!player) return;


        const moveSpeed =
            keys.shift
                ? 7
                : 4.2;


        let forward = 0;

        let right = 0;


        if (
            keys.w ||
            keys.arrowup
        ) {

            forward += 1;
        }


        if (
            keys.s ||
            keys.arrowdown
        ) {

            forward -= 1;
        }


        if (
            keys.d ||
            keys.arrowright
        ) {

            right += 1;
        }


        if (
            keys.a ||
            keys.arrowleft
        ) {

            right -= 1;
        }


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


            const sin =
                Math.sin(yaw);

            const cos =
                Math.cos(yaw);


            player.position.x +=
                (
                    right * cos +
                    forward * sin
                ) *
                moveSpeed *
                delta;


            player.position.z +=
                (
                    right * sin -
                    forward * cos
                ) *
                moveSpeed *
                delta;
        }


        /* GRAVITY */

        verticalVelocity -=
            18 *
            delta;


        player.position.y +=
            verticalVelocity *
            delta;


        const px =
            Math.round(
                player.position.x
            );

        const pz =
            Math.round(
                player.position.z
            );


        const terrain =
            getTerrainHeight(
                px,
                pz
            );


        const groundY =
            terrain +
            1.03;


        if (
            player.position.y <=
            groundY
        ) {

            player.position.y =
                groundY;

            verticalVelocity =
                0;

            onGround =
                true;

        } else {

            onGround =
                false;
        }


        /* CAMERA */

        camera.position.x =
            player.position.x;

        camera.position.y =
            player.position.y +
            1.2;

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
       MINE BLOCK
       ===================================================== */

    function mineBlock() {

        if (!camera) return;


        raycaster.setFromCamera(
            new THREE.Vector2(0, 0),
            camera
        );


        const hits =
            raycaster.intersectObjects(
                worldGroup.children
            );


        if (!hits.length) {

            return;
        }


        const hit =
            hits[0];


        if (
            hit.distance >
            6
        ) {

            return;
        }


        removeBlock(
            hit.object
        );
    }


    /* =====================================================
       PLACE BLOCK
       ===================================================== */

    function placeBlock() {

        if (!camera) return;


        const item =
            getSelectedBlock();


        if (!item) {

            showMessage(
                "Select a block"
            );

            return;
        }


        if (
            !inventory[item] ||
            inventory[item] <= 0
        ) {

            showMessage(
                "Not enough " +
                item
            );

            return;
        }


        raycaster.setFromCamera(
            new THREE.Vector2(0, 0),
            camera
        );


        const hits =
            raycaster.intersectObjects(
                worldGroup.children
            );


        if (!hits.length) {
            return;
        }


        const hit =
            hits[0];


        if (
            hit.distance >
            6
        ) {

            return;
        }


        const normal =
            hit.face.normal.clone();


        const position =
            hit.object.position.clone();


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


        const key =
            getBlockKey(
                x,
                y,
                z
            );


        if (
            blockMap.has(key)
        ) {

            return;
        }


        /* DON'T PLACE INSIDE PLAYER */

        const dx =
            Math.abs(
                x -
                player.position.x
            );

        const dy =
            Math.abs(
                y -
                player.position.y
            );

        const dz =
            Math.abs(
                z -
                player.position.z
            );


        if (
            dx < 1 &&
            dy < 2 &&
            dz < 1
        ) {

            showMessage(
                "Too close"
            );

            return;
        }


        createBlock(
            item,
            x,
            y,
            z
        );


        inventory[item]--;

        updateInventory();

        showMessage(
            "Placed " +
            item
        );
    }


    /* =====================================================
       HOTBAR ITEMS
       ===================================================== */

    const hotbarItems = [

        "grass",

        "dirt",

        "stone",

        "wood",

        "leaves",

        "coal",

        "craftingTable",

        "planks",

        "sticks"
    ];


    function getSelectedBlock() {

        return hotbarItems[
            selectedHotbarSlot
        ];
    }


    /* =====================================================
       UPDATE HOTBAR
       ===================================================== */

    function updateHotbar() {

        const slots =
            document.querySelectorAll(
                ".hotbar-slot"
            );


        slots.forEach(
            function (slot, index) {

                slot.classList.remove(
                    "selected"
                );


                if (
                    index ===
                    selectedHotbarSlot
                ) {

                    slot.classList.add(
                        "selected"
                    );
                }


                const item =
                    hotbarItems[index];


                const amount =
                    inventory[item] ||
                    0;


                const count =
                    slot.querySelector(
                        ".count"
                    );


                if (count) {

                    count.textContent =
                        amount;
                }
            }
        );
    }


    document.querySelectorAll(
        ".hotbar-slot"
    ).forEach(
        function (slot, index) {

            slot.addEventListener(
                "click",
                function () {

                    selectedHotbarSlot =
                        index;

                    updateHotbar();

                }
            );
        }
    );


    /* =====================================================
       INVENTORY
       ===================================================== */

    function updateInventory() {

        if (!inventoryItems) {
            return;
        }


        inventoryItems.innerHTML = "";


        Object.keys(
            inventory
        ).forEach(
            function (item) {

                const amount =
                    inventory[item] || 0;


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "inventory-item";


                div.innerHTML =
                    "<span>" +
                    item +
                    "</span>" +
                    "<strong>" +
                    amount +
                    "</strong>";


                inventoryItems.appendChild(
                    div
                );
            }
        );


        updateHotbar();
    }


    function toggleInventory() {

        if (!inventoryPanel) {
            return;
        }


        if (
            inventoryPanel.classList.contains(
                "hidden"
            )
        ) {

            inventoryPanel.classList.remove(
                "hidden"
            );

            if (craftingPanel) {

                craftingPanel.classList.add(
                    "hidden"
                );
            }

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


    if (inventoryBtn) {

        inventoryBtn.addEventListener(
            "click",
            toggleInventory
        );
    }


    /* =====================================================
       CRAFTING
       ===================================================== */

    const recipes = {

        planks: {

            name: "4 Planks",

            output: 4,

            ingredient:
                "wood",

            amount: 1
        },

        sticks: {

            name: "4 Sticks",

            output: 4,

            ingredient:
                "planks",

            amount: 2
        },

        craftingTable: {

            name: "Crafting Table",

            output: 1,

            ingredient:
                "planks",

            amount: 4
        },

        woodenPickaxe: {

            name: "Wooden Pickaxe",

            output: 1,

            ingredient:
                "planks",

            amount: 3
        },

        stonePickaxe: {

            name: "Stone Pickaxe",

            output: 1,

            ingredient:
                "stone",

            amount: 3
        }
    };


    function setupCraftingUI() {

        if (!craftingItems) {
            return;
        }


        craftingItems.innerHTML = "";


        Object.keys(
            recipes
        ).forEach(
            function (recipeKey) {

                const recipe =
                    recipes[
                        recipeKey
                    ];


                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "craft-button";


                button.dataset.recipe =
                    recipeKey;


                button.textContent =
                    recipe.name;


                button.addEventListener(
                    "click",
                    function () {

                        craft(
                            recipeKey
                        );

                    }
                );


                craftingItems.appendChild(
                    button
                );
            }
        );
    }


    function craft(recipeKey) {

        const recipe =
            recipes[
                recipeKey
            ];


        if (!recipe) return;


        const ingredient =
            recipe.ingredient;


        if (
            !inventory[ingredient] ||
            inventory[ingredient] <
            recipe.amount
        ) {

            showMessage(
                "Need " +
                recipe.amount +
                " " +
                ingredient
            );

            return;
        }


        inventory[ingredient] -=
            recipe.amount;


        if (
            !inventory[recipeKey]
        ) {

            inventory[recipeKey] =
                0;
        }


        inventory[recipeKey] +=
            recipe.output;


        updateInventory();


        showMessage(
            "Crafted " +
            recipe.name
        );
    }


    function toggleCrafting() {

        if (!craftingPanel) {
            return;
        }


        if (
            craftingPanel.classList.contains(
                "hidden"
            )
        ) {

            craftingPanel.classList.remove(
                "hidden"
            );

            if (inventoryPanel) {

                inventoryPanel.classList.add(
                    "hidden"
                );
            }

        } else {

            craftingPanel.classList.add(
                "hidden"
            );
        }
    }


    if (closeCrafting) {

        closeCrafting.addEventListener(
            "click",
            function () {

                craftingPanel.classList.add(
                    "hidden"
                );

            }
        );
    }


    if (craftingBtn) {

        craftingBtn.addEventListener(
            "click",
            toggleCrafting
        );
    }


    setupCraftingUI();


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    function setupMobileControls() {

        if (!mobileControls) {
            return;
        }


        const isTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;


        if (!isTouch) {

            mobileControls.style.display =
                "none";

            return;
        }


        mobileControls.style.display =
            "block";


        if (jumpBtn) {

            jumpBtn.addEventListener(
                "touchstart",
                function (event) {

                    event.preventDefault();

                    jump();

                },
                {
                    passive: false
                }
            );
        }


        if (mineBtn) {

            mineBtn.addEventListener(
                "touchstart",
                function (event) {

                    event.preventDefault();

                    mineBlock();

                },
                {
                    passive: false
                }
            );
        }


        if (placeBtn) {

            placeBtn.addEventListener(
                "touchstart",
                function (event) {

                    event.preventDefault();

                    placeBlock();

                },
                {
                    passive: false
                }
            );
        }


        let joyX = 0;
        let joyY = 0;


        if (
            joystick &&
            joystickKnob
        ) {

            joystick.addEventListener(
                "touchmove",
                function (event) {

                    event.preventDefault();


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
                        rect.width /
                        2 -
                        20;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance >
                        max
                    ) {

                        dx =
                            dx /
                            distance *
                            max;

                        dy =
                            dy /
                            distance *
                            max;
                    }


                    joystickKnob.style.transform =
                        "translate(" +
                        dx +
                        "px, " +
                        dy +
                        "px)";


                    joyX =
                        dx / max;

                    joyY =
                        dy / max;


                    keys.d =
                        joyX > 0.2;

                    keys.a =
                        joyX < -0.2;

                    keys.w =
                        joyY < -0.2;

                    keys.s =
                        joyY > 0.2;

                },
                {
                    passive: false
                }
            );


            joystick.addEventListener(
                "touchend",
                function () {

                    joyX = 0;
                    joyY = 0;


                    keys.w = false;
                    keys.a = false;
                    keys.s = false;
                    keys.d = false;


                    joystickKnob.style.transform =
                        "translate(0, 0)";
                }
            );
        }


        if (rotateScreen) {

            rotateScreen.addEventListener(
                "click",
                function () {

                    if (
                        document.documentElement
                            .requestFullscreen
                    ) {

                        document.documentElement
                            .requestFullscreen()
                            .catch(
                                function () {}
                            );
                    }
                }
            );
        }
    }


    setupMobileControls();


    /* =====================================================
       SURVIVAL
       ===================================================== */

    function updateSurvival(
        delta
    ) {

        survivalTimer +=
            delta;


        if (
            survivalTimer <
            5
        ) {

            return;
        }


        survivalTimer =
            0;


        hungerValue =
            Math.max(
                0,
                hungerValue - 1
            );


        if (
            hungerValue <= 0
        ) {

            healthValue =
                Math.max(
                    0,
                    healthValue - 1
                );
        }


        updateSurvivalUI();


        if (
            healthValue <= 0
        ) {

            showMessage(
                "You need food and rest"
            );

            healthValue =
                100;

            hungerValue =
                100;
        }
    }


    function updateSurvivalUI() {

        if (health) {

            health.textContent =
                Math.max(
                    0,
                    Math.round(
                        healthValue
                    )
                );
        }


        if (hunger) {

            hunger.textContent =
                Math.max(
                    0,
                    Math.round(
                        hungerValue
                    )
                );
        }
    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(text) {

        if (!message) return;


        message.textContent =
            text;

        message.classList.remove(
            "hidden"
        );


        clearTimeout(
            messageTimer
        );


        messageTimer =
            setTimeout(
                function () {

                    message.classList.add(
                        "hidden"
                    );

                },
                1200
            );
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    function resizeGame() {

        if (
            !camera ||
            !renderer
        ) {

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


    window.addEventListener(
        "resize",
        resizeGame
    );


    /* =====================================================
       START GAME
       ===================================================== */

    function initializeGame() {

        if (gameInitialized) {
            return;
        }


        gameInitialized =
            true;


        createScene();

        createCamera();

        createRenderer();

        generateWorld();

        createPlayer();

        setupControls();

        setupMouseLook();

        applyKit();

        updateInventory();

        updateHotbar();

        updateSurvivalUI();

        resizeGame();


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


        gameStarted =
            true;


        showMessage(
            "Welcome " +
            playerName
        );
    }


    function startFromHome() {

        updateHomeName();


        if (
            !gameInitialized
        ) {

            initializeGame();

        } else {

            gameStarted =
                true;


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
        }
    }


    if (startGameBtn) {

        startGameBtn.addEventListener(
            "click",
            startFromHome
        );
    }


    /* =====================================================
       GAME LOOP
       ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        const delta =
            Math.min(
                clock.getDelta(),
                0.05
            );


        if (
            gameStarted &&
            gameInitialized
        ) {

            updatePlayer(
                delta
            );


            loadNearbyChunks();


            updateSurvival(
                delta
            );
        }


        if (renderer && scene && camera) {

            renderer.render(
                scene,
                camera
            );
        }
    }


    /* =====================================================
       LOADING SCREEN
       ===================================================== */

    if (loadingScreen) {

        loadingScreen.classList.remove(
            "hidden"
        );

        loadingScreen.style.display =
            "flex";
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


    /* =====================================================
       LOADING -> HOME
       ===================================================== */

    setTimeout(
        function () {

            if (loadingScreen) {

                loadingScreen.classList.add(
                    "hidden"
                );

                loadingScreen.style.display =
                    "none";
            }


            if (homeScreen) {

                homeScreen.classList.remove(
                    "hidden"
                );

                homeScreen.style.display =
                    "flex";
            }


            updateHomeName();

            updateKitUI();

            updateClothesUI();

            console.log(
                "Mind Craft loaded successfully."
            );

        },
        1500
    );


    /* =====================================================
       INITIAL UI
       ===================================================== */

    updateHomeName();

    updateKitUI();

    updateClothesUI();

    updateInventory();

    updateSurvivalUI();

    animate();
}
