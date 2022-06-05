/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.type = element.getAttribute('id').split('-')[1];
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      const list = document.querySelector(`#${this.type}-accounts-list`);
      list.innerHTML = '';
      response.data.forEach((elem) => {
        list.insertAdjacentHTML('beforeend', `
        <option value="${elem.id}">${elem.name}</option>
        `)
      })
    });

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create (data, (err, response) => {
      if(response && response.success) {
        const newIncome = App.getModal(`new${this.type[0].toUpperCase()}${this.type.slice(1)}`);
        newIncome.close();
        const newIncomeForm = this.element;
        newIncomeForm.reset();
        App.update();
      }
    })
  }
}