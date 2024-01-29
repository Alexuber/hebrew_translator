require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

const submitBtn = document.querySelector('.submit-translate-btn');
const languageSelect = document.getElementById('languageSelect');
const inputText = document.getElementById('inputText');
const translationResult = document.getElementById('translationResult');
let selectedLang = languageSelect.value;

submitBtn.addEventListener('click', translate);

languageSelect.addEventListener('change', function () {
  const selectedOption = languageSelect.options[languageSelect.selectedIndex];
  selectedLang = selectedOption.value;
});

async function translate() {
  submitBtn.disabled = true;
  translationResult.innerText = '';
  hideCopyButton();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },

    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Translate for each word of users text into ${selectedLang} in the format: Word from user - Translation on ${selectedLang}. Do not use any regular text. For example: users text: "My name", output: My - Моё
          name - имя`,
        },
        {
          role: 'user',
          content: inputText.value,
        },
      ],
      temperature: 0.8,
      max_tokens: 2900,
      top_p: 1,
    }),
  });

  const translation = await response.json();

  translationResult.innerText = translation.choices[0].message.content;

  inputText.value = '';
  submitBtn.disabled = false;
  showCopyButton();
}
const copyButton = document.getElementById('copyButton');

document.getElementById('copyButton').addEventListener('click', function () {
  // Создаем новый элемент textarea для временного хранения текста
  const textarea = document.createElement('textarea');
  textarea.value = translationResult.innerText; // Устанавливаем текст в textarea

  document.body.appendChild(textarea);

  // Выделяем весь текст в textarea
  textarea.select();

  // Копируем текст в буфер обмена
  document.execCommand('copy');

  // Удаляем временный textarea
  document.body.removeChild(textarea);

  alert('Text copied to clipboard!');
});

function showCopyButton() {
  copyButton.style.display = 'inline';
}

function hideCopyButton() {
  copyButton.style.display = 'none';
}
