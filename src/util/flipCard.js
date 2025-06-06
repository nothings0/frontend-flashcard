let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

export function flipCard({target: clickedCard}, _setModalType, _setModalOpen, handleUpdate) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view").dataset.id,
        cardTwoImg = cardTwo.querySelector(".back-view").dataset.id;
        matchCards(cardOneImg, cardTwoImg, _setModalType, _setModalOpen, handleUpdate);
    }
}
function matchCards(img1, img2, _setModalType, _setModalOpen, handleUpdate) {
    if(img1 === img2) {
        matched++;
        if(matched === 8) {
            handleUpdate()
            const cards = document.querySelectorAll(".cardz");

            for (let card of cards) {
                card.classList.remove("flip", "hide")
            }
            setTimeout(() => {
                _setModalOpen(true)
                _setModalType(2)
            }, 1000);
            matched = 0;
            disableDeck = false;
            cardOne = cardTwo = "";
            return;
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne.classList.add('hide');
        cardTwo.classList.add('hide');
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 300);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 600);
}
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}