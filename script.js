const createCharacterPopup = document.querySelector("#create-characters-popup");
const bossesPoup = document.querySelector(".bossesPopup");
const characterForm = document.querySelector("#character-form");
const ignInput = document.querySelector("#name");
const genderInput = document.querySelector("#gender-select");
const classSelect = document.querySelector("#class-select");
const bossPopupDifficultyTags = document.querySelectorAll(".bossesPopup p");
const bossesSelected = document.querySelectorAll("input[name=boss]");
const submitCharBtn = document.querySelector("#submit-char");
const mainContent = document.querySelector("#content");
const body = document.querySelector("body");
const createCharacterBtn = document.querySelector("#create-character");
const deleteCharacterBtn = document.querySelector("#delete-characters");
const charactersSection = document.querySelector("#characters");
const totalMesosWeb = document.querySelector("#total-mesos");
const totalCrystals = document.querySelector("#total-crystals");
const bossMuleCharacters = [];
let bosses = {};

fetch('bosses.json')
  .then(response => response.json())
  .then(data => {
    bosses = data.bosses;
  })
  .catch(error => console.error('Error fetching boss data:', error));

fetch('classes.json')
.then(response => response.json())
.then(data => {
  const classes = data.classes;
  classes.forEach(className => {
    const option = document.createElement("option");
    option.value = className.toLowerCase().replace(/ /g, '');
    option.textContent = className;
    classSelect.appendChild(option);
  });
})
.catch(error => console.error('Error fetching class data:', error));


// document.addEventListener("DOMContentLoaded", () => {
//   fetch('./bosses.json')
//     .then(response => response.json())
//     .then(data => {
//       const bossesContainer = document.querySelector("#bosses-container");
//       data.bosses.forEach(boss => {
//         const bossDiv = document.createElement("div");
//         bossDiv.classList.add("flex", "justify-between", "w-full", "px-5", "xl:px-20", "sm:w-full", "m-auto", "items-center", "gap-x-5");

//         const bossImg = document.createElement("img");
//         bossImg.classList.add("h-12", "border", "rounded");
//         bossImg.src = boss.IMG;

//         const bossDifficulty = document.createElement("p");
//         bossDifficulty.innerText = boss.Difficulty;

//         const bossCheckbox = document.createElement("input");
//         bossCheckbox.type = "checkbox";
//         bossCheckbox.name = "boss";
//         bossCheckbox.value = boss.name;

//         bossDiv.appendChild(bossImg);
//         bossDiv.appendChild(bossDifficulty);
//         bossDiv.appendChild(bossCheckbox);

//         bossesContainer.appendChild(bossDiv);
//       });
//     })
//     .catch(error => console.error('Error fetching boss data:', error));
// });

let charIGN = "";
let charGender = genderInput.value;
let charClass = classSelect.value;
const charBosses = [];
let totalMesos = 0;
let availableCrystals = 180;

function updateUI() {
  for (i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== "Mesos" && key !== "Crystals") {
      const localChar = document.createElement("div");
      localChar.innerHTML = localStorage.getItem(key);
      charactersSection.appendChild(localChar);
    }
  }
  if (localStorage.getItem("Mesos") && localStorage.getItem("Crystals")) {
    totalMesos = localStorage.getItem("Mesos");
    availableCrystals = localStorage.getItem("Crystals");
  }
  updateCurrency();
}

updateUI();

function createChar(charName, charClass, charGender, bossesDefeated) {
  const charWrapper = document.createElement("div");
  const charInfoWrapper = document.createElement("div");
  const charImg = document.createElement("img");
  const charIGN = document.createElement("p");
  const charHr = document.createElement("hr");
  const charMesosGenerated = document.createElement("p");
  const bossTable = document.createElement("table");
  const bTableHead = document.createElement("thead");
  const bTHeadTr = document.createElement("tr");
  const bTHeadBossName = document.createElement("th");
  const bTHeadDifficulty = document.createElement("th");
  const bTHeadMesos = document.createElement("th");
  const bTheadCleared = document.createElement("th");
  const headThs = [bTHeadBossName, bTHeadDifficulty, bTHeadMesos, bTheadCleared];
  const bossTBody = document.createElement("tbody");
  let totalCharMesosGenerated = 0;
  let borderBottom = true;

  //Adding all tailwind classes.

  charWrapper.classList.add("flex", "flex-col", "gap-y-3", "text-white");

  charInfoWrapper.classList.add(
    "character",
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "gap-y-3"
  );

  charImg.classList.add("h-16");

  charIGN.classList.add("text-md");

  bossTable.classList.add(
    "text-center",
    "block",
    "border-2",
    "border-slate-700",
    "rounded"
  );

  bTableHead.classList.add(
    "block",
    "uppercase",
    "bg-slate-700",
    "text-xs",
    "border-b",
    "border-slate-700"
  );

  headThs.forEach((Th) => {
    Th.classList.add("px-6", "py-3");
    bTHeadTr.appendChild(Th);
  });

  bossTBody.classList.add(
    "flex",
    "flex-col",
    "text-xs",
    "xl:text-sm",
    "tbodychar",
    "bg-gray-800"
  );

  //Retreiving data and adding onto the character and boss table.

    
  charImg.src = `./assets/characters/${charClass}-${charGender}.webp`;

  charIGN.innerText = `IGN: ${charName}`;
  bTHeadBossName.innerText = "Boss";
  bTHeadDifficulty.innerText = "Difficulty";
  bTHeadMesos.innerText = "Mesos";
  bTheadCleared.innerText = "Cleared";
  //Counting for figuring out if it's the last boss, if so the Tr SHOULDN'T have a border bottom.
  const bossCount = Object.keys(bossesDefeated).length;
  let cont = 0;

  for (boss in bossesDefeated) {
    cont++;
    if (availableCrystals > 0) {
      totalCharMesosGenerated += bossesDefeated[boss]["Price"];
      if (cont === bossCount) {
        borderBottom = false;
      }
      createBoss(
        boss,
        bossesDefeated[boss]["Difficulty"],
        bossTBody,
        borderBottom
      );
    }
  }

  if (bossTBody.childElementCount > 5) {
    bossTBody.classList.add("overflow-y-scroll", "overflow-x-hidden");
  }

  charMesosGenerated.innerText = `Mesos generated: ${parseInt(
    totalCharMesosGenerated
  ).toLocaleString("en-US")}`;

  //Appending everything together
  //Charinfo
  charInfoWrapper.appendChild(charImg);
  charInfoWrapper.appendChild(charIGN);
  charInfoWrapper.appendChild(charHr);
  charInfoWrapper.appendChild(charMesosGenerated);
  //Table head
  bTableHead.appendChild(bTHeadTr);
  bossTable.appendChild(bTableHead);
  //TableBody
  bossTable.appendChild(bossTBody);
  //Adding everything onto the main wrapper
  charWrapper.appendChild(charInfoWrapper);
  charWrapper.appendChild(bossTable);
  //Adding the new character to the HTML section
  charactersSection.appendChild(charWrapper);

  updateCurrency();

  return charWrapper;
}

function createBoss(boss, difficulty, bossesTBody, borderBottom) {
  const bossTableTr = document.createElement("tr");
  const sameWidthDivImg = document.createElement("div");
  const sameWidthDivDifficulty = document.createElement("div");
  const sameWidthDivMesos = document.createElement("div");
  const bossImg = document.createElement("img");
  const bossTdImg = document.createElement("td");
  const bossTdDifficulty = document.createElement("td");
  const bossTdMesos = document.createElement("td");
  const bossTdCleared = document.createElement("td");
  const bossDivs = [sameWidthDivImg, sameWidthDivDifficulty, sameWidthDivMesos];
  const bossTds = [bossTdImg, bossTdDifficulty, bossTdMesos, bossTdCleared];
  const clearedBox = document.createElement("input");
  clearedBox.type = "checkbox";
  clearedBox.id="Cleared"
  clearedBox.addEventListener("click", test);
  //Adding data to each element &&  Adding tailwind classes.

  sameWidthDivDifficulty.innerText = difficulty;
  addBossBadge(sameWidthDivDifficulty);
  sameWidthDivMesos.innerText = `${parseInt(
    bosses[boss]["Price"]
  ).toLocaleString("en-US")}`;

  bossTableTr.classList.add(
    "bg-gray-800",
    "py-8",
    "flex",
    "justify-between",
    "items-center",
    "font-medium"
  );

  if (borderBottom) {
    bossTableTr.classList.add("border-b", "border-slate-700");
  }

  bossDivs.forEach((Div) => {
    Div.classList.add("w-100px");
  });

  bossImg.src = `${bosses[boss]["IMG"]}`;
  sameWidthDivImg.appendChild(bossImg);
  bossTdImg.appendChild(sameWidthDivImg);
  bossTdDifficulty.appendChild(sameWidthDivDifficulty);
  bossTdMesos.appendChild(sameWidthDivMesos);
  bossTdCleared.appendChild(clearedBox);


  bossTds.forEach((Td) => {
    bossTableTr.appendChild(Td);
  });

  bossImg.classList.add(
    "h-12",
    "border",
    "rounded",
    "border-slate-500",
    "mx-auto"
  );

  //Updating mesos and crystals
  if (availableCrystals > 0) {
    totalMesos += bosses[boss]["Price"];
    // availableCrystals--;
  }

  bossesTBody.appendChild(bossTableTr);
}


function addBossBadge(bossTag) {
  const bossTagText = bossTag.innerText;
  switch (bossTagText.toUpperCase()) {
    case "EASY":
      bossTag.classList.add("bg-gray-500", "py-1", "px-3", "rounded");
      break;
    case "NORMAL":
      bossTag.classList.add("bg-cyan-500", "py-1", "px-3", "rounded");
      break;
    case "HARD":
      bossTag.classList.add("bg-pink-600", "py-1", "px-3", "rounded");
      break;
    case "CHAOS":
      bossTag.classList.add(
        "bg-gray-900",
        "py-1",
        "px-3",
        "rounded",
        "text-yellow-100",
        "border",
        "border-yellow-100"
      );
      break;
    case "EXTREME":
      bossTag.classList.add(
        "bg-gray-900",
        "py-1",
        "px-3",
        "rounded",
        "text-red-500",
        "border",
        "border-red-500"
      );
      break;
    default:
  }
}

function updateCurrency() {
  totalMesosWeb.innerText = `${parseInt(totalMesos).toLocaleString("en-US")}`;

  totalCrystals.innerText = `${availableCrystals}`;
}

//Event listeners

//Shows create character popup and blurs the background
createCharacterBtn.addEventListener("click", function () {
  mainContent.classList.add("bg-slate-950", "blur-sm", "h-screen");
  createCharacterPopup.classList.remove("hidden");
  bossPopupDifficultyTags.forEach((bossTag) => {
    addBossBadge(bossTag);
  });
});

deleteCharacterBtn.addEventListener("click", function () {
  console.log("clicked");
  charactersSection.innerHTML = "";
  totalMesos = 0;
  availableCrystals = 180;
  localStorage.clear();
  updateUI();
});

//Closes create character popup and unblurs the background
mainContent.addEventListener("click", function (e) {
  if (e.target.id !== "create-character") {
    mainContent.classList.remove("bg-slate-950", "blur-sm", "h-screen");
    createCharacterPopup.classList.add("hidden");
  }
});

ignInput.addEventListener("keyup", function (e) {
  charIGN = e.target.value;
});

genderInput.addEventListener("change", function (e) {
  charGender = e.target.value;
});

classSelect.addEventListener("change", function (e) {
  charClass = e.target.value;
});

bossesSelected.forEach((bossSelected) => {
  bossSelected.addEventListener("change", function (e) {
    if (e.target.checked) {
      charBosses.push(e.target.value);
    } else {
      const index = charBosses.indexOf(e.target.value);
      charBosses.splice(index, 1);
    }
  });
});

submitCharBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const bossArray = Object.entries(bosses);
  const filteredBosses = [];
  charBosses.forEach((boss) => {
    bossArray.forEach(([key, value]) => {
      if (key === boss) {
        filteredBosses.push([key, value]);
      }
    });
  });
  if (charIGN.length > 0) {
    bossMuleCharacters.push(
      createChar(
        charIGN,
        charClass,
        charGender,
        Object.fromEntries(filteredBosses)
      )
    );
    bossMuleCharacters.forEach((bossMule, i) => {
      localStorage.setItem(charIGN, bossMule.outerHTML);
    });
    localStorage.setItem("Mesos", totalMesos);
    localStorage.setItem("Crystals", availableCrystals);
    charBosses.length = 0;
    filteredBosses.length = 0;
    characterForm.reset();
    bossesPoup.scrollTop = 0;
    mainContent.classList.remove("bg-slate-950", "blur-sm", "h-screen");
    createCharacterPopup.classList.add("hidden");
  }
});


function test(Event) {
  if (Event.target.checked) {
    availableCrystals--;
  }else{
    availableCrystals++;
  }
  updateCurrency();
};
