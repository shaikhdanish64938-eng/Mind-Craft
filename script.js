/* global THREE */

/* =========================================================
   MIND CRAFT / BLOCK WORLD
   COMPLETE SCRIPT - MATCHED WITH CURRENT index.html
   ========================================================= */


/* =========================================================
   LOAD THREE.JS
   ========================================================= */

const threeScript = document.createElement("script");

threeScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

threeScript.onload = startGame;

threeScript.onerror = function () {
    console.error("Three.js failed to load.");
};

document.head.appendChild(threeScript);


/* =========================================================
   MAIN GAME
   ========================================================= */

function startGame() {

    console.log("Mind Craft JavaScript loaded.");


    /* =====================================================
       EXACT HTML ELEMENTS
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

    const startGameBtn =
        document.getElementById("startGameBtn");

    const selectedKitName =
        document.getElementById("selectedKitName");

    const profileName =
        document.getElementById("profileName");

    const playerNameHud =
        document.getElementById("playerNameHud");

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

    const health =
        document.getElementById("health");

    const hunger =
        document.getElementById("hunger");

    const message =
        document.getElementById("message");

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


    /* =====================================================
       CHECK IMPORTANT BUTTONS
       ===================================================== */

    console.log(
        "PLAY BUTTON:",
        startGameBtn
    );

    console.log(
        "HOME SCREEN:",
        homeScreen
    );

    console.log(
        "GAME:",
        game
    );


    /* =====================================================
       PLAYER NAME
       ===================================================== */

    let playerName =
        localStorage.getItem(
            "mindCraftPlayerName"
        ) || "Player";


    if (playerNameInput) {

        playerNameInput.value =
            playerName;
    }


    function updatePlayerName() {

        if (!playerNameInput) {
            return;
        }


        const value =
            playerNameInput.value.trim();


        if (value.length > 0) {

            playerName =
                value;
        }


        localStorage.setItem(
            "mindCraftPlayerName",
            playerName
        );


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
    }


    if (playerNameInput) {

        playerNameInput.addEventListener(
            "input",
            updatePlayerName
        );
    }


    updatePlayerName();


    /* =====================================================
       HOME TOAST
       ===================================================== */

    let toastTimer = null;


    function showHomeToast(text) {

        if (!homeToast) {
            return;
        }


        homeToast.textContent =
            text;


        homeToast.classList.remove(
            "hidden"
        );


        homeToast.style.display =
            "block";


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                function () {

                    homeToast.classList.add(
                        "hidden"
                    );

                    homeToast.style.display =
                        "none";

                },
                1600
            );
    }


    /* =====================================================
       HOME PANELS
       ===================================================== */

    const homePanels =
        document.querySelectorAll(
            ".home-subpanel"
        );


    function closeHomePanels() {

        homePanels.forEach(
            function (panel) {

                panel.classList.add(
                    "hidden"
                );

                panel.classList.remove(
                    "active"
                );
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

            console.error(
                "Panel not found:",
                panelId
            );

            return;
        }


        panel.classList.remove(
            "hidden"
        );

        panel.classList.add(
            "active"
        );
    }


    document.querySelectorAll(
        "[data-home-panel]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const panelId =
                        button.dataset.homePanel;


                    openHomePanel(
                        panelId
                    );
                }
            );
        }
    );


    document.querySelectorAll(
        ".home-back"
    ).forEach(
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
       KIT SYSTEM
       ===================================================== */

    const kits = {

        starter: {

            name: "STARTER",

            items: {

                grass: 10,
                dirt: 10,
                wood: 4,
                stone: 4
            }
        },


        builder: {

            name: "BUILDER",

            items: {

                grass: 20,
                dirt: 20,
                stone: 20,
                wood: 10
            }
        },


        explorer: {

            name: "EXPLORER",

            items: {

                grass: 8,
                dirt: 8,
                stone: 15,
                wood: 12,
                coal: 6
            }
        }
    };


    let selectedKit =
        localStorage.getItem(
            "mindCraftKit"
        ) || "starter";


    function updateKitUI() {

        document.querySelectorAll(
            ".kit-option"
        ).forEach(
            function (option) {

                option.classList.remove(
                    "selected"
                );


                if (
                    option.dataset.kit ===
                    selectedKit
                ) {

                    option.classList.add(
                        "selected"
                    );
                }
            }
        );


        if (selectedKitName) {

            selectedKitName.textContent =
                kits[selectedKit]
                    ? kits[selectedKit].name
                    : "STARTER";
        }
    }


    document.querySelectorAll(
        ".kit-option"
    ).forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    const kit =
                        option.dataset.kit;


                    if (!kits[kit]) {
                        return;
                    }


                    selectedKit =
                        kit;


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
        }
    );


    document.querySelectorAll(
        ".kit-equip"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    updateKitUI();


                    showHomeToast(
                        kits[selectedKit].name +
                        " equipped"
                    );
                }
            );
        }
    );


    updateKitUI();


    /* =====================================================
       CLOTHES
       ===================================================== */

    let appearance = {

        head:
            localStorage.getItem(
                "mindCraftHead"
            ) || "none",

        shirt:
            localStorage.getItem(
                "mindCraftShirt"
            ) || "green",

        pants:
            localStorage.getItem(
                "mindCraftPants"
            ) || "blue",

        shoes:
            localStorage.getItem(
                "mindCraftShoes"
            ) || "white"
    };


    function updateClothesUI() {

        document.querySelectorAll(
            ".cloth-option"
        ).forEach(
            function (option) {

                const category =
                    option.dataset.category;

                const value =
                    option.dataset.value;


                option.classList.remove(
                    "selected"
                );


                if (
                    appearance[category] ===
                    value
                ) {

                    option.classList.add(
                        "selected"
                    );
                }
            }
        );


        updateClothesPreview();
    }


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

            if (
                appearance.head ===
                "cap"
            ) {

                previewHat.textContent =
                    "🧢";

            } else if (
                appearance.head ===
                "helmet"
            ) {

                previewHat.textContent =
                    "⛑️";

            } else {

                previewHat.textContent =
                    "🙂";
            }
        }


        if (previewShirt) {

            if (
                appearance.shirt ===
                "red"
            ) {

                previewShirt.textContent =
                    "🔴";

            } else if (
                appearance.shirt ===
                "blue"
            ) {

                previewShirt.textContent =
                    "🔵";

            } else {

                previewShirt.textContent =
                    "🟢";
            }
        }


        if (previewPants) {

            if (
                appearance.pants ===
                "black"
            ) {

                previewPants.textContent =
                    "⚫";

            } else if (
                appearance.pants ===
                "brown"
            ) {

                previewPants.textContent =
                    "🟤";

            } else {

                previewPants.textContent =
                    "🔵";
            }
        }


        if (previewShoes) {

            if (
                appearance.shoes ===
                "black"
            ) {

                previewShoes.textContent =
                    "⚫";

            } else {

                previewShoes.textContent =
                    "⚪";
            }
        }
    }


    document.querySelectorAll(
        ".cloth-option"
    ).forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    const category =
                        option.dataset.category;

                    const value =
                        option.dataset.value;


                    if (!category) {
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


                    if (player) {

                        applyAppearanceToPlayer();
                    }


                    showHomeToast(
                        "Clothes updated"
                    );
                }
            );
        }
    );


    updateClothesUI();


    /* =====================================================
       THREE.JS VARIABLES
       ===================================================== */

    let scene = null;

    let camera = null;

    let renderer = null;

    let player = null;

    let gameStarted = false;

    let gameInitialized = false;


    /* =====================================================
       WORLD
       ===================================================== */

    const worldGroup =
        new THREE.Group();


    const blockMap =
        new Map();


    const generatedChunks =
        new Set();


    const CHUNK_SIZE = 16;

    const RENDER_DISTANCE = 4;


    /* =====================================================
       BLOCK COLORS
       ===================================================== */

    const blockColors = {

        grass: 0x4caf50,

        dirt: 0x795548,

        stone: 0x777777,

        wood: 0x8d5a32,

        leaves: 0x2e7d32,

        coal: 0x181818,

        craftingTable: 0x9b5a32
    };


    /* =====================================================
       INVENTORY
       ===================================================== */

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
       HOTBAR
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


    let selectedHotbarSlot = 0;


    /* =====================================================
       PLAYER STATE
       ===================================================== */

    let healthValue = 100;

    let hungerValue = 100;

    let verticalVelocity = 0;

    let onGround = false;

    let yaw = 0;

    let pitch = 0;

    let mouseLocked = false;

    let survivalTimer = 0;

    let messageTimer = null;

    let lastChunkX = null;

    let lastChunkZ = null;


    const keys = {};


    /* =====================================================
       PLAYER BODY PARTS
       ===================================================== */

    let playerHead = null;

    let playerBody = null;

    let playerLeftLeg = null;

    let playerRightLeg = null;

    let playerHat = null;

    let playerLeftShoe = null;

    let playerRightShoe = null;


    /* =====================================================
       TERRAIN
       ===================================================== */

    function getTerrainHeight(
        x,
        z
    ) {

        let height =
            1 +
            Math.floor(
                Math.sin(
                    x * 0.15
                ) * 1.5 +
                Math.cos(
                    z * 0.15
                ) * 1.5
            );


        return Math.max(
            0,
            Math.min(
                4,
                height
            )
        );
    }


    /* =====================================================
       BLOCK KEY
       ===================================================== */

    function getBlockKey(
        x,
        y,
        z
    ) {

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
            getBlockKey(
                x,
                y,
                z
            );


        if (
            blockMap.has(key)
        ) {

            return blockMap.get(key);
        }


        const geometry =
            new THREE.BoxGeometry(
                1,
                1,
                1
            );


        const material =
            new THREE.MeshLambertMaterial({

                color:
                    blockColors[type] ||
                    0xffffff
            });


        const block =
            new THREE.Mesh(
                geometry,
                material
            );


        block.position.set(
            x,
            y,
            z
        );


        block.userData.blockType =
            type;

        block.userData.blockX =
            x;

        block.userData.blockY =
            y;

        block.userData.blockZ =
            z;


        worldGroup.add(
            block
        );


        blockMap.set(
            key,
            block
        );


        return block;
    }


    /* =====================================================
       REMOVE BLOCK
       ===================================================== */

    function removeBlock(
        block
    ) {

        if (!block) {
            return;
        }


        const type =
            block.userData.blockType;

        const x =
            block.userData.blockX;

        const y =
            block.userData.blockY;

        const z =
            block.userData.blockZ;


        const key =
            getBlockKey(
                x,
                y,
                z
            );


        blockMap.delete(
            key
        );


        worldGroup.remove(
            block
        );


        if (block.geometry) {

            block.geometry.dispose();
        }


        if (block.material) {

            block.material.dispose();
        }


        if (
            inventory[type] ===
            undefined
        ) {

            inventory[type] = 0;
        }


        inventory[type]++;


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
                        Math.abs(lz) <=
                        3
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


                    const coalNoise =
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
                        coalNoise < 0.09
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


                const treeNoise =
                    (
                        Math.sin(
                            x * 12.73 +
                            z * 8.31
                        ) + 1
                    ) / 2;


                if (
                    treeNoise < 0.045 &&
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
       INITIAL WORLD
       ===================================================== */

    function generateWorld() {

        for (
            let cx =
                -RENDER_DISTANCE;

            cx <=
                RENDER_DISTANCE;

            cx++
        ) {

            for (
                let cz =
                    -RENDER_DISTANCE;

                cz <=
                    RENDER_DISTANCE;

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

        if (!player) {
            return;
        }


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


        if (
            chunkX === lastChunkX &&
            chunkZ === lastChunkZ
        ) {

            return;
        }


        lastChunkX =
            chunkX;

        lastChunkZ =
            chunkZ;


        for (
            let cx =
                chunkX - 2;

            cx <=
                chunkX + 2;

            cx++
        ) {

            for (
                let cz =
                    chunkZ - 2;

                cz <=
                    chunkZ + 2;

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

                color: 0x2e7d32
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


        /* LEGS */

        const legGeometry =
            new THREE.BoxGeometry(
                0.32,
                0.75,
                0.4
            );


        playerLeftLeg =
            new THREE.Mesh(
                legGeometry,
                new THREE.MeshLambertMaterial({
                    color: 0x1565c0
                })
            );


        playerLeftLeg.position.set(
            -0.2,
            -0.3,
            0
        );


        player.add(
            playerLeftLeg
        );


        playerRightLeg =
            new THREE.Mesh(
                legGeometry,
                new THREE.MeshLambertMaterial({
                    color: 0x1565c0
                })
            );


        playerRightLeg.position.set(
            0.2,
            -0.3,
            0
        );


        player.add(
            playerRightLeg
        );


        /* HAT */

        const hatGeometry =
            new THREE.BoxGeometry(
                0.82,
                0.2,
                0.82
            );


        playerHat =
            new THREE.Mesh(
                hatGeometry,
                new THREE.MeshLambertMaterial({
                    color: 0x222222
                })
            );


        playerHat.position.y =
            1.78;


        player.add(
            playerHat
        );


        /* SHOES */

        const shoeGeometry =
            new THREE.BoxGeometry(
                0.36,
                0.18,
                0.48
            );


        playerLeftShoe =
            new THREE.Mesh(
                shoeGeometry,
                new THREE.MeshLambertMaterial({
                    color: 0xffffff
                })
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
                new THREE.MeshLambertMaterial({
                    color: 0xffffff
                })
            );


        playerRightShoe.position.set(
            0.2,
            -0.72,
            -0.04
        );


        player.add(
            playerRightShoe
        );


        player.position.set(
            0,
            getTerrainHeight(
                0,
                0
            ) + 1.03,
            0
        );


        scene.add(
            player
        );


        applyAppearanceToPlayer();
    }


    /* =====================================================
       APPLY PLAYER CLOTHES
       ===================================================== */

    function applyAppearanceToPlayer() {

        if (!player) {
            return;
        }


        /* SHIRT */

        if (playerBody) {

            let color =
                0x2e7d32;


            if (
                appearance.shirt ===
                "blue"
            ) {

                color =
                    0x1565c0;

            } else if (
                appearance.shirt ===
                "red"
            ) {

                color =
                    0xc62828;
            }


            playerBody.material.color.setHex(
                color
            );
        }


        /* PANTS */

        if (
            playerLeftLeg &&
            playerRightLeg
        ) {

            let color =
                0x1565c0;


            if (
                appearance.pants ===
                "black"
            ) {

                color =
                    0x151515;

            } else if (
                appearance.pants ===
                "brown"
            ) {

                color =
                    0x6d4c41;
            }


            playerLeftLeg.material.color.setHex(
                color
            );

            playerRightLeg.material.color.setHex(
                color
            );
        }


        /* SHOES */

        if (
            playerLeftShoe &&
            playerRightShoe
        ) {

            const color =
                appearance.shoes ===
                "black"
                    ? 0x111111
                    : 0xffffff;


            playerLeftShoe.material.color.setHex(
                color
            );

            playerRightShoe.material.color.setHex(
                color
            );
        }


        /* HAT */

        if (playerHat) {

            playerHat.visible =
                appearance.head !==
                "none";


            if (
                appearance.head ===
                "cap"
            ) {

                playerHat.material.color.setHex(
                    0x1565c0
                );

            } else if (
                appearance.head ===
                "helmet"
            ) {

                playerHat.material.color.setHex(
                    0x9e9e9e
                );
            }
        }
    }


    /* =====================================================
       APPLY KIT
       ===================================================== */

    function applySelectedKit() {

        const kit =
            kits[selectedKit];


        if (!kit) {
            return;
        }


        Object.keys(
            kit.items
        ).forEach(
            function (item) {

                if (
                    inventory[item] ===
                    undefined
                ) {

                    inventory[item] =
                        0;
                }


                inventory[item] +=
                    kit.items[item];
            }
        );


        updateInventory();


        showMessage(
            kit.name +
            " ready"
        );
    }


    /* =====================================================
       SCENE
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
                30,
                150
            );


        const ambient =
            new THREE.HemisphereLight(
                0xb8e7ff,
                0x334422,
                1.2
            );


        scene.add(
            ambient
        );


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                1.2
            );


        sun.position.set(
            40,
            80,
            30
        );


        scene.add(
            sun
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

        if (!renderer) {
            return;
        }


        renderer.domElement.addEventListener(
            "click",
            function () {

                if (
                    document.pointerLockElement !==
                    renderer.domElement
                ) {

                    renderer.domElement
                        .requestPointerLock()
                        .catch(
                            function () {}
                        );
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


                const limit =
                    Math.PI /
                    2 -
                    0.08;


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


        renderer.domElement.addEventListener(
            "mousedown",
            function (event) {

                if (!gameStarted) {
                    return;
                }


                if (
                    event.button ===
                    0
                ) {

                    mineBlock();
                }


                if (
                    event.button ===
                    2
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
       KEYBOARD CONTROLS
       ===================================================== */

    function setupControls() {

        document.addEventListener(
            "keydown",
            function (event) {

                const key =
                    event.key.toLowerCase();


                keys[key] =
                    true;


                if (
                    event.code ===
                    "Space"
                ) {

                    event.preventDefault();

                    jump();
                }


                if (
                    key === "e"
                ) {

                    toggleInventory();
                }


                if (
                    key === "c"
                ) {

                    toggleCrafting();
                }


                if (
                    event.key >= "1" &&
                    event.key <= "9"
                ) {

                    selectedHotbarSlot =
                        Number(
                            event.key
                        ) - 1;


                    updateHotbar();
                }
            }
        );


        document.addEventListener(
            "keyup",
            function (event) {

                keys[
                    event.key.toLowerCase()
                ] =
                    false;
            }
        );
    }


    /* =====================================================
       JUMP
       ===================================================== */

    function jump() {

        if (!gameStarted) {
            return;
        }


        if (!onGround) {
            return;
        }


        verticalVelocity =
            7.5;


        onGround =
            false;
    }


    /* =====================================================
       PLAYER MOVEMENT
       ===================================================== */

    function updatePlayer(
        delta
    ) {

        if (!player) {
            return;
        }


        let forward = 0;

        let right = 0;


        if (
            keys.w ||
            keys.arrowup
        ) {

            forward++;
        }


        if (
            keys.s ||
            keys.arrowdown
        ) {

            forward--;
        }


        if (
            keys.d ||
            keys.arrowright
        ) {

            right++;
        }


        if (
            keys.a ||
            keys.arrowleft
        ) {

            right--;
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


            const speed =
                keys.shift
                    ? 7
                    : 4.2;


            const sin =
                Math.sin(yaw);

            const cos =
                Math.cos(yaw);


            player.position.x +=
                (
                    right * cos +
                    forward * sin
                ) *
                speed *
                delta;


            player.position.z +=
                (
                    right * sin -
                    forward * cos
                ) *
                speed *
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
       RAYCASTER
       ===================================================== */

    const raycaster =
        new THREE.Raycaster();


    /* =====================================================
       MINE
       ===================================================== */

    function mineBlock() {

        if (!camera) {
            return;
        }


        raycaster.setFromCamera(
            new THREE.Vector2(
                0,
                0
            ),
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
       PLACE
       ===================================================== */

    function placeBlock() {

        if (!camera) {
            return;
        }


        const type =
            getSelectedBlock();


        if (!type) {
            return;
        }


        if (
            !inventory[type] ||
            inventory[type] <= 0
        ) {

            showMessage(
                "No " +
                type
            );

            return;
        }


        raycaster.setFromCamera(
            new THREE.Vector2(
                0,
                0
            ),
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


        /* PLAYER COLLISION */

        if (
            Math.abs(
                x -
                player.position.x
            ) < 1 &&
            Math.abs(
                y -
                player.position.y
            ) < 2 &&
            Math.abs(
                z -
                player.position.z
            ) < 1
        ) {

            showMessage(
                "Too close"
            );

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


        showMessage(
            "Placed " +
            type
        );
    }


    /* =====================================================
       SELECTED BLOCK
       ===================================================== */

    function getSelectedBlock() {

        return hotbarItems[
            selectedHotbarSlot
        ];
    }


    /* =====================================================
       HOTBAR UPDATE
       ===================================================== */

    function updateHotbar() {

        const slots =
            document.querySelectorAll(
                ".hotbar-slot"
            );


        slots.forEach(
            function (
                slot,
                index
            ) {

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


                const count =
                    inventory[item] ||
                    0;


                const oldCount =
                    slot.querySelector(
                        ".hotbar-count"
                    );


                if (oldCount) {

                    oldCount.remove();
                }


                const countElement =
                    document.createElement(
                        "b"
                    );


                countElement.className =
                    "hotbar-count";


                countElement.textContent =
                    count;


                slot.appendChild(
                    countElement
                );
            }
        );
    }


    document.querySelectorAll(
        ".hotbar-slot"
    ).forEach(
        function (
            slot,
            index
        ) {

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


        inventoryItems.innerHTML =
            "";


        Object.keys(
            inventory
        ).forEach(
            function (item) {

                const amount =
                    inventory[item] ||
                    0;


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
       CRAFTING RECIPES
       ===================================================== */

    const recipes = {

        planks: {

            name: "Planks",

            output: 4,

            ingredients: {

                wood: 1
            }
        },


        sticks: {

            name: "Sticks",

            output: 4,

            ingredients: {

                planks: 2
            }
        },


        craftingTable: {

            name: "Crafting Table",

            output: 1,

            ingredients: {

                planks: 4
            }
        },


        woodenPickaxe: {

            name: "Wooden Pickaxe",

            output: 1,

            ingredients: {

                planks: 3,

                sticks: 2
            }
        },


        stonePickaxe: {

            name: "Stone Pickaxe",

            output: 1,

            ingredients: {

                stone: 3,

                sticks: 2
            }
        }
    };


    /* =====================================================
       CRAFTING BUTTONS
       ===================================================== */

    document.querySelectorAll(
        ".craft-button"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const recipeName =
                        button.dataset.recipe;


                    craft(
                        recipeName
                    );
                }
            );
        }
    );


    function craft(
        recipeName
    ) {

        const recipe =
            recipes[
                recipeName
            ];


        if (!recipe) {
            return;
        }


        /* CHECK INGREDIENTS */

        const ingredients =
            recipe.ingredients;


        for (
            const item in ingredients
        ) {

            const needed =
                ingredients[item];


            const available =
                inventory[item] ||
                0;


            if (
                available <
                needed
            ) {

                showMessage(
                    "Need " +
                    needed +
                    " " +
                    item
                );

                return;
            }
        }


        /* REMOVE INGREDIENTS */

        for (
            const item in ingredients
        ) {

            inventory[item] -=
                ingredients[item];
        }


        /* ADD OUTPUT */

        if (
            inventory[recipeName] ===
            undefined
        ) {

            inventory[recipeName] =
                0;
        }


        inventory[recipeName] +=
            recipe.output;


        updateInventory();


        showMessage(
            "Crafted " +
            recipe.name
        );
    }


    /* =====================================================
       CRAFTING PANEL
       ===================================================== */

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


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    function setupMobileControls() {

        if (!mobileControls) {
            return;
        }


        const isTouchDevice =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;


        if (!isTouchDevice) {

            mobileControls.style.display =
                "none";

            return;
        }


        mobileControls.style.display =
            "block";


        /* JUMP */

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


        /* MINE */

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


        /* PLACE */

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


        /* JOYSTICK */

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
                        rect.width /
                        2;


                    const centerY =
                        rect.top +
                        rect.height /
                        2;


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
                        "px," +
                        dy +
                        "px)";


                    keys.a =
                        dx < -10;

                    keys.d =
                        dx > 10;

                    keys.w =
                        dy < -10;

                    keys.s =
                        dy > 10;

                },
                {
                    passive: false
                }
            );


            joystick.addEventListener(
                "touchend",
                function () {

                    keys.a =
                        false;

                    keys.d =
                        false;

                    keys.w =
                        false;

                    keys.s =
                        false;


                    joystickKnob.style.transform =
                        "translate(0,0)";
                }
            );
        }
    }


    setupMobileControls();


    /* =====================================================
       MOBILE LOOK
       ===================================================== */

    const lookArea =
        document.getElementById(
            "lookArea"
        );


    if (lookArea) {

        let lastTouchX = 0;

        let lastTouchY = 0;


        lookArea.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches.length
                ) {
                    return;
                }


                lastTouchX =
                    event.touches[0].clientX;


                lastTouchY =
                    event.touches[0].clientY;
            },
            {
                passive: true
            }
        );


        lookArea.addEventListener(
            "touchmove",
            function (event) {

                event.preventDefault();


                if (
                    !event.touches.length
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


                yaw -=
                    dx *
                    0.008;


                pitch -=
                    dy *
                    0.008;


                const limit =
                    Math.PI /
                    2 -
                    0.08;


                pitch =
                    Math.max(
                        -limit,
                        Math.min(
                            limit,
                            pitch
                        )
                    );


                lastTouchX =
                    touch.clientX;


                lastTouchY =
                    touch.clientY;

            },
            {
                passive: false
            }
        );
    }


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
    }


    function updateSurvivalUI() {

        if (health) {

            health.style.width =
                healthValue +
                "%";

            health.textContent =
                Math.round(
                    healthValue
                );
        }


        if (hunger) {

            hunger.style.width =
                hungerValue +
                "%";

            hunger.textContent =
                Math.round(
                    hungerValue
                );
        }
    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(
        text
    ) {

        if (!message) {
            return;
        }


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
       START GAME FUNCTION
       ===================================================== */

    function startPlaying() {

        console.log(
            "PLAY BUTTON CLICKED"
        );


        updatePlayerName();


        if (
            gameInitialized
        ) {

            if (homeScreen) {

                homeScreen.classList.add(
                    "hidden"
                );
            }


            if (game) {

                game.classList.remove(
                    "hidden"
                );

                game.style.display =
                    "block";
            }


            gameStarted =
                true;


            return;
        }


        /* CREATE GAME */

        createScene();

        createCamera();

        createRenderer();

        generateWorld();

        createPlayer();

        setupControls();

        setupMouseLook();

        applySelectedKit();

        updateInventory();

        updateHotbar();

        updateSurvivalUI();


        gameInitialized =
            true;

        gameStarted =
            true;


        /* HIDE HOME */

        if (homeScreen) {

            homeScreen.classList.add(
                "hidden"
            );

            homeScreen.style.display =
                "none";
        }


        /* SHOW GAME */

        if (game) {

            game.classList.remove(
                "hidden"
            );

            game.style.display =
                "block";
        }


        showMessage(
            "Welcome " +
            playerName
        );


        console.log(
            "GAME STARTED SUCCESSFULLY"
        );
    }


    /* =====================================================
       PLAY BUTTON
       ===================================================== */

    if (startGameBtn) {

        startGameBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                startPlaying();
            }
        );

    } else {

        console.error(
            "ERROR: startGameBtn NOT FOUND"
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
       ROTATE SCREEN
       ===================================================== */

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


                if (
                    screen.orientation &&
                    screen.orientation
                        .lock
                ) {

                    screen.orientation
                        .lock(
                            "landscape"
                        )
                        .catch(
                            function () {}
                        );
                }
            }
        );
    }


    /* =====================================================
       GAME LOOP
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


        if (
            renderer &&
            scene &&
            camera
        ) {

            renderer.render(
                scene,
                camera
            );
        }
    }


    /* =====================================================
       INITIAL UI
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

        homeScreen.style.display =
            "none";
    }


    if (game) {

        game.classList.add(
            "hidden"
        );

        game.style.display =
            "none";
    }


    /* =====================================================
       LOADING SCREEN -> HOME
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


            updatePlayerName();

            updateKitUI();

            updateClothesUI();


            console.log(
                "Loading complete -> Home Screen shown."
            );

        },
        1500
    );


    /* =====================================================
       FIRST UI UPDATE
       ===================================================== */

    updateInventory();

    updateHotbar();

    updateSurvivalUI();


    /* =====================================================
       START ANIMATION
       ===================================================== */

    animate();


    console.log(
        "Mind Craft initialization complete."
    );
}
