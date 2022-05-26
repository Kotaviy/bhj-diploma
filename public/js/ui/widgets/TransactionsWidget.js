/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if(element === null || element === undefined) {
      throw ('Element not found')
    } else {
      this.element = element;
      this.registerEvents();
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const newIncome = document.querySelector('.create-income-button');
    const newExpense = document.querySelector('.create-expense-button');
    newIncome.addEventListener('click', () => {
      const incomeModal = App.getModal('newIncome');
      incomeModal.open();
    })
    newExpense.addEventListener('click', () => {
      const expenseModal = App.getModal('newExpense');
      expenseModal.open();
    })
  }
}
