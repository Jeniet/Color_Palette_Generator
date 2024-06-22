const colorElements = document.querySelectorAll('.color');
const generateButton = document.getElementById('generate-btn');
const saveButton = document.getElementById('save-palette-btn');
const shuffleButton = document.getElementById('shuffle-btn');
const savedPalettesContainer = document.getElementById('saved-palettes');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const copyButton = document.getElementById('copy-btn');
const lockButton = document.getElementById('lock-btn');
const actionButtons = document.querySelector('.action-buttons');
const notification = document.getElementById('notification');
let selectedColorElement = null;

generateButton.addEventListener('click', (event) => {
    event.stopPropagation();
    generatePalette();
});

saveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    savePalette();
});

shuffleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    shufflePalette();
});

darkModeToggle.addEventListener('change', (event) => {
    event.stopPropagation();
    toggleDarkMode();
});

colorElements.forEach(colorElement => {
    colorElement.addEventListener('click', (event) => {
        selectedColorElement = colorElement;
        showActionButtons(event.clientX, event.clientY);
        updateButtonsVisibility(colorElement);
        updateLockButton();
        event.stopPropagation();
    });
});

savedPalettesContainer.addEventListener('click', (event) => {
    const clickedColor = event.target.closest('.color');
    if (clickedColor) {
        selectedColorElement = clickedColor;
        const hexColor = rgbToHex(selectedColorElement.style.backgroundColor);
        copyToClipboard(hexColor);
        showNotification(`Copied: ${hexColor}`);
    }
});

document.addEventListener('click', (event) => {
    if (!isClickInsideColor(event) && !event.target.closest('.action-buttons')) {
        hideActionButtons();
    }
});

copyButton.addEventListener('click', () => {
    if (selectedColorElement) {
        const hexColor = rgbToHex(selectedColorElement.style.backgroundColor);
        copyToClipboard(hexColor);
        showNotification(`Copied: ${hexColor}`);
    }
});

lockButton.addEventListener('click', () => {
    if (selectedColorElement) {
        toggleLock(selectedColorElement);
        updateLockButton();
        updateLockIcon(selectedColorElement);
    }
});

function generatePalette() {
    const colors = generateRandomColors();
    colorElements.forEach((colorElement, index) => {
        if (!colorElement.classList.contains('locked')) {
            colorElement.style.backgroundColor = colors[index];
        }
    });
}

function generateRandomColors() {
    const randomColors = [];
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < 5; i++) {
        let color = '#';
        for (let j = 0; j < 6; j++) {
            color += characters[Math.floor(Math.random() * 16)];
        }
        randomColors.push(color);
    }
    return randomColors;
}

function shufflePalette() {
    const colors = Array.from(colorElements).map(el => el.style.backgroundColor);
    const shuffledColors = shuffleArray(colors);
    colorElements.forEach((colorElement, index) => {
        if (!colorElement.classList.contains('locked')) {
            colorElement.style.backgroundColor = shuffledColors[index];
        }
    });
}

function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function savePalette() {
    const colors = Array.from(colorElements).map(el => el.style.backgroundColor);
    const paletteDiv = document.createElement('div');
    paletteDiv.classList.add('saved-palette');
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color');
        colorDiv.style.backgroundColor = color;
        paletteDiv.appendChild(colorDiv);
    });
    savedPalettesContainer.appendChild(paletteDiv);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (selectedColorElement) {
        showActionButtons(selectedColorElement.getBoundingClientRect().left, selectedColorElement.getBoundingClientRect().top);
        updateButtonsVisibility(selectedColorElement);
    }
}

function toggleLock(colorElement) {
    colorElement.classList.toggle('locked');
}

function updateLockButton() {
    if (selectedColorElement.classList.contains('locked')) {
        lockButton.textContent = 'Unlock';
    } else {
        lockButton.textContent = 'Lock';
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification(`Copied: ${text}`);
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function hideActionButtons() {
    actionButtons.style.display = 'none';
}

function showActionButtons(x, y) {
    actionButtons.style.display = 'flex';
    actionButtons.style.top = `${y}px`;
    actionButtons.style.left = `${x}px`;
}

function updateButtonsVisibility(colorElement) {
    if (!savedPalettesContainer.contains(colorElement)) {
        copyButton.style.display = 'block';
        lockButton.style.display = 'block';
    } else {
        copyButton.style.display = 'none';
        lockButton.style.display = 'none';
    }
}

function rgbToHex(rgbColor) {
    const rgb = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
}

colorElements.forEach(colorElement => {
    const lockIcon = document.createElement('span');
    lockIcon.classList.add('lock-icon');
    colorElement.appendChild(lockIcon);
    updateLockIcon(colorElement);
});

function updateLockIcon(colorElement) {
    const lockIcon = colorElement.querySelector('.lock-icon');
    if (colorElement.classList.contains('locked')) {
        lockIcon.textContent = '🔒';
    } else {
        lockIcon.textContent = '';
    }
}

function isClickInsideColor(event) {
    return event.target.closest('.color') || event.target.closest('.action-buttons');
}


