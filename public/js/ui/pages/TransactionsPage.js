/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  monthNames = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element === null || element === undefined) {
      throw('Element not found');
    } else {
      this.element = element;
      this.registerEvents();
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const deleteAccountBtn = document.querySelector('.remove-account');
    deleteAccountBtn.addEventListener('click', () => {
      this.removeAccount();
    });
  }

  registerTransactionEvents() {
    const deleteTransactionBtns = Array.from(document.querySelectorAll('.transaction__remove'));
    if(deleteTransactionBtns) {
      deleteTransactionBtns.forEach((elem) => {
        elem.addEventListener('click', () => {
          this.removeTransaction(elem.dataset.id);
        })
      })
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions === null || this.lastOptions === undefined) {
      return;
    }
    const result = confirm('Вы действительно хотите удалить этот счёт?');
    if(result === true) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if(response && response.success) {
          App.updateWidgets();
          App.updateForms();
        }
      });
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction (id) {
    const result = confirm('Вы действительно хотите удалить эту транзакцию?');
    if(result === true) {
      Transaction.remove({ id }, (err, response) => {
        if(response && response.success) {
          App.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if(options === null || options === undefined) {
      return;
    }
    this.lastOptions = options;
    const id = options.account_id;
    Account.get(id, (err, response) => {
      if(response && response.success) {
        this.renderTitle(response.data.name);
      }
    });
    Transaction.list(this.lastOptions, (err, response) => {
      if(response && response.success) {
        this.renderTransactions(response.data);
        this.registerTransactionEvents();
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = document.querySelector('.content-title');
    title.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const realDate = new Date(date);
    return realDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
    <div class="transaction transaction_expense row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum}<span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    data.forEach((elem) => {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(elem));
    })
  }
}