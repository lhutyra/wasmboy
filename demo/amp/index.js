// No closure, as the whole file is closure'd

const runTask = async () => {
  console.log('Yo!');

  const element = document.getElementById('root');

  console.log(element);
  /*
  const child = element.querySelector('amp-img');

  console.log(child);
  */

  const button = element.querySelector('button');
  console.log('button', button);
  button.addEventListener('click', () => console.log('Yay!!!'));

  const newButton = document.createElement('button');
  newButton.textContent = '2 yay!';
  element.appendChild(newButton);
  newButton.addEventListener('click', () => console.log('2Yay!!!'));

  element.addEventListener('keydown', () => console.log('document'));

  const input = element.querySelector('input');
  console.log('input', input);
  input.addEventListener('keydown', () => console.log('Input!!!'));
};
runTask();
