/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if(!element) {
      throw new Error ('Element not found');
    }
    this.element = element;
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = document.querySelector('.create-account');
    createAccount.addEventListener('click', () => {
      const createAccountModal = App.getModal('createAccount');
      createAccountModal.open();
    })
    const accounts = Array.from(document.querySelectorAll('.account'));
    accounts.forEach((elem) => {
      elem.addEventListener('click', () => {
       this.onSelectAccount(elem);
      })
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()) {
      Account.list({}, (err, response) => {
        if(response && response.success) {
          this.clear();
          this.renderItem(response.data);
          this.registerEvents();
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = Array.from(document.querySelectorAll('.account'));
    accounts.forEach((elem) => {
      elem.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    if(this.activeElement) {
      this.activeElement.classList.remove('active');
    };
    this.activeElement = element;
    element.classList.add('active');
    App.showPage('transactions', {account_id: element.dataset.id})
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `
    <li class="account" data-id='${item.id}'>
    <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum}₽</span>
    </a>
</li>
    `
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const reducedData = data.reduce((acc, elem) => {
      return acc + this.getAccountHTML(elem);
    }, '');
    this.element.insertAdjacentHTML('beforeend', reducedData);
  }
}