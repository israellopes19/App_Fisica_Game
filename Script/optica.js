const illusionImage = document.getElementById("illusionImage");
const revealBtn = document.getElementById("revealBtn");
const illusionInfo = document.getElementById("illusionInfo");

let illusionCount = 0;

const illusions = [
    {
        image: "illusion1.jpg",
        info: "Essa é uma ilusão de ótica onde as linhas parecem curvas, mas são retas! A técnica de distorção das linhas cria esse efeito visual.",
        revealInfo: "Ao olhar de perto, você verá que todas as linhas são retas. É um truque que engana os olhos devido ao contraste e ao arranjo das linhas."
    },
    {
        image: "illusion2.jpg",
        info: "Neste caso, você está vendo um círculo girando, mas ele não está se movendo. A percepção de movimento é uma ilusão de ótica.",
        revealInfo: "O cérebro tenta interpretar os padrões de cores e formas em movimento, criando a sensação de rotação, mesmo que a imagem não mude."
    }
];

function switchIllusion() {
    illusionCount = (illusionCount + 1) % illusions.length;
    illusionImage.src = illusions[illusionCount].image;
    illusionInfo.textContent = illusions[illusionCount].info;
}

illusionImage.addEventListener("click", () => {
    illusionInfo.textContent = illusions[illusionCount].revealInfo;
});

revealBtn.addEventListener("click", () => {
    switchIllusion();
});

switchIllusion();
