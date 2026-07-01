const contactForm = document.querySelector('.contact-form');
const ticketForm = document.querySelector('.ticket-form');
const paymentForm = document.querySelector('.payment-form');
const stages = document.querySelectorAll('.checkout-stage');
const stepItems = document.querySelectorAll('.steps button');
let quantity = 1;

const validators = {
  firstName: value => /^[А-ЯЁA-Z][а-яёa-z-]{1,29}$/u.test(value.trim()) ? '' : 'Введите имя буквами, например: Иван.',
  lastName: value => /^[А-ЯЁA-Z][а-яёa-z-]{1,39}$/u.test(value.trim()) ? '' : 'Введите фамилию буквами, например: Петров.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value.trim()) ? '' : 'Введите почту в формате name@example.com.',
  phone: value => value.replace(/\D/g, '').length >= 11 ? '' : 'Введите номер полностью, например: +7 (999) 123-45-67.',
  cardNumber: value => value.replace(/\D/g, '').length === 16 ? '' : 'Номер карты должен содержать 16 цифр.',
  expiry: value => /^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(value.trim()) ? '' : 'Введите срок в формате ММ/ГГ, например: 08/29.',
  cvc: value => /^\d{3}$/.test(value) ? '' : 'Введите три цифры с обратной стороны карты.',
  cardholder: value => /^[A-Z]+(?:\s+[A-Z]+)+$/.test(value.trim()) ? '' : 'Введите имя и фамилию латиницей, например: IVAN PETROV.'
};

const validateInput = input => {
  const message = validators[input.name]?.(input.value) || '';
  const label = input.closest('label');
  label?.querySelector('.error-hint')?.remove();
  input.classList.toggle('input-error', Boolean(message));
  label?.classList.toggle('field-error', Boolean(message));
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (message && label) {
    const hint = document.createElement('small');
    hint.className = 'error-hint';
    hint.textContent = message;
    label.appendChild(hint);
  }
  return !message;
};

document.querySelectorAll('.checkout-card input[name]').forEach(input => {
  input.addEventListener('blur', () => validateInput(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('input-error')) validateInput(input);
  });
});

const validateForm = form => {
  const inputs = [...form.querySelectorAll('input[name]')].filter(input => input.type !== 'radio' && input.type !== 'checkbox');
  const valid = inputs.map(validateInput).every(Boolean);
  if (!valid) inputs.find(input => input.classList.contains('input-error'))?.focus();
  return valid;
};

const showStage = number => {
  stages.forEach(stage => stage.classList.toggle('active', stage.dataset.stage === String(number)));
  stepItems.forEach(item => item.classList.toggle('active', item.dataset.target === String(number)));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

stepItems.forEach(item => item.addEventListener('click', () => showStage(item.dataset.target)));
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm(contactForm)) return;
  document.querySelector('#success-email').textContent = contactForm.querySelector('[type="email"]').value;
  showStage(2);
});

const updateTicket = () => {
  const premium = ticketForm.querySelector('[value="premium"]').checked;
  const price = premium ? 5200 : 3500;
  const ticketSum = price * quantity;
  const total = ticketSum + 350;
  document.querySelector('#ticket-quantity').textContent = quantity;
  document.querySelector('#ticket-summary').textContent = `× ${quantity}   ${ticketSum} ₽`;
  document.querySelector('#ticket-total').textContent = `${total} ₽`;
  document.querySelector('#payment-ticket-summary').textContent = `× ${quantity}   ${ticketSum} ₽`;
  document.querySelector('#payment-total').textContent = `${total} ₽`;
  document.querySelector('#payment-submit').textContent = `Оплатить ${total} ₽`;
  ticketForm.querySelectorAll('.ticket-option').forEach(option => option.classList.toggle('selected', option.querySelector('input').checked));
};
ticketForm.querySelectorAll('[name="ticket"]').forEach(input => input.addEventListener('change', updateTicket));
ticketForm.querySelectorAll('[data-count]').forEach(button => button.addEventListener('click', () => {
  quantity = Math.max(1, Math.min(8, quantity + Number(button.dataset.count)));
  updateTicket();
}));
ticketForm.addEventListener('submit', event => { event.preventDefault(); showStage(3); });

paymentForm.querySelector('[inputmode="numeric"]').addEventListener('input', event => {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
});
paymentForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm(paymentForm)) return;
  stages.forEach(stage => stage.classList.remove('active'));
  document.querySelector('.steps').style.display = 'none';
  document.querySelector('.checkout-success').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
updateTicket();
