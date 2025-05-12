// English Letters abcdefghijklmnopqrstuvwxyz 

let keyboardLetters = Array.from("abcdefghijklmnopqrstuvwxyz");
let keyboard = document.querySelector(".keyboard");
let wrong = 0;
createAllKeyboardLetters();
getWords();

function createAllKeyboardLetters() {
    keyboardLetters.forEach((letter) => {
        createLetterSpan(letter);
    })
}

function createLetterSpan(letter) {
    let span = document.createElement("span");
    span.className = "box-letter";
    span.appendChild(document.createTextNode(letter.toUpperCase()));
    keyboard.appendChild(span);
}

async function getWords() {
    const {data} = await axios.get("./words.json");
    const categories = Object.keys(data["categories"]);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    document.querySelector(".category span").textContent = randomCategory;
    const randomWord = data["categories"][randomCategory][Math.floor(Math.random() * data["categories"][randomCategory].length)];
    lettersFields(randomWord);
    handleClickEvent(randomWord);
}

function handleClickEvent(randomWord) {
    console.log(randomWord);
    document.addEventListener("click", (e) => {
        if(e.target.className === "box-letter" && wrong !== 7){
            const clickedLetter = e.target.textContent.toLowerCase();
            const fields = Array.from(document.querySelectorAll(".letters-box span"));
            let status = false;
            randomWord = randomWord.toLowerCase();
            for(let i = 0; i < randomWord.length; i++) {
                if(randomWord[i] === clickedLetter && fields[i].textContent === ""){ 
                    status = true;  
                    
                    fields[i].textContent = clickedLetter;
                    const nextPos = randomWord.slice(i + 1).indexOf(clickedLetter);
                    if(nextPos === -1)
                        e.target.classList.add("clicked");
                    break;
                }
            }
            if(!status) {
                e.target.classList.add("clicked");
                const failSound = document.getElementById("fail");
                failSound.pause();
                failSound.currentTime = 0;
                failSound.play();
                Array.from(document.querySelectorAll(".draw-content div"))[wrong++].classList.add(`wrong-${wrong}`);
                if(wrong === 7) {
                    Swal.fire({
                        title: 'Game Over...',
                        text: "Do You Want To Play Again?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, restart it!',
                        cancelButtonText: 'Cancel'
                        }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            }else {
                const successSound = document.getElementById("success");
                successSound.pause();
                successSound.currentTime = 0;
                successSound.play();
                let allFull = true;
                for(let i = 0; i < fields.length; i++) {
                    if(fields[i].textContent === "") {
                        allFull = false;
                        break;
                    }
                }
                if(allFull) {
                    Swal.fire({
                        title: 'Amazing You Won',
                        text: "Do You Want To Play Again?",
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, restart it!',
                        cancelButtonText: 'Cancel'
                        }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            }
            
            
            
            
        }   
    });

}

function lettersFields(randomWord) {
    Array.from(randomWord).forEach((letter) => {
        const span = document.createElement("span");
        if(letter === " ") {
            span.classList.add("space");
        }
        document.querySelector(".letters-box").appendChild(span);
    });
}

