const container = document.getElementById('container');
const tempSlider = document.getElementById('temperature');
const tempValue = document.getElementById('tempValue');

const molecules = [];
const numMolecules = 50;

// Criar moléculas
for (let i = 0; i < numMolecules; i++) {
  const mol = document.createElement('div');
  mol.classList.add('molecule');
  mol.style.left = Math.random() * container.offsetWidth + 'px';
  mol.style.top = Math.random() * container.offsetHeight + 'px';
  container.appendChild(mol);
  molecules.push(mol);
}

// Atualizar posição e cor baseado na temperatura
function updateMolecules(temp) {
  temp = Math.max(0, temp); // Garante que nunca seja menor que 0






  molecules.forEach(mol => {
    // COR da molécula de acordo com temperatura
    if (temp >= 300){
      mol.style.background="black"; // Preto
    } else if (temp >= 200) {
      mol.style.background = "#8B0000"; // Vermelho escuro
    } else if (temp >= 100) {
      mol.style.background = "red"; // Vermelho vivo
    } else {
      mol.style.background = "#00d4ff"; // Azul claro (normal)
    }

    // MOVIMENTO das moléculas
    if (temp === 0) {
      mol.style.left = (container.offsetWidth / 2 + Math.random() * 10 - 5) + 'px';
      mol.style.top = (container.offsetHeight / 2 + Math.random() * 10 - 5) + 'px';
    } else {
      const spread = (temp / 2);
      mol.style.left = (container.offsetWidth / 2 + (Math.random() - 0.5) * spread * 4) + 'px';
      mol.style.top = (container.offsetHeight / 2 + (Math.random() - 0.5) * spread * 4) + 'px';
    }
  });
}

tempSlider.addEventListener('input', () => {
  const temp = parseInt(tempSlider.value);
  tempValue.textContent = temp;
  updateMolecules(temp);
});

// Atualizar automaticamente para simular o movimento
setInterval(() => {
  const temp = parseInt(tempSlider.value);
  updateMolecules(temp);
}, 1000);
