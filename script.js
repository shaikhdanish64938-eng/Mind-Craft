/* global THREE */

"use strict";

/* =========================================================
   MIND CRAFT / BLOCK WORLD
   SAFE + OPTIMIZED VERSION
   ========================================================= */

/* =========================================================
   DOM
   ========================================================= */

const loadingScreen = document.getElementById("loadingScreen");
const homeScreen = document.getElementById("homeScreen");
const game = document.getElementById("game");

const playerNameInput = document.getElementById("playerNameInput");
const homePlayerName = document.getElementById("homePlayerName");
const profileName = document.getElementById("profileName");
const playerNameHud = document.getElementById("playerNameHud");

const startGameBtn = document.getElementById("startGameBtn");
const selectedKitName = document.getElementById("selectedKitName");
const homeToast = document.getElementById("homeToast");

const inventoryPanel = document.getElementById("inventoryPanel");
const craftingPanel = document.getElementById("craftingPanel");
const inventoryItems = document.getElementById("inventoryItems");

const closeInventory = document.getElementById("closeInventory");
const closeCrafting = document.getElementById("closeCrafting");

const health = document.getElementById("health");
const hunger = document.getElementById("hunger");
const message = document.getElementById("message");

const mobileControls = document.getElementById("mobileControls");
const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystickKnob");
const lookArea = document.getElementById("lookArea");

const jumpBtn = document.getElementById("jumpBtn");
const mineBtn = document.getElementById("mineBtn");
const placeBtn = document.getElementById("placeBtn");
const inventoryBtn = document.getElementById("inventoryBtn");
const craftingBtn = document.getElementById("craftingBtn");

const rotateScreen = document.getElementById("rotateScreen");

/* =========================================================
   THREE VARIABLES
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;
let player = null;
let worldGroup = null;

let raycaster = null;
let clock = null;

let blockGeometry = null;
const blockMaterials = {};

let gameStarted = false;
let gameInitialized = false;
let threeReady = false;

/* =========================================================
   WORLD SETTINGS
   ========================================================= */

const CHUNK_SIZE = 16;

const PC_RENDER_DISTANCE = 2;
const MOBILE_RENDER_DISTANCE = 1;

const CHUNKS_PER_FRAME = 1;

const WORLD_FOG_NEAR = 25;
const WORLD_FOG_FAR = 75;

/* =========================================================
   CHUNK DATA
   ========================================================= */

const chunks = new Map();
const chunkQueue = [];

let lastPlayerChunkX = null;
let lastPlayerChunkZ = null;

/* =========================================================
   BLOCK DATA
   ========================================================= */

const blockColors = {
    grass: 0x4caf50,
    dirt: 0x795548,
    stone: 0x777777,
    wood: 0x8d5a32,
    leaves: 0x2e7d32,
    coal: 0x151515,
    craftingTable: 0x9b5a32
};

/* =========================================================
   BLOCK MAP
   ========================================================= */

const blockMap = new Map();

/* =========================================================
   WORLD EDITS
   ========================================================= */

const removedBlocks = new Set();
const placedBlocks = new Map();

/* =========================================================
   INVENTORY
   ========================================================= */

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

/* =========================================================
   HOTBAR
   ========================================================= */

const hotbarItems = [
    "grass",
    "dirt",
    "stone",
    "wood",
    "leaves",
    "coal",
    "craftingTable",
    "woodenPickaxe",
    "stonePickaxe"
];

let selectedHotbarSlot = 0;

/* =========================================================
   PLAYER STATE
   ========================================================= */

let healthValue = 100;
let hungerValue = 100;

let verticalVelocity = 0;
let onGround = false;

let yaw = 0;
let pitch = 0;

let mouseLocked = false;

let survivalTimer = 0;
let messageTimer = null;

const keys = {};

let mobileMoveX = 0;
let mobileMoveY = 0;

/* =========================================================
   PLAYER BODY
   ========================================================= */

let playerHead = null;
let playerBody = null;
let playerLeftLeg = null;
let playerRightLeg = null;
let playerHat = null;
let playerLeftShoe = null;
let playerRightShoe = null;

/* =========================================================
   PLAYER NAME
   ========================================================= */

let playerName =
    localStorage.getItem("mindCraftPlayerName") || "Player";

if (playerNameInput) {
    playerNameInput.value = playerName;
}

function updatePlayerName() {
    if (playerNameInput) {
        const value = playerNameInput.value.trim();

        if (value.length > 0) {
            playerName = value;
        }
    }

    localStorage.setItem(
        "mindCraftPlayerName",
        playerName
    );

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

if (playerNameInput) {
    playerNameInput.addEventListener(
        "input",
        updatePlayerName
    );
}

updatePlayerName();

/* =========================================================
   TOUCH DETECTION
   ========================================================= */

function isTouchDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showHomeToast(text) {
    if (!homeToast) return;

    homeToast.textContent = text;
    homeToast.classList.remove("hidden");
    homeToast.style.display = "block";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        homeToast.classList.add("hidden");
        homeToast.style.display = "none";
    }, 1600);
}

/* =========================================================
   HOME PANELS
   ========================================================= */

const homePanels =
    document.querySelectorAll(".home-subpanel");

function closeHomePanels() {
    homePanels.forEach(function (panel) {
        panel.classList.add("hidden");
        panel.classList.remove("active");
    });
}

function openHomePanel(panelId) {
    closeHomePanels();

    const panel = document.getElementById(panelId);

    if (!panel) return;

    panel.classList.remove("hidden");
    panel.classList.add("active");
}

document
    .querySelectorAll("[data-home-panel]")
    .forEach(function (button) {
        button.addEventListener("click", function () {
            openHomePanel(
                button.dataset.homePanel
            );
        });
    });

document
    .querySelectorAll(".home-back")
    .forEach(function (button) {
        button.addEventListener("click", function () {
            closeHomePanels();
        });
    });

/* =========================================================
   KITS
   ========================================================= */

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
    localStorage.getItem("mindCraftKit") || "starter";

function updateKitUI() {
    document
        .querySelectorAll(".kit-option")
        .forEach(function (option) {
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
                : "STARTER";
    }
}

document
    .querySelectorAll(".kit-option")
    .forEach(function (option) {
        option.addEventListener("click", function () {
            const kit = option.dataset.kit;

            if (!kits[kit]) return;

            selectedKit = kit;

            localStorage.setItem(
                "mindCraftKit",
                selectedKit
            );

            updateKitUI();

            showHomeToast(
                kits[kit].name + " selected"
            );
        });
    });

document
    .querySelectorAll(".kit-equip")
    .forEach(function (button) {
        button.addEventListener("click", function () {
            applySelectedKit();

            showHomeToast(
                kits[selectedKit].name +
                " equipped"
            );
        });
    });

updateKitUI();

/* =========================================================
   CLOTHES
   ========================================================= */

let appearance = {
    head:
        localStorage.getItem("mindCraftHead") ||
        "none",

    shirt:
        localStorage.getItem("mindCraftShirt") ||
        "green",

    pants:
        localStorage.getItem("mindCraftPants") ||
        "blue",

    shoes:
        localStorage.getItem("mindCraftShoes") ||
        "white"
};

function updateClothesPreview() {
    const previewHat =
        document.getElementById("previewHat");

    const previewShirt =
        document.getElementById("previewShirt");

    const previewPants =
        document.getElementById("previewPants");

    const previewShoes =
        document.getElementById("previewShoes");

    if (previewHat) {
        if (appearance.head === "cap") {
            previewHat.textContent = "🧢";
        } else if (
            appearance.head === "helmet"
        ) {
            previewHat.textContent = "⛑️";
        } else {
            previewHat.textContent = "🙂";
        }
    }

    if (previewShirt) {
        previewShirt.textContent =
            appearance.shirt === "red"
                ? "🔴"
                : appearance.shirt === "blue"
                    ? "🔵"
                    : "🟢";
    }

    if (previewPants) {
        previewPants.textContent =
            appearance.pants === "black"
                ? "⚫"
                : appearance.pants === "brown"
                    ? "🟤"
                    : "🔵";
    }

    if (previewShoes) {
        previewShoes.textContent =
            appearance.shoes === "black"
                ? "⚫"
                : "⚪";
    }
}

function updateClothesUI() {
    document
        .querySelectorAll(".cloth-option")
        .forEach(function (option) {
            option.classList.remove("selected");

            const category =
                option.dataset.category;

            const value =
                option.dataset.value;

            if (
                appearance[category] ===
                value
            ) {
                option.classList.add("selected");
            }
        });

    updateClothesPreview();
}

document
    .querySelectorAll(".cloth-option")
    .forEach(function (option) {
        option.addEventListener("click", function () {
            const category =
                option.dataset.category;

            const value =
                option.dataset.value;

            if (!category) return;

            appearance[category] = value;

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

            showHomeToast("Clothes updated");
        });
    });

updateClothesUI();

/* =========================================================
   TERRAIN
   ========================================================= */

function getTerrainHeight(x, z) {
    const value =
        Math.sin(x * 0.13) * 1.3 +
        Math.cos(z * 0.12) * 1.2 +
        Math.sin((x + z) * 0.05) * 1.1;

    return Math.max(
        1,
        Math.min(
            4,
            Math.floor(2 + value * 0.55)
        )
    );
}

/* =========================================================
   BLOCK KEY
   ========================================================= */

function getBlockKey(x, y, z) {
    return (
        x +
        "|" +
        y +
        "|" +
        z
    );
}

/* =========================================================
   CHUNK KEY
   ========================================================= */

function getChunkKey(x, z) {
    return x + "|" + z;
}

/* =========================================================
   CREATE BLOCK
   ========================================================= */

function createBlock(
    type,
    x,
    y,
    z,
    parentGroup
) {
    if (!threeReady || !THREE) {
        return null;
    }

    if (!parentGroup) {
        return null;
    }

    const key =
        getBlockKey(x, y, z);

    if (removedBlocks.has(key)) {
        return null;
    }

    if (blockMap.has(key)) {
        return blockMap.get(key);
    }

    const material =
        blockMaterials[type] ||
        blockMaterials.dirt;

    if (!material || !blockGeometry) {
        return null;
    }

    const block =
        new THREE.Mesh(
            blockGeometry,
            material
        );

    block.position.set(
        x,
        y,
        z
    );

    block.userData.blockType = type;
    block.userData.blockX = x;
    block.userData.blockY = y;
    block.userData.blockZ = z;

    parentGroup.add(block);

    blockMap.set(
        key,
        block
    );

    return block;
}

/* =========================================================
   REMOVE BLOCK
   ========================================================= */

function removeBlock(block) {
    if (!block) return;

    const type =
        block.userData.blockType;

    const x =
        block.userData.blockX;

    const y =
        block.userData.blockY;

    const z =
        block.userData.blockZ;

    const key =
        getBlockKey(x, y, z);

    removedBlocks.add(key);

    placedBlocks.delete(key);

    blockMap.delete(key);

    if (block.parent) {
        block.parent.remove(block);
    }

    if (
        inventory[type] === undefined
    ) {
        inventory[type] = 0;
    }

    inventory[type]++;

    updateInventory();

    showMessage(
        "+1 " + type
    );
}

/* =========================================================
   TREE
   ========================================================= */

function createTree(
    x,
    baseY,
    z,
    group
) {
    for (
        let i = 0;
        i < 3;
        i++
    ) {
        createBlock(
            "wood",
            x,
            baseY + i,
            z,
            group
        );
    }

    for (
        let lx = -1;
        lx <= 1;
        lx++
    ) {
        for (
            let lz = -1;
            lz <= 1;
            lz++
        ) {
            for (
                let ly = 2;
                ly <= 3;
                ly++
            ) {
                if (
                    Math.abs(lx) +
                    Math.abs(lz) <=
                    2
                ) {
                    createBlock(
                        "leaves",
                        x + lx,
                        baseY + ly,
                        z + lz,
                        group
                    );
                }
            }
        }
    }
}

/* =========================================================
   CHUNK GENERATION
   ========================================================= */

function generateChunk(
    chunkX,
    chunkZ
) {
    if (!threeReady || !worldGroup) {
        return;
    }

    const chunkKey =
        getChunkKey(
            chunkX,
            chunkZ
        );

    if (chunks.has(chunkKey)) {
        return;
    }

    const group =
        new THREE.Group();

    group.userData.chunkX = chunkX;
    group.userData.chunkZ = chunkZ;

    chunks.set(
        chunkKey,
        group
    );

    worldGroup.add(group);

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
                getTerrainHeight(
                    x,
                    z
                );

            for (
                let y = 0;
                y <= height;
                y++
            ) {
                let type = "stone";

                if (
                    y === height
                ) {
                    type = "grass";
                } else if (
                    y >= height - 2
                ) {
                    type = "dirt";
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
                    coalNoise < 0.075
                ) {
                    type = "coal";
                }

                createBlock(
                    type,
                    x,
                    y,
                    z,
                    group
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
                treeNoise < 0.018 &&
                Math.abs(x) > 3 &&
                Math.abs(z) > 3 &&
                height >= 2
            ) {
                createTree(
                    x,
                    height + 1,
                    z,
                    group
                );
            }
        }
    }

    /* =====================================================
       RECREATE PLAYER-PLACED BLOCKS IN THIS CHUNK
       ===================================================== */

    placedBlocks.forEach(
        function (data, key) {
            if (
                data.chunkKey ===
                chunkKey
            ) {
                createBlock(
                    data.type,
                    data.x,
                    data.y,
                    data.z,
                    group
                );
            }
        }
    );
}

/* =========================================================
   CHUNK QUEUE
   ========================================================= */

function queueNearbyChunks() {
    if (!player || !worldGroup) return;

    const mobile =
        isTouchDevice();

    const renderDistance =
        mobile
            ? MOBILE_RENDER_DISTANCE
            : PC_RENDER_DISTANCE;

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
        chunkX === lastPlayerChunkX &&
        chunkZ === lastPlayerChunkZ
    ) {
        return;
    }

    lastPlayerChunkX = chunkX;
    lastPlayerChunkZ = chunkZ;

    const wanted = [];

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
            const key =
                getChunkKey(
                    cx,
                    cz
                );

            if (!chunks.has(key)) {
                const distance =
                    Math.abs(
                        cx - chunkX
                    ) +
                    Math.abs(
                        cz - chunkZ
                    );

                wanted.push({
                    cx: cx,
                    cz: cz,
                    distance: distance
                });
            }
        }
    }

    wanted.sort(
        function (a, b) {
            return (
                a.distance -
                b.distance
            );
        }
    );

    wanted.forEach(
        function (item) {
            const exists =
                chunkQueue.some(
                    function (q) {
                        return (
                            q.cx === item.cx &&
                            q.cz === item.cz
                        );
                    }
                );

            if (!exists) {
                chunkQueue.push(item);
            }
        }
    );

    unloadFarChunks(
        chunkX,
        chunkZ,
        renderDistance + 2
    );
}

/* =========================================================
   PROCESS CHUNK QUEUE
   ========================================================= */

function processChunkQueue() {
    for (
        let i = 0;
        i < CHUNKS_PER_FRAME;
        i++
    ) {
        if (!chunkQueue.length) {
            break;
        }

        const item =
            chunkQueue.shift();

        generateChunk(
            item.cx,
            item.cz
        );
    }
}

/* =========================================================
   UNLOAD FAR CHUNKS
   ========================================================= */

function unloadFarChunks(
    centerX,
    centerZ,
    maxDistance
) {
    const removeList = [];

    chunks.forEach(
        function (group, key) {
            const cx =
                group.userData.chunkX;

            const cz =
                group.userData.chunkZ;

            const distance =
                Math.max(
                    Math.abs(
                        cx - centerX
                    ),
                    Math.abs(
                        cz - centerZ
                    )
                );

            if (
                distance >
                maxDistance
            ) {
                removeList.push({
                    key: key,
                    group: group
                });
            }
        }
    );

    removeList.forEach(
        function (item) {
            item.group.children.forEach(
                function (block) {
                    const key =
                        getBlockKey(
                            block.userData.blockX,
                            block.userData.blockY,
                            block.userData.blockZ
                        );

                    blockMap.delete(key);
                }
            );

            worldGroup.remove(
                item.group
            );

            chunks.delete(
                item.key
            );
        }
    );
}

/* =========================================================
   PLAYER
   ========================================================= */

function createPlayer() {
    if (!threeReady || !scene) return;

    player =
        new THREE.Group();

    /* HEAD */

    playerHead =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                0.7,
                0.7
            ),
            new THREE.MeshLambertMaterial({
                color: 0xf1c7a8
            })
        );

    playerHead.position.y =
        1.35;

    player.add(
        playerHead
    );

    /* BODY */

    playerBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.8,
                1,
                0.45
            ),
            new THREE.MeshLambertMaterial({
                color: 0x2e7d32
            })
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

    playerHat =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.82,
                0.2,
                0.82
            ),
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
        getTerrainHeight(0, 0) + 1.03,
        0
    );

    scene.add(
        player
    );

    applyAppearanceToPlayer();
}

/* =========================================================
   CLOTHES -> PLAYER
   ========================================================= */

function applyAppearanceToPlayer() {
    if (
        !player ||
        !playerBody ||
        !playerLeftLeg ||
        !playerRightLeg ||
        !playerLeftShoe ||
        !playerRightShoe ||
        !playerHat
    ) {
        return;
    }

    let shirtColor =
        0x2e7d32;

    if (
        appearance.shirt ===
        "blue"
    ) {
        shirtColor =
            0x1565c0;
    } else if (
        appearance.shirt ===
        "red"
    ) {
        shirtColor =
            0xc62828;
    }

    playerBody.material.color.setHex(
        shirtColor
    );

    let pantsColor =
        0x1565c0;

    if (
        appearance.pants ===
        "black"
    ) {
        pantsColor =
            0x151515;
    } else if (
        appearance.pants ===
        "brown"
    ) {
        pantsColor =
            0x6d4c41;
    }

    playerLeftLeg.material.color.setHex(
        pantsColor
    );

    playerRightLeg.material.color.setHex(
        pantsColor
    );

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
    }

    if (
        appearance.head ===
        "helmet"
    ) {
        playerHat.material.color.setHex(
            0x9e9e9e
        );
    }
}

/* =========================================================
   KIT
   ========================================================= */

function applySelectedKit() {
    const kit =
        kits[selectedKit];

    if (!kit) return;

    Object.keys(
        kit.items
    ).forEach(
        function (item) {
            if (
                inventory[item] ===
                undefined
            ) {
                inventory[item] = 0;
            }

            inventory[item] +=
                kit.items[item];
        }
    );

    updateInventory();

    if (gameStarted) {
        showMessage(
            kit.name +
            " ready"
        );
    }
}

/* =========================================================
   SCENE
   ========================================================= */

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
            WORLD_FOG_NEAR,
            WORLD_FOG_FAR
        );

    const ambient =
        new THREE.HemisphereLight(
            0xb8e7ff,
            0x334422,
            1.1
        );

    scene.add(
        ambient
    );

    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1.15
        );

    sun.position.set(
        40,
        70,
        30
    );

    scene.add(
        sun
    );

    worldGroup =
        new THREE.Group();

    scene.add(
        worldGroup
    );
}

/* =========================================================
   CAMERA
   ========================================================= */

function createCamera() {
    camera =
        new THREE.PerspectiveCamera(
            75,
            Math.max(
                1,
                window.innerWidth
            ) /
            Math.max(
                1,
                window.innerHeight
            ),
            0.1,
            150
        );

    camera.position.set(
        0,
        4,
        5
    );

    camera.rotation.order =
        "YXZ";
}

/* =========================================================
   RENDERER
   ========================================================= */

function createRenderer() {
    const mobile =
        isTouchDevice();

    try {
        renderer =
            new THREE.WebGLRenderer({
                antialias: !mobile,
                powerPreference: "high-performance"
            });
    } catch (error) {
        console.error(
            "WebGL renderer error:",
            error
        );

        showMessage(
            "Graphics could not start"
        );

        return false;
    }

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        mobile
            ? Math.min(
                window.devicePixelRatio || 1,
                1.15
            )
            : Math.min(
                window.devicePixelRatio || 1,
                1.35
            )
    );

    renderer.domElement.style.display =
        "block";

    renderer.domElement.style.width =
        "100%";

    renderer.domElement.style.height =
        "100%";

    renderer.domElement.style.touchAction =
        "none";

    if (game) {
        game.appendChild(
            renderer.domElement
        );
    }

    return true;
}

/* =========================================================
   THREE ASSETS
   ========================================================= */

function initializeThreeAssets() {
    if (!threeReady || !THREE) {
        return false;
    }

    blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );

    Object.keys(
        blockColors
    ).forEach(
        function (type) {
            blockMaterials[type] =
                new THREE.MeshLambertMaterial({
                    color:
                        blockColors[type]
                });
        }
    );

    raycaster =
        new THREE.Raycaster();

    clock =
        new THREE.Clock();

    return true;
}

/* =========================================================
   RAYCASTER
   ========================================================= */

function getTargetBlock() {
    if (
        !raycaster ||
        !camera ||
        !worldGroup
    ) {
        return null;
    }

    raycaster.setFromCamera(
        new THREE.Vector2(0, 0),
        camera
    );

    const hits =
        raycaster.intersectObjects(
            worldGroup.children,
            true
        );

    if (!hits.length) {
        return null;
    }

    for (
        let i = 0;
        i < hits.length;
        i++
    ) {
        const object =
            hits[i].object;

        if (
            object.userData &&
            object.userData.blockType
        ) {
            if (
                hits[i].distance <= 6
            ) {
                return hits[i];
            }
        }
    }

    return null;
}

/* =========================================================
   MINE
   ========================================================= */

function mineBlock() {
    if (!gameStarted) return;

    const hit =
        getTargetBlock();

    if (!hit) return;

    removeBlock(
        hit.object
    );
}

/* =========================================================
   PLACE
   ========================================================= */

function getSelectedBlock() {
    const type =
        hotbarItems[
            selectedHotbarSlot
        ];

    if (
        type ===
        "woodenPickaxe" ||
        type ===
        "stonePickaxe"
    ) {
        return null;
    }

    return type;
}

function placeBlock() {
    if (
        !gameStarted ||
        !player
    ) {
        return;
    }

    const type =
        getSelectedBlock();

    if (!type) {
        showMessage(
            "Select a block"
        );

        return;
    }

    if (
        !inventory[type] ||
        inventory[type] <= 0
    ) {
        showMessage(
            "No " + type
        );

        return;
    }

    const hit =
        getTargetBlock();

    if (!hit) return;

    const normal =
        hit.face.normal.clone();

    const target =
        hit.object.position.clone();

    target.add(
        normal
    );

    const x =
        Math.round(
            target.x
        );

    const y =
        Math.round(
            target.y
        );

    const z =
        Math.round(
            target.z
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

    if (
        Math.abs(
            x -
            player.position.x
        ) < 0.8 &&
        Math.abs(
            y -
            player.position.y
        ) < 1.8 &&
        Math.abs(
            z -
            player.position.z
        ) < 0.8
    ) {
        showMessage(
            "Too close"
        );

        return;
    }

    const chunkX =
        Math.floor(
            x / CHUNK_SIZE
        );

    const chunkZ =
        Math.floor(
            z / CHUNK_SIZE
        );

    const chunkKey =
        getChunkKey(
            chunkX,
            chunkZ
        );

    let group =
        chunks.get(
            chunkKey
        );

    if (!group) {
        generateChunk(
            chunkX,
            chunkZ
        );

        group =
            chunks.get(
                chunkKey
            );
    }

    if (!group) return;

    removedBlocks.delete(key);

    placedBlocks.set(
        key,
        {
            type: type,
            x: x,
            y: y,
            z: z,
            chunkKey: chunkKey
        }
    );

    createBlock(
        type,
        x,
        y,
        z,
        group
    );

    inventory[type]--;

    updateInventory();

    showMessage(
        "Placed " + type
    );
}

/* =========================================================
   HOTBAR
   ========================================================= */

function updateHotbar() {
    document
        .querySelectorAll(".hotbar-slot")
        .forEach(function (slot, index) {
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

            const old =
                slot.querySelector(
                    ".hotbar-count"
                );

            if (old) {
                old.remove();
            }

            const item =
                hotbarItems[index];

            const count =
                inventory[item] || 0;

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
        });
}

document
    .querySelectorAll(".hotbar-slot")
    .forEach(function (slot, index) {
        slot.addEventListener(
            "click",
            function () {
                selectedHotbarSlot =
                    index;

                updateHotbar();
            }
        );
    });

/* =========================================================
   INVENTORY
   ========================================================= */

function updateInventory() {
    if (!inventoryItems) return;

    inventoryItems.innerHTML =
        "";

    Object.keys(
        inventory
    ).forEach(function (item) {
        const amount =
            inventory[item] || 0;

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "inventory-item";

        const nameSpan =
            document.createElement(
                "span"
            );

        nameSpan.textContent =
            item;

        const amountStrong =
            document.createElement(
                "strong"
            );

        amountStrong.textContent =
            amount;

        div.appendChild(
            nameSpan
        );

        div.appendChild(
            amountStrong
        );

        inventoryItems.appendChild(
            div
        );
    });

    updateHotbar();
}

function toggleInventory() {
    if (!inventoryPanel) return;

    const opening =
        inventoryPanel.classList.contains(
            "hidden"
        );

    if (opening) {
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

/* =========================================================
   CRAFTING
   ========================================================= */

const recipes = {
    craftingTable: {
        name: "Crafting Table",
        output: 1,
        ingredients: {
            planks: 4
        }
    },

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

function craft(recipeName) {
    const recipe =
        recipes[recipeName];

    if (!recipe) return;

    const ingredients =
        recipe.ingredients;

    for (
        const item in ingredients
    ) {
        const needed =
            ingredients[item];

        const available =
            inventory[item] || 0;

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

    for (
        const item in ingredients
    ) {
        inventory[item] -=
            ingredients[item];
    }

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

document
    .querySelectorAll(".craft-button")
    .forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                craft(
                    button.dataset.recipe
                );
            }
        );
    });

function toggleCrafting() {
    if (!craftingPanel) return;

    const opening =
        craftingPanel.classList.contains(
            "hidden"
        );

    if (opening) {
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

/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboard() {
    document.addEventListener(
        "keydown",
        function (event) {
            const key =
                event.key.toLowerCase();

            keys[key] = true;

            if (
                [
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright",
                    " "
                ].includes(key)
            ) {
                event.preventDefault();
            }

            if (
                event.code ===
                "Space"
            ) {
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
            ] = false;
        }
    );
}

/* =========================================================
   JUMP
   ========================================================= */

function jump() {
    if (
        gameStarted &&
        onGround
    ) {
        verticalVelocity =
            7;

        onGround =
            false;
    }
}

/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(delta) {
    if (
        !player ||
        !camera
    ) {
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
        Math.abs(mobileMoveY) >
        0.05
    ) {
        forward =
            -mobileMoveY;
    }

    if (
        Math.abs(mobileMoveX) >
        0.05
    ) {
        right =
            mobileMoveX;
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
                ? 6
                : 3.8;

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

    camera.position.x =
        player.position.x;

    camera.position.y =
        player.position.y +
        1.2;

    camera.position.z =
        player.position.z;

    camera.rotation.y =
        yaw;

    camera.rotation.x =
        pitch;
}

/* =========================================================
   MOUSE LOOK
   ========================================================= */

function setupMouseLook() {
    if (!renderer) return;

    renderer.domElement.addEventListener(
        "click",
        function () {
            if (
                isTouchDevice()
            ) {
                return;
            }

            if (
                document.pointerLockElement !==
                renderer.domElement
            ) {
                try {
                    renderer.domElement.requestPointerLock();
                } catch (error) {
                    console.warn(
                        "Pointer lock unavailable."
                    );
                }
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
            if (!mouseLocked) return;

            yaw -=
                event.movementX *
                0.0025;

            pitch -=
                event.movementY *
                0.0025;

            const limit =
                Math.PI / 2 -
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
            if (!gameStarted) return;

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

/* =========================================================
   MOBILE BUTTON HELPER
   ========================================================= */

function mobilePress(
    element,
    callback
) {
    if (!element) return;

    element.addEventListener(
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

/* =========================================================
   MOBILE CONTROLS
   ========================================================= */

function setupMobileControls() {
    if (!mobileControls) return;

    const isTouch =
        isTouchDevice();

    if (!isTouch) {
        mobileControls.style.display =
            "none";

        return;
    }

    mobileControls.style.display =
        "block";

    mobilePress(
        jumpBtn,
        jump
    );

    mobilePress(
        mineBtn,
        mineBlock
    );

    mobilePress(
        placeBtn,
        placeBlock
    );

    mobilePress(
        inventoryBtn,
        toggleInventory
    );

    mobilePress(
        craftingBtn,
        toggleCrafting
    );

    /* JOYSTICK */

    if (
        joystick &&
        joystickKnob
    ) {
        let joystickTouchId =
            null;

        function updateJoystick(
            touch
        ) {
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
                Math.max(
                    20,
                    rect.width / 2 - 20
                );

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance > max
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

            mobileMoveX =
                dx / max;

            mobileMoveY =
                dy / max;

            joystickKnob.style.transform =
                "translate(" +
                dx +
                "px," +
                dy +
                "px)";
        }

        joystick.addEventListener(
            "touchstart",
            function (event) {
                event.preventDefault();

                const touch =
                    event.changedTouches[0];

                if (!touch) return;

                joystickTouchId =
                    touch.identifier;

                updateJoystick(
                    touch
                );
            },
            {
                passive: false
            }
        );

        joystick.addEventListener(
            "touchmove",
            function (event) {
                event.preventDefault();

                for (
                    const touch of event.touches
                ) {
                    if (
                        touch.identifier ===
                        joystickTouchId
                    ) {
                        updateJoystick(
                            touch
                        );
                    }
                }
            },
            {
                passive: false
            }
        );

        joystick.addEventListener(
            "touchend",
            function () {
                mobileMoveX = 0;
                mobileMoveY = 0;

                joystickTouchId =
                    null;

                joystickKnob.style.transform =
                    "translate(0,0)";
            }
        );

        joystick.addEventListener(
            "touchcancel",
            function () {
                mobileMoveX = 0;
                mobileMoveY = 0;

                joystickTouchId =
                    null;

                joystickKnob.style.transform =
                    "translate(0,0)";
            }
        );
    }
}

/* =========================================================
   MOBILE LOOK
   ========================================================= */

function setupMobileLook() {
    if (!lookArea) return;

    let activeTouchId =
        null;

    let lastX = 0;
    let lastY = 0;

    lookArea.addEventListener(
        "touchstart",
        function (event) {
            if (
                activeTouchId !== null
            ) {
                return;
            }

            const touch =
                event.changedTouches[0];

            if (!touch) return;

            activeTouchId =
                touch.identifier;

            lastX =
                touch.clientX;

            lastY =
                touch.clientY;
        },
        {
            passive: true
        }
    );

    lookArea.addEventListener(
        "touchmove",
        function (event) {
            event.preventDefault();

            for (
                const touch of event.touches
            ) {
                if (
                    touch.identifier ===
                    activeTouchId
                ) {
                    const dx =
                        touch.clientX -
                        lastX;

                    const dy =
                        touch.clientY -
                        lastY;

                    yaw -=
                        dx *
                        0.007;

                    pitch -=
                        dy *
                        0.007;

                    const limit =
                        Math.PI / 2 -
                        0.08;

                    pitch =
                        Math.max(
                            -limit,
                            Math.min(
                                limit,
                                pitch
                            )
                        );

                    lastX =
                        touch.clientX;

                    lastY =
                        touch.clientY;
                }
            }
        },
        {
            passive: false
        }
    );

    lookArea.addEventListener(
        "touchend",
        function (event) {
            for (
                const touch of event.changedTouches
            ) {
                if (
                    touch.identifier ===
                    activeTouchId
                ) {
                    activeTouchId =
                        null;
                }
            }
        }
    );

    lookArea.addEventListener(
        "touchcancel",
        function () {
            activeTouchId = null;
        }
    );
}

/* =========================================================
   SURVIVAL
   ========================================================= */

function updateSurvival(delta) {
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
    }

    if (hunger) {
        hunger.style.width =
            hungerValue +
            "%";
    }
}

/* =========================================================
   MESSAGE
   ========================================================= */

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

/* =========================================================
   ORIENTATION
   ========================================================= */

async function requestLandscape() {
    try {
        if (
            document.documentElement.requestFullscreen
        ) {
            if (
                !document.fullscreenElement
            ) {
                await document.documentElement.requestFullscreen();
            }
        }
    } catch (error) {
        console.log(
            "Fullscreen unavailable."
        );
    }

    try {
        if (
            screen.orientation &&
            screen.orientation.lock
        ) {
            await screen.orientation.lock(
                "landscape"
            );
        }
    } catch (error) {
        console.log(
            "Landscape lock unavailable on this browser."
        );
    }
}

function updateOrientationUI() {
    const mobile =
        isTouchDevice();

    if (!rotateScreen) return;

    if (
        gameStarted &&
        mobile &&
        window.innerHeight >
        window.innerWidth
    ) {
        rotateScreen.style.display =
            "flex";
    } else {
        rotateScreen.style.display =
            "none";
    }
}

/* =========================================================
   INITIALIZE GAME
   ========================================================= */

function initializeGame() {
    if (
        gameInitialized ||
        !threeReady
    ) {
        return;
    }

    createScene();

    createCamera();

    const rendererOK =
        createRenderer();

    if (!rendererOK) {
        return;
    }

    if (!initializeThreeAssets()) {
        return;
    }

    createPlayer();

    setupKeyboard();
    setupMouseLook();
    setupMobileControls();
    setupMobileLook();

    updateInventory();
    updateHotbar();
    updateSurvivalUI();

    gameInitialized =
        true;

    console.log(
        "Game graphics initialized."
    );
}

/* =========================================================
   START GAME
   ========================================================= */

async function startPlaying() {
    if (
        gameStarted
    ) {
        return;
    }

    if (!threeReady) {
        showHomeToast(
            "Game is still loading..."
        );

        return;
    }

    updatePlayerName();

    /*
       Mobile fullscreen + landscape.
       Called directly from PLAY click.
    */

    if (isTouchDevice()) {
        requestLandscape();
    }

    /*
       Show game immediately.
    */

    if (loadingScreen) {
        loadingScreen.classList.add(
            "hidden"
        );

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

    if (game) {
        game.classList.remove(
            "hidden"
        );

        game.style.display =
            "block";
    }

    /*
       Initialize graphics.
    */

    initializeGame();

    if (!gameInitialized) {
        showMessage(
            "Graphics failed to start"
        );

        return;
    }

    gameStarted =
        true;

    lastPlayerChunkX =
        null;

    lastPlayerChunkZ =
        null;

    queueNearbyChunks();

    showMessage(
        "Welcome " +
        playerName
    );

    updateOrientationUI();
}

/* =========================================================
   PLAY BUTTON
   ========================================================= */

if (startGameBtn) {
    startGameBtn.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            startPlaying();
        }
    );
}

/* =========================================================
   RESIZE
   ========================================================= */

function resizeGame() {
    if (
        !camera ||
        !renderer
    ) {
        updateOrientationUI();
        return;
    }

    camera.aspect =
        Math.max(
            1,
            window.innerWidth
        ) /
        Math.max(
            1,
            window.innerHeight
        );

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    const mobile =
        isTouchDevice();

    renderer.setPixelRatio(
        mobile
            ? Math.min(
                window.devicePixelRatio || 1,
                1.15
            )
            : Math.min(
                window.devicePixelRatio || 1,
                1.35
            )
    );

    updateOrientationUI();
}

window.addEventListener(
    "resize",
    resizeGame
);

window.addEventListener(
    "orientationchange",
    function () {
        setTimeout(
            resizeGame,
            150
        );
    }
);

if (
    screen.orientation &&
    screen.orientation.addEventListener
) {
    screen.orientation.addEventListener(
        "change",
        function () {
            setTimeout(
                resizeGame,
                100
            );
        }
    );
}

/* =========================================================
   ROTATE SCREEN
   ========================================================= */

if (rotateScreen) {
    rotateScreen.addEventListener(
        "click",
        function () {
            requestLandscape();
        }
    );
}

/* =========================================================
   KEYBOARD / MOBILE BUTTONS
   ========================================================= */

if (inventoryBtn) {
    inventoryBtn.addEventListener(
        "click",
        toggleInventory
    );
}

if (craftingBtn) {
    craftingBtn.addEventListener(
        "click",
        toggleCrafting
    );
}

/* =========================================================
   GAME LOOP
   ========================================================= */

function animate() {
    requestAnimationFrame(
        animate
    );

    if (!clock) {
        return;
    }

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

        queueNearbyChunks();

        processChunkQueue();

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

/* =========================================================
   INITIAL UI
   ========================================================= */

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

updateKitUI();
updateClothesUI();
updateInventory();
updateHotbar();
updateSurvivalUI();

/* =========================================================
   SAFE THREE.JS LOADER
   ========================================================= */

function loadThreeJS() {
    /*
       If Three.js is already loaded
       through index.html, use it.
    */

    if (
        typeof THREE !== "undefined"
    ) {
        threeReady = true;

        if (
            !initializeThreeAssets()
        ) {
            console.error(
                "Three.js assets could not initialize."
            );

            return;
        }

        finishLoading();

        animate();

        return;
    }

    /*
       Otherwise load Three.js safely.
    */

    const existing =
        document.querySelector(
            'script[data-threejs-loader="true"]'
        );

    if (existing) {
        return;
    }

    const threeScript =
        document.createElement(
            "script"
        );

    threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

    threeScript.async = false;

    threeScript.dataset.threejsLoader =
        "true";

    threeScript.onload =
        function () {
            if (
                typeof THREE ===
                "undefined"
            ) {
                showThreeError();

                return;
            }

            threeReady = true;

            console.log(
                "Three.js loaded successfully."
            );

            finishLoading();

            animate();
        };

    threeScript.onerror =
        function () {
            showThreeError();
        };

    document.head.appendChild(
        threeScript
    );
}

/* =========================================================
   LOADING FINISH
   ========================================================= */

function finishLoading() {
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
            updateOrientationUI();

            console.log(
                "BLOCK WORLD HOME READY"
            );
        },
        500
    );
}

/* =========================================================
   THREE ERROR
   ========================================================= */

function showThreeError() {
    console.error(
        "Three.js failed to load."
    );

    if (loadingScreen) {
        loadingScreen.innerHTML = "";

        const title =
            document.createElement(
                "h2"
            );

        title.textContent =
            "Unable to load game";

        const info =
            document.createElement(
                "p"
            );

        info.textContent =
            "Please check your internet connection and refresh.";

        loadingScreen.appendChild(
            title
        );

        loadingScreen.appendChild(
            info
        );
    }
}

/* =========================================================
   START
   ========================================================= */

loadThreeJS();

console.log(
    "Mind Craft script loaded safely."
);
