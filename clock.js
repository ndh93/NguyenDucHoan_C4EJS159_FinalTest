
// TẠO GRID
function createGrid() {
  const numbers = [
    { number: "1", style: "w-full h-full rounded-[5px] bg-green-100 text-green-500 flex justify-center items-center border border-black" },
    { number: "2", style: "w-full h-full rounded-[5px] bg-red-100 text-red-500 flex justify-center items-center border border-black" },
    { number: "3", style: "w-full h-full rounded-[5px] bg-blue-100 text-blue-500 flex justify-center items-center border-black border" },
    { number: "4", style: "w-full h-full rounded-[5px] bg-purple-100 text-purple-500 flex justify-center items-center border border-black" },
    { number: "5", style: "w-full h-full rounded-[5px] bg-pink-100 text-pink-500 flex justify-center items-center border border-black" },
    { number: "6", style: "w-full h-full rounded-[5px] bg-yellow-100 text-yellow-500 flex justify-center items-center border border-black" },
    { number: "7", style: "w-full h-full rounded-[5px] bg-indigo-100 text-indigo-500 flex justify-center items-center border border-black" },
    { number: "8", style: "w-full h-full rounded-[5px] bg-gray-100 text-gray-500 flex justify-center items-center border border-black" },
    { number: "9", style: "w-full h-full rounded-[5px] bg-emerald-100 text-emerald-500 flex justify-center items-center border border-black" },
    { number: "10", style: "w-full h-full rounded-[5px] bg-amber-100 text-amber-500 flex justify-center items-center border border-black" },
    { number: "11", style: "w-full h-full rounded-[5px] bg-lime-100 text-lime-500 flex justify-center items-center border border-black" },
    { number: "12", style: "w-full h-full rounded-[5px] bg-black flex justify-center items-center border border-black" },
  ];

  const gameBoard = document.getElementById("grid");
  gameBoard.innerHTML = "";
  const newNumbers = numbers.slice();

  newNumbers.forEach(function(number) {
    const box = document.createElement("div");
    box.className = number.style;
    box.textContent = number.number;
    gameBoard.appendChild(box);
  });
}

// BẤM "BẮT ĐẦU" SẼ TÍNH GIỜ VÀ TRỘN BOX
let intervalId = 0;
let count = 0;
let playCount = 0; // Số lượt chơi
let moveCount = 0; // Số lần di chuyển trong lượt hiện tại

// Bắt đầu đếm thời gian
function startTimer(timerElement) {
  intervalId = setInterval(function() {
    count++;
    const minutes = String(Math.floor(count / 60)).padStart(2, '0');
    const seconds = String(count % 60).padStart(2, '0');
    timerElement.textContent = minutes + ":" + seconds;
  }, 1000);
}

// Dừng và reset thời gian
function stopTimer(timerElement) {
  clearInterval(intervalId);
  count = 0;
  timerElement.textContent = "00:00";
}

// Đổi trạng thái nút
function startEnd(button, isRunning) {
  if (isRunning) {
    button.innerText = 'KẾT THÚC';
    button.classList.remove('bg-green-100');
    button.classList.add('bg-red-800');
  } else {
    button.innerText = 'BẮT ĐẦU';
    button.classList.remove('bg-red-800');
    button.classList.add('bg-green-100');
  }
}
// Hàm shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Trộn các box trong grid
function shuffleGrid(container) {
  const items = Array.from(container.children);
  const shuffled = shuffle(items);
  container.innerHTML = "";
  shuffled.forEach(function(item) {
    container.appendChild(item);
  });
}

// BẮT ĐẦU GAME
function clock() {
  const startBtn = document.getElementById('start');
  const timer = document.getElementById('time');
  const container = document.querySelector('.grid');

  startBtn.addEventListener("click", function() {
    const isStarting = startBtn.innerText === 'BẮT ĐẦU';

    startEnd(startBtn, isStarting);

    if (isStarting) {
      stopTimer(timer);
      startTimer(timer);
      shuffleGrid(container);
      moveCount = 0;
    } else {
      stopTimer(timer);
    }
  });
}
clock();

// CHƠI GAME

// Xác định vị trí box
function checkSwap(currentIndex, direction) {
  const cols = 4;
  const rows = 3;

  if (direction === 'ArrowLeft' || direction === 'a' || direction === 'A') {
    return currentIndex % cols !== 0 ? currentIndex - 1 : null;
  } else if (direction === 'ArrowRight' || direction === 'd' || direction === 'D') {
    return currentIndex % cols !== cols - 1 ? currentIndex + 1 : null;
  } else if (direction === 'ArrowUp' || direction === 'w' || direction === 'W') {
    return currentIndex - cols >= 0 ? currentIndex - cols : null;
  } else if (direction === 'ArrowDown' || direction === 's' || direction === 'S') {
    return currentIndex + cols < cols * rows ? currentIndex + cols : null;
  } else {
    return null;
  }
}

// Hàm SWAP BOX
function swapBoxes(boxes, i, j) {
  const boxA = boxes[i];
  const boxB = boxes[j];

  const tempText = boxA.textContent;
  const tempClass = boxA.className;

  boxA.textContent = boxB.textContent;
  boxA.className = boxB.className;

  boxB.textContent = tempText;
  boxB.className = tempClass;
}

// Lấy thứ box ban đầu trước khi trộn.
let startingOrder = [];
document.addEventListener("DOMContentLoaded", function() {
  createGrid();
  const container = document.getElementById("grid");
  startingOrder = Array.from(container.children).map(function(box) {
    return box.textContent.trim();
  });
});

// Hàm xác định kết thúc trò chơi
function checkWin(container) {
  const currentOrder = Array.from(container.children).map(function(box) {
    return box.textContent.trim();
  });
  return currentOrder.every(function(num, gridIndex) {
    return num === startingOrder[gridIndex];
  });
}

// Add event và xuất dữ liệu chơi sau khi thắng game
document.addEventListener("keydown", function(e) {
  const grid = document.querySelector('.grid');
  const boxes = Array.from(grid.children);
  const blackIndex = boxes.findIndex(function(box) {
    return box.textContent === "12";
  });
  const targetIndex = checkSwap(blackIndex, e.key);

  if (targetIndex !== null) {
    swapBoxes(boxes, blackIndex, targetIndex);
    moveCount++;
  }

  if (checkWin(grid)) {
    const timeElement = document.getElementById("time");
    const finishingTime = timeElement.textContent;

    stopTimer(timeElement);

    playCount++;

    const recordTable = document.getElementById("record");
    const newRow = document.createElement("tr");

    newRow.innerHTML =
      '<td class="border border-gray-500 px-4 py-2">' + playCount + '</td>' +
      '<td class="border border-gray-500 px-4 py-2">' + finishingTime + '</td>' +
      '<td class="border border-gray-500 px-4 py-2">' + moveCount + '</td>';

    recordTable.appendChild(newRow);

    alert("CONGRATULATION! YOU WIN!🎉🎉🎉");
  }
});
