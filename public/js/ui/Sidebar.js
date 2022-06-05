/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const body = document.querySelector('body');
    const button = document.querySelector('.sidebar-toggle');
    button.addEventListener('click', () => {
      body.classList.toggle('sidebar-collapse');
      body.classList.toggle('sidebar-open');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerBtn = document.querySelector('.menu-item_register');
    registerBtn.addEventListener('click', () => {
      const registerModal = App.getModal('register');
      registerModal.open();
    });
    const loginBtn = document.querySelector('.menu-item_login');
    loginBtn.addEventListener('click', () => {
      const loginModal = App.getModal('login');
      loginModal.open();
    })
    const logoutBtn = document.querySelector('.menu-item_logout');
    logoutBtn.addEventListener('click', () => {
      User.logout(() => {
        App.setState('init');
      });
    })
  }
}